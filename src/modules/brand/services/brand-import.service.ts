import { ref } from 'vue';
import {
  brand_importFailedSuccessData,
  IBrandImportProvided,
  IBrandImportResponse,
} from '../interfaces/brand-import.interface';
import eventBus from '@/plugins/mitt';
import { BRAND_LIST_COLUMNS_IMPORT } from '../constants';
import { useBrandStore } from '../store';
import { useBrandListService } from './brand-list.service';
export const useBrandImportService = (): IBrandImportProvided => {
  const store = useBrandStore();
  const { httpAbort_registerAbort } = useHttpAbort();
  const {
    brand_queryParams
  } = useBrandListService();
  // State
  const brandImport_step = ref<number>(1);
  const brandImport_isLoading = ref<boolean>(false);
  const brandImport_values = ref<IBrandImportResponse>();

  // Simpan file sementara
  const uploadedFile = ref<File | null>(null);

  // Handler
  const brandImport_onSubmit = async () => {
    const batchId = localStorage.getItem('inventory_batch_id')?.toString();

    if (batchId) {
      const res = await store.brandImport_execute(batchId, {
        ...httpAbort_registerAbort('BRAND_LIST_REQUEST_EXECUTE'),
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

      await store.brandList_fetchList(brand_queryParams ,{
        ...httpAbort_registerAbort('BRAND_LIST_REQUEST'),
      });
      brandImport_onClose();
    }
  };

  const brandImport_onClose = () => {
    const batchId = localStorage.getItem('inventory_batch_id')?.toString();
    if (batchId) {
      void store.brandImport_reset(batchId);
    }

    brandImport_step.value = 1;
    brandImport_isLoading.value = false;
    brandImport_values.value = undefined;
    uploadedFile.value = null;

    eventBus.emit('AppBaseDialog', {
      id: 'brand-import-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  const brandImport_handleDownloadTemplate = async () => {
    try {
      await store.brand_generateTemplate({
        ...httpAbort_registerAbort('BRAND_LIST_REQUEST_TEMPLATE'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      }
    }
  };

  const brandImport_handleDropFile = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      uploadedFile.value = acceptedFiles[0];

      // langsung proses upload setelah file diterima
      void brandImport_handleUpload();
    }
  };

  const brandImport_triggerUpload = () => {
    // Membuat input file secara dinamis
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.csv';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files: FileList | null = target.files;

      if (files && files.length > 0) {
        brandImport_handleDropFile([files[0]]);
      }
    };

    input.click();
  };

  const brandImport_handleUpload = async () => {
    if (!uploadedFile.value) {
      console.warn('No file selected for upload');
      return;
    }
    brandImport_step.value = 2;
    brandImport_isLoading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile.value);
      const response = await store.brand_importItems(formData, {
        ...httpAbort_registerAbort('BRAND_LIST_REQUEST_IMPORT'),
      });

      const successData = (response.data?.successData ?? []).map((row: brand_importFailedSuccessData) => ({
        ...row,
        status: 'success',
      }));

      const failedData = (response.data?.failedData ?? []).map((row: brand_importFailedSuccessData) => ({
        ...row,
        status: 'failed',
        errorMessage: row.errorMessages,
      }));

      console.log(' Failed data: ', failedData);

      if (response?.data.batchId) {
        localStorage.setItem('inventory_batch_id', response.data.batchId);
      }

      brandImport_values.value = {
        ...response,
        data: {
          ...response.data,
          mergedData: [...successData, ...failedData],
        },
      };

      brandImport_step.value = 3;
    } catch (error) {
      brandImport_step.value = 1;
      console.error('Upload failed:', error);
    } finally {
      brandImport_isLoading.value = false;
    }
  };

  return {
    brandImport_onSubmit,
    brandImport_onClose,
    brandImport_step,
    brandImport_isLoading,
    brandImport_values: brandImport_values,
    brandImport_handleDownloadTemplate,
    brandImport_handleDropFile,
    brandImport_handleUpload,
    brandImport_triggerUpload,
    brandImport_columns: BRAND_LIST_COLUMNS_IMPORT,
  };
};
