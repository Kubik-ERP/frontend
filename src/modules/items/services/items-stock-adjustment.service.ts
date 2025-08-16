import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useInventoryItemsStore } from '../store';
import {
  IInventoryItemsStcokAdjustmentListRequestQuery,
  ItemsStockAdjustmentProvided,
} from '../interfaces/items-stock-adjustment.interface';
import { ITEM_STOCK_ADJUSTMENT_LIST_COLUMNS } from '../constants';
import { DataTableSortEvent } from 'primevue';
import eventBus from '@/plugins/mitt';

export const useInventoryItemPreviewService = (): ItemsStockAdjustmentProvided => {
  const store = useInventoryItemsStore();
  const { itemStockAdjustment_editingItem, itemsStockAdjustment_lists, inventoryItems_editingItem } = storeToRefs(store);
  const route = useRoute();

  const stockadjustment_isLoading = ref(false);

  const inventoryItemPreview_fetchItemById = async (id: string) => {
    stockadjustment_isLoading.value = true;
    try {
      const res = await store.inventoryItems_GetData({}, id);
      if (res?.data) {
        inventoryItems_editingItem.value = res.data;
      }
      stockadjustment_isLoading.value = false;
    } catch (err: unknown) {
      console.error('Failed to fetch item:', err);
      stockadjustment_isLoading.value = false;
    }
  };

  onMounted(async () => {
    await inventoryItemPreview_fetchItemById(route.params.id as string);
  });

  const inventoryItemPreview_onEditItem = (id: string) => {
    itemStockAdjustment_editingItem.value =
      itemsStockAdjustment_lists.value.data.items.find(item => item.id === id) ?? null;
    store.setStockAdjustmentFormMode('edit', itemStockAdjustment_editingItem.value);
    eventBus.emit('AppBaseDialog', {
      id: 'stock-adjustment-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    });
  };

  const stockadjustment_queryParams = ref<IInventoryItemsStcokAdjustmentListRequestQuery>({
    page: 1,
    pageSize: 10,
    search: null,
    action: null,
  });

  const stockadjustment_fetchList = async (id: string) => {
    stockadjustment_isLoading.value = true;
    try {
      const res = await store.inventoryItem_StockAdjustment(
        {
          paramsSerializer: useParamsSerializer,
        },
        id,
        stockadjustment_queryParams.value,
      );
      if (res?.data) {
        itemsStockAdjustment_lists.value.data = res.data;
      }
      stockadjustment_isLoading.value = false;
    } catch (err) {
      console.error('Failed to fetch stock adjustment list:', err);
      stockadjustment_isLoading.value = false;
    }
  };

  watch(
    () => stockadjustment_queryParams.value,
    () => {
      stockadjustment_fetchList(route.params.id as string);
    },
    { deep: true },
  );

  onMounted(async () => {
    await stockadjustment_fetchList(route.params.id as string);
  });

  const stockadjustment_onChangePage = (page: number) => {
    stockadjustment_queryParams.value.page = page;
  };

  const stockadjustment_handleOnSortChange = (event: DataTableSortEvent) => {
    // const { sortField, sortOrder } = event;
    // stockadjustment_queryParams.value.sortField = sortField;
    // stockadjustment_queryParams.value.sortOrder = sortOrder;
    console.log('event', event);
  };

  const stockadjustment_handleOnSearch = (searchTerm: string) => {
    stockadjustment_queryParams.value.search = searchTerm;
  };

  const stockadjustment_handleOnFilter = (filter: null | 'STOCK_IN' | 'STOCK_OUT') => {
    stockadjustment_queryParams.value.action = filter;
  };

  const stockadjustment_onCreate = () => {
    store.setStockAdjustmentFormMode('create', null);
    eventBus.emit('AppBaseDialog', {
      id: 'stock-adjustment-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    });
  };

  return {
    inventoryItemPreview_item: inventoryItems_editingItem,
    inventoryItemPreview_fetchItemById,
    inventoryItemPreview_onEditItem,
    stockadjustment_queryParams,
    stockadjustment_fetchList,
    stockadjustment_listColumns: ITEM_STOCK_ADJUSTMENT_LIST_COLUMNS,
    stockadjustment_isLoading,
    stockadjustment_list: itemsStockAdjustment_lists,
    stockadjustment_onChangePage,
    stockadjustment_handleOnSortChange,
    stockadjustment_handleOnSearch,
    stockadjustment_handleOnFilter,
    stockadjustment_onCreate,
  };
};
