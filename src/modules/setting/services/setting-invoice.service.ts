// Constants
import { LIST_CONTENT_SETTINGS_INVOICE, LIST_GENERAL_SETTINGS_INVOICE, LIST_INVOICE_NUMBER_CONTENTS, LIST_TABS_INVOICE_PREVIEW, LIST_TYPES_OF_RESET_SEQUENCE } from '../constants/setting-invoice.constant';

// Interfaces
import type { ISettingInvoiceFormData, ISettingInvoiceProvided } from '../interfaces/setting-invoice.interface';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useSettingInvoiceService = (): ISettingInvoiceProvided => {
  /**
   * @description Reactive data binding
   */
  const settingInvoice_activeTab = ref<string>('cashier-invoice');
  const settingInvoice_formData = reactive<ISettingInvoiceFormData>({
    generalSettings: {
      isAutomaticallyPrintReceipt: true,
      isAutomaticallyPrintKitchen: true,
      isAutomaticallyPrintTable: true,
    },
    contentSettings: {
      companyLogo: null,
      footerText: null,
      isShowCompanyLogo: true,
      isShowStoreLocation: true,
      isHideCashierName: false,
      isHideOrderType: false,
      isHideQueueNumber: false,
      isShowTableNumber: true,
      isHideItemPrices: false,
      isShowFooter: true,
    },
    invoiceNumberConfigurations: {
      incrementBy: null,
      resetSequence: 'Daily',
      startingNumber: null,
    }
  })
  const settingInvoice_isEditableInvoiceConfiguration = ref<boolean>(false)

  /**
   * @description Form validations
   */
  const settingInvoice_formRules = computed(() => ({
    contentSettings: {
      footerText: { required },
    },
    invoiceNumberConfigurations: {
      incrementBy: { required },
      resetSequence: { required },
      startingNumber: { required },
    }
  }))
  const settingInvoice_formValidations = useVuelidate(
    settingInvoice_formRules,
    settingInvoice_formData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Computed property that combines general and content settings into a single object
   */
  const settingInvoice_bindings = computed((): IPropsInvoicePaper => ({
    ...settingInvoice_formData.generalSettings,
    ...settingInvoice_formData.contentSettings,
  }));

  /**
   * @description handle business logic for close dialog edit footer content
   */
  const settingInvoice_onCloseEditFooterContentDialog = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'setting-invoice-dialog-footer-content',
      isOpen: false
    }

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  }

  /**
   * @description handle business logic for close dialog edit invoice number configuration
   */
  const settingInvoice_onCloseEditInvoiceNumberConfigurationDialog = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'setting-invoice-dialog-invoice-configuration',
      isOpen: false
    }

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  }

  /**
   * @description Handle business logic for show dialog edit footer content
   */
  const settingInvoice_onShowEditFooterContentDialog = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'setting-invoice-dialog-footer-content',
      isOpen: true,
      isUsingClosableButton: false,
      width: '534px'
    }

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  }

  /**
   * @description handle business logic for show dialog edit invoice number configuration
   */
  const settingInvoice_onShowEditInvoiceNumberConfigurationDialog = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'setting-invoice-dialog-invoice-configuration',
      isOpen: true,
      isUsingClosableButton: false,
      width: '586px'
    }

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  }

  /**
   * @description handle business logic for button toggle editable invoice configuration
   */
  const settingInvoice_toggleEditableInvoiceConfiguration = (): void => {
    settingInvoice_isEditableInvoiceConfiguration.value = !settingInvoice_isEditableInvoiceConfiguration.value
  }

  return {
    settingInvoice_activeTab,
    settingInvoice_bindings,
    settingInvoice_formData,
    settingInvoice_formValidations,
    settingInvoice_isEditableInvoiceConfiguration,
    settingInvoice_listContentSettings: LIST_CONTENT_SETTINGS_INVOICE,
    settingInvoice_listGeneralSettings: LIST_GENERAL_SETTINGS_INVOICE,
    settingInvoice_listInvoiceNumberContents: LIST_INVOICE_NUMBER_CONTENTS,
    settingInvoice_listResetSequences: LIST_TYPES_OF_RESET_SEQUENCE,
    settingInvoice_listTabsInvoicePreview: LIST_TABS_INVOICE_PREVIEW,
    settingInvoice_onCloseEditFooterContentDialog,
    settingInvoice_onCloseEditInvoiceNumberConfigurationDialog,
    settingInvoice_onShowEditFooterContentDialog,
    settingInvoice_onShowEditInvoiceNumberConfigurationDialog,
    settingInvoice_toggleEditableInvoiceConfiguration,
  }
}