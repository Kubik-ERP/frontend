// Components
import AuthenticationResetPasswordForm from '../components/AuthenticationResetPasswordForm.vue';
import AuthenticationResetPasswordOtpCode from '../components/AuthenticationResetPasswordOtpCode.vue';

export const AUTHENTICATION_RESET_PASSWORD_STEPPER = [
  {
    id: 'form',
    title: 'Form',
    component: AuthenticationResetPasswordForm,
  },
  {
    id: 'otp-code',
    title: 'OTP Code',
    component: AuthenticationResetPasswordOtpCode,
  },
];
