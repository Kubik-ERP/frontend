// Interfaces
import type {
  IAuthenticationCreateNewPasswordFormData,
  IAuthenticationCreateNewPasswordProvided,
} from '../interfaces/authentication-create-new-password.interface';

// Store / Pinia
import { storeToRefs } from 'pinia';
import { useAuthenticationStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAuthenticationCreateNewPasswordService = (): IAuthenticationCreateNewPasswordProvided => {
  /**
   * @description Injected variables
   */
  const store = useAuthenticationStore(); // Instance of the store
  const { authentication_isLoading } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const authenticationCreateNewPassword_formData = reactive<IAuthenticationCreateNewPasswordFormData>({
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const authenticationCreateNewPassword_isSuccess = ref<boolean>(false);

  /**
   * @description Form validations
   */
  const authenticationCreateNewPassword_formRules = computed(() => ({
    email: { email, required },
    password: { required },
    passwordConfirmation: { required },
  }));

  const authenticationCreateNewPassword_formValidations = useVuelidate(
    authenticationCreateNewPassword_formRules,
    authenticationCreateNewPassword_formData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle fetch api authentication login. We call the fetchauthenticationSignIn function from the store to handle the request.
   */
  const authenticationCreateNewPassword_fetchAuthenticationCreateNewPassword = async () => {
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
    authenticationCreateNewPassword_formData,
    authenticationCreateNewPassword_formValidations,
    authenticationCreateNewPassword_isLoading: authentication_isLoading,
    authenticationCreateNewPassword_isSuccess,
    authenticationCreateNewPassword_onSubmit: authenticationCreateNewPassword_fetchAuthenticationCreateNewPassword,
  };
};
