// Constants
import {
  AUTHENTICATION_SIGN_UP_REQUEST,
  AUTHENTICATION_REGISTER_STEPPER,
  AUTHENTICATION_SEND_OTP_REQUEST,
} from '../constants';
import { IAuthenticationSendOtpFormData, IAuthenticationVerifyOtpFormData } from '../interfaces';

// Interfaces
import type {
  IAuthenticationSignUpFormData,
  IAuthenticationSignUpProvided,
  IAuthenticationStepper,
} from '../interfaces';

// Stores
import { useAuthenticationStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { email, required, sameAs } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAuthenticationRegisterService = (): IAuthenticationSignUpProvided => {
  /**
   * @description Injected variables
   */
  const router = useRouter(); // Instance of the router
  const store = useAuthenticationStore(); // Instance of the store
  const { authentication_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const authenticationSignUp_activeStep = ref<number>(0);
  const authenticationSignUp_durationOtp = ref<number>(0);
  const authenticationSignUp_formData = reactive<IAuthenticationSignUpFormData>({
    email: '',
    phoneCountryCode: '+62',
    phoneNumber: '',
    password: '',
    passwordConfirmation: '',
  });
  const authenticationSignUp_isAcceptTnc = ref<boolean>(false);
  const authenticationSignUp_maskedPhoneNumber = ref<string>('');
  const authenticationSignUp_stepper = shallowRef<IAuthenticationStepper[]>(AUTHENTICATION_REGISTER_STEPPER);
  const authenticationSignUp_verifyOtpFormData = reactive<IAuthenticationVerifyOtpFormData>({
    email: '',
    otp: '',
    type: 'REGISTER',
  });

  /**
   * @description Form validations
   */
  const authenticationSignUp_formRules = computed(() => ({
    email: { email, required },
    phoneCountryCode: { required, isPhoneCodeValid: isPhoneCodeValid },
    phoneNumber: { required, isPhoneNumberValid: isPhoneNumberValid },
    password: { required, isPasswordValid },
    passwordConfirmation: { required, sameAs: sameAs(authenticationSignUp_formData.password) },
  }));
  const authenticationSignUp_formRulesOfVerifyOtp = computed(() => ({
    otp: { required },
  }));

  const authenticationSignUp_formValidations = useVuelidate(
    authenticationSignUp_formRules,
    authenticationSignUp_formData,
    {
      $autoDirty: true,
    },
  );
  const authenticationSignUp_formValidationsOfVerifyOtp = useVuelidate(
    authenticationSignUp_formRulesOfVerifyOtp,
    authenticationSignUp_verifyOtpFormData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle business logic for formatting duration otp.
   */
  const authenticationSignUp_durationOtpFormatted = computed(() => {
    try {
      const minutes = Math.floor(authenticationSignUp_durationOtp.value / 60);
      const seconds = authenticationSignUp_durationOtp.value % 60;

      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } catch (error) {
      console.error(error, 'error');
    }
  });

  /**
   * @description Handle business logic for masking phone numbers.
   */
  const authenticationSignUp_maskPhoneNumber = () => {
    const phoneNumber = authenticationSignUp_formData.phoneNumber;
    const maskedPhoneNumber =
      phoneNumber.substring(0, 3) + '******' + phoneNumber.substring(phoneNumber.length - 2);
    authenticationSignUp_maskedPhoneNumber.value = maskedPhoneNumber;
  };

  /**
   * @description Handle business logic to start countdown otp.
   */
  const authenticationSignUp_startCountdownOtp = () => {
    if (authenticationSignUp_durationOtp.value === 0) {
      return;
    }

    const interval = setInterval(() => {
      authenticationSignUp_durationOtp.value -= 1;
      if (authenticationSignUp_durationOtp.value <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  /**
   * @description Handle fetch api authentication sign up. We call the fetchAuthentication_sendOtp function from the store to handle the request.
   */
  const authenticationSignUp_fetchAuthenticationSendOtp = async () => {
    try {
      const payload: IAuthenticationSendOtpFormData = {
        email: authenticationSignUp_formData.email,
      };

      await store.fetchAuthentication_sendOtp(payload, {
        ...httpAbort_registerAbort(AUTHENTICATION_SEND_OTP_REQUEST),
      });

      authenticationSignUp_durationOtp.value = 60 * 5; // 5 minutes
      authenticationSignUp_startCountdownOtp();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api authentication sign up. We call the fetchAuthentication_signUp function from the store to handle the request.
   */
  const authenticationSignUp_fetchAuthenticationSignUp = async () => {
    try {
      await store.fetchAuthentication_signUp(
        {
          ...authenticationSignUp_formData,
          phoneCountryCode: authenticationSignUp_formData.phoneCountryCode.replace('+', ''),
        },
        {
          ...httpAbort_registerAbort(AUTHENTICATION_SIGN_UP_REQUEST),
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api authentication sign up. We call the fetchAuthentication_verifyOtp function from the store to handle the request.
   */
  const authenticationSignUp_fetchAuthenticationVerifyOtp = async () => {
    try {
      await store.fetchAuthentication_verifyOtp(authenticationSignUp_verifyOtpFormData, {
        ...httpAbort_registerAbort(AUTHENTICATION_SEND_OTP_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic to resend otp.
   */
  const authenticationSignUp_onResendOtp = async () => {
    await authenticationSignUp_fetchAuthenticationSendOtp();
  };

  /**
   * @description Handle action on submit form.
   */
  const authenticationSignUp_onSubmit = async (): Promise<void> => {
    if (authenticationSignUp_activeStep.value === 0) {
      authenticationSignUp_formValidations.value.$touch();
      if (authenticationSignUp_formValidations.value.$invalid) return;
    } else {
      authenticationSignUp_formValidationsOfVerifyOtp.value.$touch();
      if (authenticationSignUp_formValidationsOfVerifyOtp.value.$invalid) return;
    }

    try {
      if (authenticationSignUp_activeStep.value === 0) {
        await authenticationSignUp_fetchAuthenticationSignUp();
        await authenticationSignUp_fetchAuthenticationSendOtp();
        authenticationSignUp_maskPhoneNumber();
        authenticationSignUp_activeStep.value = 1;
      } else {
        authenticationSignUp_verifyOtpFormData.email = authenticationSignUp_formData.email;

        await authenticationSignUp_fetchAuthenticationVerifyOtp();
        router.push({ name: 'sign-in' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    authenticationSignUp_activeStep,
    authenticationSignUp_durationOtpFormatted,
    authenticationSignUp_formData,
    authenticationSignUp_formValidations,
    authenticationSignUp_formValidationsOfVerifyOtp,
    authenticationSignUp_isAcceptTnc,
    authenticationSignUp_isLoading: authentication_isLoading,
    authenticationSignUp_maskedPhoneNumber,
    authenticationSignUp_stepper,
    authenticationSignUp_onResendOtp,
    authenticationSignUp_onSubmit,
    authenticationSignUp_verifyOtpFormData,
  };
};
