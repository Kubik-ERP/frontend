// Interfaces
import type { Validation } from '@vuelidate/core';
import type { ShallowRef } from 'vue';
import type { IAuthenticationStepper } from './index';

export interface IAuthenticationSignUpSetUpPinFormData {
  pin: string;
}

export interface IAuthenticationSignUpVerifyPinFormData {
  pinConfirmation: string;
}

export interface IAuthenticationVerifyOtpFormData {
  email: string;
  otp: string;
  type: string;
}

export interface IAuthenticationSignUpFormData {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
}

export interface IAuthenticationSignUpProvided {
  authenticationSignUp_activeStep: Ref<number>;
  authenticationSignUp_durationOtpFormatted: globalThis.ComputedRef<string | undefined>;
  authenticationSignUp_formData: IAuthenticationSignUpFormData;
  authenticationSignUp_formDataOfSetUpPin: IAuthenticationSignUpSetUpPinFormData;
  authenticationSignUp_formDataOfVerifyOtp: IAuthenticationVerifyOtpFormData;
  authenticationSignUp_formDataOfVerifyPin: IAuthenticationSignUpVerifyPinFormData;
  authenticationSignUp_formValidations: globalThis.Ref<Validation>;
  authenticationSignUp_formValidationsOfSetUpPin: globalThis.Ref<Validation>;
  authenticationSignUp_formValidationsOfVerifyOtp: globalThis.Ref<Validation>;
  authenticationSignUp_formValidationsOfVerifyPin: globalThis.Ref<Validation>;
  authenticationSignUp_isAcceptTnc: Ref<boolean>;
  authenticationSignUp_isLoading: globalThis.Ref<boolean>;
  authenticationSignUp_maskedEmail: Ref<string>;
  authenticationSignUp_stepper: ShallowRef<IAuthenticationStepper[]>;
  authenticationSignUp_onResendOtp: () => Promise<void>;
  authenticationSignUp_onSubmit: () => Promise<void>;
}
