// Interfaces
import type { Validation } from '@vuelidate/core';
import type { ShallowRef } from 'vue';
import { IAuthenticationStepper, IAuthenticationVerifyOtpFormData } from './index';

export interface IAuthenticationResetPasswordFormData {
  email: string;
}

export interface IAuthenticationResetPasswordProvided {
  authenticationResetPassword_activeStep: Ref<number>;
  authenticationResetPassword_formData: IAuthenticationResetPasswordFormData;
  authenticationResetPassword_formValidations: globalThis.Ref<Validation>;
  authenticationResetPassword_formValidationsOfVerifyOtp: globalThis.Ref<Validation>;
  authenticationResetPassword_isLoading: globalThis.Ref<boolean>;
  authenticationResetPassword_isSuccess: Ref<boolean>;
  authenticationResetPassword_onSubmit: () => Promise<void>;
  authenticationResetPassword_stepper: ShallowRef<IAuthenticationStepper[]>;
  authenticationResetPassword_verifyOtpFormData: IAuthenticationVerifyOtpFormData;
}
