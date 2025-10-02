// Interfaces
import type { Validation } from '@vuelidate/core';
import type { ShallowRef } from 'vue';
import type { IAuthenticationStepper } from './index';

export interface IAuthenticationSignInFormData {
  email: string;
  username?: string;
  password: string;
  deviceType: 'DESKTOP' | 'MOBILE';
  browser: string;
  city: string;
  country: string;
  rememberMe: boolean;
}

export interface IAuthenticationSignInResponse {
  data: {
    accessToken: string;
  };
}

export interface IAuthenticationSignInProvided {
  authenticationSignIn_activeStep: Ref<number>;
  authenticationSignIn_detectLocationAndBrowser: () => Promise<void>;
  authenticationSignIn_fetchAuthenticationGoogleRedirect: () => Promise<unknown>;
  authenticationSignIn_fetchAuthenticationPermissions: () => Promise<unknown>;
  authenticationSignIn_formData: IAuthenticationSignInFormData;
  authenticationSignIn_formValidations: globalThis.Ref<Validation>;
  authenticationSignIn_handleLogout: () => Promise<void>;
  authenticationSignIn_isLoading: globalThis.Ref<boolean>;
  authenticationSignIn_isNotAuthenticated: globalThis.Ref<boolean>;
  authenticationSignIn_onSelectRole: (role: 'OWNER' | 'EMPLOYEE') => void;
  authenticationSignIn_onSsoWithGoogle: () => Promise<void>;
  authenticationSignIn_onSubmit: () => Promise<void>;
  authenticationSignIn_selectedRole: Ref<'OWNER' | 'EMPLOYEE'>;
  authenticationSignIn_stepper: ShallowRef<IAuthenticationStepper[]>;
}
