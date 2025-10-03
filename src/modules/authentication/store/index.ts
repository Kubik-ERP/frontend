// Constants
import {
  AUTHENTICATION_BASE_PERMISSIONS_ENDPOINT,
  AUTHENTICATION_ENDPOINT_GOOGLE_REDIRECT,
  AUTHENTICATION_ENDPOINT_PIN,
  AUTHENTICATION_ENDPOINT_PROFILE,
  AUTHENTICATION_ENDPOINT_RESET_PASSWORD,
  AUTHENTICATION_ENDPOINT_SEND_OTP,
  AUTHENTICATION_ENDPOINT_SIGN_IN,
  AUTHENTICATION_ENDPOINT_SIGN_UP,
  AUTHENTICATION_ENDPOINT_STAFF_LOGIN,
  AUTHENTICATION_ENDPOINT_STAFF_LOGOUT,
  AUTHENTICATION_ENDPOINT_VERIFY_OTP,
} from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { LocationQuery } from 'vue-router';
import type {
  IAuthenticationConnectDeviceFormData,
  IAuthenticationConnectDeviceResponse,
  IAuthenticationCreateNewPasswordFormData,
  IAuthenticationResetPasswordFormData,
  IAuthenticationVerifyOtpFormData,
  IAuthenticationSignInFormData,
  IAuthenticationSignUpFormData,
  IAuthenticationStateStore,
  IAuthenticationSendOtpFormData,
  IAuthenticationSignInResponse,
  IAuthenticationProfile,
  IAuthenticationPermissionResponse,
} from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useAuthenticationStore = defineStore('authentication', {
  state: (): IAuthenticationStateStore => ({
    authentication_isLoading: false,
    authentication_isStaff: false,
    authentication_permissions: [],
    authentication_token: '',
    authentication_userData: null as IAuthenticationProfile | null,
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api authentication create new password.
     * @url /authentication/forgot-password
     * @method PUT
     * @access public
     */
    async fetchAuthentication_createNewPassword(
      payload: IAuthenticationCreateNewPasswordFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.put<unknown>(AUTHENTICATION_ENDPOINT_RESET_PASSWORD, payload, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.authentication_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api authentication google redirect.
     * @url /authentication/google/redirect?{restQueryParams}
     * @method GET
     * @access public
     */
    async fetchAuthentication_googleRedirect(
      restQueryParams: LocationQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IAuthenticationSignInResponse> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.get<IAuthenticationSignInResponse>(
          AUTHENTICATION_ENDPOINT_GOOGLE_REDIRECT,
          {
            params: restQueryParams,
            ...requestConfigurations,
          },
        );

        this.authentication_token = response.data.data.accessToken;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.authentication_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api authentication permissions.
     * @url /permissions/me
     * @method GET
     * @access public
     */
    async fetchAuthentication_permissions(
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IAuthenticationPermissionResponse> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.get<IAuthenticationPermissionResponse>(
          AUTHENTICATION_BASE_PERMISSIONS_ENDPOINT,
          {
            ...requestConfigurations,
          },
        );

        this.authentication_permissions = response.data.data;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.authentication_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api authentication reset password.
     * @url /authentication/profile
     * @method GET
     * @access public
     */
    async fetchAuthentication_profile(requestConfigurations: AxiosRequestConfig): Promise<IAuthenticationProfile> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.get<{ data: IAuthenticationProfile }>(AUTHENTICATION_ENDPOINT_PROFILE, {
          ...requestConfigurations,
        });
        this.authentication_userData = {
          ...response.data.data,
          isAccessRetail: response.data.data.isAccessRetail ?? true,
        };

        return Promise.resolve(response.data.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.authentication_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api authentication reset password.
     * @url /authentication/forgot-password
     * @method POST
     * @access public
     */
    async fetchAuthentication_resetPassword(
      // pin: string,
      payload: IAuthenticationResetPasswordFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(AUTHENTICATION_ENDPOINT_RESET_PASSWORD, payload, {
          // headers: {
          //   pin: pin,
          // },
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.authentication_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api authentication send otp.
     * @url /authentication/otp/generate
     * @method POST
     * @access public
     */
    async fetchAuthentication_sendOtp(
      payload: IAuthenticationSendOtpFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(AUTHENTICATION_ENDPOINT_SEND_OTP, payload, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.authentication_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api authentication pin.
     * @url /authentication/pin/${type}
     * @method POST
     * @access public
     */
    async fetchAuthentication_pin(
      type: 'set' | 'unset',
      payload: ISetUnsetPin,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(`${AUTHENTICATION_ENDPOINT_PIN}/${type}`, payload, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.authentication_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api authentication sign in.
     * @url /authentication/login
     * @method POST
     * @access public
     */
    async fetchAuthentication_signIn(
      payload: IAuthenticationSignInFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IAuthenticationSignInResponse> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.post<IAuthenticationSignInResponse>(
          AUTHENTICATION_ENDPOINT_SIGN_IN,
          payload,
          {
            ...requestConfigurations,
          },
        );
        this.authentication_token = response.data.data.accessToken;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.authentication_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api authentication sign up.
     * @url /authentication/register
     * @method POST
     * @access public
     */
    async fetchAuthentication_signUp(
      payload: IAuthenticationSignUpFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IAuthenticationSignInResponse> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.post<IAuthenticationSignInResponse>(
          AUTHENTICATION_ENDPOINT_SIGN_UP,
          payload,
          {
            ...requestConfigurations,
          },
        );

        this.authentication_token = response.data.data.accessToken;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.authentication_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api authentication staff login.
     * @url /authentication/staff/login
     * @method POST
     * @access public
     */
    async fetchAuthentication_staffLogin(
      payload: IAuthenticationConnectDeviceFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IAuthenticationConnectDeviceResponse> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.post<IAuthenticationConnectDeviceResponse>(
          AUTHENTICATION_ENDPOINT_STAFF_LOGIN,
          payload,
          {
            ...requestConfigurations,
          },
        );

        // Store the token and user data if successful
        if (response.data.data?.accessToken) {
          this.authentication_token = response.data.data.accessToken;
          this.authentication_isStaff = true;
        }

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.authentication_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api authentication staff logout.
     * @url /authentication/staff/logout
     * @method POST
     * @access public
     */
    async fetchAuthentication_staffLogout(requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(AUTHENTICATION_ENDPOINT_STAFF_LOGOUT, null, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.authentication_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api authentication verify otp.
     * @url /authentication/otp/verify
     * @method POST
     * @access public
     */
    async fetchAuthentication_verifyOtp(
      payload: IAuthenticationVerifyOtpFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(AUTHENTICATION_ENDPOINT_VERIFY_OTP, payload, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.authentication_isLoading = false;
      }
    },

    /**
     * @description Handle logout functionality for both staff and regular users.
     * For staff users, it will call the staff logout API before clearing local storage.
     * For regular users, it will only clear local storage.
     * @access public
     */
    async handleLogout(requestConfigurations?: AxiosRequestConfig): Promise<void> {
      try {
        // Check if user is staff by looking at local storage
        const userDataRaw = localStorage.getItem('authentication');
        let isStaff = false;

        if (userDataRaw) {
          const userData = JSON.parse(userDataRaw);
          isStaff = userData?.authentication_userData?.isStaff;
        }

        // If user is staff, call the staff logout API
        if (isStaff) {
          try {
            await this.fetchAuthentication_staffLogout({
              ...requestConfigurations,
            });
          } catch (error) {
            // Log the error but don't prevent logout from continuing
            console.error('Staff logout API failed:', error);
          }
        }

        // Clear authentication state
        this.authentication_token = '';
        this.authentication_userData = null;
        this.authentication_permissions = [];

        // Clear local storage
        localStorage.removeItem('authentication');
        localStorage.removeItem('outlet');

        // Redirect to login page
        window.location.href = '/authentication/sign-in';
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Logout error:', error);
        } else {
          console.error('Logout error:', String(error));
        }

        // Even if there's an error, still clear local storage and redirect
        localStorage.removeItem('authentication');
        localStorage.removeItem('outlet');
        window.location.href = '/authentication/sign-in';
      }
    },
  },
  persist: {
    key: 'authentication',
    pick: [
      'authentication_isStaff',
      'authentication_permissions',
      'authentication_token',
      'authentication_userData',
    ],
    storage: localStorage,
  },
});
