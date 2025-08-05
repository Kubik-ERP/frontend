// Constants
import {
  AUTHENTICATION_SIGN_UP_REQUEST,
  AUTHENTICATION_SIGN_UP_STEPPER,
  AUTHENTICATION_SEND_OTP_REQUEST,
} from '../constants';
import { IAuthenticationVerifyOtpFormData } from '../interfaces';

// Interfaces
import type {
  IAuthenticationSendOtpFormData,
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
  const route = useRoute(); // Instance of the route
  // const router = useRouter(); // Instance of the router
  const store = useAuthenticationStore(); // Instance of the store
  const { authentication_isLoading, authentication_token } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const authenticationSignUp_activeStep = ref<number>(2);
  const authenticationSignUp_durationOtp = ref<number>(0);
  const authenticationSignUp_formData = reactive<IAuthenticationSignUpFormData>({
    fullName: '',
    email: '',
    phoneCountryCode: '+62',
    phoneNumber: '',
    password: '',
    passwordConfirmation: '',
  });
  const authenticationSignUp_formDataOfSetUpPin = reactive<IAuthenticationSetUpPinFormData>({
    pin: '',
  });
  const authenticationSignUp_formDataOfVerifyOtp = reactive<IAuthenticationVerifyOtpFormData>({
    email: '',
    otp: '',
    type: 'REGISTER',
  });
  const authenticationSignUp_formDataOfVerifyPin = reactive<IAuthenticationVerifyPinFormData>({
    pinConfirmation: '',
  });
  const authenticationSignUp_isAcceptTnc = ref<boolean>(false);
  const authenticationSignUp_maskedEmail = ref<string>('');
  const authenticationSignUp_stepper = shallowRef<IAuthenticationStepper[]>(AUTHENTICATION_SIGN_UP_STEPPER);

  /**
   * @description Form validations
   */
  const authenticationSignUp_formRules = computed(() => ({
    fullName: { required },
    email: { email, required },
    phoneCountryCode: { required, isPhoneCodeValid: isPhoneCodeValid },
    phoneNumber: { required, isPhoneNumberValid: isPhoneNumberValid },
    password: { required, isPasswordValid },
    passwordConfirmation: { required, sameAs: sameAs(authenticationSignUp_formData.password) },
  }));
  const authenticationSignUp_formRulesOfVerifyOtp = computed(() => ({
    otp: { required },
  }));
  const authenticationSignUp_formRulesOfSetUpPin = computed(() => ({
    pin: { required },
  }));
  const authenticationSignUp_formRulesOfVerifyPin = computed(() => ({
    pinConfirmation: {
      required,
      sameAs: sameAs(authenticationSignUp_formDataOfSetUpPin.pin),
    },
  }));

  const authenticationSignUp_formValidations = useVuelidate(
    authenticationSignUp_formRules,
    authenticationSignUp_formData,
    {
      $autoDirty: true,
    },
  );
  const authenticationSignUp_formValidationsOfSetUpPin = useVuelidate(
    authenticationSignUp_formRulesOfSetUpPin,
    authenticationSignUp_formDataOfSetUpPin,
    {
      $autoDirty: true,
    },
  );
  const authenticationSignUp_formValidationsOfVerifyOtp = useVuelidate(
    authenticationSignUp_formRulesOfVerifyOtp,
    authenticationSignUp_formDataOfVerifyOtp,
    {
      $autoDirty: true,
    },
  );
  const authenticationSignUp_formValidationsOfVerifyPin = useVuelidate(
    authenticationSignUp_formRulesOfVerifyPin,
    authenticationSignUp_formDataOfVerifyPin,
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
  const authenticationSignUp_maskEmail = () => {
    const email = authenticationSignUp_formData.email;
    const maskedEmail = email.replace(/(.{2})(.*)(.{2}@.*)/, (match, p1, p2, p3) => {
      console.log(match);

      return `${p1}${'*'.repeat(p2.length)}${p3}`;
    });

    authenticationSignUp_maskedEmail.value = maskedEmail;
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

      authenticationSignUp_activeStep.value += 1;
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
   * @description Handle fetch api authentication sign up. We call the fetchAuthentication_pin function from the store to handle the request.
   */
  const authenticationSignUp_fetchAuthenticationSetUpPin = async () => {
    try {
      const payload: ISetUnsetPin = {
        pin: authenticationSignUp_formDataOfSetUpPin.pin,
        pinConfirmation: authenticationSignUp_formDataOfVerifyPin.pinConfirmation,
      };

      await store.fetchAuthentication_pin('set', payload, {
        ...httpAbort_registerAbort(AUTHENTICATION_SIGN_UP_REQUEST),
      });

      // router.push({ name: 'sign-in' });
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

      authenticationSignUp_fetchAuthenticationSendOtp();
      authenticationSignUp_maskEmail();
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
      await store.fetchAuthentication_verifyOtp(
        {
          ...authenticationSignUp_formDataOfVerifyOtp,
          email: authenticationSignUp_formData.email,
        },
        {
          ...httpAbort_registerAbort(AUTHENTICATION_SEND_OTP_REQUEST),
        },
      );

      authenticationSignUp_activeStep.value += 1;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle dynamic validation for forms
   */
  const authenticationSignUp_dynamicValidation = (): void => {
    switch (authenticationSignUp_activeStep.value) {
      case 0:
        authenticationSignUp_formValidations.value.$touch();
        if (authenticationSignUp_formValidations.value.$invalid) return;
        break;
      case 1:
        authenticationSignUp_formValidationsOfVerifyOtp.value.$touch();
        if (authenticationSignUp_formValidationsOfVerifyOtp.value.$invalid) return;
        break;
      case 2:
        authenticationSignUp_formValidationsOfSetUpPin.value.$touch();
        if (authenticationSignUp_formValidationsOfSetUpPin.value.$invalid) return;
        break;
      case 3:
        authenticationSignUp_formValidationsOfVerifyPin.value.$touch();
        if (authenticationSignUp_formValidationsOfVerifyPin.value.$invalid) return;
        break;
      default:
        break;
    }
  };

  /**
   * @description Handle dynamic business logic for forms
   */
  const authenticationSignUp_dynamicBusinessLogic = (): void => {
    switch (authenticationSignUp_activeStep.value) {
      case 0:
        authenticationSignUp_fetchAuthenticationSignUp();

        break;
      case 1:
        authenticationSignUp_fetchAuthenticationVerifyOtp();

        break;
      case 2:
        authenticationSignUp_activeStep.value += 1;

        break;
      case 3:
        authenticationSignUp_fetchAuthenticationSetUpPin();

        break;
      default:
        break;
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
    authenticationSignUp_dynamicValidation();

    try {
      authenticationSignUp_dynamicBusinessLogic();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for verifying user
   */
  const authenticationSignUp_verifyUser = (): void => {
    const email = route.query.email as string;
    const token = route.query.token as string;
    const type = route.query.type as string;

    if (email && token) {
      authenticationSignUp_formData.email = email;
      authentication_token.value = token;

      switch (type) {
        case 'email-verification':
          authenticationSignUp_activeStep.value = 1;
          authenticationSignUp_fetchAuthenticationSendOtp();
          authenticationSignUp_maskEmail();

          break;
        case 'set-up-pin':
          authenticationSignUp_activeStep.value = 2;

          break;
        default:
          authenticationSignUp_activeStep.value = 0;
          break;
      }
    }
  };

  return {
    authenticationSignUp_activeStep,
    authenticationSignUp_durationOtpFormatted,
    authenticationSignUp_formData,
    authenticationSignUp_formDataOfSetUpPin,
    authenticationSignUp_formDataOfVerifyOtp,
    authenticationSignUp_formDataOfVerifyPin,
    authenticationSignUp_formValidations,
    authenticationSignUp_formValidationsOfSetUpPin,
    authenticationSignUp_formValidationsOfVerifyOtp,
    authenticationSignUp_formValidationsOfVerifyPin,
    authenticationSignUp_isAcceptTnc,
    authenticationSignUp_isLoading: authentication_isLoading,
    authenticationSignUp_maskedEmail,
    authenticationSignUp_stepper,
    authenticationSignUp_onResendOtp,
    authenticationSignUp_onSubmit,
    authenticationSignUp_verifyUser,
  };
};
