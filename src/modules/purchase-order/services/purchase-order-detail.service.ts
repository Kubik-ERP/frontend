// Constants
import {
  PURCHASE_ORDER_DETAIL_LIST_COLUMNS,
  PURCHASE_ORDER_DETAIL_REQUEST,
  PURCHASE_ORDER_DETAIL_CONFIRM_REQUEST,
  PURCHASE_ORDER_DETAIL_CANCEL_REQUEST,
  PURCHASE_ORDER_DETAIL_SHIP_REQUEST,
  PURCHASE_ORDER_DETAIL_PAY_REQUEST,
} from '../constants';

// Interfaces
import type {
  IPurchaseOrderDetailProvided,
  IPurchaseOrderDetailConfirmFormData,
  IPurchaseOrderDetailCancelFormData,
} from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { usePurchaseOrderStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const usePurchaseOrderDetailService = (): IPurchaseOrderDetailProvided => {
  /**
   * @description Injected variables
   */
  const route = useRoute();
  const router = useRouter(); // Router instance
  const store = usePurchaseOrderStore(); // Instance of the store
  const { purchaseOrder_detail, purchaseOrder_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Computed properties for business logic
   */
  const purchaseOrderDetail_listColumns = computed(() => PURCHASE_ORDER_DETAIL_LIST_COLUMNS);
  const purchaseOrderDetail_routeParamsId = computed(() =>
    route.params.id.length > 0 ? String(route.params.id) : '',
  );

  /**
   * @description Reactive variables
   */
  const purchaseOrderDetail_formDataOfConfirm = ref<IPurchaseOrderDetailConfirmFormData>({
    deliveryDate: null,
  });
  const purchaseOrderDetail_formDataOfCancel = ref<IPurchaseOrderDetailCancelFormData>({
    reason: '',
  });

  /**
   * @description Form validations
   */
  const purchaseOrderDetail_formRulesOfConfirm = computed(() => ({
    deliveryDate: { required },
  }));

  const purchaseOrderDetail_formValidationsOfConfirm = useVuelidate(
    purchaseOrderDetail_formRulesOfConfirm,
    purchaseOrderDetail_formDataOfConfirm,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle fetch api purchase order - details
   */
  const purchaseOrderDetail_fetchDetails = async (): Promise<unknown> => {
    try {
      await store.purchaseOrder_details(purchaseOrderDetail_routeParamsId.value, {
        ...httpAbort_registerAbort(PURCHASE_ORDER_DETAIL_REQUEST),
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
   * @description Handle fetch api purchase order - confirm
   */
  const purchaseOrderDetail_fetchConfirm = async (): Promise<unknown> => {
    try {
      const payload = {
        delivery_date: Array.isArray(purchaseOrderDetail_formDataOfConfirm.value.deliveryDate)
          ? purchaseOrderDetail_formDataOfConfirm.value.deliveryDate[0]
          : purchaseOrderDetail_formDataOfConfirm.value.deliveryDate,
      };

      await store.purchaseOrder_confirm(purchaseOrderDetail_routeParamsId.value, payload, {
        ...httpAbort_registerAbort(PURCHASE_ORDER_DETAIL_CONFIRM_REQUEST),
      });

      // Refresh data
      await purchaseOrderDetail_fetchDetails();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      const closeEventEmitter: IPropsDialogConfirmation = {
        id: 'purchase-order-detail-confirmation-dialog',
        isOpen: false,
      };
      eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
      purchaseOrderDetail_onCloseDialogConfirm();
    }
  };

  /**
   * @description Handle fetch api purchase order - cancel
   */
  const purchaseOrderDetail_fetchCancel = async (id: string): Promise<unknown> => {
    try {
      const payload = {
        reason: purchaseOrderDetail_formDataOfCancel.value.reason,
      };

      await store.purchaseOrder_cancel(id, payload, {
        ...httpAbort_registerAbort(PURCHASE_ORDER_DETAIL_CANCEL_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Purchase order cancelled successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      // Refresh data
      await purchaseOrderDetail_fetchDetails();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api purchase order - ship
   */
  const purchaseOrderDetail_fetchShip = async (id: string): Promise<unknown> => {
    try {
      await store.purchaseOrder_ship(id, {
        ...httpAbort_registerAbort(PURCHASE_ORDER_DETAIL_SHIP_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Purchase order shipped successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      // Refresh data
      await purchaseOrderDetail_fetchDetails();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api purchase order - receive
   */
  const purchaseOrderDetail_fetchReceive = async (id: string): Promise<unknown> => {
    try {
      console.log('Receiving PO...', id);
      // await store.purchaseOrder_receive(id, {
      //   ...httpAbort_registerAbort(PURCHASE_ORDER_DETAIL_RECEIVE_REQUEST),
      // });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Purchase order received successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      // Refresh data
      await purchaseOrderDetail_fetchDetails();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api purchase order - pay
   */
  const purchaseOrderDetail_fetchPay = async (id: string): Promise<unknown> => {
    try {
      await store.purchaseOrder_pay(id, {
        ...httpAbort_registerAbort(PURCHASE_ORDER_DETAIL_PAY_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Purchase order paid successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      // Refresh data
      await purchaseOrderDetail_fetchDetails();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for cancel action
   */
  const purchaseOrderDetail_onCancel = (): void => {
    const currentId = purchaseOrder_detail.value?.id;
    if (!currentId) return;

    // Reset form data
    purchaseOrderDetail_formDataOfCancel.value.reason = '';

    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'purchase-order-detail-confirmation-dialog',
      iconName: 'confirmation',
      title: 'Are you sure want to cancel this purchase order?',
      description:
        'This action cannot be undone, and any pending shipments related to this order will be cancelled.',
      type: 'error',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingForm: true,
      textButtonPrimary: 'Cancel PO',
      textButtonSecondary: 'Cancel',
      width: '460px',
      formData: purchaseOrderDetail_formDataOfCancel.value,
      formFields: [
        {
          key: 'reason',
          label: 'Reason (optional)',
          type: 'textarea',
          placeholder: 'Enter cancellation reason...',
          required: true,
          rows: 3,
        },
      ],
      onClickButtonPrimary: async () => {
        try {
          await purchaseOrderDetail_fetchCancel(currentId);
          // Close dialog
          const closeEventEmitter: IPropsDialogConfirmation = {
            id: 'purchase-order-detail-confirmation-dialog',
            isOpen: false,
          };
          eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
        } catch (error) {
          console.error('Error cancelling purchase order:', error);
        }
      },
      onClickButtonSecondary: () => {
        const closeEventEmitter: IPropsDialogConfirmation = {
          id: 'purchase-order-detail-confirmation-dialog',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
      },
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for ship action
   */
  const purchaseOrderDetail_onShip = (): void => {
    const currentId = purchaseOrder_detail.value?.id;
    if (!currentId) return;

    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'purchase-order-detail-confirmation-dialog',
      iconName: 'confirmation',
      title: 'Are you sure want to update this purchase order status to Shipped?',
      description: `<span class="font-normal text-center text-sm text-grayscale-70">
          Order status will changed to <strong>Shipped</strong>. Ensure that the ordered items are already in the shipping process by the supplier.
        </span>`,
      type: 'info',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      textButtonPrimary: 'Ship Order',
      textButtonSecondary: 'Cancel',
      width: '472px',
      onClickButtonPrimary: async () => {
        try {
          await purchaseOrderDetail_fetchShip(currentId);
          // Close dialog
          const closeEventEmitter: IPropsDialogConfirmation = {
            id: 'purchase-order-detail-confirmation-dialog',
            isOpen: false,
          };
          eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Error shipping purchase order:', error);
          } else {
            console.error('Error shipping purchase order:', String(error));
          }
        }
      },
      onClickButtonSecondary: () => {
        const closeEventEmitter: IPropsDialogConfirmation = {
          id: 'purchase-order-detail-confirmation-dialog',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
      },
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for receive action
   */
  const purchaseOrderDetail_onReceive = (): void => {
    const currentId = purchaseOrder_detail.value?.id;
    if (!currentId) return;

    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'purchase-order-detail-confirmation-dialog',
      iconName: 'confirmation',
      title: 'Are you sure want to update this purchase order status to Received?',
      description: `<span class="font-normal text-center text-sm text-grayscale-70">
          Order status will changed to <strong>Received</strong>. Make sure the received items match the PO document.
        </span>`,
      type: 'info',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      textButtonPrimary: 'Receive Order',
      textButtonSecondary: 'Cancel',
      width: '472px',
      onClickButtonPrimary: async () => {
        try {
          await purchaseOrderDetail_fetchReceive(currentId);
          // Close dialog
          const closeEventEmitter: IPropsDialogConfirmation = {
            id: 'purchase-order-detail-confirmation-dialog',
            isOpen: false,
          };
          eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Error receiving purchase order:', error);
          } else {
            console.error('Error receiving purchase order:', String(error));
          }
        }
      },
      onClickButtonSecondary: () => {
        const closeEventEmitter: IPropsDialogConfirmation = {
          id: 'purchase-order-detail-confirmation-dialog',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
      },
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for shipped action
   */
  const purchaseOrderDetail_onShipped = (): void => {
    const currentId = purchaseOrder_detail.value?.id;
    if (!currentId) return;

    router.push({ name: 'purchase-order.received', params: { id: currentId } });
  }

  /**
   * @description Handle business logic for pay action
   */
  const purchaseOrderDetail_onPay = (): void => {
    const currentId = purchaseOrder_detail.value?.id;
    if (!currentId) return;

    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'purchase-order-detail-confirmation-dialog',
      iconName: 'confirmation',
      title: 'Are you sure want to update this purchase order status to Paid?',
      description: `<span class="font-normal text-center text-sm text-grayscale-70">
          Order status will changed to <strong>Paid</strong>
        </span>`,
      type: 'info',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      textButtonPrimary: 'Mark as Paid',
      textButtonSecondary: 'Cancel',
      width: '472px',
      onClickButtonPrimary: async () => {
        try {
          await purchaseOrderDetail_fetchPay(currentId);
          // Close dialog
          const closeEventEmitter: IPropsDialogConfirmation = {
            id: 'purchase-order-detail-confirmation-dialog',
            isOpen: false,
          };
          eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Error paying purchase order:', error);
          } else {
            console.error('Error paying purchase order:', String(error));
          }
        }
      },
      onClickButtonSecondary: () => {
        const closeEventEmitter: IPropsDialogConfirmation = {
          id: 'purchase-order-detail-confirmation-dialog',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
      },
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for edit action
   */
  const purchaseOrderDetail_onEdit = (): void => {
    const currentId = purchaseOrder_detail.value?.id;
    if (!currentId) return;

    router.push({ name: 'purchase-order.edit', params: { id: currentId } });
  };

  /**
   * @description Handle business logic for back action
   */
  const purchaseOrderDetail_onBack = (): void => {
    router.push({ name: 'purchase-order.index' });
  };

  /**
   * @description Handle business logic to render dynamic class of status
   */
  const purchaseOrderDetail_getStatusClass = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'CANCELLED':
      case 'CANCELED':
        return 'bg-error-background text-error-main';
      case 'CONFIRMED':
        return 'bg-secondary-background text-green-primary';
      case 'PAID':
        return 'bg-complementary-background text-complementary-main';
      case 'PENDING':
        return 'bg-warning-background text-warning-main';
      case 'RECEIVED':
        return 'bg-success-background text-success';
      case 'SHIPPED':
        return 'bg-primary-background text-primary';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  /**
   * @description Handle business logic to return dynamic action button
   */
  const purchaseOrderDetail_dynamicButtonAction = (status: string): void => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        purchaseOrderDetail_onShowDialogConfirm();
        break;
      case 'CONFIRMED':
        purchaseOrderDetail_onShip();
        break;
      case 'SHIPPED':
        purchaseOrderDetail_onShipped();
        break;
      case 'RECEIVED':
        purchaseOrderDetail_onPay();
        break;
      default:
        break;
    }
  };

  /**
   * @description Handle business logic to return dynamic label button
   */
  const purchaseOrderDetail_dynamicButtonLabel = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Confirm PO';
      case 'CONFIRMED':
        return 'Order Shipped';
      case 'SHIPPED':
        return 'Order Received';
      case 'RECEIVED':
        return 'Order Paid';
      default:
        return 'Unknown Action';
    }
  };

  /**
   * @description Handle business logic for close dialog confirm purchase order
   */
  const purchaseOrderDetail_onCloseDialogConfirm = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'purchase-order-detail-confirm-po-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for submit form confirm purchase order
   */
  const purchaseOrderDetail_onConfirm = (): void => {
    try {
      purchaseOrderDetail_formValidationsOfConfirm.value.$touch();

      if (purchaseOrderDetail_formValidationsOfConfirm.value.$invalid) return;

      const argsEventEmitter: IPropsDialogConfirmation = {
        id: 'purchase-order-detail-confirmation-dialog',
        iconName: 'confirmation',

        title: 'Are you sure want to update this purchase order status to Confirmed?',
        description: `<span class="font-normal text-center text-sm text-grayscale-70">
            Order status will changed to <strong>Confirmed</strong> and system will automatically generate Delivery Order document
          </span>`,
        type: 'info',
        isOpen: true,
        isUsingButtonSecondary: true,
         isUsingHtmlTagOnDescription: true,
        textButtonPrimary: 'Confirm PO',
        textButtonSecondary: 'Cancel',
        width: '472px',
        onClickButtonPrimary: () => {
          purchaseOrderDetail_fetchConfirm();
        },
        onClickButtonSecondary: () => {
          const closeEventEmitter: IPropsDialogConfirmation = {
            id: 'purchase-order-detail-confirmation-dialog',
            isOpen: false,
          };
          eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
        },
      };

      eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  /**
   * @description Handle business logic for showing dialog confirm purchase order
   */
  const purchaseOrderDetail_onShowDialogConfirm = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'purchase-order-detail-confirm-po-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '534px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  return {
    purchaseOrderDetail_data: purchaseOrder_detail,
    purchaseOrderDetail_dynamicButtonAction,
    purchaseOrderDetail_dynamicButtonLabel,
    purchaseOrderDetail_isLoading: purchaseOrder_isLoading,
    purchaseOrderDetail_listColumns: purchaseOrderDetail_listColumns.value,
    purchaseOrderDetail_formDataOfConfirm,
    purchaseOrderDetail_formDataOfCancel,
    purchaseOrderDetail_formValidationsOfConfirm,
    purchaseOrderDetail_fetchDetails,
    purchaseOrderDetail_onCancel,
    purchaseOrderDetail_onCloseDialogConfirm,
    purchaseOrderDetail_onConfirm,
    purchaseOrderDetail_onShip,
    purchaseOrderDetail_onReceive,
    purchaseOrderDetail_onPay,
    purchaseOrderDetail_onEdit,
    purchaseOrderDetail_onBack,
    purchaseOrderDetail_getStatusClass,
  };
};
