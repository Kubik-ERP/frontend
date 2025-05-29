// Constants
import { LIST_CONTENT_SETTINGS_INVOICE, LIST_GENERAL_SETTINGS_INVOICE, LIST_INVOICE_NUMBER_CONTENTS, LIST_TABS_INVOICE_PREVIEW } from '../constants/setting-invoice.constant';

// Interfaces
import type { ISettingInvoiceFormData, ISettingInvoiceProvided } from '../interfaces/setting-invoice.interface';

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
      isShowCompanyLogo: true,
      isShowStoreLocation: true,
      isHideCashierName: false,
      isHideOrderType: false,
      isHideQueueNumber: false,
      isShowTableNumber: true,
      isHideItemPrices: false,
      isShowFooter: true,
    },
  })
  const settingInvoice_isEditableInvoiceConfiguration = ref<boolean>(true)

  /**
   * @description Computed property that combines general and content settings into a single object
   */
  const settingInvoice_bindings = computed((): IPropsInvoicePaper => ({
    ...settingInvoice_formData.generalSettings,
    ...settingInvoice_formData.contentSettings,
  }));

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
    settingInvoice_isEditableInvoiceConfiguration,
    settingInvoice_listContentSettings: LIST_CONTENT_SETTINGS_INVOICE,
    settingInvoice_listGeneralSettings: LIST_GENERAL_SETTINGS_INVOICE,
    settingInvoice_listInvoiceNumberContents: LIST_INVOICE_NUMBER_CONTENTS,
    settingInvoice_listTabsInvoicePreview: LIST_TABS_INVOICE_PREVIEW,
    settingInvoice_toggleEditableInvoiceConfiguration,
  }
}