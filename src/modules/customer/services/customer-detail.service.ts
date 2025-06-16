import { IIncreasePoint, IDecreasePoint } from '../interfaces/CustomerDetailInterface';

import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

export const useCustomerDetailService = () => {
  const increarePoint_FormData = reactive<IIncreasePoint>({
    point: 0,
    isHaveExpiryDate: "No Expiry Date",
    ExpiryDate: '',
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
    increarePoint_FormData.isHaveExpiryDate = "No Expiry Date";
    increarePoint_FormData.ExpiryDate = '';
    increarePoint_FormData.notes = '';
  }

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
  }

  return {
    increarePoint_FormData,
    increasePoint_formValidations,
    increarePoint_ResetFormData,

    decreasePoint_FormData,
    decreasePoint_formValidations,
    decreasePoint_ResetFormData,

  };
};
