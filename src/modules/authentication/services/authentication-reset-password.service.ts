// Constants
import {
  AUTHENTICATION_RESET_PASSWORD_REQUEST,
  AUTHENTICATION_RESEND_RESET_PASSWORD_REQUEST,
  AUTHENTICATION_RESET_PASSWORD_STEPPER,
} from '../constants';
import { IAuthenticationStepper } from '../interfaces';

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
  const authenticationResetPassword_isPinInvalid = ref<boolean>(false);
  const authenticationResetPassword_isSuccess = ref<boolean>(false);
  const authenticationResetPassword_stepper = shallowRef<IAuthenticationStepper[]>(
    AUTHENTICATION_RESET_PASSWORD_STEPPER,
  );
  const authenticationResetPassword_formDataOfVerifyPin = reactive<IAuthenticationVerifyPinFormData>({
    pinConfirmation: '',
  });
  const authenticationResetPassword_resendCooldown = ref<number>(0);
  const authenticationResetPassword_canResend = computed<boolean>(
    () => authenticationResetPassword_resendCooldown.value <= 0,
  );

  /**
   * @description Form validations
   */
  const authenticationResetPassword_formRules = computed(() => ({
    email: { email, required },
  }));
  const authenticationResetPassword_formRulesOfVerifyPin = computed(() => ({
    pinConfirmation: {
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
    authenticationResetPassword_formRulesOfVerifyPin,
    authenticationResetPassword_formDataOfVerifyPin,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Start countdown timer for resend email functionality
   */
  const authenticationResetPassword_startResendCountdown = () => {
    authenticationResetPassword_resendCooldown.value = 60; // 60 seconds cooldown
    const interval = setInterval(() => {
      authenticationResetPassword_resendCooldown.value -= 1;
      if (authenticationResetPassword_resendCooldown.value <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  /**
   * @description Handle resend email reset password functionality
   */
  const authenticationResetPassword_onResendEmail = async (): Promise<void> => {
    if (!authenticationResetPassword_canResend.value) return;

    try {
      await store.fetchAuthentication_resetPassword(authenticationResetPassword_formData, {
        ...httpAbort_registerAbort(AUTHENTICATION_RESEND_RESET_PASSWORD_REQUEST),
      });

      // Start countdown after successful resend
      authenticationResetPassword_startResendCountdown();
    } catch (error: unknown) {
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
      await store.fetchAuthentication_resetPassword(
        // authenticationResetPassword_formDataOfVerifyPin.pinConfirmation,
        authenticationResetPassword_formData,
        {
          ...httpAbort_registerAbort(AUTHENTICATION_RESET_PASSWORD_REQUEST),
        },
      );

      authenticationResetPassword_isSuccess.value = true;
      // Start countdown after successful initial reset password request
      authenticationResetPassword_startResendCountdown();
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
      await authenticationResetPassword_fetchAuthenticationResetPassword();

      // if (authenticationResetPassword_activeStep.value === 0) {
      //   authenticationResetPassword_activeStep.value = 1;
      // } else {
      //   await authenticationResetPassword_fetchAuthenticationResetPassword();
      // }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    authenticationResetPassword_activeStep,
    authenticationResetPassword_formData,
    authenticationResetPassword_formDataOfVerifyPin,
    authenticationResetPassword_formValidations,
    authenticationResetPassword_formValidationsOfVerifyOtp,
    authenticationResetPassword_isLoading: authentication_isLoading,
    authenticationResetPassword_isPinInvalid,
    authenticationResetPassword_isSuccess,
    authenticationResetPassword_onSubmit,
    authenticationResetPassword_stepper,
    authenticationResetPassword_resendCooldown,
    authenticationResetPassword_canResend,
    authenticationResetPassword_onResendEmail,
  };
};
