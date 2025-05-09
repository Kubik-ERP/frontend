import { BaseValidation } from '@vuelidate/core';

export {};

/**
 * @description Here's a way to extend the global interfaces.
 */
declare global {
  interface IBindStateForm {
    solo: boolean;
    flat: boolean;
    placeholder: string;
    class: string;
    hideDetails: string;
    autocomplete: string;
  }

  interface IComponentComposableOptions {
    clearBeforeUnmount?: boolean;
  }

  interface ICurrencyOptions {
    minimumFractionDigits: number;
    style: string;
    currency: string;
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
    isDraggable?: boolean;
    isUsingBackdrop?: boolean;
    isUsingClosableButton?: boolean;
    isOpen: boolean;
    width?: string;
  }

  interface IPropsDialogConfirmation {
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

  interface IResponseListenerForm {
    input: () => void;
    blur: () => void;
  }

  interface IBusEvent {
    [key: string]: unknown;
    [key: symbol]: unknown;
  }
}
