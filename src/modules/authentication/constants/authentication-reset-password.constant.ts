// Components
import AuthenticationResetPasswordForm from '../components/AuthenticationResetPasswordForm.vue';
import AuthenticationResetPasswordPinVerification from '../components/AuthenticationResetPasswordPinVerification.vue';

export const AUTHENTICATION_RESET_PASSWORD_STEPPER = [
  {
    id: 'form',
    title: 'Form',
    component: AuthenticationResetPasswordForm,
  },
  {
    id: 'pin-verification',
    title: 'PIN Verification',
    component: AuthenticationResetPasswordPinVerification,
  },
];
