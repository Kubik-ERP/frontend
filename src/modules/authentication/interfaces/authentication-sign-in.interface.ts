// Interfaces
import type { Validation } from '@vuelidate/core';

export interface IAuthenticationSignInFormData {
  email: string;
  password: string;
}

export interface IAuthenticationSignInProvided {
  authenticationSignIn_formData: IAuthenticationSignInFormData;
  authenticationSignIn_formValidations: globalThis.Ref<Validation>;
  authenticationSignIn_isLoading: globalThis.Ref<boolean>;
  authenticationSignIn_onSubmit: () => Promise<void>;
}
