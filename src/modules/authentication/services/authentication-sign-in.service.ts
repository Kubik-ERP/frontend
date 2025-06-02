// Constants
import {
  AUTHENTICATION_GOOGLE_REDIRECT_REQUEST,
  AUTHENTICATION_PROFILE_REQUEST,
  AUTHENTICATION_SIGN_IN_REQUEST,
} from '../constants';

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
  const { authentication_isLoading, authentication_token, authentication_userData } = storeToRefs(store);
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

      await authenticationSignIn_fetchAuthenticationProfile();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api authentication profile. We call the fetchAuthentication_profile function from the store to handle the request.
   */
  const authenticationSignIn_fetchAuthenticationProfile = async () => {
    try {
      let validationType;

      await store.fetchAuthentication_profile({
        ...httpAbort_registerAbort(AUTHENTICATION_PROFILE_REQUEST),
      });

      if (authentication_userData.value) {
        if (!authentication_userData.value.isVerified) {
          validationType = 'email-verification';
        }

        if (authentication_userData.value.usingPin) {
          validationType = 'set-up-pin';
        }
      }

      if (validationType) {
        router.push({
          name: 'sign-up',
          query: {
            email: authentication_userData.value?.email ?? authenticationSignIn_formData.email,
            type: validationType,
            token: authentication_token.value,
          },
        });
      } else {
        router.push({ name: 'outlet.list' });
      }
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
      await authenticationSignIn_fetchAuthenticationProfile();
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
