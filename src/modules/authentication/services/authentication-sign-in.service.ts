// Constants
import {
  AUTHENTICATION_GOOGLE_REDIRECT_REQUEST,
  AUTHENTICATION_PERMISSIONS_REQUEST,
  AUTHENTICATION_PROFILE_REQUEST,
  AUTHENTICATION_SIGN_IN_REQUEST,
  AUTHENTICATION_SIGN_IN_STEPPER,
} from '../constants';

// Interfaces
import type {
  IAuthenticationSignInFormData,
  IAuthenticationSignInProvided,
  IAuthenticationStepper,
} from '../interfaces';

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
  const { authentication_isLoading, authentication_userData, authentication_rememberMe } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const authenticationSignIn_activeStep = ref<number>(0);
  const authenticationSignIn_formData = reactive<IAuthenticationSignInFormData>({
    email: '',
    password: '',
    deviceType: 'DESKTOP',
    browser: '',
    city: '',
    country: '',
    rememberMe: authentication_rememberMe.value,
  });
  const authenticationSignIn_isNotAuthenticated = ref<boolean>(false);
  const authenticationSignIn_selectedRole = ref<'OWNER' | 'EMPLOYEE'>('OWNER');
  const authenticationSignIn_stepper = shallowRef<IAuthenticationStepper[]>(AUTHENTICATION_SIGN_IN_STEPPER);

  /**
   * @description Form validations
   */
  const authenticationSignIn_formRules = computed(() => {
    const rules: Record<string, Record<string, unknown>> = {
      email: { email, required },
    };

    // Only require password for OWNER role
    if (authenticationSignIn_selectedRole.value === 'OWNER') {
      rules.password = { required };
    }

    return rules;
  });
  const authenticationSignIn_formValidations = useVuelidate(
    authenticationSignIn_formRules,
    authenticationSignIn_formData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle business logic to detect location and browser information users.
   */
  const authenticationSignIn_detectLocationAndBrowser = async () => {
    try {
      // Get the browser information
      authenticationSignIn_formData.browser = window.navigator.userAgent;

      // Get the location information
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      authenticationSignIn_formData.city = data.city || '';
      authenticationSignIn_formData.country = data.country_name || '';
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

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
   * @description Handle fetch api authentication permissions. We call the fetchAuthentication_permissions function from the store to handle the request.
   */
  const authenticationSignIn_fetchAuthenticationPermissions = async () => {
    try {
      await store.fetchAuthentication_permissions({
        ...httpAbort_registerAbort(AUTHENTICATION_PERMISSIONS_REQUEST),
      });
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

        if (!authentication_userData.value.usingPin) {
          validationType = 'set-up-pin';
        }
      }

      if (validationType) {
        // ? UNCOMMENT THIS CODE IF WE'LL ENABLE SIGN UP PAGE
        // router.push({
        //   name: 'sign-up',
        //   query: {
        //     email: authentication_userData.value?.email ?? authenticationSignIn_formData.email,
        //     type: validationType,
        //     token: authentication_token.value,
        //   },
        // });

        router.push({ name: 'outlet.list' });
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
   * @description Handle user role selection.
   */
  const authenticationSignIn_onSelectRole = (role: 'OWNER' | 'EMPLOYEE'): void => {
    authenticationSignIn_selectedRole.value = role;
    authenticationSignIn_activeStep.value = 1;
  };

  /**
   * @description Handle business logic to direct user to the sso authentication
   */
  const authenticationSignIn_onSsoWithGoogle = async (): Promise<void> => {
    // Update store with current rememberMe value before redirecting
    store.updateRememberMe(authenticationSignIn_formData.rememberMe);

    window.location.href = `${import.meta.env.VITE_APP_BASE_API_URL}${import.meta.env.VITE_APP_BASE_API_PREFIX}/authentication/google`;
  };

  /**
   * @description Handle logout functionality using the store method
   */
  const authenticationSignIn_handleLogout = async (): Promise<void> => {
    try {
      await store.handleLogout();
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
      if (authenticationSignIn_selectedRole.value === 'EMPLOYEE') {
        // For employee, redirect to connect device page with email
        await router.push({
          name: 'connect-device',
          query: { email: authenticationSignIn_formData.email },
        });
      } else {
        // For owner, proceed with normal login
        await authenticationSignIn_fetchAuthenticationSignIn();
        await authenticationSignIn_fetchAuthenticationProfile();
      }
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

  /**
   * @description Watch rememberMe changes and sync with store
   */
  watch(
    () => authenticationSignIn_formData.rememberMe,
    (newValue) => {
      store.updateRememberMe(newValue);
    },
  );

  /**
   * @description Watch store rememberMe changes and sync with form
   */
  watch(
    authentication_rememberMe,
    (newValue) => {
      authenticationSignIn_formData.rememberMe = newValue;
    },
  );

  return {
    authenticationSignIn_activeStep,
    authenticationSignIn_detectLocationAndBrowser,
    authenticationSignIn_fetchAuthenticationGoogleRedirect,
    authenticationSignIn_fetchAuthenticationPermissions,
    authenticationSignIn_formData,
    authenticationSignIn_formValidations,
    authenticationSignIn_handleLogout,
    authenticationSignIn_isLoading: authentication_isLoading,
    authenticationSignIn_isNotAuthenticated,
    authenticationSignIn_onSelectRole,
    authenticationSignIn_onSsoWithGoogle,
    authenticationSignIn_onSubmit,
    authenticationSignIn_selectedRole,
    authenticationSignIn_stepper,
  };
};
