// Interfaces
import type { Validation } from '@vuelidate/core';

export interface IAuthenticationSignInFormData {
  email: string;
  username?: string;
  password: string;
  deviceType: 'DESKTOP' | 'MOBILE';
  browser: string;
  city: string;
  country: string;
}

export interface IAuthenticationSignInResponse {
  data: {
    accessToken: string;
  };
}

export interface IAuthenticationSignInProvided {
  authenticationSignIn_detectLocationAndBrowser: () => Promise<void>;
  authenticationSignIn_fetchAuthenticationGoogleRedirect: () => Promise<unknown>;
  authenticationSignIn_formData: IAuthenticationSignInFormData;
  authenticationSignIn_formValidations: globalThis.Ref<Validation>;
  authenticationSignIn_isLoading: globalThis.Ref<boolean>;
  authenticationSignIn_isNotAuthenticated: globalThis.Ref<boolean>;
  authenticationSignIn_onSsoWithGoogle: () => Promise<void>;
  authenticationSignIn_onSubmit: () => Promise<void>;
}
