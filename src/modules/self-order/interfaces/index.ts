export * from './self-order-invalid.interface';
export * from './self-order-login.interface';
export * from './self-order-register.interface';
export * from './self-order-store.interface';
export * from './self-order.interface';

// Vue
import type { ComputedRef, Ref, WritableComputedRef } from 'vue';

// Vuelidate
import type { Validation } from '@vuelidate/core';

// Cashier interfaces
import type { 
  ICashierProductState,
  ICashierModalAddProduct,
  ICashierModalAddProductItem,
  ICashierSelected,
} from '@/modules/cashier/interfaces';
import type { IProductItem } from '@/modules/cashier/interfaces/cashier-response';

/**
 * @description Interface for SelfOrderUI provided data and methods
 */
export interface ISelfOrderProvided {
  isProductActive: (product: IProductItem) => boolean;
  isRetailBusinessType: ComputedRef<boolean>;
  selfOrder_handleBarcodeScanned: (barcode: string) => Promise<void>;
  selfOrder_handleFetchCategory: () => Promise<void>;
  selfOrder_handleFetchProductCategory: () => Promise<void>;
  selfOrder_handleOpenModalAddProduct: (product: IProductItem) => void;
  selfOrder_handleQuantity: (type: 'increase' | 'decrease') => void;
  selfOrder_handleSelectCategory: (category: string) => void;
  selfOrder_handleSelectProduct: (product?: IProductItem, item?: ICashierModalAddProductItem) => void;
  selfOrder_modalAddEditItem: Ref<ICashierModalAddProduct>;
  selfOrder_modalCategory: Ref<{ show: boolean }>;
  selfOrder_onSearchData: () => Promise<void>;
  selfOrder_productState: Ref<ICashierProductState>;
  selfOrder_selectedProduct: Ref<ICashierSelected[]>;
  selfOrder_selectedProductQty: WritableComputedRef<number, number | string>;
  selfOrder_selectedView: Ref<'image' | 'grid' | 'inline'>;
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

