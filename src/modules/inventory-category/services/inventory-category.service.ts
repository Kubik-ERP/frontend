import { DataTableSortEvent } from 'primevue';
import { INVERNTORY_CATEGORY_LIST_COLUMNS, VOUCHER_LIST_REQUEST } from '../constants';
import {
  IInventoryCategoryListProvided,
  IInventoryCategoryListRequestQuery,
} from '../interfaces/inventory-category-list.interface';
import { useInventoryCategoryStore } from '../store';
import eventBus from '@/plugins/mitt';
import { storeToRefs } from 'pinia';

export const useInventoryCategoryService = (): IInventoryCategoryListProvided => {
  const store = useInventoryCategoryStore();
  // use storeToRefs so components/services share the same reactive state
  const {
    inventoryCategoryList_isLoading,
    inventoryCategoryList,
    inventoryCategoryFormMode,
    inventoryCategory_editingItem,
  } = storeToRefs(store);

  const { httpAbort_registerAbort } = useHttpAbort();

  const inventoryCategoryList_queryParams = reactive<IInventoryCategoryListRequestQuery>({
    page: 1,
    pageSize: 10,
    search: null,
    orderBy: null,
    orderDirection: 'desc',
  });

  /**
   * Fetch Inventory Category List
   */
  const inventoryCategoryList_fetchData = async (): Promise<void> => {
    try {
      await store.inventoryCategoryList_fetchList(inventoryCategoryList_queryParams, {
        ...httpAbort_registerAbort(VOUCHER_LIST_REQUEST),
        paramsSerializer: useParamsSerializer,
      });
    } catch (error: unknown) {
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // initial fetch (same as before)
  watch(
    () => ({ ...inventoryCategoryList_queryParams }),
    debounce(async () => {
      await inventoryCategoryList_fetchData();
    }, 500),
    { deep: true, immediate: true },
  );

  /**
   * Handle page change
   */
  const inventoryCategoryList_onChangePage = (page: number): void => {
    inventoryCategoryList_queryParams.page = page;
  };

  /**
   * Handle sort change
   */
  const inventoryCategoryList_handleOnSortChange = (event: DataTableSortEvent): void => {
    const sortField = event.sortField as string;
    const sortOrder = event.sortOrder as number;
    inventoryCategoryList_queryParams.orderBy = sortField === 'createdAt' ? 'created_at' : 'id';

    if (sortOrder === 1) {
      inventoryCategoryList_queryParams.orderDirection = 'asc';
    } else if (sortOrder === -1) {
      inventoryCategoryList_queryParams.orderDirection = 'desc';
    } else {
      inventoryCategoryList_queryParams.orderDirection = null;
    }
    inventoryCategoryList_fetchData();
  };

  /**
   * Handle create category
   * -> use store.setFormMode so modal + form read shared state
   */
  const inventoryCategoryList_onCreateCategory = (): void => {
    store.setFormMode('create', null);
    const argsEventEmitter: IPropsDialog = {
      id: 'inventory-category-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * Handle edit category
   */
  const inventoryCategoryList_onEditCategory = (categoryId: string): void => {
    const category = inventoryCategoryList.value.data.items.find(item => item.id === categoryId) ?? null;
    store.setFormMode('edit', category);
    const argsEventEmitter: IPropsDialog = {
      id: 'inventory-category-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * Handle delete category (actual deletion after confirmation)
   */
  const inventoryCategoryList_onDeleteCategory = async (categoryId: string): Promise<void> => {
    try {
      const res = await store.inventoryCategoryList_deleteCategory(categoryId);
      // Show toast success
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: res.message || 'Category has been deleted successfully',
        position: EToastPosition.TOP_RIGHT,
      };
      eventBus.emit('AppBaseToast', argsEventEmitter);
      // Refetch list handled in store.delete (but call to be safe)
      await inventoryCategoryList_fetchData();
    } catch (error: unknown) {
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
  };

  /**
   * Delete Category (show confirmation first then call onDelete)
   * - keep the previous dialog-confirmation behavior
   */
  const inventoryCategoryList_deleteCategory = async (categoryId: string): Promise<void> => {
    const item = inventoryCategoryList.value.data.items.find(c => c.id === categoryId);
    if (!item) return;

    if (item.isHaveItems) {
      const argsEventEmitter: IPropsDialogConfirmation = {
        id: 'inventory-category-dialog-confirmation',
        description: 'This inventory category have items in it and cannot be deleted.',
        iconName: 'info',
        isOpen: true,
        onClickButtonPrimary: () => {
          eventBus.emit('AppBaseDialogConfirmation', { id: 'inventory-category-dialog-confirmation', isOpen: false } as IPropsDialogConfirmation);
        },
        textButtonPrimary: 'Cancel',
        title: 'Cannot delete inventory',
        type: 'error',
      };
      eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      return;
    }

    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'inventory-category-dialog-confirmation',
      description: 'This action cannot be undone, and the category you remove will be deleted permanently.',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialogConfirmation', { id: 'inventory-category-dialog-confirmation', isOpen: false } as IPropsDialogConfirmation);
      },
      onClickButtonSecondary: async () => {
        eventBus.emit('AppBaseDialogConfirmation', { id: 'inventory-category-dialog-confirmation', isOpen: false } as IPropsDialogConfirmation);
        await inventoryCategoryList_onDeleteCategory(categoryId);
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete Category',
      title: 'Are you sure want to delete this category?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * handle search
   */
  const inventoryCategoryList_handleOnSearch = (searchTerm: string): void => {
    inventoryCategoryList_queryParams.search = searchTerm;
    inventoryCategoryList_queryParams.page = 1; // Reset to first page on search
    inventoryCategoryList_fetchData();
  };

  const inventoryCategoryList_onImport = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'inventory-category-import-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  }

  return {
    inventoryCategoryList_columns: INVERNTORY_CATEGORY_LIST_COLUMNS,
    inventoryCategoryList_fetchData,
    inventoryCategoryList_isLoading,
    inventoryCategoryList_onChangePage,
    inventoryCategoryList_handleOnSortChange,
    inventoryCategoryList_handleOnSearch,
    inventoryCategoryList_queryParams,
    inventoryCategoryList_values: inventoryCategoryList,
    inventoryCategoryList_onCreateCategory,
    inventoryCategoryList_onEditCategory,
    inventoryCategoryList_onDeleteCategory: inventoryCategoryList_deleteCategory,
    inventoryCategoryFormMode,
    inventoryCategoryList_editingItem: inventoryCategory_editingItem,
    inventoryCategoryList_onImport
  };
};
