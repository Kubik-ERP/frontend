export * from './authentication-create-new-password.interface';
export * from './authentication-reset-password.interface';
export * from './authentication-sign-in.interface';
export * from './authentication-sign-up.interface';

export interface IAuthenticationStateStore {
  authentication_isLoading: boolean;
  authentication_token: string;
  authentication_userData: unknown;
}

export interface IAuthenticationSendOtpFormData {
  email: string;
}

export interface IAuthenticationStepper {
  id: string;
  title: string;
  component: unknown;
}

export interface IAuthenticationVerifyOtpFormData {
  email: string;
  otp: string;
  type: string;
}
