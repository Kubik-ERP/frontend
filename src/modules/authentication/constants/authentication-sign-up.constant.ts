// Components
import AuthenticationRegisterForm from "../components/AuthenticationSignUpForm.vue"
import AuthenticationRegisterOtpCode from "../components/AuthenticationSignUpOtpCode.vue"

export const AUTHENTICATION_REGISTER_STEPPER = [
  {
    id: "form",
    title: "Form",
    component: AuthenticationRegisterForm,
  },
  {
    id: "otp-code",
    title: "OTP Code",
    component: AuthenticationRegisterOtpCode,
  },
]