// Axios
import axios, { type InternalAxiosRequestConfig, type AxiosInstance, type AxiosError } from 'axios';

// Constants
import { EToastPosition, EToastType } from '@/app/constants/toast.constant';

// Stores
import { useAuthenticationStore } from '@/modules/authentication/store';
import { useOutletStore } from '@/modules/outlet/store';

// MITT
import eventBus from '../mitt';

const httpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL
    ? `${import.meta.env.VITE_APP_BASE_API_URL}${import.meta.env.VITE_APP_BASE_API_PREFIX}`
    : '/api',
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  /**
   * @description Injected variables
   */
  const authenticationStore = useAuthenticationStore();
  const { authentication_token } = storeToRefs(authenticationStore);

  const outletStore = useOutletStore();
  const { outlet_currentOutlet, outlet_selectedOutletOnAccountPage } = storeToRefs(outletStore);

  if (authentication_token.value) {
    config.headers.Authorization = `Bearer ${authentication_token.value}`;
  }

  if (outlet_selectedOutletOnAccountPage.value) {
    config.headers['X-STORE-ID'] = outlet_selectedOutletOnAccountPage.value.id;
  } else if (outlet_currentOutlet?.value) {
    config.headers['X-STORE-ID'] = outlet_currentOutlet.value.id;
  }

  return config;
});

httpClient.interceptors.response.use(undefined, (error: AxiosError<{ message?: string }>) => {
  /**
   * @description Here's we can handle various errors.
   */
  switch (error.response?.status) {
    case 400:
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        message: error.response?.data?.message ?? 'Bad Request',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.DANGER,
      });
      break;
    case 401:
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        message: error.response?.data?.message ?? 'Unauthorized',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.DANGER,
      });

      // Remove the persisted states
      localStorage.removeItem('authentication');
      localStorage.removeItem('outlet');

      // // Redirect to sign-in page
      window.location.href = '/authentication/sign-in';

      break;
    case 500:
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        message: error.response?.data?.message ?? 'Internal Server Error',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.DANGER,
      });
      break;
    default:
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        message: error.response?.data?.message ?? 'Something went wrong',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.DANGER,
      });
      break;
  }

  if (error instanceof Error) {
    return Promise.reject(error);
  } else {
    return Promise.reject(new Error(String(error)));
  }
});

export default httpClient;
