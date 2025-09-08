// Constants
import {
  PURCHASE_ORDER_LIST_COLUMNS,
  PURCHASE_ORDER_LIST_REQUEST,
  PURCHASE_ORDER_CANCEL_REQUEST,
  PURCHASE_ORDER_CONFIRM_REQUEST,
  PURCHASE_ORDER_SHIP_REQUEST,
  PURCHASE_ORDER_RECEIVE_REQUEST,
  PURCHASE_ORDER_PAY_REQUEST,
} from '../constants';

// Interfaces
import type {
  IPurchaseOrderListProvided,
  IPurchaseOrderListRequestQuery,
  IPurchaseOrderCancelPayload,
  IPurchaseOrderConfirmPayload,
} from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { usePurchaseOrderStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

// PrimeVue
import { DataTableSortEvent } from 'primevue';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const usePurchaseOrderListService = (): IPurchaseOrderListProvided => {
  /**
   * @description Injected variables
   */
  const store = usePurchaseOrderStore(); // Instance of the store
  const { purchaseOrder_isLoading, purchaseOrder_lists } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const purchaseOrderList_queryParams = reactive<IPurchaseOrderListRequestQuery>({
    page: 1,
    pageSize: 10,
    search: '',
    orderBy: 'orderDate',
    orderDirection: 'desc',
  });
  const purchaseOrderList_formDataOfCancel = ref<IPurchaseOrderCancelPayload>({
    reason: '',
  });
  const purchaseOrderList_formDataOfConfirm = ref<IPurchaseOrderConfirmPayload>({
    delivery_date: null,
  });
  const purchaseOrderList_selectedId = ref<string>('');

  /**
   * @description Form validations
   */
  const purchaseOrderList_formRulesOfConfirm = computed(() => ({
    delivery_date: { required },
  }));
  const purchaseOrderList_formValidationsOfConfirm = useVuelidate(
    purchaseOrderList_formRulesOfConfirm,
    purchaseOrderList_formDataOfConfirm,
  );

  /**
   * @description Handle fetch api purchase order - list
   */
  const purchaseOrderList_fetchList = async (): Promise<unknown> => {
    try {
      await store.purchaseOrder_list(purchaseOrderList_queryParams, {
        ...httpAbort_registerAbort(PURCHASE_ORDER_LIST_REQUEST),
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
   * @description Handle fetch api purchase order - cancel
   */
  const purchaseOrderList_fetchCancel = async (): Promise<unknown> => {
    try {
      await store.purchaseOrder_cancel(
        purchaseOrderList_selectedId.value,
        purchaseOrderList_formDataOfCancel.value,
        {
          ...httpAbort_registerAbort(PURCHASE_ORDER_CANCEL_REQUEST),
        },
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Purchase order cancelled successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
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
  const purchaseOrderList_fetchConfirm = async (): Promise<unknown> => {
    try {
      await store.purchaseOrder_confirm(
        purchaseOrderList_selectedId.value,
        purchaseOrderList_formDataOfConfirm.value,
        {
          ...httpAbort_registerAbort(PURCHASE_ORDER_CONFIRM_REQUEST),
        },
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Purchase order confirmed successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
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
  const purchaseOrderList_fetchShip = async (): Promise<unknown> => {
    try {
      await store.purchaseOrder_ship(purchaseOrderList_selectedId.value, {
        ...httpAbort_registerAbort(PURCHASE_ORDER_SHIP_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Purchase order shipped successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
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
  const purchaseOrderList_fetchReceive = async (): Promise<unknown> => {
    try {
      await store.purchaseOrder_receive(purchaseOrderList_selectedId.value, {
        ...httpAbort_registerAbort(PURCHASE_ORDER_RECEIVE_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Purchase order received successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
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
  const purchaseOrderList_fetchPay = async (): Promise<unknown> => {
    try {
      await store.purchaseOrder_pay(purchaseOrderList_selectedId.value, {
        ...httpAbort_registerAbort(PURCHASE_ORDER_PAY_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Purchase order paid successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for changing page size
   */
  const purchaseOrderList_onChangePage = (page: number): void => {
    purchaseOrderList_queryParams.page = page;
  };

  /**
   * @description Handle sorting changes
   */
  const purchaseOrderList_handleOnSortChange = (event: DataTableSortEvent) => {
    purchaseOrderList_queryParams.orderBy = event.sortField as string;
    purchaseOrderList_queryParams.orderDirection = event.sortOrder === 1 ? 'asc' : 'desc';
  };

  /**
   * @description Handle business logic for close dialog cancel
   */
  const purchaseOrderList_onCloseDialogCancel = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'purchase-order-list-cancel-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for close dialog confirm
   */
  const purchaseOrderList_onCloseDialogConfirm = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'purchase-order-list-confirm-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for showing dialog cancel
   */
  const purchaseOrderList_onShowDialogCancel = (id: string): void => {
    purchaseOrderList_selectedId.value = id;

    // Reset form data
    purchaseOrderList_formDataOfCancel.value.reason = '';

    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'purchase-order-list-cancel-dialog',
      iconName: 'exclude',
      title: 'Are you sure want to cancel this purchase order?',
      description:
        'This action cannot be undone, and any pending shipments related to this order will be cancelled.',
      type: 'error',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingForm: true,
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Cancel PO',
      width: '460px',
      formData: purchaseOrderList_formDataOfCancel.value,
      formFields: [
        {
          key: 'reason',
          label: 'Reason (optional)',
          type: 'textarea',
          placeholder: 'Enter cancellation reason...',
          required: false,
          rows: 3,
        },
      ],
      onClickButtonPrimary: purchaseOrderList_onCloseDialogCancel,
      onClickButtonSecondary: purchaseOrderList_onSubmitCancel,
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for showing dialog confirm
   */
  const purchaseOrderList_onShowDialogConfirm = (id: string): void => {
    purchaseOrderList_selectedId.value = id;

    // Reset form data
    purchaseOrderList_formDataOfConfirm.value.delivery_date = null;

    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'purchase-order-list-confirm-dialog',
      iconName: 'info',
      title: 'Confirm Purchase Order',
      description: 'Please provide the delivery date to confirm this purchase order.',
      type: 'info',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingForm: true,
      textButtonPrimary: 'Confirm Order',
      textButtonSecondary: 'Cancel',
      width: '460px',
      formData: purchaseOrderList_formDataOfConfirm.value,
      formFields: [
        {
          key: 'delivery_date',
          label: 'Delivery Date',
          type: 'date',
          placeholder: 'Select delivery date',
          required: true,
        },
      ],
      formValidations: {
        delivery_date: purchaseOrderList_formValidationsOfConfirm.value.delivery_date,
      },
      onClickButtonPrimary: purchaseOrderList_onSubmitConfirm,
      onClickButtonSecondary: () => {
        const closeEventEmitter: IPropsDialogConfirmation = {
          id: 'purchase-order-list-confirm-dialog',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
      },
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for submitting cancel form
   */
  const purchaseOrderList_onSubmitCancel = async (): Promise<void> => {
    try {
      await purchaseOrderList_fetchCancel();
      await purchaseOrderList_fetchList();

      // Close the dialog
      const closeEventEmitter: IPropsDialogConfirmation = {
        id: 'purchase-order-list-cancel-dialog',
        isOpen: false,
      };
      eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error cancelling purchase order:', error);
      } else {
        console.error('Error cancelling purchase order:', String(error));
      }
    }
  };

  /**
   * @description Handle business logic for submitting confirm form
   */
  const purchaseOrderList_onSubmitConfirm = async (): Promise<void> => {
    purchaseOrderList_formValidationsOfConfirm.value.$touch();

    if (purchaseOrderList_formValidationsOfConfirm.value.$invalid) {
      return;
    }

    try {
      await purchaseOrderList_fetchConfirm();
      await purchaseOrderList_fetchList();

      // Close the dialog
      const closeEventEmitter: IPropsDialogConfirmation = {
        id: 'purchase-order-list-confirm-dialog',
        isOpen: false,
      };
      eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error confirming purchase order:', error);
      } else {
        console.error('Error confirming purchase order:', String(error));
      }
    }
  };

  /**
   * @description Handle business logic for ship action
   */
  const purchaseOrderList_onShip = async (id: string): Promise<void> => {
    purchaseOrderList_selectedId.value = id;

    try {
      await purchaseOrderList_fetchShip();
      await purchaseOrderList_fetchList();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error shipping purchase order:', error);
      } else {
        console.error('Error shipping purchase order:', String(error));
      }
    }
  };

  /**
   * @description Handle business logic for receive action
   */
  const purchaseOrderList_onReceive = async (id: string): Promise<void> => {
    purchaseOrderList_selectedId.value = id;

    try {
      await purchaseOrderList_fetchReceive();
      await purchaseOrderList_fetchList();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error receiving purchase order:', error);
      } else {
        console.error('Error receiving purchase order:', String(error));
      }
    }
  };

  /**
   * @description Handle business logic for pay action
   */
  const purchaseOrderList_onPay = async (id: string): Promise<void> => {
    purchaseOrderList_selectedId.value = id;

    try {
      await purchaseOrderList_fetchPay();
      await purchaseOrderList_fetchList();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error paying purchase order:', error);
      } else {
        console.error('Error paying purchase order:', String(error));
      }
    }
  };

  /**
   * @description Watcher for query parameters changes
   */
  watch(
    () => purchaseOrderList_queryParams,
    debounce(async () => {
      await purchaseOrderList_fetchList();
    }, 500),
    { deep: true },
  );

  /**
   * @description Handle business logic to render dynamic class of status
   */
  const purchaseOrderList_getClassOfStatus = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'CANCELLED':
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
        return '';
    }
  };

  /**
   * @description Handle business logic to show button cancel PO
   */
  const purchaseOrderList_onShowButtonCancelPO = (status: string): boolean => {
    const listAcceptedStatuses = ['CONFIRMED', 'PENDING', 'SHIPPED'];

    if (listAcceptedStatuses.includes(status.toUpperCase())) {
      return true;
    }

    return false;
  };

  /**
   * @description Handle business logic to show button Delivery Order Document
   */
  const purchaseOrderList_onShowButtonDeliveryOrderDocument = (status: string): boolean => {
    const listAcceptedStatuses = ['CONFIRMED', 'PENDING', 'SHIPPED', 'PAID'];

    if (listAcceptedStatuses.includes(status.toUpperCase())) {
      return true;
    }

    return false;
  };

  return {
    purchaseOrderList_columns: PURCHASE_ORDER_LIST_COLUMNS,
    purchaseOrderList_fetchList,
    purchaseOrderList_formDataOfCancel,
    purchaseOrderList_formDataOfConfirm,
    purchaseOrderList_formValidationsOfConfirm,
    purchaseOrderList_getClassOfStatus,
    purchaseOrderList_handleOnSortChange,
    purchaseOrderList_isLoading: purchaseOrder_isLoading,
    purchaseOrderList_onChangePage,
    purchaseOrderList_onCloseDialogCancel,
    purchaseOrderList_onCloseDialogConfirm,
    purchaseOrderList_onPay,
    purchaseOrderList_onReceive,
    purchaseOrderList_onShip,
    purchaseOrderList_onShowButtonCancelPO,
    purchaseOrderList_onShowButtonDeliveryOrderDocument,
    purchaseOrderList_onShowDialogCancel,
    purchaseOrderList_onShowDialogConfirm,
    purchaseOrderList_onSubmitCancel,
    purchaseOrderList_onSubmitConfirm,
    purchaseOrderList_queryParams,
    purchaseOrderList_values: purchaseOrder_lists,
  } as IPurchaseOrderListProvided;
};
