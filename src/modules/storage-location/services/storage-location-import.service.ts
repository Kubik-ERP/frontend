import { ref } from 'vue';
import {
  IStorageLocationImportFailedSuccessData,
  IStorageLocationImportProvided,
  IStorageLocationImportResponse,
} from '../interfaces/storage-location-import.interface';
import eventBus from '@/plugins/mitt';
import { STORAGE_LOCATION_LIST_COLUMNS_IMPORT } from '../contants';
import { useStorageLocationStore } from '../store';
import { useStorageLocationService } from './storage-location.service';
export const useStorageLocationImportService = (): IStorageLocationImportProvided => {
  const store = useStorageLocationStore();
  const { httpAbort_registerAbort } = useHttpAbort();
  const {
    storageLocation_queryParams
  } = useStorageLocationService();
  // State
  const storageLocationImport_step = ref<number>(1);
  const storageLocationImport_isLoading = ref<boolean>(false);
  const storageLocationImport_values = ref<IStorageLocationImportResponse>();

  // Simpan file sementara
  const uploadedFile = ref<File | null>(null);

  // Handler
  const storageLocationImport_onSubmit = () => {
    try{
      const batchId = localStorage.getItem('inventory_batch_id')?.toString();
      if (batchId) {
        void store.storageLocationImport_execute(batchId, {
          ...httpAbort_registerAbort('STORAGE_LIST_REQUEST_EXECUTE'),
        });

        localStorage.removeItem('inventory_batch_id');

        void store.storageLocation_fetchListData(storageLocation_queryParams, {
          ...httpAbort_registerAbort('STORAGE_LIST_REQUEST'),
        })
      }

      storageLocationImport_onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      }
    }
  };

  const storageLocationImport_onClose = async () => {
    const batchId = localStorage.getItem('inventory_batch_id')?.toString();
    if (batchId) {
      await store.storageLocationImport_reset(batchId);
    }

    storageLocationImport_step.value = 1;
    storageLocationImport_isLoading.value = false;
    storageLocationImport_values.value = undefined;
    uploadedFile.value = null;

    eventBus.emit('AppBaseDialog', {
      id: 'storage-location-import-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  const storageLocationImport_handleDownloadTemplate = async () => {
   try {
    await store.storageLocation_generateTemplate({
      ...httpAbort_registerAbort('STORAGE_LIST_REQUEST_TEMPLATE'),
    })
   } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
   }
  };

  const storageLocationImport_handleDropFile = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      uploadedFile.value = acceptedFiles[0];
      console.log('File dropped:', uploadedFile.value);

      // langsung proses upload setelah file diterima
      void storageLocationImport_handleUpload();
    }
  };

  const storageLocationImport_triggerUpload = () => {
    // Membuat input file secara dinamis
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.csv';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files: FileList | null = target.files;

      if (files && files.length > 0) {
        storageLocationImport_handleDropFile([files[0]]);
      }
    };

    input.click();
  };

  const storageLocationImport_handleUpload = async () => {
    if (!uploadedFile.value) {
      console.warn('No file selected for upload');
      return;
    }
    storageLocationImport_step.value = 2;
    storageLocationImport_isLoading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile.value);
      const response = await store.storageLocation_importItems(formData, {
        ...httpAbort_registerAbort('STORAGE_LIST_REQUEST_IMPORT'),
      });

      const successData = (response.data?.successData ?? []).map(
        (row: IStorageLocationImportFailedSuccessData) => ({
          ...row,
          status: 'success',
        }),
      );

      const failedData = (response.data?.failedData ?? []).map((row: IStorageLocationImportFailedSuccessData) => ({
        ...row,
        status: 'failed',
        errorMessage: row.errorMessages,
      }));

      console.log(' Failed data: ', failedData);

      if (response?.data.batchId) {
        localStorage.setItem('inventory_batch_id', response.data.batchId);
      }

      storageLocationImport_values.value = {
        ...response,
        data: {
          ...response.data,
          mergedData: [...successData, ...failedData],
        },
      };

      storageLocationImport_step.value = 3;
    } catch (error) {
      storageLocationImport_step.value = 1;
      console.error('Upload failed:', error);
    } finally {
      storageLocationImport_isLoading.value = false;
    }
  };

  return {
    storageLocationImport_onSubmit,
    storageLocationImport_onClose,
    storageLocationImport_step,
    storageLocationImport_isLoading,
    storageLocationImport_values: storageLocationImport_values,
    storageLocationImport_handleDownloadTemplate,
    storageLocationImport_handleDropFile,
    storageLocationImport_handleUpload,
    storageLocationImport_triggerUpload,
    storageLocationImport_columns: STORAGE_LOCATION_LIST_COLUMNS_IMPORT,
  };
};
