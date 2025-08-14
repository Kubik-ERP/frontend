// Constants
import {
  PURCHASE_ORDER_CREATE_EDIT_LIST_COLUMNS,
  PURCHASE_ORDER_CREATE_EDIT_PRODUCT_ITEMS,
  PURCHASE_ORDER_CREATE_EDIT_SUPPLIERS,
  PURCHASE_ORDER_CREATE_REQUEST,
  PURCHASE_ORDER_DETAILS_REQUEST,
  PURCHASE_ORDER_UPDATE_REQUEST,
} from '../constants';

// Interfaces
import type {
  IPurchaseOrderCreateEditFormData,
  IPurchaseOrderCreateEditProductItem,
  IPurchaseOrderCreateEditProvided,
} from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { usePurchaseOrderStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const usePurchaseOrderCreateEditService = (): IPurchaseOrderCreateEditProvided => {
  /**
   * @description Injected variables
   */
  const router = useRouter(); // Router instance
  const route = useRoute(); // Current route
  const store = usePurchaseOrderStore(); // Instance of the store
  const { purchaseOrder_detail } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Computed properties for business logic
   */
  const purchaseOrderCreateEdit_isEditMode = computed(() => route.params.id !== undefined);
  const purchaseOrderCreateEdit_purchaseOrderId = computed(() => (route.params.id ? String(route.params.id) : ''));

  /**
   * @description Reactive variables
   */
  const purchaseOrderCreateEdit_formData = ref<IPurchaseOrderCreateEditFormData>({
    supplierId: '',
    orderDate: null,
    productItems: [],
  });
  const purchaseOrderCreateEdit_formDataOfEditQuantity = ref<IPurchaseOrderCreateEditProductItem>({
    id: '',
    name: '',
    brandName: '',
    quantity: 0,
    sku: '',
    unit: '',
    unitPrice: 0,
    totalPrice: 0,
  });
  const purchaseOrderCreateEdit_selectedProductItem = ref<IPurchaseOrderCreateEditProductItem | null>(null);
  const purchaseOrderCreateEdit_selectedProductItems = ref<IPurchaseOrderCreateEditProductItem[]>([]);
  const purchaseOrderCreateEdit_totalPrice = ref<number>(0);

  /**
   * @description Form validations
   */
  const purchaseOrderCreateEdit_formRules = computed(() => ({
    supplierId: { required },
    orderDate: {
      required,
      date: helpers.withMessage(
        'Order date must be a valid date',
        (value: Date | string) => !isNaN(new Date(value).getTime()),
      ),
    },
  }));
  const purchaseOrderCreateEdit_formRulesOfEditQuantity = computed(() => ({
    quantity: {
      required,
      minValue: helpers.withMessage('Quantity must be at least 1', (value: number) => value > 0),
    },
  }));

  const purchaseOrderCreateEdit_formValidations = useVuelidate(
    purchaseOrderCreateEdit_formRules,
    purchaseOrderCreateEdit_formData,
    {
      $autoDirty: true,
    },
  );
  const purchaseOrderCreateEdit_formValidationsOfEditQuantity = useVuelidate(
    purchaseOrderCreateEdit_formRulesOfEditQuantity,
    purchaseOrderCreateEdit_formDataOfEditQuantity.value,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle business logic for resetting form data
   */
  const purchaseOrderCreateEdit_onResetForm = (): void => {
    purchaseOrderCreateEdit_formData.value = {
      supplierId: '',
      orderDate: null,
      productItems: [],
    };

    purchaseOrderCreateEdit_selectedProductItems.value = [];
    purchaseOrderCreateEdit_selectedProductItem.value = null;
    purchaseOrderCreateEdit_totalPrice.value = 0;

    purchaseOrderCreateEdit_formValidations.value.$reset();
  };

  /**
   * @description Handle fetch api purchase order - create
   */
  const purchaseOrderCreateEdit_fetchCreate = async (): Promise<unknown> => {
    try {
      // Transform the form data to match the API payload structure
      const orderDate = Array.isArray(purchaseOrderCreateEdit_formData.value.orderDate)
        ? purchaseOrderCreateEdit_formData.value.orderDate[0]
        : purchaseOrderCreateEdit_formData.value.orderDate;

      const payload = {
        supplierId: purchaseOrderCreateEdit_formData.value.supplierId,
        orderDate: orderDate ? new Date(orderDate).toISOString() : new Date().toISOString(),
        productItems: purchaseOrderCreateEdit_selectedProductItems.value.map(item => ({
          id: item.id,
          masterItemId: item.id, // Using the same ID as masterItemId for now
          quantity: item.quantity,
        })),
      };

      await store.purchaseOrder_create(payload, {
        ...httpAbort_registerAbort(PURCHASE_ORDER_CREATE_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Purchase order created successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      setTimeout(() => {
        router.push({ name: 'purchase-order.list' });
      }, 1000);
    } catch (error: unknown) {
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.DANGER,
        message: 'Failed to create purchase order',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api purchase order - details
   */
  const purchaseOrderCreateEdit_fetchDetails = async (id: string): Promise<unknown> => {
    try {
      await store.purchaseOrder_details(id, {
        ...httpAbort_registerAbort(PURCHASE_ORDER_DETAILS_REQUEST),
      });
    } catch (error: unknown) {
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.DANGER,
        message: 'Failed to fetch purchase order details',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api purchase order - update
   */
  const purchaseOrderCreateEdit_fetchUpdate = async (id: string): Promise<unknown> => {
    try {
      // Transform the form data to match the API payload structure
      const orderDate = Array.isArray(purchaseOrderCreateEdit_formData.value.orderDate)
        ? purchaseOrderCreateEdit_formData.value.orderDate[0]
        : purchaseOrderCreateEdit_formData.value.orderDate;

      const payload = {
        supplierId: purchaseOrderCreateEdit_formData.value.supplierId,
        orderDate: orderDate ? new Date(orderDate).toISOString() : new Date().toISOString(),
        productItems: purchaseOrderCreateEdit_selectedProductItems.value.map(item => ({
          id: item.id,
          masterItemId: item.id, // Using the same ID as masterItemId for now
          quantity: item.quantity,
        })),
      };

      await store.purchaseOrder_update(id, payload, {
        ...httpAbort_registerAbort(PURCHASE_ORDER_UPDATE_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Purchase order updated successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      setTimeout(() => {
        router.push({ name: 'purchase-order.list' });
      }, 1000);
    } catch (error: unknown) {
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.DANGER,
        message: 'Failed to update purchase order',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

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
  const purchaseOrderCreateEdit_onSubmitForm = async (): Promise<void> => {
    // Validate form first
    purchaseOrderCreateEdit_formValidations.value.$touch();

    if (purchaseOrderCreateEdit_formValidations.value.$invalid) {
      return;
    }

    try {
      if (purchaseOrderCreateEdit_isEditMode.value) {
        await purchaseOrderCreateEdit_fetchUpdate(purchaseOrderCreateEdit_purchaseOrderId.value);
      } else {
        await purchaseOrderCreateEdit_fetchCreate();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  /**
   * @description Handle business logic for loading initial data (for edit mode)
   */
  const purchaseOrderCreateEdit_onLoadInitialData = async (): Promise<void> => {
    if (purchaseOrderCreateEdit_isEditMode.value && purchaseOrderCreateEdit_purchaseOrderId.value) {
      try {
        await purchaseOrderCreateEdit_fetchDetails(purchaseOrderCreateEdit_purchaseOrderId.value);
      } catch (error) {
        console.error('Error loading purchase order details:', error);
      }
    }
  }; /**
   * @description Watcher to populate form when detail is loaded (for edit mode)
   */
  watch(
    () => purchaseOrder_detail.value,
    newDetail => {
      if (newDetail) {
        purchaseOrderCreateEdit_formData.value = {
          supplierId: newDetail.supplierId,
          orderDate: new Date(newDetail.orderDate),
          productItems: [],
        };

        // Transform product items to the create-edit format
        purchaseOrderCreateEdit_selectedProductItems.value = newDetail.productItems.map(item => ({
          id: item.id,
          name: item.productName,
          brandName: '', // Not available in detail, will need to be fetched separately
          quantity: item.quantity,
          sku: '', // Not available in detail
          unit: '', // Not available in detail
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        }));
      }
    },
    { immediate: true },
  );

  /**
   * @description Handle business logic for adding product item
   */
  const purchaseOrderCreateEdit_onAddProductItem = (productItem: IPurchaseOrderCreateEditProductItem) => {
    try {
      if (!purchaseOrderCreateEdit_formData.value) return;

      // Check if product item already exists in formData
      const existingItemIndex = purchaseOrderCreateEdit_formData.value.productItems.findIndex(
        item => item.id === productItem.id,
      );

      if (existingItemIndex === -1) {
        // Add new item to formData
        purchaseOrderCreateEdit_formData.value.productItems.push(productItem);
      } else {
        // Update existing item in formData
        purchaseOrderCreateEdit_formData.value.productItems[existingItemIndex] = productItem;
      }

      // Check if product item already exists in selectedProductItems
      const existingSelectedItemIndex = purchaseOrderCreateEdit_selectedProductItems.value.findIndex(
        item => item.id === productItem.id,
      );

      if (existingSelectedItemIndex === -1) {
        // Add new item to selectedProductItems (triggers immediate display and total calculation)
        purchaseOrderCreateEdit_selectedProductItems.value.push(productItem);
      } else {
        // Update existing item in selectedProductItems
        purchaseOrderCreateEdit_selectedProductItems.value[existingSelectedItemIndex] = productItem;
      }

      // Reset selected product item
      purchaseOrderCreateEdit_selectedProductItem.value = null;
    } catch (error) {
      console.error('Error adding product item:', error);
    }
  };

  /**
   * @description Handle business logic for close dialog add table
   */
  const purchaseOrderCreateEdit_onCloseDialogAddProductItem = () => {
    const argsEventEmitter: IPropsDialog = {
      id: 'purchase-order-create-edit-add-product-item',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);

    // Clear the staging area when canceling
    purchaseOrderCreateEdit_formData.value.productItems = [];
    purchaseOrderCreateEdit_selectedProductItem.value = null;
  };

  /**
   * @description Handle business logic for close dialog edit quantity
   */
  const purchaseOrderCreateEdit_onCloseDialogEditQuantity = () => {
    const argsEventEmitter: IPropsDialog = {
      id: 'purchase-order-create-edit-edit-quantity',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
    purchaseOrderCreateEdit_formDataOfEditQuantity.value = {
      id: '',
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
  const purchaseOrderCreateEdit_onDeleteProductItem = (
    productItem: IPurchaseOrderCreateEditProductItem | string,
  ) => {
    // Handle both cases: receiving full object or just ID
    const productItemId = typeof productItem === 'string' ? productItem : productItem.id;

    // Remove from selectedProductItems (what's displayed)
    purchaseOrderCreateEdit_selectedProductItems.value = purchaseOrderCreateEdit_selectedProductItems.value.filter(
      item => item.id !== productItemId,
    );

    // Also remove from formData to keep them in sync
    if (purchaseOrderCreateEdit_formData.value) {
      purchaseOrderCreateEdit_formData.value.productItems =
        purchaseOrderCreateEdit_formData.value.productItems.filter(item => item.id !== productItemId);
    }
  };

  /**
   * @description Handle business logic for show dialog add product item
   */
  const purchaseOrderCreateEdit_onShowDialogAddProductItem = () => {
    // Clear staging area when opening dialog
    purchaseOrderCreateEdit_formData.value.productItems = [];
    purchaseOrderCreateEdit_selectedProductItem.value = null;

    const argsEventEmitter: IPropsDialog = {
      id: 'purchase-order-create-edit-add-product-item',
      isOpen: true,
      isUsingClosableButton: true,
      width: '742px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for show dialog edit quantity
   */
  const purchaseOrderCreateEdit_onShowDialogEditQuantity = (productItem: IPurchaseOrderCreateEditProductItem) => {
    purchaseOrderCreateEdit_formDataOfEditQuantity.value = { ...productItem }; // Clone to avoid direct mutation

    const argsEventEmitter: IPropsDialog = {
      id: 'purchase-order-create-edit-edit-quantity',
      isOpen: true,
      isUsingClosableButton: true,
      width: '548px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for submit edit quantity
   */
  const purchaseOrderCreateEdit_onSubmitEditQuantity = () => {
    try {
      // Update the selected product item in both lists
      purchaseOrderCreateEdit_onAddProductItem(purchaseOrderCreateEdit_formDataOfEditQuantity.value);
      purchaseOrderCreateEdit_onCloseDialogEditQuantity();
    } catch (error) {
      console.error('Error submitting edit quantity:', error);
    }
  };

  /**
   * @description Handle business logic for submit add product item
   */
  const purchaseOrderCreateEdit_onSubmitAddProductItem = () => {
    try {
      // Transfer items from staging area (formData.productItems) to selectedProductItems
      purchaseOrderCreateEdit_formData.value.productItems.forEach(item => {
        // Check if product item already exists in selectedProductItems
        const existingSelectedItemIndex = purchaseOrderCreateEdit_selectedProductItems.value.findIndex(
          selectedItem => selectedItem.id === item.id,
        );

        if (existingSelectedItemIndex === -1) {
          // Add new item to selectedProductItems
          purchaseOrderCreateEdit_selectedProductItems.value.push({ ...item });
        } else {
          // Update existing item in selectedProductItems
          purchaseOrderCreateEdit_selectedProductItems.value[existingSelectedItemIndex] = { ...item };
        }
      });

      // Clear the staging area after successful addition
      purchaseOrderCreateEdit_formData.value.productItems = [];
      purchaseOrderCreateEdit_selectedProductItem.value = null;

      // Close the dialog
      const argsEventEmitter: IPropsDialog = {
        id: 'purchase-order-create-edit-add-product-item',
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
  const purchaseOrderCreateEdit_onDecrementQuantity = () => {
    if (purchaseOrderCreateEdit_formDataOfEditQuantity.value.quantity > 1) {
      purchaseOrderCreateEdit_formDataOfEditQuantity.value.quantity =
        purchaseOrderCreateEdit_formDataOfEditQuantity.value.quantity - 1;
    }
  };

  /**
   * @description Handle business logic for incrementing quantity
   */
  const purchaseOrderCreateEdit_onIncrementQuantity = () => {
    purchaseOrderCreateEdit_formDataOfEditQuantity.value.quantity =
      purchaseOrderCreateEdit_formDataOfEditQuantity.value.quantity + 1;
  };

  /**
   * @description Watcher for calculate total price when product items change
   */
  watch(
    purchaseOrderCreateEdit_selectedProductItems,
    newProductItems => {
      if (!newProductItems) return;

      purchaseOrderCreateEdit_totalPrice.value = newProductItems.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );
    },
    { immediate: true, deep: true },
  );

  /**
   * @description Watcher for calculate total price when quantity changes in edit dialog
   */
  watch(
    () => purchaseOrderCreateEdit_formDataOfEditQuantity.value.quantity,
    newQuantity => {
      if (newQuantity && purchaseOrderCreateEdit_formDataOfEditQuantity.value.unitPrice) {
        purchaseOrderCreateEdit_formDataOfEditQuantity.value.totalPrice =
          newQuantity * purchaseOrderCreateEdit_formDataOfEditQuantity.value.unitPrice;
      }
    },
    { immediate: true },
  );

  /**
   * @description Watcher for calculate total price when quantity changes in add product dialog (staging area)
   */
  watch(
    () => purchaseOrderCreateEdit_formData.value.productItems,
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

  return {
    purchaseOrderCreateEdit_fetchCreate,
    purchaseOrderCreateEdit_fetchDetails,
    purchaseOrderCreateEdit_fetchUpdate,
    purchaseOrderCreateEdit_formData,
    purchaseOrderCreateEdit_formDataOfEditQuantity,
    purchaseOrderCreateEdit_formValidations,
    purchaseOrderCreateEdit_formValidationsOfEditQuantity,
    purchaseOrderCreateEdit_isEditMode,
    purchaseOrderCreateEdit_listColumns: PURCHASE_ORDER_CREATE_EDIT_LIST_COLUMNS,
    purchaseOrderCreateEdit_listProductItems: PURCHASE_ORDER_CREATE_EDIT_PRODUCT_ITEMS,
    purchaseOrderCreateEdit_listSuppliers: PURCHASE_ORDER_CREATE_EDIT_SUPPLIERS,
    purchaseOrderCreateEdit_onAddProductItem,
    purchaseOrderCreateEdit_onCloseDialogAddProductItem,
    purchaseOrderCreateEdit_onCloseDialogEditQuantity,
    purchaseOrderCreateEdit_onDecrementQuantity,
    purchaseOrderCreateEdit_onDeleteProductItem,
    purchaseOrderCreateEdit_onIncrementQuantity,
    purchaseOrderCreateEdit_onLoadInitialData,
    purchaseOrderCreateEdit_onResetForm,
    purchaseOrderCreateEdit_onShowDialogAddProductItem,
    purchaseOrderCreateEdit_onShowDialogEditQuantity,
    purchaseOrderCreateEdit_onSubmitAddProductItem,
    purchaseOrderCreateEdit_onSubmitEditQuantity,
    purchaseOrderCreateEdit_onSubmitForm,
    purchaseOrderCreateEdit_selectedProductItem,
    purchaseOrderCreateEdit_selectedProductItems,
    purchaseOrderCreateEdit_totalPrice,
  };
};
