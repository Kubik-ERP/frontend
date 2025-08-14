import { IInventoryCategoryListRequestQuery } from '@/modules/inventory-category/interfaces/inventory-category-list.interface';
import { ITEMS_LIST_COLUMS } from '../constants';
import { IInventoryItemsListProvided } from '../interfaces/items-list.interface';
import { useInventoryItemsStore } from '../store';
import { DataTableSortEvent } from 'primevue';
import eventBus from '@/plugins/mitt';

export const useInventoryItemsListService = (): IInventoryItemsListProvided => {
  const store = useInventoryItemsStore();
  const { inventoryItemsFormMode, inventoryItems_editingItem, inventoryItems_isLoading, inventoryItems_lists } =
    storeToRefs(store);
  const router = useRouter();

  const inventoryItems_queryParams: IInventoryCategoryListRequestQuery = reactive({
    page: 1,
    pageSize: 10,
    search: null,
    orderBy: null,
    orderDirection: null,
  });

  const inventoryItems_fetchData = async () => {
    try {
      inventoryItems_isLoading.value = true;
      await store.InventoryItems_fetchData(inventoryItems_queryParams, {
        paramsSerializer: useParamsSerializer,
      });

      inventoryItems_isLoading.value = false;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  watch(
    inventoryItems_queryParams,
    () => {
      inventoryItems_fetchData();
    },
    { deep: true },
  );

  onMounted(() => {
    inventoryItems_fetchData();
  });

  const inventoryItems_onChangePage = (page: number) => {
    inventoryItems_queryParams.page = page;
  };

  const inventoryItems_handleOnSearch = (searchTerm: string) => {
    inventoryItems_queryParams.search = searchTerm;
  };

  const inventoryItems_handleOnSortChange = (event: DataTableSortEvent) => {
    inventoryItems_queryParams.orderBy = 'updated_at';
    inventoryItems_queryParams.orderDirection = event.sortOrder === 1 ? 'asc' : 'desc';
  };

  const inventoryItems_onCreate = () => {
    inventoryItemsFormMode.value = 'create';
    inventoryItems_editingItem.value = null;

    router.push({ name: 'items.create' });
  };

  const inventoryItems_onEdit = (inventoryItemsId: string) => {
    inventoryItemsFormMode.value = 'edit';
    inventoryItems_editingItem.value =
      inventoryItems_lists.value.data.items.find(item => item.id === inventoryItemsId) ?? null;

    router.push({ name: 'items.edit', params: { id: inventoryItemsId } });
  };

  const inventoryItems_onDelete = (inventoryItemsId: string) => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'inventory-items-dialog-confirmation',
      description: 'This action cannot be undone, and the items you remove will be deleted permanently.',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        // Close dialog (Cancel)
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'inventory-items-dialog-confirmation',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      },
      onClickButtonSecondary: async () => {
        // Close dialog
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'inventory-items-dialog-confirmation',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);

        // Proceed delete
        await store.inventoryItems_DeleteData(
          { paramsSerializer: useParamsSerializer },
          inventoryItemsId
        );

        await inventoryItems_fetchData();
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete',
      title: 'Are you sure want to delete this item?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  const inventoryItem_onAdjustment = (inventoryItemsId: string) => {
    router.push({name: 'items.stock.adjustment', params: {id: inventoryItemsId}});
  }

  return {
    inventoryItems_colums: ITEMS_LIST_COLUMS,
    inventoryItems_queryParams,
    inventoryItems_fetchData,
    inventoryItems_list: inventoryItems_lists.value.data.items,
    inventoryItems_values: inventoryItems_lists,
    inventoryItems_isLoading,
    inventoryItems_handleOnSearch,
    inventoryItems_onChangePage,
    inventoryItems_handleOnSortChange,
    inventoryItems_onCreate,
    inventoryItems_onEdit,
    inventoryItems_onDelete,
    inventoryItemsFormMode,
    inventoryItems_editingItem,
    inventoryItem_onAdjustment
  };
};
