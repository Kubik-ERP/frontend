import useVuelidate from '@vuelidate/core';
import { IInventoryItemsPayload } from '../interfaces';
import { IInventoryItemsActionProvided } from '../interfaces/items-action.interface';
import { useInventoryItemsStore } from '../store';
import { useInventoryCategoryStore } from '@/modules/inventory-category/store';
import { useBrandStore } from '@/modules/brand/store';
import { useStorageLocationStore } from '@/modules/storage-location/store';
import eventBus from '@/plugins/mitt';
import { useSupplierStore } from '@/modules/supplier/store';
export const useInvetoryItemsActionService = (): IInventoryItemsActionProvided => {
  const store = useInventoryItemsStore();
  const { inventoryItemsFormMode, inventoryItems_editingItem, inventoryItems_isLoading } = storeToRefs(store);
  const storeCategory = useInventoryCategoryStore();
  const storeBrand = useBrandStore();
  const storeStorageLocation = useStorageLocationStore();
  const storeSupplier = useSupplierStore();

  const { supplier_supplierLists } = storeToRefs(storeSupplier);

  const { brandList } = storeToRefs(storeBrand);

  const { inventoryCategoryList } = storeToRefs(storeCategory);

  const { storageLocation_lists } = storeToRefs(storeStorageLocation);

  const router = useRouter();

  onMounted(async () => {
    await storeCategory.inventoryCategoryList_fetchList(
      {
        pageSize: 100,
        page: 1,
        search: null,
        orderBy: null,
        orderDirection: null,
      },
      {},
    );

    await storeBrand.brandList_fetchList(
      {
        pageSize: 100,
        page: 1,
        search: null,
        orderBy: null,
        orderDirection: null,
      },
      {},
    );

    await storeStorageLocation.storageLocation_fetchListData(
      {
        pageSize: 100,
        page: 1,
        search: null,
        orderBy: null,
        orderDirection: null,
      },
      {},
    );

    await storeSupplier.supplier_list(
      {
        pageSize: 100,
        page: 1,
        search: null,
        orderBy: null,
        orderDirection: null,
      },
      {},
    );
  });

  const inventoryItemsAction_formData = ref<IInventoryItemsPayload>({
    name: '',
    brandId: '',
    barcode: '',
    sku: '',
    categoryId: '',
    unit: '',
    notes: '',
    stockQuantity: 0,
    reorderLevel: 0,
    minimumStockQuantity: 0,
    expiryDate: '',
    storageLocationId: '',
    supplierId: '',
    pricePerUnit: 0,
  });

  const route = useRoute();
  watch(
    [inventoryItemsFormMode, inventoryItems_editingItem],
    async ([mode, item]) => {
      if (mode === 'edit' && item) {
        Object.assign(inventoryItemsAction_formData.value, {
          name: item.itemName,
          brandId: item.brandId,
          barcode: item.barcode,
          sku: item.sku,
          categoryId: item.categoryId,
          unit: item.unit,
          notes: item.notes,
          stockQuantity: item.stockQuantity,
          reorderLevel: item.reorderLevel,
          minimumStockQuantity: item.minimumStockQuantity,
          expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
          storageLocationId: item.storageLocationId,
          supplierId: item.supplierId,
          pricePerUnit: item.pricePerUnit,
        });
      } else if (route.params.id) {
        inventoryItemsFormMode.value = 'edit';
        const res = await  store.inventoryItems_GetData({
          ...route.params
        } ,route.params.id as string);
        inventoryItems_editingItem.value = res.data;
      } else {
        inventoryItemsAction_formData.value = {
          name: '',
          brandId: '',
          barcode: '',
          sku: '',
          categoryId: '',
          unit: '',
          notes: '',
          stockQuantity: 0,
          reorderLevel: 0,
          minimumStockQuantity: 0,
          expiryDate: '',
          storageLocationId: '',
          supplierId: '',
          pricePerUnit: 0,
        };
      }
    },
    { immediate: true }, // biar langsung isi kalau datanya udah ada
  );

  const inventoryItems_formValidation = computed(() => ({
    name: { required: true },
    brandId: { required: false },
    barcode: {},
    sku: { required: true },
    categoryId: { required: true },
    unit: { required: true },
    notes: {},
    stockQuantity: { required: true },
    reorderLevel: { required: true },
    minimumStockQuantity: { required: true },
    expiryDate: {},
    storageLocationId: { required: true },
    supplierId: { required: true },
    pricePerUnit: { required: true },
  }));

  const inventoryItems_FormValid = computed(() => ({
    name: inventoryItemsAction_formData.value.name,
    brandId: inventoryItemsAction_formData.value.brandId,
    barcode: inventoryItemsAction_formData.value.barcode,
    sku: inventoryItemsAction_formData.value.sku,
    categoryId: inventoryItemsAction_formData.value.categoryId,
    unit: inventoryItemsAction_formData.value.unit,
    notes: inventoryItemsAction_formData.value.notes,
    stockQuantity: inventoryItemsAction_formData.value.stockQuantity,
    reorderLevel: inventoryItemsAction_formData.value.reorderLevel,
    minimumStockQuantity: inventoryItemsAction_formData.value.minimumStockQuantity,
    expiryDate: inventoryItemsAction_formData.value.expiryDate,
    storageLocationId: inventoryItemsAction_formData.value.storageLocationId,
    supplierId: inventoryItemsAction_formData.value.supplierId,
    pricePerUnit: inventoryItemsAction_formData.value.pricePerUnit,
  }));

  const inventoryItemsAction_Validation = useVuelidate(inventoryItems_formValidation, inventoryItems_FormValid, {
    $autoDirty: true,
    $lazy: true,
  });

  const onSubmit = async (payload: IInventoryItemsPayload, mode: 'create' | 'edit', id?: string) => {
    let result;
    if (mode === 'create') {
      result = await store.inventoryItems_PostData({}, payload);
    } else if (mode === 'edit' && id) {
      result = await store.inventoryItems_PutData({}, id, payload);
    }

    const argsEventEmitter: IPropsToast = {
      isOpen: true,
      type: EToastType.SUCCESS,
      message:
        result?.message ||
        (mode === 'create' ? 'Category created successfully!' : 'Category updated successfully!'),
      position: EToastPosition.TOP_RIGHT,
    };
    await eventBus.emit('AppBaseToast', argsEventEmitter);

    router.push({ name: 'items.list' });
  };

  const onCancel = () => {
    router.push({ name: 'items.list' });
  };

  const inventoryItemsAction_isValid = ref(false);

  const inventoryItems_handleBarcodeScanner = () => {
    alert('handleBarcodeScanner');
  };




  return {
    inventoryItemsAction_isLoading: inventoryItems_isLoading,
    inventoryItemsAction_formData,
    inventoryItemsAction_Validation,
    inventoryItemsAction_isValid,
    inventoryItemsAction_brandList: computed(() => brandList.value?.data?.items ?? []),
    inventoryItemsAction_categoryList: computed(() => inventoryCategoryList.value?.data?.items ?? []),
    inventoryItemsAction_locationStorage: computed(() => storageLocation_lists.value?.data?.items ?? []),
    inventoryItemAction_supplierList: computed(() => supplier_supplierLists.value?.data?.items ?? []),
    inventoryItemsAction_onSubmit: onSubmit,
    inventoryItemsAction_onCancel: onCancel,
    inventoryItemsAction_values: inventoryItemsAction_formData,
    inventoryItemsAction_formOnMode: inventoryItemsFormMode,
    inventoryItems_editingItem,
    inventoryItems_handleBarcodeScanner
  };
};
