// Constants
import { AUTHENTICATION_GOOGLE_REDIRECT_REQUEST, AUTHENTICATION_SIGN_IN_REQUEST } from '../constants';

// Interfaces
import type {
  IAuthenticationSignInFormData,
  IAuthenticationSignInProvided,
} from '../interfaces/authentication-sign-in.interface';

// Stores
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
  const route = useRoute(); // Instance of the route
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
  const authenticationSignIn_isNotAuthenticated = ref<boolean>(false);

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
   * @description Handle fetch api authentication login. We call the fetchAuthentication_googleRedirect function from the store to handle the request.
   */
  const authenticationSignIn_fetchAuthenticationGoogleRedirect = async () => {
    try {
      await store.fetchAuthentication_googleRedirect(route.query, {
        ...httpAbort_registerAbort(AUTHENTICATION_GOOGLE_REDIRECT_REQUEST),
      });

      router.push({ name: 'outlet.list' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api authentication login. We call the fetchauthenticationSignIn function from the store to handle the request.
   */
  const authenticationSignIn_fetchAuthenticationSignIn = async () => {
    try {
      const result = await store.fetchAuthentication_signIn(
        {
          ...authenticationSignIn_formData,
          username: authenticationSignIn_formData.email,
        },
        {
          ...httpAbort_registerAbort(AUTHENTICATION_SIGN_IN_REQUEST),
        },
      );
      router.push({ name: 'outlet.list' });

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
   * @description Handle business logic to direct user to the sso authentication
   */
  const authenticationSignIn_onSsoWithGoogle = async (): Promise<void> => {
    window.location.href = `${import.meta.env.VITE_APP_BASE_API_URL}${import.meta.env.VITE_APP_BASE_API_PREFIX}/authentication/google`;
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
      authenticationSignIn_isNotAuthenticated.value = true;

      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle side effects when the user fills the form.
   */
  watch(
    authenticationSignIn_formData,
    () => {
      if (authenticationSignIn_isNotAuthenticated.value) {
        authenticationSignIn_isNotAuthenticated.value = false;
      }
    },
    {
      deep: true,
    },
  );

  return {
    authenticationSignIn_fetchAuthenticationGoogleRedirect,
    authenticationSignIn_formData,
    authenticationSignIn_formValidations,
    authenticationSignIn_isLoading: authentication_isLoading,
    authenticationSignIn_isNotAuthenticated,
    authenticationSignIn_onSsoWithGoogle,
    authenticationSignIn_onSubmit,
  };
};
