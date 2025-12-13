import { BaseValidation } from '@vuelidate/core';
import type { Component } from 'vue';

export {};

/**
 * @description Here's a way to extend the global interfaces.
 */
declare global {
  // Menu interfaces for type safety
  interface ISubMenu {
    name: string;
    translationKey?: string;
    path: string;
  }

  interface IMenu {
    name: string;
    translationKey?: string;
    iconName: string;
    path: string;
    isHaveSubMenus: boolean;
    subMenus: ISubMenu[];
  }

  interface IMenuCategory {
    name: string;
    translationKey?: string;
    menus: IMenu[];
  }

  export interface IAuthenticationSetUpPinFormData {
    pin: string;
  }

  export interface IAuthenticationVerifyPinFormData {
    pinConfirmation: string;
  }

  interface IBindStateForm {
    solo: boolean;
    flat: boolean;
    placeholder: string;
    class: string;
    hideDetails: string;
    autocomplete: string;
  }

  interface IColumnDataTable {
    label: string;
    translationKey?: string;
    sortable: boolean;
    value: string;
    width?: string;
  }

  interface IComponentComposableOptions {
    clearBeforeUnmount?: boolean;
  }

  interface ICurrencyOptions {
    minimumFractionDigits: number;
    style: string;
    currency: string;
  }

  interface ICustomer {
    address: string;
    code: string;
    dob: string;
    email: string;
    gender: string;
    id: string;
    name: string;
    number: string;
    point: number | null;
    tag: string | null;
    username: string;
  }

  interface IDefaultContent {
    id: string;
    key: string;
    label: string;
  }

  interface IDefaultResponseFetch {
    statusCode: number;
    message: string;
  }

  interface IDropdownItem {
    iconName?: string;
    label: string;
    translationKey?: string;
    value: string | number | Record<string, unknown>;
  }

  interface IObjectFileUpload extends File {
    objectURL: string;
  }

  interface IPageMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }

  interface ISecondPageMeta {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
  }

  interface IPagination {
    total: number;
    skip: number;
    limit: number;
  }

  export type TPermissions =
    | 'access_all_store'
    | 'store_management'
    | 'dashboard_view'
    | 'reports'
    | 'accounts'
    | 'connected_device_configuration'
    | 'payment_method_configuration'
    | 'general_loyalty_point_configuration'
    | 'tax_and_service_charge_configuration'
    | 'invoice_templates'
    | 'product_category'
    | 'product_management'
    | 'set_up_cash_drawer'
    | 'close_cash_register'
    | 'daily_sales'
    | 'queue'
    | 'check_out_sales'
    | 'cancel_invoice'
    | 'refund_invoice'
    | 'process_unpaid_invoice'
    | 'voucher'
    | 'cash_in_out'
    | 'customer_management'
    | 'view_customer_profile'
    | 'management_customer_loyalty_point'
    | 'supplier_management'
    | 'view_supplier_details'
    | 'category_management'
    | 'manage_item'
    | 'stock_adjustment'
    | 'manage_brand'
    | 'manage_stock_opname'
    | 'manage_storage_location'
    | 'manage_purchase_order'
    | 'manage_staff_member'
    | 'manage_staff_attendance'
    | 'edit_invoice'
    | 'payment_rounding_setting'
    | 'integration'
    | 'recipe_management'
    | 'manage_transfer_stock';

  interface IPropsDialog {
    id: string;
    isDraggable?: boolean;
    isUsingBackdrop?: boolean;
    isUsingClosableButton?: boolean;
    isOpen: boolean;
    width?: string;
  }

  interface IPropsDialogConfirmation {
    id: string;
    description?: string;
    iconName?: string;
    isLoading?: boolean;
    isOpen?: boolean;
    isUsingIcon?: boolean;
    isUsingButtonActions?: boolean;
    isUsingButtonSecondary?: boolean;
    isUsingHtmlTagOnDescription?: boolean;
    onClickButtonPrimary?: () => void;
    onClickButtonSecondary?: () => void;
    textButtonPrimary?: string;
    textButtonSecondary?: string;
    title?: string;
    type?: 'error' | 'info';
    width?: string;
    secondaryIcon?: string;
    // Enhanced form support
    isUsingForm?: boolean;
    formData?: Record<string, unknown>;
    formFields?: IDialogFormField[];
    formValidations?: Record<string, unknown>;
  }

  interface IDialogFormField {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'email' | 'password' | 'date';
    placeholder?: string;
    required?: boolean;
    options?: IDropdownItem[]; // For select type
    rows?: number; // For textarea type
    disabled?: boolean;
    validator?: unknown; // Vuelidate validator
  }

  interface IPropsDialogPinVerification {
    isInvalid?: boolean;
    isOpen: boolean;
    onClickPrimaryButton?: () => void;
    onClickSecondaryButton?: () => void;
    pinConfirmation?: string;
    primaryButtonClass?: string;
    primaryButtonLabel?: string;
    secondaryButtonClass?: string;
    secondaryButtonLabel?: string;
  }
  interface IPropsFormGroup {
    isNameAsLabel: boolean;
    isNameAsPlaceholder: boolean;
    isNotHaveSpacing: boolean;
    labelFor?: string;
    name: string;
    spacingBottom: string;
    validators: BaseValidation;
  }

  interface IPropsInvoicePaper {
    companyLogo?: File | null;
    companyLogoUrl?: string | null;
    footerText?: string | null;
    businessType?: string;
    isAutomaticallyPrintReceipt: boolean;
    isAutomaticallyPrintKitchen: boolean;
    isAutomaticallyPrintTable: boolean;
    isShowCompanyLogo: boolean;
    isShowStoreLocation: boolean;
    isHideCashierName: boolean;
    isHideOrderType: boolean;
    isHideQueueNumber: boolean;
    isShowTableNumber: boolean;
    isHideItemPrices: boolean;
    isShowFooter: boolean;
    isShowLoyaltyPointsUsed: boolean;
    isShowTotalPointsAccumulated: boolean;
    incrementBy?: number;
    resetSequence?: string;
    startingNumber?: number;
  }

  interface IPropsToast {
    isOpen: boolean;
    message: string;
    position: EToastPosition;
    type: EToastType;
  }

  interface IStoreHour {
    openTime: Date | Date[] | (Date | null)[] | null | undefined;
    closeTime: Date | Date[] | (Date | null)[] | null | undefined;
  }

  interface IStoreOperationalHour {
    timeSlots: IStoreHour[];
    day: string;
    dayTranslationKey?: string;
    isOpen: boolean;
  }

  /**
   * Interface for nesting configuration in Vuelidate validation.
   */
  interface IVuelidateNestingConfig {
    field: string; // The name of the nested field (e.g., 'competency', 'budget')
    index: number; // The index in the $each array for the nested field
  }

  /**
   * Interface for the configuration object passed to useFormValidateEach.
   */
  interface IVuelidateValidationEachConfig {
    validation: VuelidateValidation; // Vuelidate validation object
    field: string; // The target field to validate (e.g., 'competencyName', 'workIndicator')
    fieldIndex: number; // Index in the $each array for the target field
    nesting?: IVuelidateNestingConfig | null; // Optional nesting level (e.g., competency[0])
    subNesting?: IVuelidateNestingConfig | null; // Optional sub-nesting level (e.g., competency[0].budget[1])
  }

  /**
   * Interface to approximate Vuelidate's validation structure.
   * This is a simplified representation; adjust based on your Vuelidate version.
   */
  interface IVuelidateValidation {
    $invalid: boolean; // Indicates if the form or field is invalid
    $dirty: boolean; // Indicates if the form or field has been touched
    $each: {
      $response: {
        $data: Array<Record<string, unknown>>; // Array of nested data objects
        $errors: Array<Record<string, unknown[]>>; // Array of error objects for fields
      };
    };
  }

  /**
   * Interface for the return value of useFormValidateEach.
   */
  interface IValidationResult {
    $invalid: boolean; // Form or field invalid state
    $dirty: boolean; // Form or field dirty state
    $errors: unknown[]; // Array of error messages for the target field
  }

  interface IRestParamsFormValidateEach {
    field: string;
    fieldIndex?: number;
    fieldNesting?: string;
    fieldNestingIndex?: number;
    fieldSubNesting?: string;
    fieldSubNestingIndex?: number;
    isNesting?: boolean;
    isSubNesting?: boolean;
  }

  interface ISetUnsetPin {
    pin: string;
    pinConfirmation: string;
  }
  interface ISplitButton {
    iconName?: string;
    label: string;
    command?: () => void;
  }

  interface ITabs {
    component: Component;
    label: string;
    value: string;
    translationKey?: string;
  }

  interface IResponseListenerForm {
    input: () => void;
    blur: () => void;
  }

  interface IBusEvent {
    [key: string]: unknown;
    [key: symbol]: unknown;
  }
}
