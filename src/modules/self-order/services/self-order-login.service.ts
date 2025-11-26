// Interfaces
import type { ISelfOrderLoginProvided } from '../interfaces';

// Stores
import { useSelfOrderStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { email, maxLength, minLength, numeric, required } from '@vuelidate/validators';

// Vue Router
import { useRoute, useRouter } from 'vue-router';

/**
 * @description Closure function that returns everything what we need into an object for SelfOrderLoginUI
 */
export const useSelfOrderLoginService = (): ISelfOrderLoginProvided => {
  /**
   * @description Injected variables
   */
  const route = useRoute();
  const router = useRouter();
  const store = useSelfOrderStore(); // Instance of the store
  const { selfOrderLogin_isLoading } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const selfOrderLogin_formData = reactive({
    code: '+62',
    email: '',
    name: '',
    number: '',
  });

  /**
   * @description Computed properties
   */

  /**
   * @description Form validations
   */
  const selfOrderLogin_formRules = computed(() => ({
    code: { required },
    email: { email },
    name: { required },
    number: { maxLength: maxLength(15), minLength: minLength(10), numeric, required },
  }));

  const selfOrderLogin_formValidations = useVuelidate(selfOrderLogin_formRules, selfOrderLogin_formData, {
    $autoDirty: true,
  });

  /**
   * @description Functions (sorted alphabetically)
   */
  const selfOrderLogin_getStoreId = () => {
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

  const selfOrderLogin_handleGuestSignIn = () => {
    const redirectPath = (route.query.redirect as string) || '/self-order';
    const queryParams = {
      floorName: route.query.floorName as string,
      storeId: route.query.storeId as string,
      tablesName: route.query.tablesName as string,
    };
    localStorage.setItem('userinfo', JSON.stringify({ isGuest: true, name: 'Guest' }));
    localStorage.setItem('shoppingCart', JSON.stringify({}));
    router.push({ path: redirectPath, query: queryParams });
  };

  const selfOrderLogin_handleSignIn = async () => {
    if (selfOrderLogin_formValidations.value.$invalid) {
      selfOrderLogin_formValidations.value.$touch();
      return;
    }

    try {
      const response = await store.selfOrderLogin_handleSignIn({
        code: selfOrderLogin_formData.code,
        email: selfOrderLogin_formData.email,
        name: selfOrderLogin_formData.name,
        number: selfOrderLogin_formData.number,
        storeId: selfOrderLogin_getStoreId(),
      });

      localStorage.setItem('userinfo', JSON.stringify((response as { data: unknown }).data));
      localStorage.setItem('shoppingCart', JSON.stringify({}));

      const redirectPath = (route.query.redirect as string) || '/self-order';

      const queryParams = {
        floorName: route.query.floorName as string,
        storeId: route.query.storeId as string,
        tablesName: route.query.tablesName as string,
      };

      router.push({ path: redirectPath, query: queryParams });
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  /**
   * @description Return all the data and methods (sorted alphabetically)
   */
  return {
    selfOrderLogin_formData,
    selfOrderLogin_formValidations,
    selfOrderLogin_handleGuestSignIn,
    selfOrderLogin_handleSignIn,
    selfOrderLogin_isLoading,
  };
};
