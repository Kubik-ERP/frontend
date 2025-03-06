// Components
import AuthenticationRegisterForm from "../components/AuthenticationRegisterForm.vue"
import AuthenticationRegisterOtpCode from "../components/AuthenticationRegisterOtpCode.vue"

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