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
    isShowCompanyLogo: boolean;
    isShowStoreLocation: boolean;
    isHideCashierName: boolean;
    isHideOrderType: boolean;
    isHideQueueNumber: boolean;
    isShowTableNumber: boolean;
    isHideItemPrices: boolean;
    isShowFooter: boolean;
  } & ISettingInvoiceContentSettings;
}

export interface ISettingInvoiceProvided {
  settingInvoice_activeTab: globalThis.Ref<string>;
  settingInvoice_bindings: globalThis.ComputedRef<IPropsInvoicePaper>;
  settingInvoice_formData: ISettingInvoiceFormData;
  settingInvoice_isEditableInvoiceConfiguration: globalThis.Ref<boolean>;
  settingInvoice_listContentSettings: IDefaultContent[];
  settingInvoice_listGeneralSettings: IDefaultContent[];
  settingInvoice_listInvoiceNumberContents: IDefaultContent[];
  settingInvoice_listTabsInvoicePreview: ITabs[];
  settingInvoice_toggleEditableInvoiceConfiguration: () => void;
}