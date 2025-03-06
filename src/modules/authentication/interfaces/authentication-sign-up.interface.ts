// Interfaces
import type { Validation } from '@vuelidate/core';
import type { ShallowRef } from 'vue';

export interface IAuthenticationSignUpStepper {
  id: string;
  title: string;
  component: unknown;
}

export interface IAuthenticationSignUpFormData {
  email: string;
  phoneCode: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
}

export interface IAuthenticationSignUpProvided {
  authenticationSignUp_activeStep: Ref<number>;
  authenticationSignUp_formData: IAuthenticationSignUpFormData;
  authenticationSignUp_formValidations: globalThis.Ref<Validation>;
  authenticationSignUp_isAcceptTnc: Ref<boolean>;
  authenticationSignUp_isLoading: globalThis.Ref<boolean>;
  authenticationSignUp_stepper: ShallowRef<IAuthenticationSignUpStepper[]>;
  authenticationSignUp_onSubmit: () => Promise<void>;
}
