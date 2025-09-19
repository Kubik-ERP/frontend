import { ref } from 'vue';
import eventBus from '@/plugins/mitt';
import { PRODUCT_LIST_COLUMNS_IMPORT } from '../constants';
import { useProductService } from './catalog-product.service';
import { IProductImportFailedSuccessData, IProductImportProvided, IProductImportResponse } from '../interfaces/product-import.interface';
import { useProductImportStore } from '../store';
export const useProductImportService = (): IProductImportProvided => {
  const store = useProductImportStore();
  const { httpAbort_registerAbort } = useHttpAbort();
  const {
    getAllProducts
  } = useProductService();
  // State
  const productImport_step = ref<number>(1);
  const productImport_isLoading = ref<boolean>(false);
  const productImport_values = ref<IProductImportResponse>();

  // Simpan file sementara
  const uploadedFile = ref<File | null>(null);

  // Handler
  const productImport_onSubmit = async () => {
    try{
      const batchId = localStorage.getItem('inventory_batch_id')?.toString();
      if (batchId) {
        await store.product_Import_execute(batchId, {
          ...httpAbort_registerAbort('STORAGE_LIST_REQUEST_EXECUTE'),
        });

        localStorage.removeItem('inventory_batch_id');

        await getAllProducts(1, 100, '');
      }

      productImport_onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      }
    }
  };

  const productImport_onClose = async () => {
    const batchId = localStorage.getItem('inventory_batch_id')?.toString();
    if (batchId) {
      await store.product_Import_reset(batchId);
    }

    productImport_step.value = 1;
    productImport_isLoading.value = false;
    productImport_values.value = undefined;
    uploadedFile.value = null;

    eventBus.emit('AppBaseDialog', {
      id: 'product-import-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  const productImport_handleDownloadTemplate = async () => {
   try {
    await store.product_generateTemplate({
      ...httpAbort_registerAbort('STORAGE_LIST_REQUEST_TEMPLATE'),
    })
   } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
   }
  };

  const productImport_handleDropFile = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      uploadedFile.value = acceptedFiles[0];
      console.log('File dropped:', uploadedFile.value);

      // langsung proses upload setelah file diterima
      void productImport_handleUpload();
    }
  };

  const productImport_triggerUpload = () => {
    // Membuat input file secara dinamis
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.csv';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files: FileList | null = target.files;

      if (files && files.length > 0) {
        productImport_handleDropFile([files[0]]);
      }
    };

    input.click();
  };

  const productImport_handleUpload = async () => {
    if (!uploadedFile.value) {
      console.warn('No file selected for upload');
      return;
    }
    productImport_step.value = 2;
    productImport_isLoading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile.value);
      const response = await store.product_importItems(formData, {
        ...httpAbort_registerAbort('STORAGE_LIST_REQUEST_IMPORT'),
      });

      const successData = (response.data?.successData ?? []).map(
        (row: IProductImportFailedSuccessData) => ({
          ...row,
          status: 'success',
        }),
      );

      const failedData = (response.data?.failedData ?? []).map((row: IProductImportFailedSuccessData) => ({
        ...row,
        status: 'failed',
        errorMessage: row.errorMessages,
      }));

      console.log(' Failed data: ', failedData);

      if (response?.data.batchId) {
        localStorage.setItem('inventory_batch_id', response.data.batchId);
      }

      productImport_values.value = {
        ...response,
        data: {
          ...response.data,
          mergedData: [...successData, ...failedData],
        },
      };

      productImport_step.value = 3;
    } catch (error) {
      productImport_step.value = 1;
      console.error('Upload failed:', error);
    } finally {
      productImport_isLoading.value = false;
    }
  };

  return {
    productImport_onSubmit,
    productImport_onClose,
    productImport_step,
    productImport_isLoading,
    productImport_values: productImport_values,
    productImport_handleDownloadTemplate,
    productImport_handleDropFile,
    productImport_handleUpload,
    productImport_triggerUpload,
    productImport_columns: PRODUCT_LIST_COLUMNS_IMPORT,
  };
};
