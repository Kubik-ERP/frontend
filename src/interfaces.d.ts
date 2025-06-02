import { BaseValidation } from '@vuelidate/core';
import type { Component } from 'vue';

export {};

/**
 * @description Here's a way to extend the global interfaces.
 */
declare global {
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
    sortable: boolean;
    value: string;
  }

  interface IComponentComposableOptions {
    clearBeforeUnmount?: boolean;
  }

  interface ICurrencyOptions {
    minimumFractionDigits: number;
    style: string;
    currency: string;
  }

  interface IDefaultContent {
    id: string;
    key: string;
    label: string;
  }

  interface IDropdownItem {
    label: string;
    value: string | number;
  }

  interface IObjectFileUpload extends File {
    objectURL: string;
  }

  interface IPagination {
    total: number;
    skip: number;
    limit: number;
  }

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
    onClickButtonPrimary?: () => void;
    onClickButtonSecondary?: () => void;
    textButtonPrimary?: string;
    textButtonSecondary?: string;
    title?: string;
    type?: 'error' | 'info';
    width?: string;
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
    footerText?: string | null;
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
    incrementBy?: number;
    resetSequence?: string;
    startingNumber?: number;
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
    field: string
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
