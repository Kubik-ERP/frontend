import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { IInventoryItemsPayload } from '../interfaces';
import { IInventoryItemsActionProvided } from '../interfaces/items-action.interface';
import { useInventoryItemsStore } from '../store';
import { useInventoryCategoryStore } from '@/modules/inventory-category/store';
import { useBrandStore } from '@/modules/brand/store';
import { useStorageLocationStore } from '@/modules/storage-location/store';
import eventBus from '@/plugins/mitt';
import { useSupplierStore } from '@/modules/supplier/store';
// import { useOutletStore } from '@/modules/outlet/store';

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
    inventoryItems_isLoading.value = true;

    try {
      await Promise.all([
        storeCategory.inventoryCategoryList_fetchList(
          { pageSize: 100, page: 1, search: null, orderBy: null, orderDirection: null },
          {},
        ),
        storeBrand.brandList_fetchList(
          { pageSize: 100, page: 1, search: null, orderBy: null, orderDirection: null },
          {},
        ),
        storeStorageLocation.storageLocation_fetchListData(
          { pageSize: 100, page: 1, search: null, orderBy: null, orderDirection: null },
          {},
        ),
        storeSupplier.supplier_list(
          { pageSize: 100, page: 1, search: null, orderBy: null, orderDirection: null },
          {},
        ),
      ]);
    } finally {
      inventoryItems_isLoading.value = false;
    }
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
    priceGrosir: 0,
    imagePreview: null,
    imageFile: null,
    conversions: [],
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
          priceGrosir: item.priceGrosir,
          imagePreview: item.imageUrl ? `${import.meta.env.VITE_APP_BASE_BUCKET_URL}${item.imageUrl}` : null,
          imageFile: item.imageUrl ? `${import.meta.env.VITE_APP_BASE_BUCKET_URL}${item.imageUrl}` : null,
          conversions: item.masterInventoryItemConversions?.map(c => ({
            unitName: c.unitName,
            unitSymbol: c.unitSymbol,
            value: c.conversionValue,
          })) || [],
        });
      } else if (route.params.id) {
        inventoryItemsFormMode.value = 'edit';
        const res = await store.inventoryItems_GetData({ ...route.params }, route.params.id as string);
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
          priceGrosir: 0,
          imagePreview: null,
          imageFile: null,
          conversions: [],
        };
      }
    },
    { immediate: true },
  );

  const inventoryItems_formValidationRules = computed(() => ({
    name: { required },
    sku: { },
    categoryId: { required },
    unit: { required },
    stockQuantity: { required },
    reorderLevel: { required },
    minimumStockQuantity: { required },
    supplierId: { required },
    pricePerUnit: { required },
  }));

  const inventoryItems_validModel = computed(() => inventoryItemsAction_formData.value);

  const inventoryItemsAction_Validation = useVuelidate(
    inventoryItems_formValidationRules,
    inventoryItems_validModel,
    {
      $autoDirty: true,
      $lazy: true,
    },
  );

  const inventoryItemsAction_isValid = computed(() => !inventoryItemsAction_Validation.value.$invalid);

  const onSubmit = async (mode: 'create' | 'edit', id?: string) => {
    const isFormCorrect = await inventoryItemsAction_Validation.value.$validate();
    if (!isFormCorrect) {
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.DANGER,
        message: 'Please fill all required fields',
        position: EToastPosition.TOP_RIGHT,
      };
      eventBus.emit('AppBaseToast', argsEventEmitter);
      return;
    }

    const formattedPayload = { ...inventoryItemsAction_formData.value };
    if (formattedPayload.expiryDate instanceof Date) {
      const date = formattedPayload.expiryDate;
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      formattedPayload.expiryDate = `${year}-${month}-${day}`;
    } else if (formattedPayload.expiryDate === null) {
      formattedPayload.expiryDate = '';
    }

    let result;
    if (mode === 'create') {
      result = await store.inventoryItems_PostData({}, formattedPayload);
    } else if (mode === 'edit' && id) {
      result = await store.inventoryItems_PutData({}, id, formattedPayload);
    }

    const argsEventEmitter: IPropsToast = {
      isOpen: true,
      type: EToastType.SUCCESS,
      message:
        result?.message || (mode === 'create' ? 'Item created successfully!' : 'Item updated successfully!'),
      position: EToastPosition.TOP_RIGHT,
    };
    await eventBus.emit('AppBaseToast', argsEventEmitter);

    router.push({ name: 'items.list' });
  };

  const onCancel = () => {
    router.push({ name: 'items.list' });
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
    inventoryItems_handleBarcodeScanner,
  };
};
