import { ref } from 'vue';
import { CATEGORIES_COLUMNS_IMPORT } from '../../constants';
import { useCategoryImportStore } from '../../store/categories.store';
import { ICategoryImportFailedSuccessData, ICategoryImportProvided, ICategoryImportResponse } from '../../interfaces/Category/category-import.interface';
import { useCategoryService } from './CategoryService';
import eventBus from '@/plugins/mitt';
export const usecategoryImportService = (): ICategoryImportProvided => {
  const store = useCategoryImportStore();
  const { httpAbort_registerAbort } = useHttpAbort();
  const {
    getAllCategories
  } = useCategoryService();
  // State
  const categoryImport_step = ref<number>(1);
  const categoryImport_isLoading = ref<boolean>(false);
  const categoryImport_values = ref<ICategoryImportResponse>();

  // Simpan file sementara
  const uploadedFile = ref<File | null>(null);

  // Handler
  const categoryImport_onSubmit = () => {
    try{
      const batchId = localStorage.getItem('inventory_batch_id')?.toString();
      if (batchId) {
        void store.category_Import_execute(batchId, {
          ...httpAbort_registerAbort('STORAGE_LIST_REQUEST_EXECUTE'),
        });

        localStorage.removeItem('inventory_batch_id');

        void getAllCategories(1, 100, '');
      }

      categoryImport_onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      }
    }
  };

  const categoryImport_onClose = async () => {
    const batchId = localStorage.getItem('inventory_batch_id')?.toString();
    if (batchId) {
      await store.category_Import_reset(batchId);
    }

    categoryImport_step.value = 1;
    categoryImport_isLoading.value = false;
    categoryImport_values.value = undefined;
    uploadedFile.value = null;

    eventBus.emit('AppBaseDialog', {
      id: 'category-import-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  const categoryImport_handleDownloadTemplate = async () => {
   try {
    await store.category_generateTemplate({
      ...httpAbort_registerAbort('STORAGE_LIST_REQUEST_TEMPLATE'),
    })
   } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
   }
  };

  const categoryImport_handleDropFile = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      uploadedFile.value = acceptedFiles[0];
      console.log('File dropped:', uploadedFile.value);

      // langsung proses upload setelah file diterima
      void categoryImport_handleUpload();
    }
  };

  const categoryImport_triggerUpload = () => {
    // Membuat input file secara dinamis
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.csv';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files: FileList | null = target.files;

      if (files && files.length > 0) {
        categoryImport_handleDropFile([files[0]]);
      }
    };

    input.click();
  };

  const categoryImport_handleUpload = async () => {
    if (!uploadedFile.value) {
      console.warn('No file selected for upload');
      return;
    }
    categoryImport_step.value = 2;
    categoryImport_isLoading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile.value);
      const response = await store.category_importItems(formData, {
        ...httpAbort_registerAbort('STORAGE_LIST_REQUEST_IMPORT'),
      });

      const successData = (response.data?.successData ?? []).map(
        (row: ICategoryImportFailedSuccessData) => ({
          ...row,
          status: 'success',
        }),
      );

      const failedData = (response.data?.failedData ?? []).map((row: ICategoryImportFailedSuccessData) => ({
        ...row,
        status: 'failed',
        errorMessage: row.errorMessages,
      }));

      console.log(' Failed data: ', failedData);

      if (response?.data.batchId) {
        localStorage.setItem('inventory_batch_id', response.data.batchId);
      }

      categoryImport_values.value = {
        ...response,
        data: {
          ...response.data,
          mergedData: [...successData, ...failedData],
        },
      };

      categoryImport_step.value = 3;
    } catch (error) {
      categoryImport_step.value = 1;
      console.error('Upload failed:', error);
    } finally {
      categoryImport_isLoading.value = false;
    }
  };

  return {
    categoryImport_onSubmit,
    categoryImport_onClose,
    categoryImport_step,
    categoryImport_isLoading,
    categoryImport_values: categoryImport_values,
    categoryImport_handleDownloadTemplate,
    categoryImport_handleDropFile,
    categoryImport_handleUpload,
    categoryImport_triggerUpload,
    categoryImport_columns: CATEGORIES_COLUMNS_IMPORT,
  };
};
