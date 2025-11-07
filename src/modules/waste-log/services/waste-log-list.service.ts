// Constants
import {
  WASTE_LOG_BATCH_LIST_REQUEST,
  WASTE_LOG_LIST_COLUMNS,
  WASTE_LOG_CREATE_EDIT_LIST_CATEGORIES,
  WASTE_LOG_CREATE_EDIT_LIST_UOM_OPTIONS,
  WASTE_LOG_LIST_REQUEST,
  WASTE_LOG_CREATE_REQUEST,
  WASTE_LOG_DELETE_REQUEST,
  WASTE_LOG_DETAIL_REQUEST,
  WASTE_LOG_UPDATE_REQUEST,
} from '../constants';
import { EToastPosition, EToastType } from '@/app/constants';

// Interfaces
import type { DataTableSortEvent } from 'primevue';
import type { IBatch, IWasteLogFormData, IWasteLogListProvided, IWasteLogListQueryParams } from '../interfaces';
import type {
  IWasteLog,
  WasteLogItem as IWasteLogItemStore,
  IWasteLogCreateEditFormPayload,
} from '../interfaces/waste-log-store.interface';
import type { IInventoryItems } from '@/modules/items/interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useWasteLogStore } from '../store';
import { useInventoryItemsStore } from '@/modules/items/store';
import { useBatchStore } from '@/modules/prep-batch-management/store';

