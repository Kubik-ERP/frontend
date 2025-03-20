import { ref } from 'vue';
import {
  ICashierOrderSummaryCalculation,
  ICashierOrderSummaryData,
  ICashierOrderSummaryProvided,
} from '../interfaces/cashier-order-summary';

export const useCashierOrderSummaryService = (): ICashierOrderSummaryProvided => {
  const cashierOrderSummary_data = ref<ICashierOrderSummaryData>({
    orderId: '1234',
    customerName: 'Rama Dwiyantara Perkasa',
    orderType: '',
    tableNumber: '',
    promoCode: '',
    paymentMethod: '',
  });

  const cashierOrderSummary_calculation = ref<ICashierOrderSummaryCalculation>({
    subTotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });

  return {
    cashierOrderSummary_data,
    cashierOrderSummary_calculation,
  };
};
