import eventBus from '@/plugins/mitt';
import {
  ISupplierImport,
  ISupplierImportProvided,
  ISupplierImportResponse,
} from '../interfaces/supplier-import.interface';
import { SUPPLIER_LIST_COLUMNS_IMPORT } from '../constants';
import { useSupplierStore } from '../store';
import { useSupplierListService } from './supplier-list.service';

export const useSupplierImportService = (): ISupplierImportProvided => {
  const store = useSupplierStore();
  const { httpAbort_registerAbort } = useHttpAbort();
  const { supplierList_queryParams } = useSupplierListService();

  // State
  const supplierImport_step = ref<number>(1);
  const supplierImport_isLoading = ref<boolean>(false);
  const supplierImport_values = ref<ISupplierImportResponse>();

  // Simpan file sementara
  const uploadedFile = ref<File | null>(null);

  // Handler
  const supplierImport_onSubmit = async () => {
    try {
      const batchId = localStorage.getItem('inventory_batch_id')?.toString();

      if (batchId) {
        const res = await store.SupplierImport_execute(batchId, {
          ...httpAbort_registerAbort('SUPPLIER_LIST_REQUEST_EXECUTE'),
        });

        if (res) {
          const argsEventEmitter: IPropsToast = {
            isOpen: true,
            type: EToastType.SUCCESS,
            message: res.message || 'Item imported successfully!',
            position: EToastPosition.TOP_RIGHT,
          };
          eventBus.emit('AppBaseToast', argsEventEmitter);
        }
        localStorage.removeItem('inventory_batch_id');

        await store.supplier_list(supplierList_queryParams, {
          ...httpAbort_registerAbort('SUPPLIER_LIST_REQUEST'),
        });
        supplierImport_onClose();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      }
    }
  };

  const supplierImport_onClose = async () => {
    const batchId = localStorage.getItem('inventory_batch_id')?.toString();
    if (batchId) {
      await store.SupplierImport_reset(batchId);
    }

    supplierImport_step.value = 1;
    supplierImport_isLoading.value = false;
    supplierImport_values.value = undefined;
    uploadedFile.value = null;

    eventBus.emit('AppBaseDialog', {
      id: 'supplier-import-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  const supplierImport_handleDownloadTemplate = async () => {
    try {
      await store.Supplier_generateTemplate({
        ...httpAbort_registerAbort('SUPPLIER_GENERATE_TEMPLATE'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      }
    }
  };

  const supplierImport_handleDropFile = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      uploadedFile.value = acceptedFiles[0];
      console.log('File dropped:', uploadedFile.value);

      // langsung proses upload setelah file diterima
      void supplierImport_handleUpload();
    }
  };

  const supplierImport_triggerUpload = () => {
    // Membuat input file secara dinamis
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.csv';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files: FileList | null = target.files;

      if (files && files.length > 0) {
        supplierImport_handleDropFile([files[0]]);
      }
    };

    input.click();
  };

  const supplierImport_handleUpload = async () => {
    if (!uploadedFile.value) {
      console.warn('No file selected for upload');
      return;
    }
    supplierImport_step.value = 2;
    supplierImport_isLoading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile.value);
      const response = await store.Supplier_importItems(formData, {
        ...httpAbort_registerAbort('STORAGE_LIST_REQUEST_IMPORT'),
      });

      const successData = (response.data?.successData ?? []).map((row: ISupplierImport) => ({
        ...row,
        status: 'success',
      }));

      const failedData = (response.data?.failedData ?? []).map((row: ISupplierImport) => ({
        ...row,
        status: 'failed',
        errorMessage: row.errorMessages,
      }));

      console.log(' Failed data: ', failedData);

      if (response?.data.batchId) {
        localStorage.setItem('inventory_batch_id', response.data.batchId);
      }

      supplierImport_values.value = {
        ...response,
        data: {
          ...response.data,
          mergedData: [...successData, ...failedData],
        },
      };

      supplierImport_step.value = 3;
    } catch (error) {
      supplierImport_step.value = 1;
      console.error('Upload failed:', error);
    } finally {
      supplierImport_isLoading.value = false;
    }
  };

  return {
    supplierImport_onSubmit,
    supplierImport_onClose,
    supplierImport_step,
    supplierImport_isLoading,
    supplierImport_values: supplierImport_values,
    supplierImport_handleDownloadTemplate,
    supplierImport_handleDropFile,
    supplierImport_handleUpload,
    supplierImport_triggerUpload,
    supplierImport_columns: SUPPLIER_LIST_COLUMNS_IMPORT,
  };
};