// Vue Composables
import { ref, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useHttpAbort } from '@/app/composables';
import { useParamsSerializer } from '@/app/composables/useHttp';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useWasteLogListService = (): IWasteLogListProvided => {
  /**
   * @description Injected variables
   */
  const batchStore = useBatchStore(); // Instance of the batch store
  const inventoryItemsStore = useInventoryItemsStore(); // Instance of inventory items store
  const store = useWasteLogStore(); // Instance of the store
  const { httpAbort_registerAbort } = useHttpAbort();
  const { wasteLog_isLoading, wasteLog_lists } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const wasteLogList_batchOptions = ref<IBatch[]>([]);
  const wasteLogList_formData = ref<IWasteLogFormData>({
    batchId: null,
    wasteLogs: [],
  });
  const wasteLogList_inventoryItems = ref<IInventoryItems[]>([]);
  const wasteLogList_isLoadingBatchOptions = ref<boolean>(false);
  const wasteLogList_isLoadingInventoryItems = ref<boolean>(false);
  const wasteLogList_queryParams = reactive<IWasteLogListQueryParams>({
    page: 1,
    pageSize: 10,
    search: '',
    orderBy: 'updated_at',
    orderDirection: 'desc',
  });

  // Scroll callback - will be set by component
  let wasteLogList_scrollToNewItem: ((index: number) => void) | null = null;

  /**
   * @description Set scroll callback function from component
   */
  const wasteLogList_setScrollCallback = (callback: (index: number) => void): void => {
    wasteLogList_scrollToNewItem = callback;
  };

  /**
   * @description Form validations
   */
  const wasteLogList_formRules = computed(() => ({
    batchId: { required },
    wasteLogs: {
      $each: helpers.forEach({
        category: { required },
        uom: { required },
        itemId: { required },
        quantity: { required },
      }),
    },
  }));
  const wasteLogList_formValidations = useVuelidate(wasteLogList_formRules, wasteLogList_formData, {
    $autoDirty: true,
  });

  /**
   * @description Computed property to flatten waste log items for display in datatable
   * Each waste log contains multiple items, we flatten them for table display
   */
  const wasteLogList_flattenedItems = computed(() => {
    return wasteLog_lists.value.items.flatMap((wasteLog) =>
      wasteLog.wasteLogItems.map((item) => ({
        ...item,
        wasteLogId: wasteLog.wasteLogId,
        batchId: wasteLog.batchId,
        storeName: wasteLog.storeName,
        wasteLogCreatedAt: wasteLog.createdAt,
      })),
    );
  });

  /**
   * @description Map API response to form data for editing
   */
  const wasteLogList_mapApiResponseToFormData = (apiData: IWasteLog): void => {
    // Find batch object from options using batchId
    const batchObject = wasteLogList_batchOptions.value.find((batch) => batch.id === apiData.batchId);

    wasteLogList_formData.value = {
      batchId: batchObject || apiData.batchId,
      wasteLogs: apiData.wasteLogItems.map((item: IWasteLogItemStore) => ({
        category: item.category,
        itemId: item.inventoryItemId,
        notes: item.notes,
        photo: null, // Will be handled separately if needed
        photoPreview: item.photoUrl || null,
        quantity: item.quantity,
        uom: item.uom,
      })),
    };
  };

  /**
   * @description Helper function to extract batch ID from form data
   */
  const wasteLogList_extractBatchId = (): string => {
    const batchId = wasteLogList_formData.value.batchId;
    if (typeof batchId === 'object' && batchId !== null && 'id' in batchId) {
      return batchId.id;
    }
    return (batchId as string) || '';
  };

  /**
   * @description Map form data to API payload for create/update
   */
  const wasteLogList_mapFormDataToApiPayload = (): IWasteLogCreateEditFormPayload => {
    const batchId =
      typeof wasteLogList_formData.value.batchId === 'object' && wasteLogList_formData.value.batchId !== null
        ? wasteLogList_formData.value.batchId.id
        : wasteLogList_formData.value.batchId || '';

    return {
      batchId,
      payload: wasteLogList_formData.value.wasteLogs.map(wasteLog => ({
        inventory_item_id: wasteLog.itemId || '',
        category: wasteLog.category || '',
        quantity: wasteLog.quantity,
        uom: wasteLog.uom || '',
        notes: wasteLog.notes || '',
        image: wasteLog.photo || null,
      })),
    };
  };

  /**
   * @description Handle fetch api waste log - list
   */
  const wasteLogList_fetchList = async (): Promise<unknown> => {
    try {
      await store.wasteLog_list(wasteLogList_queryParams, {
        ...httpAbort_registerAbort(WASTE_LOG_LIST_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api waste log - detail
   */
  const wasteLogList_fetchDetail = async (id: string): Promise<IWasteLog | null> => {
    try {
      const response = await store.wasteLog_detail(id, {
        ...httpAbort_registerAbort(WASTE_LOG_DETAIL_REQUEST),
      });
      return response as IWasteLog;
    } catch (error: unknown) {
      console.error('Error fetching waste log detail:', error);
      return null;
    }
  };

  /**
   * @description Handle fetch batch list for dropdown
   */
  const wasteLogList_fetchBatchList = async (): Promise<void> => {
    try {
      wasteLogList_isLoadingBatchOptions.value = true;

      const params = {
        page: 1,
        limit: 100, // Get more batches for dropdown
      };

      await batchStore.fetchBatchList(params, {
        ...httpAbort_registerAbort(WASTE_LOG_BATCH_LIST_REQUEST),
      });

      wasteLogList_batchOptions.value = (batchStore.batch_lists.data as IBatch[]) || [];
    } catch (error) {
      console.error('Error fetching batch list:', error);
      wasteLogList_batchOptions.value = [];
    } finally {
      wasteLogList_isLoadingBatchOptions.value = false;
    }
  };

  /**
   * @description Handle api waste log - update
   */
  const wasteLogList_updateWasteLog = async (id: string): Promise<void> => {
    wasteLogList_formValidations.value.$touch();

    if (wasteLogList_formValidations.value.$invalid) {
      return;
    }

    try {
      // Create FormData according to API specification
      const formData = new FormData();

      // Add batchId - extract ID from object or use string directly
      const batchId = wasteLogList_extractBatchId();
      formData.append('batchId', batchId);

      // Add each waste log item
      wasteLogList_formData.value.wasteLogs.forEach((wasteLog, index) => {
        formData.append(`payload[${index}].inventory_item_id`, wasteLog.itemId || '');
        formData.append(`payload[${index}].category`, wasteLog.category || '');
        formData.append(`payload[${index}].quantity`, wasteLog.quantity.toString());
        formData.append(`payload[${index}].uom`, wasteLog.uom || '');
        formData.append(`payload[${index}].notes`, wasteLog.notes || '');

        // Add image if exists
        if (wasteLog.photo) {
          formData.append(`payload[${index}].image`, wasteLog.photo);
        }
      });

      // Call API
      await store.wasteLog_update(id, formData, {
        ...httpAbort_registerAbort(WASTE_LOG_UPDATE_REQUEST),
      });

      // Show success toast
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        message: 'Waste log berhasil diperbarui!',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.SUCCESS,
      });

      // Close dialog
      wasteLogList_onCloseDialogAddWasteLog();

      // Refresh list
      await wasteLogList_fetchList();
    } catch (error) {
      console.error('Error updating waste log:', error);

      // Show error toast
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        message: 'Gagal memperbarui waste log. Silakan coba lagi.',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.DANGER,
      });
    }
  };

  /**
   * @description Handle on sort change for data table
   */
  const wasteLogList_handleOnSortChange = (event: DataTableSortEvent): void => {
    if (event.sortField && event.sortOrder) {
      wasteLogList_queryParams.orderBy = event.sortField as string;
      wasteLogList_queryParams.orderDirection = event.sortOrder === 1 ? 'asc' : 'desc';
      wasteLogList_fetchList();
    }
  };

  /**
   * @description Handle business logic for adding new waste log item
   */
  const wasteLogList_onAddWasteLogItem = (): void => {
    wasteLogList_formData.value.wasteLogs.push({
      category: null,
      itemId: null,
      notes: null,
      photo: null,
      photoPreview: null,
      quantity: 0,
      uom: null,
    });

    // Show success toast
    eventBus.emit('AppBaseToast', {
      isOpen: true,
      message: 'Item waste log berhasil ditambahkan',
      position: EToastPosition.TOP_RIGHT,
      type: EToastType.SUCCESS,
    });

    // Scroll to new item after a brief delay
    const newItemIndex = wasteLogList_formData.value.wasteLogs.length - 1;
    setTimeout(() => {
      if (wasteLogList_scrollToNewItem) {
        wasteLogList_scrollToNewItem(newItemIndex);
      }
    }, 100);
  };

  /**
   * @description Handle business logic for deleting waste log item
   */
  const wasteLogList_onDeleteWasteLogItem = (index: number): void => {
    wasteLogList_formData.value.wasteLogs.splice(index, 1);
  };

  /**
   * @description Handle business logic for initializing form with one empty item
   */
  const wasteLogList_onInitializeForm = (): void => {
    wasteLogList_formData.value = {
      batchId: null,
      wasteLogs: [],
    };

    // Add one initial item if there are no items
    if (wasteLogList_formData.value.wasteLogs.length === 0) {
      wasteLogList_onAddWasteLogItem();
    }
  };

  /**
   * @description Handle business logic for removing photo
   */
  const wasteLogList_onRemovePhoto = (index: number): void => {
    wasteLogList_formData.value.wasteLogs[index].photo = null;
    wasteLogList_formData.value.wasteLogs[index].photoPreview = null;
  };

  /**
   * @description Handle business logic for selecting photo
   */
  const wasteLogList_onSelectPhoto = (index: number, event: Event): void => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      wasteLogList_formData.value.wasteLogs[index].photo = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = e => {
        wasteLogList_formData.value.wasteLogs[index].photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * @description Handle on change page for data table
   */
  const wasteLogList_onChangePage = (page: number): void => {
    wasteLogList_queryParams.page = page;
    wasteLogList_fetchList();
  };

  /**
   * @description Handle business logic for close dialog cancel confirmation
   */
  const wasteLogList_onCloseDialogCancelConfirmation = (): void => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'waste-log-list-dialog-confirmation',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for close dialog add waste log
   */
  const wasteLogList_onCloseDialogAddWasteLog = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'waste-log-add-or-edit-waste-log-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for saving waste log (create or update)
   */
  const wasteLogList_onSaveWasteLog = async (): Promise<void> => {
    wasteLogList_formValidations.value.$touch();

    if (wasteLogList_formValidations.value.$invalid) {
      return;
    }

    try {
      if (wasteLogList_isEditMode.value && wasteLogList_currentEditId.value) {
        // Update mode
        await wasteLogList_updateWasteLog(wasteLogList_currentEditId.value);
      } else {
        // Create mode
        // Create FormData according to API specification
        const formData = new FormData();

        // Add batchId - extract ID from object or use string directly
        const batchId = wasteLogList_extractBatchId();
        formData.append('batchId', batchId);

        // Add each waste log item
        wasteLogList_formData.value.wasteLogs.forEach((wasteLog, index) => {
          formData.append(`payload[${index}].inventory_item_id`, wasteLog.itemId || '');
          formData.append(`payload[${index}].category`, wasteLog.category || '');
          formData.append(`payload[${index}].quantity`, wasteLog.quantity.toString());
          formData.append(`payload[${index}].uom`, wasteLog.uom || '');
          formData.append(`payload[${index}].notes`, wasteLog.notes || '');

          // Add image if exists
          if (wasteLog.photo) {
            formData.append(`payload[${index}].image`, wasteLog.photo);
          }
        });

        // Call API
        await store.wasteLog_create(formData, {
          ...httpAbort_registerAbort(WASTE_LOG_CREATE_REQUEST),
        });

        // Show success toast
        eventBus.emit('AppBaseToast', {
          isOpen: true,
          message: 'Waste log berhasil disimpan!',
          position: EToastPosition.TOP_RIGHT,
          type: EToastType.SUCCESS,
        });

        // Close dialog
        wasteLogList_onCloseDialogAddWasteLog();

        // Refresh list
        await wasteLogList_fetchList();
      }
    } catch (error) {
      console.error('Error saving waste log:', error);

      // Show error toast
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        message: 'Gagal menyimpan waste log. Silakan coba lagi.',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.DANGER,
      });
    }
  };

  /**
   * @description Reactive data for tracking edit mode
   */
  const wasteLogList_isEditMode = ref<boolean>(false);
  const wasteLogList_currentEditId = ref<string | null>(null);

  /**
   * @description Handle business logic for showing dialog add or edit waste log
   */
  const wasteLogList_onShowDialogAddOrEditWasteLog = async (id?: string): Promise<void> => {
    if (id) {
      // Edit mode
      wasteLogList_isEditMode.value = true;
      wasteLogList_currentEditId.value = id;

      // Fetch detail and populate form
      const detailData = await wasteLogList_fetchDetail(id);
      if (detailData) {
        wasteLogList_mapApiResponseToFormData(detailData);
      }
    } else {
      // Add mode
      wasteLogList_isEditMode.value = false;
      wasteLogList_currentEditId.value = null;
      wasteLogList_onInitializeForm();
    }

    const argsEventEmitter: IPropsDialog = {
      id: 'waste-log-add-or-edit-waste-log-dialog',
      isOpen: true,
      width: '80%',
      isUsingClosableButton: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for showing dialog cancel add or edit waste log
   */
  const wasteLogList_onShowDialogCancelAddOrEditWasteLog = (): void => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'waste-log-list-dialog-confirmation',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            Are you sure you want to cancel adding this waste log? All unsaved changes will be lost.
          </p>
        </div>`,
      iconName: 'exclude',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        wasteLogList_onCloseDialogCancelConfirmation();
      },
      onClickButtonSecondary: () => {
        wasteLogList_onCloseDialogAddWasteLog();
        wasteLogList_onCloseDialogCancelConfirmation();
      },
      textButtonPrimary: 'Continue Adding',
      textButtonSecondary: 'Cancel Adding',
      title: 'Are you sure want to cancel adding this waste log?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle on show dialog delete
   */
  const wasteLogList_onShowDialogDelete = (id: string): void => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'waste-log-list-dialog-confirmation',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            This action will permanently delete this waste log and cannot be undone.
          </p>
        </div>`,
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialog', { id: 'waste-log-list-dialog-confirmation', isOpen: false });
      },
      onClickButtonSecondary: async () => {
        try {
          await store.wasteLog_delete(id, {
            ...httpAbort_registerAbort(WASTE_LOG_DELETE_REQUEST),
          });
          eventBus.emit('AppBaseDialog', { id: 'waste-log-list-dialog-confirmation', isOpen: false });
          await wasteLogList_fetchList(); // Refresh list after delete
        } catch (error) {
          console.error('Error deleting waste log:', error);
          eventBus.emit('AppBaseDialog', { id: 'waste-log-list-dialog-confirmation', isOpen: false });
        }
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete',
      title: 'Delete Waste Log',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle fetch inventory items for dropdown
   */
  const wasteLogList_fetchInventoryItems = async (): Promise<void> => {
    try {
      wasteLogList_isLoadingInventoryItems.value = true;

      const params = {
        page: 1,
        pageSize: 100, // Get more items for dropdown
        search: null,
        orderBy: null,
        orderDirection: null,
      };

      const response = await inventoryItemsStore.InventoryItems_fetchData(params, {
        paramsSerializer: useParamsSerializer,
      });

      wasteLogList_inventoryItems.value = response.data?.items || [];
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      wasteLogList_inventoryItems.value = [];
    } finally {
      wasteLogList_isLoadingInventoryItems.value = false;
    }
  };

  return {
    wasteLogList_batchOptions,
    wasteLogList_categoryOptions: WASTE_LOG_CREATE_EDIT_LIST_CATEGORIES,
    wasteLogList_columns: WASTE_LOG_LIST_COLUMNS,
    wasteLogList_fetchBatchList,
    wasteLogList_fetchDetail,
    wasteLogList_fetchInventoryItems,
    wasteLogList_fetchList,
    wasteLogList_flattenedItems,
    wasteLogList_formData,
    wasteLogList_formValidations: wasteLogList_formValidations.value,
    wasteLogList_handleOnSortChange,
    wasteLogList_inventoryItems,
    wasteLogList_isLoading: wasteLog_isLoading,
    wasteLogList_isLoadingBatchOptions,
    wasteLogList_isLoadingInventoryItems,
    wasteLogList_mapApiResponseToFormData,
    wasteLogList_mapFormDataToApiPayload,
    wasteLogList_onAddWasteLogItem,
    wasteLogList_onChangePage,
    wasteLogList_onDeleteWasteLogItem,
    wasteLogList_onInitializeForm,
    wasteLogList_onRemovePhoto,
    wasteLogList_onSaveWasteLog,
    wasteLogList_onSelectPhoto,
    wasteLogList_onShowDialogAddOrEditWasteLog,
    wasteLogList_onShowDialogCancelAddOrEditWasteLog,
    wasteLogList_onShowDialogDelete,
    wasteLogList_queryParams,
    wasteLogList_setScrollCallback,
    wasteLogList_uomOptions: WASTE_LOG_CREATE_EDIT_LIST_UOM_OPTIONS,
    wasteLogList_updateWasteLog,
    wasteLogList_values: wasteLog_lists,
  };
};
