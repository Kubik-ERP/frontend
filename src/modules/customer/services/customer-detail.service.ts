import type {
  IIncreasePoint,
  IDecreasePoint,
  ICustomerDetailsRequestQuery,
  IloyaltyPoints,
  ICustomerLoyaltyPointQuery,
  IPointDetails,
} from '../interfaces/CustomerDetailInterface';

import { useFormatDateLocal } from '@/app/composables';

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

// Plugins
import eventBus from '@/plugins/mitt';

import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

export const useCustomerDetailService = () => {
  const route = useRoute();
  const customerId = route.params.id as string;

  const isEdit = ref(false);
  const selectedPointId = ref<string>();

  const store = useCustomerDetailsStore();

  const { customerDetails_isLoading, customerDetails, loyaltyPoints_list } = storeToRefs(store);

  const { httpAbort_registerAbort } = useHttpAbort();

  const customerDetails_queryParams = reactive<ICustomerDetailsRequestQuery>({
    start_date: null,
    end_date: null,
    page: 1,
    limit: 10,
    search: '',
    payment_status: null,
    order_type: null,
  });

  function jsonToQueryString(params: ICustomerDetailsRequestQuery): string {
    const queryParts = [];

    // Iterate over each key in the params object
    for (const key in params) {
      // Ensure the key belongs to the object itself
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key];

        // Skip null, undefined, or empty string values
        if (value === null || value === undefined || value === '') {
          continue;
        }

        // Handle the specific key mappings for arrays
        if (key === 'payment_status' && Array.isArray(value)) {
          // Map 'payment_status' array to 'order_type' parameters
          value.forEach(item => {
            queryParts.push(`order_type=${encodeURIComponent(item)}`);
          });
        } else if (key === 'order_type' && Array.isArray(value)) {
          // Map 'order_type' array to 'payment_status' parameters
          value.forEach(item => {
            queryParts.push(`payment_status=${encodeURIComponent(item)}`);
          });
        } else if (Array.isArray(value)) {
          // Generic handler for other arrays if they exist
          value.forEach(item => {
            queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
          });
        } else {
          // Handle simple key-value pairs like page and limit
          // Handle simple key-value pairs like page and limit
          queryParts.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(value instanceof Date ? value.toISOString() : String(value))}`,
          );
        }
      }
    }

    // Join all parts with '&' and prepend '?' if there are any parts
    return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  }

  const increarePoint_FormData = reactive<IIncreasePoint>({
    point: 0,
    isHaveExpiryDate: 'No Expiry Date',
    ExpiryDate: null,
    notes: null,
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
    increarePoint_FormData.ExpiryDate = null;
    increarePoint_FormData.notes = null;

    increasePoint_formValidations.value.$reset();

    isIncreasePointOpen.value = false;
  };

  const decreasePoint_FormData = reactive<IDecreasePoint>({
    point: 0,
    notes: null,
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

    decreasePoint_formValidations.value.$reset();

    isDecreasePointOpen.value = false;
  };

  const customerDetails_fetchInformation = async (): Promise<unknown> => {
    try {
      const formattedParams = jsonToQueryString(customerDetails_queryParams);

      const response = await store.salesInvoice_list(customerId, formattedParams, {
        ...httpAbort_registerAbort(SALES_INVOICE_LIST_REQUEST),
      });
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };
  const customerDetails_fetchSalesInvoice = async (): Promise<unknown> => {
    try {
      const { start_date, end_date, ...otherFilter } = customerDetails_queryParams;

      const filteredParams = {
        ...otherFilter,
        start_date: start_date ? useFormatDateLocal(new Date(start_date)) : null,
        end_date: end_date ? useFormatDateLocal(new Date(end_date)) : null,
      };

      const formattedParams = jsonToQueryString(filteredParams as ICustomerDetailsRequestQuery);

      await store.salesInvoice_list(customerId, formattedParams, {
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

  const customerDetails_onChangePage = (page: number): void => {
    customerDetails_queryParams.page = page;
  };

  watch(
    () => customerDetails_queryParams,
    debounce(async () => {
      await customerDetails_fetchSalesInvoice();
    }, 500),
    {
      deep: true,
    },
  );

  const orderTypeClass = (orderType: string) => {
    switch (orderType) {
      case 'Dine In':
        return 'bg-primary-background text-primary';
      case 'Take Away':
        return 'bg-secondary-background text-green-primary';
      case 'Delivery':
        return 'text-success-main';
      default:
        return '';
    }
  };

  const orderStatusClass = (orderStatus: string) => {
    switch (orderStatus) {
      case 'Pain':
        return 'bg-background-success text-success';
      case 'Unpaid':
        return 'bg-warning-background text-warning-main';
      case 'Cancelled':
        return 'bg-error-background text-error-main';
      case 'Refunded':
        return 'bg-error-background text-error-main';
      default:
        return '';
    }
  };

  const isIncreasePointOpen = ref(false);
  const isDecreasePointOpen = ref(false);

  
  const pointTypeClass = (type: string) => {
    if (type === 'point_addition') return 'bg-primary-background text-primary';
    if (type === 'point_deduction') return 'bg-error-background text-error-main';
  };

  const pointTypeFormat = (type: string, points: number) => {
    if (type === 'point_addition') return '+ ' + points;
    else if (type === 'point_deduction') return '- ' + points;
    else return points;
  };

  const customerDetails_fetchLoyaltyPoint = async (): Promise<IloyaltyPoints> => {
    try {
      return await store.fetch_loyaltyPoints_list(
        customerId,
        httpAbort_registerAbort(SALES_INVOICE_LIST_REQUEST),
        loyaltyPoint_queryParams,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const loyaltyPoint_queryParams = reactive<ICustomerLoyaltyPointQuery>({
    page: 1,
    limit: 10,
    type: null,
    date: null,
  });

  const loyaltyPoint_onChangePage = (page: number): void => {
    loyaltyPoint_queryParams.page = page;
  };

  watch(
    () => loyaltyPoint_queryParams,
    debounce(async () => {
      await customerDetails_fetchLoyaltyPoint();
    }, 500),
    {
      deep: true,
    },
  );

  const customerDetails_fetchIncreasePointOnSubmit = async (): Promise<void> => {
    try {
      increasePoint_formValidations.value.$reset();
      if (increasePoint_formValidations.value.$invalid) return;
      await store.increasePoint_onSubmit(
        httpAbort_registerAbort(SALES_INVOICE_LIST_REQUEST),
        increarePoint_FormData,
        customerId,
      );
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Point Addition has been created successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      increasePoint_formValidations.value.$reset();
      increarePoint_ResetFormData();
      await customerDetails_fetchLoyaltyPoint();
    }
  };

  const customerDetails_fetchDecreasePointOnSubmit = async (): Promise<void> => {
    try {
      decreasePoint_formValidations.value.$reset();
      if (decreasePoint_formValidations.value.$invalid) return;
      await store.decreasePoint_onSubmit(
        httpAbort_registerAbort(SALES_INVOICE_LIST_REQUEST),
        decreasePoint_FormData,
        customerId,
      );
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Point Deduction has been created successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      decreasePoint_formValidations.value.$reset();
      decreasePoint_ResetFormData();
      await customerDetails_fetchLoyaltyPoint();
    }
  };

  const customerDetails_fetchDecreasePointOnEdit = async (): Promise<void> => {
    try {
      decreasePoint_formValidations.value.$reset();
      if (decreasePoint_formValidations.value.$invalid) return;
      await store.decreasePoint_onEdit(
        httpAbort_registerAbort(SALES_INVOICE_LIST_REQUEST),
        decreasePoint_FormData,
        selectedPointId.value as string,
        customerId,
      );
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Point Deduction has been Edited successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      decreasePoint_ResetFormData();
      selectedPointId.value = '';
      await customerDetails_fetchLoyaltyPoint();
    }
  };

  const customerDetails_fetchIncreasePointOnEdit = async (): Promise<void> => {
    try {
      increasePoint_formValidations.value.$reset();
      if (increasePoint_formValidations.value.$invalid) return;
      
      await store.increasePoint_onEdit(
        httpAbort_registerAbort(SALES_INVOICE_LIST_REQUEST),
        selectedPointId.value as string,
        increarePoint_FormData,
        customerId,
      );
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Point Addition has been Edited successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      increarePoint_ResetFormData();
      selectedPointId.value = '';
      await customerDetails_fetchLoyaltyPoint();
    }
  };

  const handle_editLoyaltyPoints = async (data: IPointDetails) => {
    if (data.type === 'point_addition') {
      selectedPointId.value = data.id;

      increarePoint_FormData.point = data.value;
      increarePoint_FormData.isHaveExpiryDate = data.expiryDate ? 'Specific Date' : 'No Expiry Date';
      increarePoint_FormData.ExpiryDate = data.expiryDate;
      increarePoint_FormData.notes = data.notes;

      isIncreasePointOpen.value = true;

    } else if (data.type === 'point_deduction') {
      selectedPointId.value = data.id;

      decreasePoint_FormData.point = data.value;
      decreasePoint_FormData.notes = data.notes;

      isDecreasePointOpen.value = true;

    }
  };

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
    orderStatusClass,
    orderTypeClass,

    customerDetails_fetchLoyaltyPoint,
    loyaltyPoint_onChangePage,
    loyaltyPoint_queryParams,

    customerDetails_queryParams,
    customerDetails_onChangePage,

    customerDetails_fetchInformation,

    customerDetails,
    loyaltyPoints_list,

    isEdit,

    customerDetails_fetchIncreasePointOnSubmit,
    customerDetails_fetchDecreasePointOnEdit,
    customerDetails_fetchDecreasePointOnSubmit,
    customerDetails_fetchIncreasePointOnEdit,

    isIncreasePointOpen,
    isDecreasePointOpen,
    pointTypeClass,
    pointTypeFormat,

    handle_editLoyaltyPoints,
  };
};
