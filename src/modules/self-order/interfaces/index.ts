// Export all interfaces from centralized files
export * from './self-order-invalid.interface';
export * from './self-order-login.interface';
export * from './self-order-register.interface';
export * from './self-order-store.interface';
export * from './self-order.interface';

// Vue
import type { Ref } from 'vue';

// Vuelidate
import type { Validation } from '@vuelidate/core';

// Re-export specific interfaces for backward compatibility
import type { ISelfOrderCategoriesResponse } from './self-order-store.interface';
import type { ISelfOrderSelected } from './self-order.interface';

export interface ISelfOrderStateStore {
  selfOrderProduct_selectedProduct: ISelfOrderSelected[];
  selfOrderSelfOrder_isLoadingSignUp: boolean;
  selfOrderSelfOrder_isLoadingSignIn: boolean;
}

export interface ISelfOrderStateCategory {
  isLoading: boolean;
  data: ISelfOrderCategoriesResponse;
}

export interface ISelfOrderOrderType {
  code: string;
  label: string;
  icon?: string;
}

/**
 * @description Interface for SelfOrderLoginUI provided data and methods
 */
export interface ISelfOrderLoginProvided {
  selfOrderLogin_formData: {
    code: string;
    email: string;
    name: string;
    number: string;
  };
  selfOrderLogin_formValidations: Ref<Validation>;
  selfOrderLogin_handleGuestSignIn: () => void;
  selfOrderLogin_handleSignIn: () => Promise<void>;
  selfOrderLogin_isLoading: Ref<boolean>;
}

/**
 * @description Interface for SelfOrderRegisterUI provided data and methods
 */
export interface ISelfOrderRegisterProvided {
  selfOrderRegister_formData: {
    code: string;
    name: string;
    number: string;
    email: string;
  };
  selfOrderRegister_formValidations: Ref<Validation>;
  selfOrderRegister_handleSignUp: () => Promise<void>;
  selfOrderRegister_isLoading: Ref<boolean>;
}

/**
 * @description Interface for SelfOrderInvalidUI provided data and methods
 * Currently empty as the invalid page doesn't need any logic
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISelfOrderInvalidProvided {
  // Currently empty as the invalid page doesn't need any logic
}
