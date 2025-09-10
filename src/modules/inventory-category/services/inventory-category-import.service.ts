import { ref } from 'vue';
import {
  IInventoryCategoryImport,
  IInventoryCategoryImportProvided,
  IInventoryCategoryImportResponse,
} from '../interfaces/inventory-category-import.interface';
import eventBus from '@/plugins/mitt';
import { INVENTORY_CATEGORY_LIST_COLUMNS_IMPORT, VOUCHER_LIST_REQUEST } from '../constants';
import { ITEMS_LIST_REQUEST } from '@/modules/items/constants';
import { useInventoryCategoryStore } from '../store';
import { useInventoryCategoryService } from './inventory-category.service';
export const useInventoryCategoryImportService = (): IInventoryCategoryImportProvided => {
  const store = useInventoryCategoryStore();

  const {
    inventoryCategoryList_queryParams
  } = useInventoryCategoryService();

  // State
  const inventoryCategoryImport_step = ref<number>(1);
  const inventoryCategoryImport_isLoading = ref<boolean>(false);
  const inventoryCategoryImport_values = ref<IInventoryCategoryImportResponse>();
  const { httpAbort_registerAbort } = useHttpAbort();
  // Simpan file sementara
  const uploadedFile = ref<File | null>(null);

  // Handler
  const inventoryCategoryImport_onSubmit = async () => {
    try {
      const batchId = localStorage.getItem('inventory_batch_id')?.toString();

      if (batchId) {
        const res = await store.inventoryCategory_Import_execute(batchId, {
          ...httpAbort_registerAbort(ITEMS_LIST_REQUEST + '_EXECUTE'),
        });
        if (res) {
          await store.inventoryCategoryList_fetchList(
            inventoryCategoryList_queryParams,
            {
              ...httpAbort_registerAbort(VOUCHER_LIST_REQUEST),
              paramsSerializer: useParamsSerializer,
            }
          )

          const argsEventEmitter: IPropsToast = {
            isOpen: true,
            type: EToastType.SUCCESS,
            message: res.message || 'Item imported successfully!',
            position: EToastPosition.TOP_RIGHT,
          };
          eventBus.emit('AppBaseToast', argsEventEmitter);
        }

        inventoryCategoryImport_onClose();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const inventoryCategoryImport_onClose = () => {
    try {
      const batchId = localStorage.getItem('inventory_batch_id')?.toString();
      if (batchId) {
        void store.inventoryCategory_Import_reset(batchId);
      }
      inventoryCategoryImport_step.value = 1;
      inventoryCategoryImport_isLoading.value = false;
      inventoryCategoryImport_values.value = undefined;
      uploadedFile.value = null;

      eventBus.emit('AppBaseDialog', {
        id: 'inventory-category-import-modal',
        isUsingClosableButton: false,
        isUsingBackdrop: true,
        isOpen: false,
        width: '600px',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: EToastType.DANGER,
          message: error.message || 'Item imported successfully!',
          position: EToastPosition.TOP_RIGHT,
        };
        eventBus.emit('AppBaseToast', argsEventEmitter);
      }
    }
  };

  const inventoryCategoryImport_handleDownloadTemplate = async () => {
    try {
      await store.inventoryCategory_generateTemplate({
        ...httpAbort_registerAbort(ITEMS_LIST_REQUEST + '_GENERATE_TEMPLATE'),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const inventoryCategoryImport_handleDropFile = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      uploadedFile.value = acceptedFiles[0];

      void inventoryCategoryImport_handleUpload();
    }
  };

  const inventoryCategoryImport_triggerUpload = () => {
    // Membuat input file secara dinamis
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.csv';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files: FileList | null = target.files;

      if (files && files.length > 0) {
        inventoryCategoryImport_handleDropFile([files[0]]);
      }
    };

    input.click();
  };

  const inventoryCategoryImport_handleUpload = async () => {
    if (!uploadedFile.value) {
      console.warn('No file selected for upload');
      return;
    }
    inventoryCategoryImport_step.value = 2;
    inventoryCategoryImport_isLoading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile.value);
      const response = await store.inventoryCategory_importItems(formData, {
        ...httpAbort_registerAbort(ITEMS_LIST_REQUEST + '_IMPORT'),
      });

      const successData = (response.data?.successData ?? []).map((row: IInventoryCategoryImport) => ({
        ...row,
        status: 'success',
      }));

      const failedData = (response.data?.failedData ?? []).map((row: IInventoryCategoryImport) => ({
        ...row,
        status: 'failed',
        errorMessage: row.errorMessages,
      }));

      if (response?.data.batchId) {
        localStorage.setItem('inventory_batch_id', response.data.batchId);
      }

      inventoryCategoryImport_values.value = {
        ...response,
        data: {
          ...response.data,
          mergedData: [...successData, ...failedData],
        },
      };
    } catch (error) {
      inventoryCategoryImport_step.value = 1;
      console.error('Upload failed:', error);
    } finally {
      inventoryCategoryImport_isLoading.value = false;
    }
  };

  return {
    inventoryCategoryImport_onSubmit,
    inventoryCategoryImport_onClose,
    inventoryCategoryImport_step,
    inventoryCategoryImport_isLoading,
    inventoryCategoryImport_values: inventoryCategoryImport_values,
    inventoryCategoryImport_handleDownloadTemplate,
    inventoryCategoryImport_handleDropFile,
    inventoryCategoryImport_handleUpload,
    inventoryCategoryImport_triggerUpload,
    inventoryCategoryImport_columns: INVENTORY_CATEGORY_LIST_COLUMNS_IMPORT,
  };
};
