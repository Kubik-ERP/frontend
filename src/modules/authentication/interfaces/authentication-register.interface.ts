// Interfaces
import type { Validation } from '@vuelidate/core';
import type { ShallowRef } from 'vue';

export interface IAuthenticationRegisterStepper {
  id: string;
  title: string;
  component: unknown;
}

export interface IAuthenticationRegisterFormData {
  email: string;
  phoneCode: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
}

export interface IAuthenticationRegisterProvided {
  authenticationRegister_activeStep: Ref<number>;
  authenticationRegister_formData: IAuthenticationRegisterFormData;
  authenticationRegister_formValidations: globalThis.Ref<Validation>;
  authenticationRegister_isAcceptTnc: Ref<boolean>;
  authenticationRegister_isLoading: globalThis.Ref<boolean>;
  authenticationRegister_stepper: ShallowRef<IAuthenticationRegisterStepper[]>;
  authenticationRegister_onSubmit: () => Promise<void>;
}
