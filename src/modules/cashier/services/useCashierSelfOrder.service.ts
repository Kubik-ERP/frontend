import { useCashierStore } from '../store';

import { useRouter, useRoute } from 'vue-router';

import { reactive, computed } from 'vue';

import { required, numeric, minLength, maxLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

export const useCashierSelfOrderService = () => {
  const router = useRouter();
  const route = useRoute();

  const store = useCashierStore();

  const { cashierSelfOrder_isLoadingSignIn, cashierSelfOrder_isLoadingSignUp } = storeToRefs(store);

  const cashierSelfOrder_signInForm = reactive({
    code: '+62',
    number: '',
  });

  const cashierSelfOrder_signUpForm = reactive({
    name: '',
    code: '+62',
    number: '',
  });

  const cashierSelfOrder_formRulesSignIn = computed(() => ({
    code: { required },
    number: { required, numeric, minLength: minLength(10), maxLength: maxLength(15) },
  }));

  const cashierSelfOrder_formRulesSignUp = computed(() => ({
    name: { required },
    code: { required },
    number: { required, numeric, minLength: minLength(10), maxLength: maxLength(15) },
  }));

  const cashierSelfOrder_formValidationsSignIn = useVuelidate(
    cashierSelfOrder_formRulesSignIn,
    cashierSelfOrder_signInForm,
    { $autoDirty: true },
  );

  const cashierSelfOrder_formValidationsSignUp = useVuelidate(
    cashierSelfOrder_formRulesSignUp,
    cashierSelfOrder_signUpForm,
    { $autoDirty: true },
  );

  const getStoreId = () => {
    const redirect = route.query.redirect as string;

    if (redirect) {
      try {
        const url = new URL(redirect, window.location.origin);
        return url.searchParams.get('storeId');
      } catch {
        return null;
      }
    }

    return (route.query.storeId as string) || null;
  };

  const cashierSelfOrder_handleSignIn = async () => {
    if (cashierSelfOrder_formValidationsSignIn.value.$invalid) {
      cashierSelfOrder_formValidationsSignIn.value.$touch();
      return;
    }

    try {
      const response = await store.cashierSelfOrder_handleSignIn({
        ...cashierSelfOrder_signInForm,
        storeId: getStoreId(),
      });

      localStorage.setItem('userinfo', JSON.stringify(response.data));

      const redirectPath = (route.query.redirect as string) || '/self-order';

      router.push(redirectPath);
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  const cashierSelfOrder_handleSignUp = async () => {
    if (cashierSelfOrder_formValidationsSignUp.value.$invalid) {
      cashierSelfOrder_formValidationsSignUp.value.$touch();
      return;
    }

    try {
      const response = await store.cashierSelfOrder_handleSignUp({
        ...cashierSelfOrder_signUpForm,
        storeId: getStoreId(),
      });

      localStorage.setItem('userinfo', JSON.stringify(response.data));

      const redirectPath = (route.query.redirect as string) || '/self-order';

      router.push(redirectPath);
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  return {
    cashierSelfOrder_signInForm,
    cashierSelfOrder_signUpForm,
    cashierSelfOrder_formValidationsSignIn,
    cashierSelfOrder_formValidationsSignUp,
    cashierSelfOrder_isLoadingSignIn,
    cashierSelfOrder_isLoadingSignUp,
    cashierSelfOrder_handleSignIn,
    cashierSelfOrder_handleSignUp,
  };
};
