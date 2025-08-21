import { SUPPLIER_LIST_TABLE_ITEMS_COLUMNS } from '../constants';
import { ISupplierItemListRequestQuery } from '../interfaces/supplier-list.interface';
import { ISupplierPreviewItemsProvided } from '../interfaces/supplier-preview.interface';
import { useSupplierStore } from '../store';
import { DataTableSortEvent } from 'primevue';

export const useSupplierPreviewItemService = (): ISupplierPreviewItemsProvided => {
  const store = useSupplierStore();
  const { supplier_itemLists } = storeToRefs(store);
  const route = useRoute();
  const supplierPreview_isLoading = ref(false);
  const supplierPreview_itemsLoading = ref(false);

  const supplierPreview_queryItemSupplier = ref<ISupplierItemListRequestQuery>({
    page: 1,
    pageSize: 10,
    search: null,
    orderBy: null,
    orderDirection: null,
    startDate: null,
    endDate: null,
  });

  const supplierPreview_fetchSupplierItem = async () => {
    console.log('supplierPreview_fetchSupplierItem');
    supplierPreview_itemsLoading.value = true;
    try {
      await store.supplier_getItems(route.params.id as string, supplierPreview_queryItemSupplier.value, {
        ...useHttpAbort().httpAbort_registerAbort(`SUPPLIER_GET_ITEMS_${route.params.id}`),
      });

      supplierPreview_itemsLoading.value = false;
    } catch (error) {
      supplierPreview_itemsLoading.value = false;
      console.error('Error fetching supplier:', error);
      throw error;
    }
  };

  watch(
    () => supplierPreview_queryItemSupplier,
    debounce(async () => {
      await supplierPreview_fetchSupplierItem();
    }, 500),
    { deep: true },
  );

  onMounted(async () => {
    await supplierPreview_fetchSupplierItem();
  });

  const supplierPreview_onChangePage = (page: number) => {
    supplierPreview_queryItemSupplier.value.page = page;
  };

  const supplierPreview_onSort = (event: DataTableSortEvent) => {
    supplierPreview_queryItemSupplier.value.orderBy = event.sortField as string;
    supplierPreview_queryItemSupplier.value.orderDirection = event.sortOrder === 1 ? 'asc' : 'desc';
  };

  return {
    supplierPreview_isLoading,
    supplierPreview_columnItems: SUPPLIER_LIST_TABLE_ITEMS_COLUMNS,
    supplierPreview_queryItemSupplier: supplierPreview_queryItemSupplier,
    supllierPreview_itemSupplier: supplier_itemLists,
    supplierPreview_onChangePage,
    supplierPreview_onSort,
    supplierPreview_itemsLoading,
  };
};
