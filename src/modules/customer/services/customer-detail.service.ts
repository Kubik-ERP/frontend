import type { IIncreasePoint, IDecreasePoint } from '../interfaces/CustomerDetailInterface';

import { useCustomerDetailsStore } from '../store';

import {
  SALES_INVOICE_LIST_REQUEST,
  SALES_INVOICE_COLUMNS,
  SALES_INVOICE_VALUES,
  LOYALTY_POINT_COLUMNS,
  LOYALTY_POINT_VALUES,
  SALES_INVOICE_PAYMENT_STATUS,
  SALES_INVOICE_ORDER_TYPE,

  LOYALTY_POINT_TYPES,

} from '../constants';

import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

export const useCustomerDetailService = () => {
  const store = useCustomerDetailsStore();

  const {customerDetails_isLoading} = storeToRefs(store);

  const { httpAbort_registerAbort } = useHttpAbort();

  const increarePoint_FormData = reactive<IIncreasePoint>({
    point: 0,
    isHaveExpiryDate: 'No Expiry Date',
    ExpiryDate: new Date(),
    notes: '',
  });

  const increasePoint_formRules = computed(() => ({
    point: { required },
  }));

  const increasePoint_formValidations = useVuelidate(increasePoint_formRules, increarePoint_FormData, {
    $autoDirty: true,
  });

  const increarePoint_ResetFormData = () => {
    increarePoint_FormData.point = 0;
    increarePoint_FormData.isHaveExpiryDate = 'No Expiry Date';
    increarePoint_FormData.ExpiryDate = new Date();
    increarePoint_FormData.notes = '';
  };

  const decreasePoint_FormData = reactive<IDecreasePoint>({
    point: 0,
    notes: '',
  });

  const decreasePoint_formRules = computed(() => ({
    point: { required },
  }));

  const decreasePoint_formValidations = useVuelidate(decreasePoint_formRules, decreasePoint_FormData, {
    $autoDirty: true,
  });

  const decreasePoint_ResetFormData = () => {
    decreasePoint_FormData.point = 0;
    decreasePoint_FormData.notes = '';
  };

  const customerDetails_fetchSalesInvoice = async (id: string): Promise<unknown> => {
    try {
      return await store.salesInvoice_list(id, {
        ...httpAbort_registerAbort(SALES_INVOICE_LIST_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const customerDetails_fetchLoyaltyPoint = async (id: string): Promise<unknown> => {
    try {
      return await store.loyaltyPoints_list(id, httpAbort_registerAbort(SALES_INVOICE_LIST_REQUEST));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  }

  return {
    increarePoint_FormData,
    increasePoint_formValidations,
    increarePoint_ResetFormData,

    decreasePoint_FormData,
    decreasePoint_formValidations,
    decreasePoint_ResetFormData,

    customerDetail_columns: SALES_INVOICE_COLUMNS,
    customerDetail_values: SALES_INVOICE_VALUES,

    customerLoyaltyPoint_columns: LOYALTY_POINT_COLUMNS,
    customerLoyaltyPoint_values: LOYALTY_POINT_VALUES,

    salesInvoice_paymentStatus: SALES_INVOICE_PAYMENT_STATUS,
    salesInvoice_orderType: SALES_INVOICE_ORDER_TYPE,

    loyaltyPoint_types: LOYALTY_POINT_TYPES,

    customerDetails_isLoading,

    customerDetails_fetchSalesInvoice,
    customerDetails_fetchLoyaltyPoint,
  };
};
