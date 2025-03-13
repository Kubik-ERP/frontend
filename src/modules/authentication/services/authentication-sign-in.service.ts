// Constants
import { AUTHENTICATION_SIGN_IN_REQUEST } from '../constants';

// Interfaces
import type {
  IAuthenticationSignInFormData,
  IAuthenticationSignInProvided,
} from '../interfaces/authentication-sign-in.interface';

// Store / Pinia
import { storeToRefs } from 'pinia';
import { useAuthenticationStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAuthenticationSignInService = (): IAuthenticationSignInProvided => {
  /**
   * @description Injected variables
   */
  const store = useAuthenticationStore(); // Instance of the store
  const router = useRouter(); // Instance of the router
  const { authentication_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const authenticationSignIn_formData = reactive<IAuthenticationSignInFormData>({
    email: '',
    password: '',
  });

  /**
   * @description Form validations
   */
  const authenticationSignIn_formRules = computed(() => ({
    email: { email, required },
    password: { required },
  }));
  const authenticationSignIn_formValidations = useVuelidate(
    authenticationSignIn_formRules,
    authenticationSignIn_formData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle fetch api authentication login. We call the fetchauthenticationSignIn function from the store to handle the request.
   */
  const authenticationSignIn_fetchAuthenticationSignIn = async () => {
    try {
      const result = await store.fetchAuthentication_login(authenticationSignIn_formData, {
        ...httpAbort_registerAbort(AUTHENTICATION_SIGN_IN_REQUEST),
      });
      router.push({ name: 'dashboard' });

      return Promise.resolve(result);
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
  const authenticationSignIn_onSubmit = async (): Promise<void> => {
    authenticationSignIn_formValidations.value.$touch();
    if (authenticationSignIn_formValidations.value.$invalid) return;

    try {
      await authenticationSignIn_fetchAuthenticationSignIn();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    authenticationSignIn_formData,
    authenticationSignIn_formValidations,
    authenticationSignIn_isLoading: authentication_isLoading,
    authenticationSignIn_onSubmit,
  };
};
