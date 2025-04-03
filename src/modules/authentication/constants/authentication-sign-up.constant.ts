// Components
import AuthenticationSignUpForm from '../components/AuthenticationSignUpForm.vue';
import AuthenticationSignUpOtpCode from '../components/AuthenticationSignUpOtpCode.vue';
import AuthenticationSignUpSetUpPin from '../components/AuthenticationSignUpSetUpPin.vue';
import AuthenticationSignUpVerifyPin from '../components/AuthenticationSignUpVerifyPin.vue';

export const AUTHENTICATION_SIGN_UP_STEPPER = [
  {
    id: 'form',
    title: 'Form',
    component: AuthenticationSignUpForm,
  },
  {
    id: 'otp-code',
    title: 'OTP Code',
    component: AuthenticationSignUpOtpCode,
  },
  {
    id: 'set-up-pin',
    title: 'Set Up PIN',
    component: AuthenticationSignUpSetUpPin,
  },
  {
    id: 'verify-pin',
    title: 'Verify PIN',
    component: AuthenticationSignUpVerifyPin,
  },
];
