import eventBus from '@/plugins/mitt';
import {
  IInventoryItemImportProvided,
  IInventoryItemImportResponse,
  inventoryItems_importFailedSuccessData,
} from '../interfaces/item-import.interface';
import { ITEMS_LIST_COLUMS_IMPORT, ITEMS_LIST_REQUEST } from '../constants';
import { useInventoryItemsStore } from '../store';

export const useInventoryItemImportService = (): IInventoryItemImportProvided => {
  const store = useInventoryItemsStore();
  const { httpAbort_registerAbort } = useHttpAbort();
  // State
  const inventoryItem_step = ref<number>(1);
  const inventoryItem_isLoading = ref<boolean>(false);
  const inventoryItem_values = ref<IInventoryItemImportResponse>();

  // Simpan file sementara
  const uploadedFile = ref<File | null>(null);

  // Handler
  const inventoryItem_onSubmit = async () => {
    try {
      const batchId = localStorage.getItem('inventory_batch_id')?.toString();

      if (batchId) {
        const res = await store.inventoryItemImport_execute(batchId, {
          ...httpAbort_registerAbort(ITEMS_LIST_REQUEST+"_EXECUTE"),
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

        inventoryItem_onClose();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const inventoryItem_onClose = async () => {
    const batchId = localStorage.getItem('inventory_batch_id');

    if (batchId) {
      await store.inventoryItemImport_reset(batchId);
      localStorage.removeItem('inventory_batch_id');
      eventBus.emit('AppBaseDialog', {
        id: 'inventory-item-import-modal',
        isUsingClosableButton: false,
        isUsingBackdrop: true,
        isOpen: false,
        width: '600px',
      });
      inventoryItem_step.value = 1;
      inventoryItem_isLoading.value = false;
      inventoryItem_values.value = undefined;
      uploadedFile.value = null;
    } else {
       eventBus.emit('AppBaseDialog', {
        id: 'inventory-item-import-modal',
        isUsingClosableButton: false,
        isUsingBackdrop: true,
        isOpen: false,
        width: '600px',
      });
    }
  };

  const inventoryItem_handleDownloadTemplate = async () => {
    try {
      await store.inventoryItem_generateTemplate({
        ...httpAbort_registerAbort(ITEMS_LIST_REQUEST),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const inventoryItem_handleDropFile = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      uploadedFile.value = acceptedFiles[0];
      console.log('File dropped:', uploadedFile.value);

      // langsung proses upload setelah file diterima
      void inventoryItem_handleUpload();
    }
  };

  const inventoryItem_triggerUpload = () => {
    // Membuat input file secara dinamis
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.csv';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files: FileList | null = target.files;

      if (files && files.length > 0) {
        inventoryItem_handleDropFile([files[0]]);
      }
    };

    input.click();
  };

  const inventoryItem_handleUpload = async () => {
    if (!uploadedFile.value) {
      console.warn('No file selected for upload');
      return;
    }
    inventoryItem_step.value = 2;
    inventoryItem_isLoading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile.value);
      const response = await store.inventoryItem_importItems(formData, {
        ...httpAbort_registerAbort(ITEMS_LIST_REQUEST),
      });

      const successData = (response.data?.successData ?? []).map(
        (row: inventoryItems_importFailedSuccessData) => ({
          ...row,
          status: 'success',
        }),
      );

      const failedData = (response.data?.failedData ?? []).map((row: inventoryItems_importFailedSuccessData) => ({
        ...row,
        status: 'failed',
        errorMessage: row.errorMessages,
      }));

      console.log(' Failed data: ', failedData);

      if (response?.data.batchId) {
        localStorage.setItem('inventory_batch_id', response.data.batchId);
      }

      inventoryItem_values.value = {
        ...response,
        data: {
          ...response.data,
          mergedData: [...successData, ...failedData],
        },
      };

      inventoryItem_step.value = 3;
    } catch (error) {
      inventoryItem_step.value = 1;
      console.error('Upload failed:', error);
    } finally {
      inventoryItem_isLoading.value = false;
    }
  };

  return {
    inventoryItem_onSubmit,
    inventoryItem_onClose,
    inventoryItem_step,
    inventoryItem_isLoading,
    inventoryItem_values: inventoryItem_values,
    inventoryItem_handleDownloadTemplate,
    inventoryItem_handleDropFile,
    inventoryItem_handleUpload,
    inventoryItem_triggerUpload,
    inventoryItem_columns: ITEMS_LIST_COLUMS_IMPORT,
  };
};
