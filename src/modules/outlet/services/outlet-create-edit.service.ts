// Interfaces
import {
  EOutletBusinessType,
  IOutletCreateEditFormData,
  IOutletCreateEditProvided,
} from '../interfaces/outlet-create-edit.interface';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useOutletCreateEditService = (): IOutletCreateEditProvided => {
  /**
   * @description Injected variables
   */
  // Insert here

  /**
   * @description Reactive data binding
   */
  const outletCreateEdit_formData = reactive<IOutletCreateEditFormData>({
    name: '',
    email: '',
    phoneCode: '',
    phoneNumber: '',
    businessType: EOutletBusinessType.RestaurantFnB,
    address: '',
    photo: '',
    location: '',
    city: '',
    postalCode: '',
    building: '',
    operationals: [],
  });

  /**
   * @description Form validations
   */
  const outletCreateEdit_formRules = computed(() => ({
    name: { required },
    email: { email, required },
    phoneCode: { required },
    phoneNumber: { required },
    businessType: { required },
    address: { required },
    photo: { required },
    location: { required },
    city: { required },
    postalCode: { required },
    building: { required },
    operationals: { required },
  }));

  const outletCreateEdit_formValidations = useVuelidate(outletCreateEdit_formRules, outletCreateEdit_formData, {
    $autoDirty: true,
  });

  return {
    outletCreateEdit_formData,
    outletCreateEdit_formValidations,
  };
};
