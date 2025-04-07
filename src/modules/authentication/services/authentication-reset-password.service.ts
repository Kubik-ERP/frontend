// Constants
import {
  AUTHENTICATION_RESET_PASSWORD_REQUEST,
  AUTHENTICATION_RESET_PASSWORD_STEPPER,
  AUTHENTICATION_SEND_OTP_REQUEST,
} from '../constants';
import {
  IAuthenticationSendOtpFormData,
  IAuthenticationStepper,
  IAuthenticationVerifyOtpFormData,
} from '../interfaces';

// Interfaces
import type {
  IAuthenticationResetPasswordFormData,
  IAuthenticationResetPasswordProvided,
} from '../interfaces/authentication-reset-password.interface';

// Stores
import { useAuthenticationStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAuthenticationResetPasswordService = (): IAuthenticationResetPasswordProvided => {
  /**
   * @description Injected variables
   */
  const store = useAuthenticationStore(); // Instance of the store
  const { authentication_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const authenticationResetPassword_activeStep = ref<number>(0);
  const authenticationResetPassword_formData = reactive<IAuthenticationResetPasswordFormData>({
    email: '',
  });
  const authenticationResetPassword_isPinInvalid = ref<boolean>(true);
  const authenticationResetPassword_isSuccess = ref<boolean>(false);
  const authenticationResetPassword_stepper = shallowRef<IAuthenticationStepper[]>(
    AUTHENTICATION_RESET_PASSWORD_STEPPER,
  );
  const authenticationResetPassword_verifyOtpFormData = reactive<IAuthenticationVerifyOtpFormData>({
    email: '',
    otp: '',
    type: 'FORGOT_PASSWORD',
  });

  /**
   * @description Form validations
   */
  const authenticationResetPassword_formRules = computed(() => ({
    email: { email, required },
  }));
  const authenticationResetPassword_formRulesOfVerifyOtp = computed(() => ({
    otp: {
      required,
    },
  }));

  const authenticationResetPassword_formValidations = useVuelidate(
    authenticationResetPassword_formRules,
    authenticationResetPassword_formData,
    {
      $autoDirty: true,
    },
  );
  const authenticationResetPassword_formValidationsOfVerifyOtp = useVuelidate(
    authenticationResetPassword_formRulesOfVerifyOtp,
    authenticationResetPassword_verifyOtpFormData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle fetch api authentication reset password. We call the fetchAuthentication_sendOtp function from the store to handle the request.
   */
  const authenticationResetPassword_fetchAuthenticationSendOtp = async () => {
    try {
      const payload: IAuthenticationSendOtpFormData = {
        email: authenticationResetPassword_formData.email,
      };

      await store.fetchAuthentication_sendOtp(payload, {
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
   * @description Handle fetch api authentication reset password. We call the fetchAuthentication_verifyOtp function from the store to handle the request.
   */
  const authenticationResetPassword_fetchAuthenticationVerifyOtp = async () => {
    try {
      if (!authenticationResetPassword_verifyOtpFormData.email) {
        authenticationResetPassword_verifyOtpFormData.email = authenticationResetPassword_formData.email;
      }

      await store.fetchAuthentication_verifyOtp(authenticationResetPassword_verifyOtpFormData, {
        ...httpAbort_registerAbort(AUTHENTICATION_SEND_OTP_REQUEST),
      });
    } catch (error: unknown) {
      authenticationResetPassword_isPinInvalid.value = true;

      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api authentication reset password. We call the fetchAuthentication_resetPassword function from the store to handle the request.
   */
  const authenticationResetPassword_fetchAuthenticationResetPassword = async () => {
    try {
      await store.fetchAuthentication_resetPassword(authenticationResetPassword_formData, {
        ...httpAbort_registerAbort(AUTHENTICATION_RESET_PASSWORD_REQUEST),
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
   * @description Handle action on submit form.
   */
  const authenticationResetPassword_onSubmit = async (): Promise<void> => {
    if (authenticationResetPassword_activeStep.value === 0) {
      authenticationResetPassword_formValidations.value.$touch();
      if (authenticationResetPassword_formValidations.value.$invalid) return;
    } else {
      authenticationResetPassword_formValidationsOfVerifyOtp.value.$touch();
      if (authenticationResetPassword_formValidationsOfVerifyOtp.value.$invalid) return;
    }

    try {
      if (authenticationResetPassword_activeStep.value === 0) {
        await authenticationResetPassword_fetchAuthenticationResetPassword();
        await authenticationResetPassword_fetchAuthenticationSendOtp();
        authenticationResetPassword_activeStep.value = 1;
      } else {
        await authenticationResetPassword_fetchAuthenticationVerifyOtp();
        authenticationResetPassword_isSuccess.value = true;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle side effect after fill the otp form
   */
  watch(
    () => authenticationResetPassword_verifyOtpFormData.otp,
    value => {
      if (authenticationResetPassword_isPinInvalid.value) {
        authenticationResetPassword_isPinInvalid.value = false;
      }

      if (value.length === 6) {
        authenticationResetPassword_onSubmit();
      }
    },
  );

  return {
    authenticationResetPassword_activeStep,
    authenticationResetPassword_formData,
    authenticationResetPassword_formValidations,
    authenticationResetPassword_formValidationsOfVerifyOtp,
    authenticationResetPassword_isLoading: authentication_isLoading,
    authenticationResetPassword_isPinInvalid,
    authenticationResetPassword_isSuccess,
    authenticationResetPassword_onSubmit,
    authenticationResetPassword_stepper,
    authenticationResetPassword_verifyOtpFormData,
  };
};
