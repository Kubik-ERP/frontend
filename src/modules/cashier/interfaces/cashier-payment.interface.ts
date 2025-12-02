import { Reactive, Ref } from 'vue';
import { Validation } from '@vuelidate/core';
import {
  ICashierOrderSummaryModalPaymentMethod,
} from './cashier-order-summary';

// Service returns this subset
export interface ICashierPaymentService {
  cashierPayment_handleFetchPaymentMethod: () => Promise<void>;
  cashierPayment_handlePaymentMethod: () => Promise<void>;
  cashierPayment_handleSimulatePayment: (invoiceId: string) => Promise<void>;
  cashierPayment_modalPaymentMethod: Ref<ICashierOrderSummaryModalPaymentMethod>;
  cashierPayment_paymentAmountFormValidation: globalThis.Ref<Validation>;
  cashierPayment_paymentForm: Reactive<{ paymentAmount: number }>;
  cashierPayment_subscribe: () => void;
  cashierPayment_unsubscribe: () => void;
}

// Provided includes additional properties from other services
export interface ICashierPaymentProvided extends ICashierPaymentService {
  cashierPayment_handleSaveUnpaidOrder: () => Promise<void>;
}
