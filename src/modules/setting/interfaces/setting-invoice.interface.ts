// Interfaces
import type { Validation } from '@vuelidate/core';

export interface ISettingInvoiceGeneralSettings {
  isAutomaticallyPrintReceipt: boolean;
  isAutomaticallyPrintKitchen: boolean;
  isAutomaticallyPrintTable: boolean;
}

export interface ISettingInvoiceContentSettings {
  isShowCompanyLogo: boolean;
  isShowStoreLocation: boolean;
  isHideCashierName: boolean;
  isHideOrderType: boolean;
  isHideQueueNumber: boolean;
  isShowTableNumber: boolean;
  isHideItemPrices: boolean;
  isShowFooter: boolean;
}

export interface ISettingInvoiceFormData {
  generalSettings: {
    isAutomaticallyPrintReceipt: boolean;
    isAutomaticallyPrintKitchen: boolean;
    isAutomaticallyPrintTable: boolean;
  } & ISettingInvoiceGeneralSettings;
  contentSettings: {
    companyLogo: File | null;
    footerText: string | null;
    isShowCompanyLogo: boolean;
    isShowStoreLocation: boolean;
    isHideCashierName: boolean;
    isHideOrderType: boolean;
    isHideQueueNumber: boolean;
    isShowTableNumber: boolean;
    isHideItemPrices: boolean;
    isShowFooter: boolean;
  } & ISettingInvoiceContentSettings;
  invoiceNumberConfigurations: {
    incrementBy: number | null;
    resetSequence: string | null;
    startingNumber: number | null;
  };
}

export interface ISettingInvoiceProvided {
  settingInvoice_activeTab: globalThis.Ref<string>;
  settingInvoice_bindings: globalThis.ComputedRef<IPropsInvoicePaper>;
  settingInvoice_formData: ISettingInvoiceFormData;
  settingInvoice_formValidations: globalThis.Ref<Validation>;
  settingInvoice_isEditableInvoiceConfiguration: globalThis.Ref<boolean>;
  settingInvoice_listContentSettings: IDefaultContent[];
  settingInvoice_listGeneralSettings: IDefaultContent[];
  settingInvoice_listInvoiceNumberContents: IDefaultContent[];
  settingInvoice_listResetSequences: IDropdownItem[];
  settingInvoice_listTabsInvoicePreview: ITabs[];
  settingInvoice_onCloseEditFooterContentDialog: () => void;
  settingInvoice_onCloseEditInvoiceNumberConfigurationDialog: () => void;
  settingInvoice_onShowEditFooterContentDialog: () => void;
  settingInvoice_onShowEditInvoiceNumberConfigurationDialog: () => void;
  settingInvoice_toggleEditableInvoiceConfiguration: () => void;
}