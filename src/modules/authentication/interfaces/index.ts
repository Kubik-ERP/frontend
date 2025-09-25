export * from './authentication-connect-device.interface';
export * from './authentication-create-new-password.interface';
export * from './authentication-reset-password.interface';
export * from './authentication-sign-in.interface';
export * from './authentication-sign-up.interface';

export interface IAuthenticationProfile {
  fullname: string;
  usingPin: boolean;
  email: string;
  phone: string;
  isVerified: boolean;
  limitStore: number;
  id: number;
  roles: {
    id: number;
    name: string;
  };
  isAccessRetail: boolean | null;
}

export interface IAuthenticationPermissionResponse extends IDefaultResponseFetch {
  data: string[];
}

export interface IAuthenticationStateStore {
  authentication_isLoading: boolean;
  authentication_isStaff: boolean;
  authentication_permissions: string[];
  authentication_token: string;
  authentication_userData: IAuthenticationProfile | null;
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

export interface ISetUnsetPin {
  pin: string;
}

export interface ISetUnsetPin {
  pin: string;
}
