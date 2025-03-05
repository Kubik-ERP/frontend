// Composables
import { useHttpAbort } from '@/app/composables';

// Constants
import { AUTHENTICATION_LOGIN_REQUEST } from '../constants';

// Interfaces
import type { IAuthenticationLoginFormData, IAuthenticationLoginProvided } from '../interfaces/authentication-login.interface';

// Store / Pinia
import { storeToRefs } from 'pinia';
import { useAuthenticationStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { computed, reactive } from 'vue';

// Vue Router
import { useRouter } from 'vue-router';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAuthenticationLoginService = (): IAuthenticationLoginProvided => {
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
  const authenticationLogin_formData = reactive<IAuthenticationLoginFormData>({
    email: '',
    password: '',
  });

  /**
   * @description Form validations
   */
  const authenticationLogin_formRules = computed(() => ({
    email: { email, required },
    password: { required },
  }));
  const authenticationLogin_formValidations = useVuelidate(
    authenticationLogin_formRules,
    authenticationLogin_formData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle fetch api authentication login. We call the fetchAuthenticationLogin function from the store to handle the request.
   */
  const authenticationLogin_fetchAuthenticationLogin = async () => {
    try {
      const result = await store.fetchAuthentication_login(authenticationLogin_formData, {
        ...httpAbort_registerAbort(AUTHENTICATION_LOGIN_REQUEST),
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
  const authenticationLogin_onSubmit = async (): Promise<void> => {
    authenticationLogin_formValidations.value.$touch();
    if (authenticationLogin_formValidations.value.$invalid) return;

    try {
      await authenticationLogin_fetchAuthenticationLogin();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    authenticationLogin_formData,
    authenticationLogin_formValidations,
    authenticationLogin_isLoading: authentication_isLoading,
    authenticationLogin_onSubmit,
  };
};
