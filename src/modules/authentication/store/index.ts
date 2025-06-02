// Constants
import {
  AUTHENTICATION_ENDPOINT_GOOGLE_REDIRECT,
  AUTHENTICATION_ENDPOINT_PIN,
  AUTHENTICATION_ENDPOINT_PROFILE,
  AUTHENTICATION_ENDPOINT_RESET_PASSWORD,
  AUTHENTICATION_ENDPOINT_SEND_OTP,
  AUTHENTICATION_ENDPOINT_SIGN_IN,
  AUTHENTICATION_ENDPOINT_SIGN_UP,
  AUTHENTICATION_ENDPOINT_VERIFY_OTP,
} from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { LocationQuery } from 'vue-router';
import type {
  IAuthenticationCreateNewPasswordFormData,
  IAuthenticationResetPasswordFormData,
  IAuthenticationVerifyOtpFormData,
  IAuthenticationSignInFormData,
  IAuthenticationSignUpFormData,
  IAuthenticationStateStore,
  IAuthenticationSendOtpFormData,
  IAuthenticationSignInResponse,
  IAuthenticationProfile,
} from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useAuthenticationStore = defineStore('authentication', {
  state: (): IAuthenticationStateStore => ({
    authentication_isLoading: false,
    authentication_token: '',
    authentication_userData: null,
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
     * @description Handle fetch api authentication reset password.
     * @url /authentication/profile
     * @method GET
     * @access public
     */
    async fetchAuthentication_profile(requestConfigurations: AxiosRequestConfig): Promise<IAuthenticationProfile> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.get<IAuthenticationProfile>(AUTHENTICATION_ENDPOINT_PROFILE, {
          ...requestConfigurations,
        });

        this.authentication_userData = response.data;

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
     * @url /authentication/forgot-password
     * @method POST
     * @access public
     */
    async fetchAuthentication_resetPassword(
      pin: string,
      payload: IAuthenticationResetPasswordFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.authentication_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(AUTHENTICATION_ENDPOINT_RESET_PASSWORD, payload, {
          headers: {
            pin: pin,
          },
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
  },
  persist: {
    key: 'authentication',
    pick: ['authentication_token'],
    storage: sessionStorage,
  },
});
