import eventBus from '@/plugins/mitt';
import { STORAGE_LOCATION_LIST_COLUMNS } from '../contants';
import {
  IStorageLocationListProvided,
  IStorageLocationListRequestQuery,
} from '../interfaces/storage-location-list.interface';
import { useStorageLocationStore } from '../store';
import { DataTableSortEvent } from 'primevue';
import { IStorageLocation } from '../interfaces';

export const useStorageLocationService = (): IStorageLocationListProvided => {
  const store = useStorageLocationStore();
  const {
    storageLocation_isLoading,
    storageLocation_lists,
    storageLocationFormMode,
    storageLocation_editingItem,
  } = storeToRefs(store);

  const storageLocation_queryParams = reactive<IStorageLocationListRequestQuery>({
    page: 1,
    pageSize: 10,
    search: null,
    orderBy: null,
    orderDirection: null,
  });

  const storageLocation_fetchData = async () => {
    try {
      await store.storageLocation_fetchListData(storageLocation_queryParams, {
        paramsSerializer: useParamsSerializer,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  storageLocation_fetchData();

  watch(
    () => storageLocation_queryParams,
    () => {
      storageLocation_fetchData();
    },
    { deep: true },
  );

  const storageLocation_handleOnSearch = (searchTerm: string) => {
    storageLocation_queryParams.search = searchTerm;
  };

  const storageLocation_onChangePage = (page: number) => {
    storageLocation_queryParams.page = page;
  };

  const storageLocation_handleOnSortChange = (event: DataTableSortEvent) => {
    const sortField = event.sortField as string;
    const sortOrder = event.sortOrder as number;
    storageLocation_queryParams.orderBy = sortField === 'id' ? 'created_at' : 'id';

    if (sortOrder === 1) storageLocation_queryParams.orderDirection = 'asc';
    else if (sortOrder === -1) storageLocation_queryParams.orderDirection = 'desc';
    else storageLocation_queryParams.orderDirection = null;
  };

  const storageLocation_onCreate = () => {
    console.log('storageLocation_onCreate');
    store.setFormMode('create');
    eventBus.emit('AppBaseDialog', {
      id: 'storage-location-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    });
  };

  const storageLocation_onEdit = (storageLocationId: string) => {
    console.log(storageLocation_lists.value.data.items);
    const foundStorageLocation = storageLocation_lists.value.data.items.find(
      (storageLocation: IStorageLocation) => storageLocation.id === storageLocationId,
    );

    console.log('storageLocation_onEdit', foundStorageLocation);
    store.setFormMode('edit', foundStorageLocation);
    eventBus.emit('AppBaseDialog', {
      id: 'storage-location-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    });
  };

  const storageLocationList_deleteStorageLocation = async (storageLocationId: string): Promise<void> => {
    const storageLocation = storageLocation_lists.value.data.items.find(s => s.id === storageLocationId);

    if (!storageLocation) {
      console.error(`Storage Location with ID ${storageLocationId} not found`);
      return;
    }

    // Jika storage location punya items di dalamnya (misalnya field isHaveItems)
    if (storageLocation.isHaveItems) {
      const argsEventEmitter: IPropsDialogConfirmation = {
        id: 'storage-location-dialog-confirmation',
        description: 'This storage location has items associated with it and cannot be deleted.',
        iconName: 'info',
        isOpen: true,
        onClickButtonPrimary: () => {
          // Tutup dialog
          eventBus.emit('AppBaseDialogConfirmation', {
            id: 'storage-location-dialog-confirmation',
            isOpen: false,
          } as IPropsDialogConfirmation);
        },
        textButtonPrimary: 'Cancel',
        title: 'Cannot delete storage location',
        type: 'error',
      };
      eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      return;
    }

    const handle_delete = async (storageLocationId: string) => {
      try {
        const res = await store.storageLocation_deleteStorageLocation(storageLocationId);
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: EToastType.SUCCESS,
          message: res.message || 'Storage Location Action successfully!',
          position: EToastPosition.TOP_RIGHT,
        };

        eventBus.emit('AppBaseToast', argsEventEmitter);

        await storageLocation_fetchData();
      } catch (error: unknown) {
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      }
    };

    // Kalau bisa dihapus, tampilkan konfirmasi
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'storage-location-dialog-confirmation',
      description:
        'This action cannot be undone, and the storage location you remove will be deleted permanently.',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        // Tutup dialog
        eventBus.emit('AppBaseDialogConfirmation', {
          id: 'storage-location-dialog-confirmation',
          isOpen: false,
        } as IPropsDialogConfirmation);
      },
      onClickButtonSecondary: async () => {
        // Tutup dialog
        eventBus.emit('AppBaseDialogConfirmation', {
          id: 'storage-location-dialog-confirmation',
          isOpen: false,
        } as IPropsDialogConfirmation);

        await handle_delete(storageLocationId);
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete',
      title: 'Are you sure you want to delete this storage location?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  return {
    storageLocation_columns: STORAGE_LOCATION_LIST_COLUMNS,
    storageLocation_fetchData,
    storageLocation_isLoading,
    storageLocation_onChangePage,
    storageLocation_handleOnSortChange,
    storageLocation_handleOnSearch,
    storageLocation_queryParams,
    storageLocation_onCreate,
    storageLocation_onEdit,
    storageLocation_onDelete: storageLocationList_deleteStorageLocation,
    storageLocation_values: storageLocation_lists,
    storageLocationFormMode,
    storageLocation_editingItem,
  };
};
