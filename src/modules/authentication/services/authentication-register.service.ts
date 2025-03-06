// Constants
import { AUTHENTICATION_REGISTER_STEPPER } from '../constants/authentication-register.constant';

// Interfaces
import type {
  IAuthenticationRegisterFormData,
  IAuthenticationRegisterProvided,
  IAuthenticationRegisterStepper,
} from '../interfaces/authentication-register.interface';

// Store / Pinia
import { storeToRefs } from 'pinia';
import { useAuthenticationStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { email, required, sameAs } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAuthenticationRegisterService = (): IAuthenticationRegisterProvided => {
  /**
   * @description Injected variables
   */
  const store = useAuthenticationStore(); // Instance of the store
  const { authentication_isLoading } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const authenticationRegister_activeStep = ref<number>(1);
  const authenticationRegister_formData = reactive<IAuthenticationRegisterFormData>({
    email: '',
    phoneCode: '+62',
    phoneNumber: '',
    password: '',
    passwordConfirmation: '',
  });
  const authenticationRegister_isAcceptTnc = ref<boolean>(false);
  const authenticationRegister_stepper = shallowRef<IAuthenticationRegisterStepper[]>(
    AUTHENTICATION_REGISTER_STEPPER,
  );

  /**
   * @description Form validations
   */
  const authenticationRegister_formRules = computed(() => ({
    email: { email, required },
    phoneCode: { required, isPhoneCodeValid },
    phoneNumber: { required, isPhoneNumberValid },
    password: { required, isPasswordValid },
    passwordConfirmation: { required, sameAs: sameAs(() => authenticationRegister_formData.password) },
  }));

  const authenticationRegister_formValidations = useVuelidate(
    authenticationRegister_formRules,
    authenticationRegister_formData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle fetch api authentication register. We call the fetchAuthenticationRegister function from the store to handle the request.
   */
  const authenticationRegister_fetchAuthenticationRegister = async () => {
    try {
      console.log('Fetch api here...');
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    authenticationRegister_activeStep,
    authenticationRegister_formData,
    authenticationRegister_formValidations,
    authenticationRegister_isAcceptTnc,
    authenticationRegister_isLoading: authentication_isLoading,
    authenticationRegister_stepper,
    authenticationRegister_onSubmit: authenticationRegister_fetchAuthenticationRegister,
  };
};
