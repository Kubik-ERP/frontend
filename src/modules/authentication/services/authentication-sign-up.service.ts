// Constants
import { AUTHENTICATION_REGISTER_STEPPER } from '../constants/authentication-sign-up.constant';

// Interfaces
import type {
  IAuthenticationSignUpFormData,
  IAuthenticationSignUpProvided,
  IAuthenticationSignUpStepper,
} from '../interfaces/authentication-sign-up.interface';

// Store / Pinia
import { storeToRefs } from 'pinia';
import { useAuthenticationStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { email, required, sameAs } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAuthenticationRegisterService = (): IAuthenticationSignUpProvided => {
  /**
   * @description Injected variables
   */
  const store = useAuthenticationStore(); // Instance of the store
  const { authentication_isLoading } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const authenticationSignUp_activeStep = ref<number>(1);
  const authenticationSignUp_formData = reactive<IAuthenticationSignUpFormData>({
    email: '',
    phoneCode: '+62',
    phoneNumber: '',
    password: '',
    passwordConfirmation: '',
  });
  const authenticationSignUp_isAcceptTnc = ref<boolean>(false);
  const authenticationSignUp_stepper = shallowRef<IAuthenticationSignUpStepper[]>(AUTHENTICATION_REGISTER_STEPPER);

  /**
   * @description Form validations
   */
  const authenticationSignUp_formRules = computed(() => ({
    email: { email, required },
    phoneCode: { required, isPhoneCodeValid },
    phoneNumber: { required, isPhoneNumberValid },
    password: { required, isPasswordValid },
    passwordConfirmation: { required, sameAs: sameAs(() => authenticationSignUp_formData.password) },
  }));

  const authenticationSignUp_formValidations = useVuelidate(
    authenticationSignUp_formRules,
    authenticationSignUp_formData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle fetch api authentication register. We call the fetchAuthenticationRegister function from the store to handle the request.
   */
  const authenticationSignUp_fetchAuthenticationRegister = async () => {
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
    authenticationSignUp_activeStep,
    authenticationSignUp_formData,
    authenticationSignUp_formValidations,
    authenticationSignUp_isAcceptTnc,
    authenticationSignUp_isLoading: authentication_isLoading,
    authenticationSignUp_stepper,
    authenticationSignUp_onSubmit: authenticationSignUp_fetchAuthenticationRegister,
  };
};
