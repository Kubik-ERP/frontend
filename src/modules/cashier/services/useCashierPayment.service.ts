// Constants
import { CASHIER_DUMMY_PARAMS_SIMULATE_PAYMENT } from '../constants';

// Interfaces
import {
  ICashierOrderSummaryModalPaymentMethod,
  ICashierCalulateEstimationData,
  ICashierOrderSummaryModalPlaceOrderConfirmation,
} from '../interfaces/cashier-order-summary';
import { ICashierResponseWebsocketMessage } from '../interfaces/cashier-response';
import type { ICashierPaymentProvided } from '../interfaces/cashier-payment.interface';

// Router
import { useRouter, useRoute } from 'vue-router';

// Stores
import { useCashierStore } from '../store';

// Socket
import { useSocket } from '@/plugins/socket';

// Vue
import { onUnmounted, reactive, ref, watch, type Ref } from 'vue';

// Composables
import useVuelidate from '@vuelidate/core';
import { minValue, numeric, required } from '@vuelidate/validators';
import { computed } from 'vue';

export const useCashierPaymentService = (
  cashierOrder_calculateEstimation: Ref<ICashierCalulateEstimationData>,
  cashierOrder_modalPlaceOrderDetail: Ref<ICashierOrderSummaryModalPlaceOrderConfirmation>,
): ICashierPaymentProvided => {
  /**
   * @description Destructure all the data and methods what we need
   */
  // Router
  const router = useRouter();
  const route = useRoute();

  /**
   * @description Injected variables
   */
  const store = useCashierStore();

  // Modal for payment method selection
  const cashierPayment_modalPaymentMethod = ref<ICashierOrderSummaryModalPaymentMethod>({
    show: false,
    isLoading: false,
    selectedPaymentMethod: '',
    data: [],
  });

  /**
   * @description Handle order type selection
   * @returns void
   */
  const cashierPayment_handleFetchPaymentMethod = async () => {
    cashierPayment_modalPaymentMethod.value.isLoading = true;

    try {
      const response = await store.cashierProduct_fetchPaymentMethod(false, route, {});

      cashierPayment_modalPaymentMethod.value.data = response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      cashierPayment_modalPaymentMethod.value.isLoading = false;
    }
  };

  /**
   * @description Handle payment method selection
   * @returns void
   */
  const cashierPayment_handlePaymentMethod = async () => {};

  // Watch for changes in payment method modal visibility
  watch(
    () => cashierPayment_modalPaymentMethod.value.show,
    value => {
      if (value) {
        cashierPayment_handleFetchPaymentMethod();
      }
    },
  );

  const cashierPayment_paymentForm = reactive({
    paymentAmount: 0,
  });

  const cashierPayment_formRules = {
    paymentAmount: {
      required,
      numeric,
      minValue: minValue(computed(() => cashierOrder_calculateEstimation.value.data.grandTotal)),
    },
  };

  const cashierPayment_paymentAmountFormValidation = useVuelidate(
    cashierPayment_formRules,
    cashierPayment_paymentForm,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle simulating payment
   * @param {string} invoiceId - The invoice ID to simulate payment for
   * @returns void
   */
  const cashierPayment_handleSimulatePayment = async (invoiceId: string) => {
    try {
      const params = {
        ...CASHIER_DUMMY_PARAMS_SIMULATE_PAYMENT,
        order_id: invoiceId ?? null,
      };

      await store.cashierProduct_simulatePayment(params, route);
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      cashierOrder_modalPlaceOrderDetail.value.isLoading = false;
    }
  };

  // Socket connection for real-time updates
  const socket = useSocket();

  /**
   * @description Subscribe to payment events
   * @returns void
   */
  const cashierPayment_subscribe = () => {
    const orderId = cashierOrder_modalPlaceOrderDetail.value.data?.orderId;
    if (!orderId) return;

    socket.emit('subscribe-invoice', orderId);

    socket.on('payment-success', (data: ICashierResponseWebsocketMessage) => {
      localStorage.removeItem('shoppingCart');

      if (data.orderId === orderId) {
        router.replace({ name: 'invoice', params: { invoiceId: data?.orderId ?? null } });
      }
    });

    socket.on('payment-failed', data => {
      localStorage.removeItem('shoppingCart');

      if (data.orderId === orderId) {
        router.replace({ name: 'invoice', params: { invoiceId: data?.orderId ?? null } });
      }
    });
  };

  /**
   * @description Unsubscribe from payment events
   * @returns void
   */
  const cashierPayment_unsubscribe = () => {
    const orderId = cashierOrder_modalPlaceOrderDetail.value.data?.orderId;
    if (!orderId) return;

    socket.emit('unsubscribe-invoice', orderId);

    socket.off('payment-success');
    socket.off('payment-failed');
  };

  // Watch for visibility of payment modal to manage subscription
  watch(
    () => cashierOrder_modalPlaceOrderDetail.value.showModalPayment,
    isVisible => {
      if (isVisible) {
        cashierPayment_subscribe();
      } else {
        cashierPayment_unsubscribe();
      }
    },
  );

  // Cleanup on component unmount
  onUnmounted(() => {
    cashierPayment_unsubscribe();
  });

  /**
   * @description Handle saving unpaid order (placeholder - actual implementation in order service)
   * @returns void
   */
  const cashierPayment_handleSaveUnpaidOrder = async () => {
    // This is a placeholder that will be overridden by the actual implementation
    // from cashierOrder service when provided
    console.warn('handleSaveUnpaidOrder called but not implemented in payment service');
  };

  return {
    cashierPayment_handleFetchPaymentMethod,
    cashierPayment_handlePaymentMethod,
    cashierPayment_handleSimulatePayment,
    cashierPayment_handleSaveUnpaidOrder,
    cashierPayment_modalPaymentMethod,
    cashierPayment_paymentAmountFormValidation,
    cashierPayment_paymentForm,
    cashierPayment_subscribe,
    cashierPayment_unsubscribe,
  } as unknown as ICashierPaymentProvided;
};
