// Constants
import { TRANSFER_STOCK_CREATE_EDIT_LIST_COLUMNS } from '../constants';

// Interfaces
import type {
  ITransferStockCreateEditFormData,
  ITransferStockCreateEditProductItem,
  ITransferStockCreateEditProvided,
  ITransferStockStockShortfall,
} from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useTransferStockStore } from '../store';
import { useOutletStore } from '@/modules/outlet/store';
import { useInventoryItemsStore } from '@/modules/items/store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

/**
 * @description Simple UUID generator for transfer stock items
 */
const generateId = (): string => {
  return 'ts-item-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useTransferStockCreateEditService = (): ITransferStockCreateEditProvided => {
  /**
   * @description Injected variables
   */
  const router = useRouter(); // Router instance
  const route = useRoute(); // Current route
  const store = useTransferStockStore(); // Instance of the store
  const outletStore = useOutletStore(); // Outlet store for getting stores/outlets
  const itemsStore = useInventoryItemsStore(); // Items store for getting inventory items
  // const { transferStock_detail } = storeToRefs(store);
  // const { httpAbort_registerAbort } = useHttpAbort(); // TODO: Uncomment when backend API is available

  /**
   * @description Computed properties for business logic
   */
  const transferStockCreateEdit_isEditMode = computed(() => route.params.id !== undefined);
  const transferStockCreateEdit_transferStockId = computed(() => (route.params.id ? String(route.params.id) : ''));

  /**
   * @description Computed property to transform product items for dropdown display
   */
  const transferStockCreateEdit_listProductItems = computed((): IDropdownItem[] => {
    return itemsStore.inventoryItems_lists.data.items.map(item => {
      return {
        value: {
          id: generateId(), // Generate unique ID for the transfer stock item
          masterItemId: item.id, // Store the original inventory item ID
          sku: item.sku,
          name: item.itemName,
          brandName: item.brand || '', // Get brand name from item
          quantity: 1,
          unit: item.unit || 'pcs',
          unitPrice: item.pricePerUnit || 0,
          totalPrice: item.pricePerUnit || 0,
          stockQuantity: item.stockQuantity || 0,
        },
        label: `${item.sku} - ${item.itemName}`,
      };
    });
  });

  /**
   * @description Computed property for list columns
   */
  const transferStockCreateEdit_listColumns = computed(() => TRANSFER_STOCK_CREATE_EDIT_LIST_COLUMNS);

  /**
   * @description Computed property for from stores dropdown
   */
  const transferStockCreateEdit_listFromStores = computed((): IDropdownItem[] => {
    return outletStore.outlet_lists.items.map(outlet => ({
      label: outlet.name,
      value: outlet.id,
    }));
  });

  /**
   * @description Computed property for to stores dropdown (exclude selected from store)
   */
  const transferStockCreateEdit_listToStores = computed((): IDropdownItem[] => {
    return outletStore.outlet_lists.items
      .filter(outlet => outlet.id !== transferStockCreateEdit_formData.value.fromStoreId)
      .map(outlet => ({
        label: outlet.name,
        value: outlet.id,
      }));
  });

  /**
   * @description Reactive variables
   */
  const transferStockCreateEdit_formData = ref<ITransferStockCreateEditFormData>({
    fromStoreId: '',
    toStoreId: '',
    transferDate: null,
    notes: '',
    productItems: [],
  });
  const transferStockCreateEdit_formDataOfEditQuantity = ref<ITransferStockCreateEditProductItem>({
    id: '',
    masterItemId: '',
    name: '',
    brandName: '',
    quantity: 0,
    sku: '',
    unit: '',
    unitPrice: 0,
    totalPrice: 0,
  });
  const transferStockCreateEdit_selectedProductItem = ref<ITransferStockCreateEditProductItem | null>(null);
  const transferStockCreateEdit_selectedProductItems = ref<ITransferStockCreateEditProductItem[]>([]);
  const transferStockCreateEdit_stockShortfalls = ref<ITransferStockStockShortfall[]>([]);
  const transferStockCreateEdit_totalItems = ref<number>(0);
  const transferStockCreateEdit_totalQuantity = ref<number>(0);
  const transferStockCreateEdit_totalValue = ref<number>(0);

  /**
   * @description Form validations
   */
  const transferStockCreateEdit_formRules = computed(() => ({
    fromStoreId: { required },
    toStoreId: {
      required,
      differentFromFromStore: helpers.withMessage(
        'Destination store must be different from source store',
        (value: string) => value !== transferStockCreateEdit_formData.value.fromStoreId,
      ),
    },
    transferDate: {
      required,
      date: helpers.withMessage(
        'Transfer date must be a valid date',
        (value: Date | string) => !isNaN(new Date(value).getTime()),
      ),
    },
  }));
  const transferStockCreateEdit_formRulesOfEditQuantity = computed(() => ({
    quantity: {
      required,
      minValue: helpers.withMessage('Quantity must be at least 1', (value: number) => value > 0),
      maxValue: helpers.withMessage('Quantity cannot exceed available stock', (value: number) => {
        const item = transferStockCreateEdit_formDataOfEditQuantity.value;
        return !item.stockQuantity || value <= item.stockQuantity;
      }),
    },
  }));

  const transferStockCreateEdit_formValidations = useVuelidate(
    transferStockCreateEdit_formRules,
    transferStockCreateEdit_formData,
    {
      $autoDirty: true,
    },
  );
  const transferStockCreateEdit_formValidationsOfEditQuantity = useVuelidate(
    transferStockCreateEdit_formRulesOfEditQuantity,
    transferStockCreateEdit_formDataOfEditQuantity.value,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle business logic for resetting form data
   */
  const transferStockCreateEdit_onResetForm = (): void => {
    transferStockCreateEdit_formData.value = {
      fromStoreId: '',
      toStoreId: '',
      transferDate: null,
      notes: '',
      productItems: [],
    };

    transferStockCreateEdit_selectedProductItems.value = [];
    transferStockCreateEdit_selectedProductItem.value = null;
    transferStockCreateEdit_stockShortfalls.value = [];
    transferStockCreateEdit_totalItems.value = 0;
    transferStockCreateEdit_totalQuantity.value = 0;
    transferStockCreateEdit_totalValue.value = 0;

    transferStockCreateEdit_formValidations.value.$reset();
  };

  /**
   * @description Handle validate stock availability
   */
  const transferStockCreateEdit_onValidateStockAvailability = async (): Promise<boolean> => {
    const shortfalls: ITransferStockStockShortfall[] = [];

    transferStockCreateEdit_selectedProductItems.value.forEach(item => {
      const availableStock = item.stockQuantity || 0;
      if (item.quantity > availableStock) {
        shortfalls.push({
          itemName: item.name,
          sku: item.sku,
          requestedQuantity: item.quantity,
          availableStock,
          shortfall: item.quantity - availableStock,
        });
      }
    });

    transferStockCreateEdit_stockShortfalls.value = shortfalls;

    if (shortfalls.length > 0) {
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.WARNING,
        message: `Stock shortfall detected for ${shortfalls.length} item(s). Please review quantities.`,
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      return false;
    }

    return true;
  };

  /**
   * @description Handle fetch api transfer stock - create
   */
  const transferStockCreateEdit_fetchCreate = async (): Promise<unknown> => {
    try {
      // Validate stock availability first
      const isStockAvailable = await transferStockCreateEdit_onValidateStockAvailability();
      if (!isStockAvailable) {
        return Promise.reject(new Error('Insufficient stock for transfer'));
      }

      // Build payload matching API requirements
      const payload = {
        store_to_id: transferStockCreateEdit_formData.value.toStoreId,
        items: transferStockCreateEdit_selectedProductItems.value.map(item => ({
          itemId: item.masterItemId,
          qty: item.quantity,
        })),
        note: transferStockCreateEdit_formData.value.notes || undefined,
      };

      await store.transferStock_create(payload);

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Transfer stock created successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      setTimeout(() => {
        router.push({ name: 'transfer-stock.index' });
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api transfer stock - details
   */
  const transferStockCreateEdit_fetchDetails = async (): Promise<unknown> => {
    try {
      await store.transferStock_detail(transferStockCreateEdit_transferStockId.value);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api outlet - list and items list
   */
  const transferStockCreateEdit_fetchOutletList = async (): Promise<unknown> => {
    try {
      // Fetch outlets/stores
      await outletStore.fetchOutlet_lists({});

      // Fetch inventory items
      await itemsStore.InventoryItems_fetchData(
        {
          page: 1,
          pageSize: 100, // Get all items
          orderBy: 'name',
          orderDirection: 'asc',
        },
        {},
      );

      return Promise.resolve();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api transfer stock - update
   */
  const transferStockCreateEdit_fetchUpdate = async (): Promise<unknown> => {
    try {
      // Validate stock availability first
      const isStockAvailable = await transferStockCreateEdit_onValidateStockAvailability();
      if (!isStockAvailable) {
        return Promise.reject(new Error('Insufficient stock for transfer'));
      }

      // Build payload matching API requirements
      const payload = {
        transfer_stock_id: transferStockCreateEdit_transferStockId.value,
        store_to_id: transferStockCreateEdit_formData.value.toStoreId,
        items: transferStockCreateEdit_selectedProductItems.value.map(item => ({
          itemId: item.masterItemId,
          qty: item.quantity,
        })),
        note: transferStockCreateEdit_formData.value.notes || undefined,
      };

      await store.transferStock_update(payload);

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Transfer stock updated successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      setTimeout(() => {
        router.push({ name: 'transfer-stock.index' });
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for form submission
   */
  const transferStockCreateEdit_onSubmitForm = async (): Promise<void> => {
    // Validate form first
    transferStockCreateEdit_formValidations.value.$touch();

    if (transferStockCreateEdit_formValidations.value.$invalid) {
      return;
    }

    // Check if any items are selected
    if (transferStockCreateEdit_selectedProductItems.value.length === 0) {
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.WARNING,
        message: 'Please add at least one product item',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      return;
    }

    try {
      if (transferStockCreateEdit_isEditMode.value) {
        await transferStockCreateEdit_fetchUpdate();
      } else {
        await transferStockCreateEdit_fetchCreate();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  /**
   * @description Handle business logic for loading initial data (for edit mode)
   */
  const transferStockCreateEdit_onLoadInitialData = async (): Promise<void> => {
    await transferStockCreateEdit_fetchOutletList();

    if (transferStockCreateEdit_isEditMode.value && transferStockCreateEdit_transferStockId.value) {
      try {
        await transferStockCreateEdit_fetchDetails();
      } catch (error) {
        console.error('Error loading transfer stock details:', error);
      }
    }
  };

  /**
   * @description Watcher to populate form when detail is loaded (for edit mode)
   */
  // watch(
  //   () => transferStock_detail.value,
  //   newDetail => {
  //     if (newDetail && newDetail.fromStoreId && newDetail.toStoreId && newDetail.transferDate) {
  //       transferStockCreateEdit_formData.value = {
  //         fromStoreId: newDetail.fromStoreId,
  //         toStoreId: newDetail.toStoreId,
  //         transferDate: new Date(newDetail.transferDate),
  //         notes: newDetail.notes || '',
  //         productItems: [],
  //       };

  //       // Transform product items to the create-edit format only if they exist
  //       if (newDetail.transferStockItems && Array.isArray(newDetail.transferStockItems)) {
  //         transferStockCreateEdit_selectedProductItems.value = newDetail.transferStockItems.map(item => ({
  //           id: item.id || '',
  //           masterItemId: item.masterInventoryItemId || '',
  //           name: item.itemInfo?.name || '',
  //           brandName: item.itemInfo?.brandName || '',
  //           quantity: item.requestedQuantity || 0,
  //           sku: item.itemInfo?.sku || '',
  //           unit: item.itemInfo?.unit || '',
  //           unitPrice: item.unitPrice || 0,
  //           totalPrice: item.totalPrice || 0,
  //           stockQuantity: item.itemInfo?.stockQuantity || 0,
  //         }));
  //       }
  //     }
  //   },
  //   { immediate: true },
  // );

  /**
   * @description Handle business logic for adding product item
   */
  const transferStockCreateEdit_onAddProductItem = (productItem: ITransferStockCreateEditProductItem) => {
    try {
      if (!transferStockCreateEdit_formData.value) return;

      // Check if product item already exists in formData
      const existingItemIndex = transferStockCreateEdit_formData.value.productItems.findIndex(
        item => item.masterItemId === productItem.masterItemId,
      );

      if (existingItemIndex === -1) {
        // Add new item to formData
        transferStockCreateEdit_formData.value.productItems.push(productItem);
      } else {
        // Update existing item in formData
        transferStockCreateEdit_formData.value.productItems[existingItemIndex] = productItem;
      }

      // Check if product item already exists in selectedProductItems
      const existingSelectedItemIndex = transferStockCreateEdit_selectedProductItems.value.findIndex(
        item => item.masterItemId === productItem.masterItemId,
      );

      if (existingSelectedItemIndex === -1) {
        // Add new item to selectedProductItems (triggers immediate display and total calculation)
        transferStockCreateEdit_selectedProductItems.value.push(productItem);
      } else {
        // Update existing item in selectedProductItems
        transferStockCreateEdit_selectedProductItems.value[existingSelectedItemIndex] = productItem;
      }

      // Reset selected product item
      transferStockCreateEdit_selectedProductItem.value = null;
    } catch (error) {
      console.error('Error adding product item:', error);
    }
  };

  /**
   * @description Handle business logic for close dialog add table
   */
  const transferStockCreateEdit_onCloseDialogAddProductItem = () => {
    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-create-edit-add-product-item',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);

    // Clear the staging area when canceling
    transferStockCreateEdit_formData.value.productItems = [];
    transferStockCreateEdit_selectedProductItem.value = null;
  };

  /**
   * @description Handle business logic for close dialog edit quantity
   */
  const transferStockCreateEdit_onCloseDialogEditQuantity = () => {
    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-create-edit-edit-quantity',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
    transferStockCreateEdit_formDataOfEditQuantity.value = {
      id: '',
      masterItemId: '',
      name: '',
      brandName: '',
      quantity: 0,
      sku: '',
      unit: '',
      unitPrice: 0,
      totalPrice: 0,
    }; // Reset selected item after closing dialog
  };

  /**
   * @description Handle business logic for delete product item
   */
  const transferStockCreateEdit_onDeleteProductItem = (
    productItem: ITransferStockCreateEditProductItem | string,
  ) => {
    // Handle both cases: receiving full object or just masterItemId
    const masterItemId = typeof productItem === 'string' ? productItem : productItem.masterItemId;

    // Remove from selectedProductItems (what's displayed)
    transferStockCreateEdit_selectedProductItems.value = transferStockCreateEdit_selectedProductItems.value.filter(
      item => item.masterItemId !== masterItemId,
    );

    // Also remove from formData to keep them in sync
    if (transferStockCreateEdit_formData.value) {
      transferStockCreateEdit_formData.value.productItems =
        transferStockCreateEdit_formData.value.productItems.filter(item => item.masterItemId !== masterItemId);
    }
  };

  /**
   * @description Handle business logic for show dialog add product item
   */
  const transferStockCreateEdit_onShowDialogAddProductItem = () => {
    // Clear staging area when opening dialog
    transferStockCreateEdit_formData.value.productItems = [];
    transferStockCreateEdit_selectedProductItem.value = null;

    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-create-edit-add-product-item',
      isOpen: true,
      isUsingClosableButton: false,
      width: '60%',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for show dialog edit quantity
   */
  const transferStockCreateEdit_onShowDialogEditQuantity = (productItem: ITransferStockCreateEditProductItem) => {
    transferStockCreateEdit_formDataOfEditQuantity.value = { ...productItem }; // Clone to avoid direct mutation

    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-create-edit-edit-quantity',
      isOpen: true,
      isUsingClosableButton: false,
      width: '548px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for submit edit quantity
   */
  const transferStockCreateEdit_onSubmitEditQuantity = () => {
    try {
      // Validate quantity first
      // transferStockCreateEdit_formValidationsOfEditQuantity.value.$touch();
      // if (transferStockCreateEdit_formValidationsOfEditQuantity.value.$invalid) {
      //   return;
      // }

      // Update the selected product item in both lists
      transferStockCreateEdit_onAddProductItem(transferStockCreateEdit_formDataOfEditQuantity.value);
      transferStockCreateEdit_onCloseDialogEditQuantity();
    } catch (error) {
      console.error('Error submitting edit quantity:', error);
    }
  };

  /**
   * @description Handle business logic for submit add product item
   */
  const transferStockCreateEdit_onSubmitAddProductItem = () => {
    try {
      // Transfer items from staging area (formData.productItems) to selectedProductItems
      transferStockCreateEdit_formData.value.productItems.forEach(item => {
        // Check if product item already exists in selectedProductItems
        const existingSelectedItemIndex = transferStockCreateEdit_selectedProductItems.value.findIndex(
          selectedItem => selectedItem.id === item.id,
        );

        if (existingSelectedItemIndex === -1) {
          // Add new item to selectedProductItems
          transferStockCreateEdit_selectedProductItems.value.push({ ...item });
        } else {
          // Update existing item in selectedProductItems
          transferStockCreateEdit_selectedProductItems.value[existingSelectedItemIndex] = { ...item };
        }
      });

      // Clear the staging area after successful addition
      transferStockCreateEdit_formData.value.productItems = [];
      transferStockCreateEdit_selectedProductItem.value = null;

      // Close the dialog
      const argsEventEmitter: IPropsDialog = {
        id: 'transfer-stock-create-edit-add-product-item',
        isOpen: false,
      };

      eventBus.emit('AppBaseDialog', argsEventEmitter);
    } catch (error) {
      console.error('Error submitting product items:', error);
    }
  };

  /**
   * @description Handle business logic for decrementing quantity safely (prevent negative/zero values)
   */
  const transferStockCreateEdit_onDecrementQuantity = () => {
    if (transferStockCreateEdit_formDataOfEditQuantity.value.quantity > 1) {
      transferStockCreateEdit_formDataOfEditQuantity.value.quantity =
        transferStockCreateEdit_formDataOfEditQuantity.value.quantity - 1;
    }
  };

  /**
   * @description Handle business logic for incrementing quantity
   */
  const transferStockCreateEdit_onIncrementQuantity = () => {
    const currentItem = transferStockCreateEdit_formDataOfEditQuantity.value;
    const maxQuantity = currentItem.stockQuantity || 999;

    if (currentItem.quantity < maxQuantity) {
      transferStockCreateEdit_formDataOfEditQuantity.value.quantity =
        transferStockCreateEdit_formDataOfEditQuantity.value.quantity + 1;
    }
  };

  /**
   * @description Watcher for calculate totals when product items change
   */
  watch(
    transferStockCreateEdit_selectedProductItems,
    newProductItems => {
      if (!newProductItems) return;

      transferStockCreateEdit_totalItems.value = newProductItems.length;
      transferStockCreateEdit_totalQuantity.value = newProductItems.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      transferStockCreateEdit_totalValue.value = newProductItems.reduce(
        (total, item) => total + (item.totalPrice || item.quantity * (item.unitPrice || 0)),
        0,
      );
    },
    { immediate: true, deep: true },
  );

  /**
   * @description Computed properties for edit quantity dialog - disable/enable buttons
   */
  const transferStockCreateEdit_isDecrementDisabled = computed(
    () => transferStockCreateEdit_formDataOfEditQuantity.value.quantity <= 1,
  );
  const transferStockCreateEdit_isIncrementDisabled = computed(() => {
    const item = transferStockCreateEdit_formDataOfEditQuantity.value;
    const maxQuantity = item.stockQuantity || 999;
    return item.quantity >= maxQuantity;
  });

  /**
   * @description Watcher for calculate total price when quantity or unitPrice changes in edit dialog
   */
  watch(
    () => ({
      quantity: transferStockCreateEdit_formDataOfEditQuantity.value.quantity,
      unitPrice: transferStockCreateEdit_formDataOfEditQuantity.value.unitPrice,
    }),
    ({ quantity, unitPrice }) => {
      if (quantity && unitPrice) {
        transferStockCreateEdit_formDataOfEditQuantity.value.totalPrice = quantity * unitPrice;
      }
    },
    { immediate: true },
  );

  /**
   * @description Watcher for calculate total price when quantity changes in add product dialog (staging area)
   */
  watch(
    () => transferStockCreateEdit_formData.value.productItems,
    productItems => {
      if (productItems && productItems.length > 0) {
        productItems.forEach(item => {
          if (item.quantity && item.unitPrice) {
            item.totalPrice = item.quantity * item.unitPrice;
          }
        });
      }
    },
    { immediate: true, deep: true },
  );

  /**
   * @description Watcher to clear toStoreId when fromStoreId changes
   */
  watch(
    () => transferStockCreateEdit_formData.value.fromStoreId,
    newFromStoreId => {
      if (newFromStoreId === transferStockCreateEdit_formData.value.toStoreId) {
        transferStockCreateEdit_formData.value.toStoreId = '';
      }
    },
  );

  return {
    transferStockCreateEdit_fetchCreate,
    transferStockCreateEdit_fetchDetails,
    transferStockCreateEdit_fetchOutletList,
    transferStockCreateEdit_fetchUpdate,
    transferStockCreateEdit_formData,
    transferStockCreateEdit_formDataOfEditQuantity,
    transferStockCreateEdit_formValidations,
    transferStockCreateEdit_formValidationsOfEditQuantity,
    transferStockCreateEdit_isDecrementDisabled,
    transferStockCreateEdit_isEditMode,
    transferStockCreateEdit_isIncrementDisabled,
    transferStockCreateEdit_listColumns: transferStockCreateEdit_listColumns.value,
    transferStockCreateEdit_listProductItems,
    transferStockCreateEdit_listFromStores,
    transferStockCreateEdit_listToStores,
    transferStockCreateEdit_onAddProductItem,
    transferStockCreateEdit_onCloseDialogAddProductItem,
    transferStockCreateEdit_onCloseDialogEditQuantity,
    transferStockCreateEdit_onDecrementQuantity,
    transferStockCreateEdit_onDeleteProductItem,
    transferStockCreateEdit_onIncrementQuantity,
    transferStockCreateEdit_onLoadInitialData,
    transferStockCreateEdit_onResetForm,
    transferStockCreateEdit_onShowDialogAddProductItem,
    transferStockCreateEdit_onShowDialogEditQuantity,
    transferStockCreateEdit_onSubmitAddProductItem,
    transferStockCreateEdit_onSubmitEditQuantity,
    transferStockCreateEdit_onSubmitForm,
    transferStockCreateEdit_onValidateStockAvailability,
    transferStockCreateEdit_selectedProductItem,
    transferStockCreateEdit_selectedProductItems,
    transferStockCreateEdit_stockShortfalls,
    transferStockCreateEdit_totalItems,
    transferStockCreateEdit_totalQuantity,
    transferStockCreateEdit_totalValue,
  };
};
