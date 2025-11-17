// Interfaces
import type { ISelfOrderRegisterProvided } from '../interfaces';

// Stores
import { useSelfOrderStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { maxLength, minLength, numeric, required } from '@vuelidate/validators';

// Vue Router
import { useRoute, useRouter } from 'vue-router';

/**
 * @description Closure function that returns everything what we need into an object for SelfOrderRegisterUI
 */
export const useSelfOrderRegisterService = (): ISelfOrderRegisterProvided => {
  /**
   * @description Injected variables
   */
  const route = useRoute();
  const router = useRouter();
  const store = useSelfOrderStore(); // Instance of the store
  const { selfOrderRegister_isLoading } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const selfOrderRegister_formData = reactive({
    code: '+62',
    name: '',
    number: '',
  });

  /**
   * @description Computed properties
   */

  /**
   * @description Form validations
   */
  const selfOrderRegister_formRules = computed(() => ({
    code: { required },
    name: { required },
    number: { maxLength: maxLength(15), minLength: minLength(10), numeric, required },
  }));

  const selfOrderRegister_formValidations = useVuelidate(selfOrderRegister_formRules, selfOrderRegister_formData, {
    $autoDirty: true,
  });

  /**
   * @description Functions (sorted alphabetically)
   */
  const selfOrderRegister_getStoreId = () => {
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

  const selfOrderRegister_handleSignUp = async () => {
    if (selfOrderRegister_formValidations.value.$invalid) {
      selfOrderRegister_formValidations.value.$touch();
      return;
    }

    try {
      const response = await store.selfOrderRegister_handleSignUp({
        code: selfOrderRegister_formData.code,
        name: selfOrderRegister_formData.name,
        number: selfOrderRegister_formData.number,
        storeId: selfOrderRegister_getStoreId(),
      });

      localStorage.setItem('userinfo', JSON.stringify((response as { data: unknown }).data));

      const redirectPath = (route.query.redirect as string) || '/self-order';

      router.push(redirectPath);
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  /**
   * @description Return all the data and methods (sorted alphabetically)
   */
  return {
    selfOrderRegister_formData,
    selfOrderRegister_formValidations,
    selfOrderRegister_handleSignUp,
    selfOrderRegister_isLoading,
  };
};
