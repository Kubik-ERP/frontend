// Constants
import { AUTHENTICATION_CONNECT_DEVICE_REQUEST } from '../constants';

// Interfaces
import type { IAuthenticationConnectDeviceFormData, IAuthenticationConnectDeviceProvided } from '../interfaces';

// Stores
import { useAuthenticationStore } from '../store';
import { useOutletStore } from '@/modules/outlet/store';

// Vuelidate
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAuthenticationConnectDeviceService = (): IAuthenticationConnectDeviceProvided => {
  /**
   * @description Injected variables
   */
  const store = useAuthenticationStore(); // Instance of the store
  const outletStore = useOutletStore(); // Instance of the outlet store
  const route = useRoute(); // Instance of the route
  const router = useRouter(); // Instance of the router
  const { authentication_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();
  const { outlet_currentOutlet } = storeToRefs(outletStore);

  /**
   * @description Reactive data binding
   */
  const authenticationConnectDevice_formData = reactive<IAuthenticationConnectDeviceFormData>({
    email: (route.query.email as string) || '',
    deviceCode: '',
    deviceType: 'DESKTOP',
    browser: '',
    city: '',
    country: '',
  });
  const authenticationConnectDevice_isNotAuthenticated = ref<boolean>(false);

  /**
   * @description Form validations
   */
  const authenticationConnectDevice_formRules = computed(() => ({
    email: { email, required },
    deviceCode: { required },
  }));
  const authenticationConnectDevice_formValidations = useVuelidate(
    authenticationConnectDevice_formRules,
    authenticationConnectDevice_formData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle business logic to detect location and browser information users.
   */
  const authenticationConnectDevice_detectLocationAndBrowser = async () => {
    try {
      // Get the browser information
      authenticationConnectDevice_formData.browser = window.navigator.userAgent;

      // Get the location information
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      authenticationConnectDevice_formData.city = data.city || '';
      authenticationConnectDevice_formData.country = data.country_name || '';
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to detect location and browser:', error.message);
      } else {
        console.error('Failed to detect location and browser:', String(error));
      }
    }
  };

  /**
   * @description Handle fetch api authentication staff login. We call the fetchAuthentication_staffLogin function from the store to handle the request.
   */
  const authenticationConnectDevice_fetchAuthenticationStaffLogin = async () => {
    try {
      const response = await store.fetchAuthentication_staffLogin(
        {
          ...authenticationConnectDevice_formData,
          deviceCode: authenticationConnectDevice_formData.deviceCode.toUpperCase(),
        },
        {
          ...httpAbort_registerAbort(AUTHENTICATION_CONNECT_DEVICE_REQUEST),
        },
      );

      if (response.data?.accessToken) {
        await authenticationConnectDevice_fetchAuthenticationProfile();
        await authenticationConnectDevice_fetchOutletDetail(response.data.storeId);
        await authenticationConnectDevice_fetchAuthenticationPermissions();

        // Navigate to dashboard or appropriate page
        await router.push({ name: 'dashboard' });
      }
    } catch (error: unknown) {
      authenticationConnectDevice_isNotAuthenticated.value = true;

      if (error instanceof Error) {
        console.error('Staff login failed:', error.message);
      } else {
        console.error('Staff login failed:', String(error));
      }
    }
  };

  /**
   * @description Handle fetch api authentication permissions. We call the fetchAuthentication_permissions function from the store to handle the request.
   */
  const authenticationConnectDevice_fetchAuthenticationPermissions = async () => {
    try {
      await store.fetchAuthentication_permissions({
        ...httpAbort_registerAbort(AUTHENTICATION_CONNECT_DEVICE_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to fetch permissions:', error.message);
      } else {
        console.error('Failed to fetch permissions:', String(error));
      }
    }
  };

  /**
   * @description Handle fetch api authentication profile. We call the fetchAuthentication_profile function from the store to handle the request.
   */
  const authenticationConnectDevice_fetchAuthenticationProfile = async () => {
    try {
      await store.fetchAuthentication_profile({
        ...httpAbort_registerAbort(AUTHENTICATION_CONNECT_DEVICE_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to fetch profile:', error.message);
      } else {
        console.error('Failed to fetch profile:', String(error));
      }
    }
  };

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_detail function from the store to handle the request.
   */
  const authenticationConnectDevice_fetchOutletDetail = async (storeId: string) => {
    try {
      const result = await outletStore.fetchOutlet_detail(storeId, {
        ...httpAbort_registerAbort(AUTHENTICATION_CONNECT_DEVICE_REQUEST),
      });

      outlet_currentOutlet.value = result.data || null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to fetch outlet detail:', error.message);
      } else {
        console.error('Failed to fetch outlet detail:', String(error));
      }
    }
  };

  /**
   * @description Handle action on submit form.
   */
  const authenticationConnectDevice_onSubmit = async (): Promise<void> => {
    authenticationConnectDevice_formValidations.value.$touch();
    if (authenticationConnectDevice_formValidations.value.$invalid) return;

    try {
      await authenticationConnectDevice_fetchAuthenticationStaffLogin();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Connect device submission failed:', error.message);
      } else {
        console.error('Connect device submission failed:', String(error));
      }
    }
  };

  /**
   * @description Handle side effects when the user fills the form.
   */
  watch(
    authenticationConnectDevice_formData,
    () => {
      if (authenticationConnectDevice_isNotAuthenticated.value) {
        authenticationConnectDevice_isNotAuthenticated.value = false;
      }
    },
    {
      deep: true,
    },
  );

  return {
    authenticationConnectDevice_detectLocationAndBrowser,
    authenticationConnectDevice_formData,
    authenticationConnectDevice_formValidations,
    authenticationConnectDevice_isLoading: authentication_isLoading,
    authenticationConnectDevice_isNotAuthenticated,
    authenticationConnectDevice_onSubmit,
  };
};
