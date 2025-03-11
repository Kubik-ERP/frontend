// Constants
// import { AUTHENTICATION_RESET_PASSWORD_REQUEST } from '../constants';

// Interfaces
import type {
  IAuthenticationResetPasswordFormData,
  IAuthenticationResetPasswordProvided,
} from '../interfaces/authentication-reset-password.interface';

// Store / Pinia
import { storeToRefs } from 'pinia';
import { useAuthenticationStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAuthenticationResetPasswordService = (): IAuthenticationResetPasswordProvided => {
  /**
   * @description Injected variables
   */
  const store = useAuthenticationStore(); // Instance of the store
  const { authentication_isLoading } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const authenticationResetPassword_formData = reactive<IAuthenticationResetPasswordFormData>({
    email: '',
  });
  const authenticationResetPassword_isSuccess = ref<boolean>(true);

  /**
   * @description Form validations
   */
  const authenticationResetPassword_formRules = computed(() => ({
    email: { email, required },
  }));

  const authenticationResetPassword_formValidations = useVuelidate(
    authenticationResetPassword_formRules,
    authenticationResetPassword_formData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle fetch api authentication login. We call the fetchauthenticationSignIn function from the store to handle the request.
   */
  const authenticationResetPassword_fetchAuthenticationResetPassword = async () => {
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

  /**
   * @description Handle action on submit form.
   */
  const authenticationResetPassword_onSubmit = async (): Promise<void> => {
    authenticationResetPassword_formValidations.value.$touch();
    if (authenticationResetPassword_formValidations.value.$invalid) return;

    try {
      await authenticationResetPassword_fetchAuthenticationResetPassword();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    authenticationResetPassword_formData,
    authenticationResetPassword_formValidations,
    authenticationResetPassword_isLoading: authentication_isLoading,
    authenticationResetPassword_isSuccess,
    authenticationResetPassword_onSubmit,
  };
};
