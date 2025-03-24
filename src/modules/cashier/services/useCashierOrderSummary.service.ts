import { ref } from 'vue';
import {
  ICashierOrderSummaryCalculation,
  ICashierOrderSummaryData,
  ICashierOrderSummaryModalAddEdit,
  ICashierOrderSummaryProvided,
} from '../interfaces/cashier-order-summary';

import type { MenuContext } from 'primevue';

export const useCashierOrderSummaryService = (): ICashierOrderSummaryProvided => {
  const cashierOrderSummary_menuOrder = ref<MenuContext>();

  const cashierOrderSummary_menuOrderItem = ref([{ label: 'Cancel Order' }, { label: 'Add Invoice Detail' }]);

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

  const cashierOrderSummary_modalAddEditNotes = ref<ICashierOrderSummaryModalAddEdit>({
    show: false,
    item: null,
    tempValue: '',
  });

  watch(
    () => cashierOrderSummary_modalAddEditNotes.value.show,
    value => {
      if (!value) {
        cashierOrderSummary_modalAddEditNotes.value.item = null;
      }
    },
  );

  watchEffect(() => {
    if (cashierOrderSummary_modalAddEditNotes.value.show) {
      cashierOrderSummary_modalAddEditNotes.value.tempValue = '';
    }
  });

  return {
    cashierOrderSummary_menuOrder,
    cashierOrderSummary_menuOrderItem,
    cashierOrderSummary_data,
    cashierOrderSummary_calculation,
    cashierOrderSummary_modalAddEditNotes,
  };
};
