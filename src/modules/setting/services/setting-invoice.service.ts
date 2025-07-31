// Constants
import { SETTING_INVOICE_DETAIL_REQUEST, SETTING_UPDATE_INVOICE_REQUEST } from '../constants/setting.constant';
import {
  LIST_CONTENT_SETTINGS_INVOICE,
  LIST_GENERAL_SETTINGS_INVOICE,
  LIST_INVOICE_NUMBER_CONTENTS,
  LIST_TABS_INVOICE_PREVIEW,
  LIST_TYPES_OF_RESET_SEQUENCE,
} from '../constants/setting-invoice.constant';

// Interfaces
import type {
  ISettingInvoiceFormData,
  ISettingInvoiceProvided,
  ISettingInvoiceNumberConfigurations,
} from '../interfaces/setting-invoice.interface';
import type { FileUploadSelectEvent } from 'primevue';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useSettingStore } from '../store';
import { useOutletStore } from '@/modules/outlet/store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useSettingInvoiceService = (): ISettingInvoiceProvided => {
  /**
   * @description Injected variables
   */
  const store = useSettingStore(); // Instance of the store

  const storeId = useOutletStore();

  const { httpAbort_registerAbort } = useHttpAbort();
  const { setting_invoice, setting_isLoading } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const settingInvoice_activeTab = ref<string>('cashier-invoice');
  const settingInvoice_formData = reactive<ISettingInvoiceFormData>({
    companyLogoUrl: null,
    storeId: storeId.outlet_currentOutlet?.id as string,
    generalSettings: {
      isAutomaticallyPrintReceipt: true,
      isAutomaticallyPrintKitchen: true,
      isAutomaticallyPrintTable: true,
    },
    contentSettings: {
      companyLogo: null,
      footerText: `
        <p id="label-social-media" class="font-normal text-black text-sm text-center">Social Media</p>
        <p id="social-media-ig" class="font-normal text-black text-sm text-center">Instagram : @lawsonkal</p>
        <p id="closing-text" class="font-normal text-black text-sm text-center">
          Terima kasih dan kami tunggu kehadiran Anda kembali
        </p>
      `,
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
      invoicePreview: '202508010001',
      incrementBy: 1,
      resetSequence: 'Daily',
      startingNumber: 1,
    },
  });

  const invoiceNumberConfigurations_formData = reactive<ISettingInvoiceNumberConfigurations>({
    invoicePreview: '202508010001',
    incrementBy: 1,
    resetSequence: 'Daily',
    startingNumber: 1,
  });

  const footerText_formData = reactive<{ text: string | null }>({
    text: 'please edit footer text here',
  });

  const settingInvoice_isEditableInvoiceConfiguration = ref<boolean>(false);

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
    },
  }));
  const settingInvoice_formValidations = useVuelidate(settingInvoice_formRules, settingInvoice_formData, {
    $autoDirty: true,
  });

  /**
   * @description Handle fetch api pos setting. We call the fetchSetting_detailInvoiceSetting function from the store to handle the request.
   */
  const settingInvoice_fetchSettingDetail = async (): Promise<void> => {
    try {
      await store.fetchSetting_detailInvoiceSetting(settingInvoice_formData.storeId, {
        ...httpAbort_registerAbort(SETTING_INVOICE_DETAIL_REQUEST),
      });
      // --- MAPPING LOGIC ---

      // Map top-level properties
      settingInvoice_formData.companyLogoUrl = setting_invoice.value?.companyLogoUrl ?? null;

      // Map general settings
      settingInvoice_formData.generalSettings.isAutomaticallyPrintReceipt =
        setting_invoice.value?.isAutomaticallyPrintReceipt ?? false;
      settingInvoice_formData.generalSettings.isAutomaticallyPrintKitchen =
        setting_invoice.value?.isAutomaticallyPrintKitchen ?? false;
      settingInvoice_formData.generalSettings.isAutomaticallyPrintTable =
        setting_invoice.value?.isAutomaticallyPrintTable ?? false;

      // Map content settings
      settingInvoice_formData.contentSettings.footerText = setting_invoice.value?.footerText ?? null;
      settingInvoice_formData.contentSettings.isShowCompanyLogo =
        setting_invoice.value?.isShowCompanyLogo ?? false;
      settingInvoice_formData.contentSettings.isShowStoreLocation =
        setting_invoice.value?.isShowStoreLocation ?? false;
      settingInvoice_formData.contentSettings.isHideCashierName =
        setting_invoice.value?.isHideCashierName ?? false;
      settingInvoice_formData.contentSettings.isHideOrderType = setting_invoice.value?.isHideOrderType ?? false;
      settingInvoice_formData.contentSettings.isHideQueueNumber =
        setting_invoice.value?.isHideQueueNumber ?? false;
      settingInvoice_formData.contentSettings.isShowTableNumber =
        setting_invoice.value?.isShowTableNumber ?? false;
      settingInvoice_formData.contentSettings.isHideItemPrices = setting_invoice.value?.isHideItemPrices ?? false;
      settingInvoice_formData.contentSettings.isShowFooter = setting_invoice.value?.isShowFooter ?? false;
      // Note: companyLogo might need special handling if it's a file upload object

      // Map invoice number configurations
      settingInvoice_formData.invoiceNumberConfigurations.incrementBy = setting_invoice.value?.incrementBy ?? null;
      settingInvoice_formData.invoiceNumberConfigurations.resetSequence =
        setting_invoice.value?.resetSequence ?? null;
      settingInvoice_formData.invoiceNumberConfigurations.startingNumber =
        setting_invoice.value?.startingNumber ?? null;
      settingInvoice_formData.invoiceNumberConfigurations.invoicePreview = generateInvoicePreview();
      // Note: 'invoicePreview' is not available in your API response, so its value remains unchanged.

      settingInvoice_mappingInvoiceDetail();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * Generates an invoice preview string based on the current date and a starting number.
   * The format is "YYYYMMDDXXXX", where YYYY is the year, MM is the month, DD is the day,
   * @returns {string} The formatted invoice preview string (e.g., "202507170001").
   */
  function generateInvoicePreview(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const numberPart = String(settingInvoice_formData.invoiceNumberConfigurations.startingNumber).padStart(4, '0');

    return `${year}${month}${day}${numberPart}`;
  }

  /**
   * @description Handle fetch api pos setting. We call  the fetchSetting_updateInvoiceSetting function from the store to handle the request.
   */
  const settingInvoice_fetchUpdateSettingInvoice = async (): Promise<void> => {
    try {
      const payload = settingInvoice_mappingPayloadToFormData();

      await store.fetchSetting_updateInvoiceSetting(payload, {
        ...httpAbort_registerAbort(SETTING_UPDATE_INVOICE_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Invoice setting has been updated successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      settingInvoice_isEditableInvoiceConfiguration.value = false;
    }
  };

  /**
   * @description Computed property that combines general and content settings into a single object
   */
  const settingInvoice_bindings = computed(
    (): IPropsInvoicePaper => ({
      companyLogoUrl: settingInvoice_formData.companyLogoUrl,
      ...settingInvoice_formData.generalSettings,
      ...settingInvoice_formData.contentSettings,
    }),
  );

  /**
   * @description Handle business logic for mapping invoice detail of general settings
   */
  const settingInvoice_mappingInvoiceDetailOfGeneralSettings = (): void => {
    for (const generalKey in settingInvoice_formData.generalSettings) {
      if (Object.hasOwn(setting_invoice.value!, generalKey)) {
        const value = setting_invoice.value![generalKey as keyof typeof setting_invoice.value];

        if (value !== null && value !== undefined) {
          if (typeof value === 'boolean') {
            settingInvoice_formData.generalSettings[
              generalKey as keyof typeof settingInvoice_formData.generalSettings
            ] = value;
          }
        }
      }
    }
  };

  /**
   * @description Handle business logic for mapping invoice detail of content settings
   */
  const settingInvoice_mappingInvoiceDetailOfContentSettings = (): void => {
    for (const contentKey in settingInvoice_formData.contentSettings) {
      if (contentKey === 'companyLogo') {
        const companyLogo = setting_invoice.value?.companyLogoUrl;

        if (typeof companyLogo === 'string') {
          settingInvoice_formData.companyLogoUrl = `${import.meta.env.VITE_APP_BASE_BUCKET_URL}${companyLogo}`;
        } else {
          settingInvoice_formData.companyLogoUrl = null;
        }

        return;
      }

      if (Object.hasOwn(setting_invoice.value!, contentKey)) {
        const value = setting_invoice.value![contentKey as keyof typeof setting_invoice.value];

        if (value !== null && value !== undefined) {
          (settingInvoice_formData.contentSettings as Record<string, unknown>)[contentKey] = value;
        }
      }
    }
  };

  /**
   * @description Handle business logic for mapping invoice detail of invoice number configurations
   */
  const settingInvoice_mappingInvoiceDetailOfInvoiceNumberConfigurations = (): void => {
    for (const invoiceConfigKey in settingInvoice_formData.invoiceNumberConfigurations) {
      if (Object.hasOwn(setting_invoice.value!, invoiceConfigKey)) {
        const value = setting_invoice.value![invoiceConfigKey as keyof typeof setting_invoice.value];

        if (value !== null && value !== undefined) {
          (settingInvoice_formData.invoiceNumberConfigurations as Record<string, unknown>)[invoiceConfigKey] =
            value;
        }
      }
    }
  };

  /**
   * @description Handle business logic for mapping default invoice detail
   */
  const settingInvoice_mappingDefaultInvoiceDetail = (key: string): void => {
    if (Object.hasOwn(setting_invoice.value!, key)) {
      if (key === 'companyLogoUrl') {
        return;
      }

      const value = setting_invoice.value![key as keyof typeof setting_invoice.value];

      if (value !== null && value !== undefined) {
        (settingInvoice_formData as Record<string, unknown>)[key] = value;
      }
    }
  };

  /**
   * @description Handle business logic for mapping invoice detail
   */
  const settingInvoice_mappingInvoiceDetail = (): void => {
    if (!setting_invoice.value) {
      return;
    }

    for (const key in settingInvoice_formData) {
      switch (key) {
        case 'generalSettings':
          settingInvoice_mappingInvoiceDetailOfGeneralSettings();

          break;
        case 'contentSettings':
          settingInvoice_mappingInvoiceDetailOfContentSettings();

          break;
        case 'invoiceNumberConfigurations':
          settingInvoice_mappingInvoiceDetailOfInvoiceNumberConfigurations();

          break;
        default:
          settingInvoice_mappingDefaultInvoiceDetail(key);

          break;
      }
    }
  };

  /**
   * @description Handle business logic for mapping payload into form data
   */
  const settingInvoice_mappingPayloadToFormData = (): FormData => {
    const mappedPayload = {
      storeId: settingInvoice_formData.storeId,
      ...settingInvoice_formData.contentSettings,
      ...settingInvoice_formData.generalSettings,
      ...settingInvoice_formData.invoiceNumberConfigurations,
    };

    // Create a new FormData object and append the mapped payload
    const formData = new FormData();

    Object.entries(mappedPayload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return formData;
  };

  /**
   * @description handle business logic for close dialog edit footer content
   */
  const settingInvoice_onCloseEditFooterContentDialog = (): void => {
    footerText_formData.text = settingInvoice_formData.contentSettings.footerText;

    const argsEventEmitter: IPropsDialog = {
      id: 'setting-invoice-dialog-footer-content',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description handle business logic for close dialog edit invoice number configuration
   */
  const settingInvoice_onCloseEditInvoiceNumberConfigurationDialog = (): void => {
    Object.assign(invoiceNumberConfigurations_formData, settingInvoice_formData.invoiceNumberConfigurations);
    settingInvoice_formData.invoiceNumberConfigurations.invoicePreview = generateInvoicePreview();

    const argsEventEmitter: IPropsDialog = {
      id: 'setting-invoice-dialog-invoice-configuration',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for show dialog edit footer content
   */
  const settingInvoice_onShowEditFooterContentDialog = (): void => {
    footerText_formData.text = settingInvoice_formData.contentSettings.footerText;

    const argsEventEmitter: IPropsDialog = {
      id: 'setting-invoice-dialog-footer-content',
      isOpen: true,
      isUsingClosableButton: false,
      width: '534px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for show dialog edit invoice number configuration
   */
  const settingInvoice_onShowEditInvoiceNumberConfigurationDialog = (): void => {
    Object.assign(invoiceNumberConfigurations_formData, settingInvoice_formData.invoiceNumberConfigurations);
    settingInvoice_formData.invoiceNumberConfigurations.invoicePreview = generateInvoicePreview();

    const argsEventEmitter: IPropsDialog = {
      id: 'setting-invoice-dialog-invoice-configuration',
      isOpen: true,
      isUsingClosableButton: false,
      width: '586px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for event click button update invoice setting
   */
  const settingInvoice_onUpdateSettingInvoice = async (): Promise<void> => {
    try {
      await settingInvoice_formValidations.value.$validate();

      if (settingInvoice_formValidations.value.$invalid) {
        return;
      }

      await settingInvoice_fetchUpdateSettingInvoice();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for uploading photo company logo
   */
  const settingInvoice_onUploadCompanylogo = (event: FileUploadSelectEvent) => {
    if (event.files && event.files.length > 0) {
      settingInvoice_formData.contentSettings.companyLogo = event.files[0]; // Assign the first file
    }
  };

  /**
   * @description handle business logic for button toggle editable invoice configuration
   */
  const settingInvoice_toggleEditableInvoiceConfiguration = (): void => {
    settingInvoice_isEditableInvoiceConfiguration.value = !settingInvoice_isEditableInvoiceConfiguration.value;
  };

  return {
    settingInvoice_activeTab,
    settingInvoice_bindings,
    settingInvoice_fetchSettingDetail,
    settingInvoice_formData,
    invoiceNumberConfigurations_formData,
    footerText_formData,
    settingInvoice_formValidations,
    settingInvoice_isEditableInvoiceConfiguration,
    settingInvoice_isLoading: setting_isLoading,
    settingInvoice_listContentSettings: LIST_CONTENT_SETTINGS_INVOICE,
    settingInvoice_listGeneralSettings: LIST_GENERAL_SETTINGS_INVOICE,
    settingInvoice_listInvoiceNumberContents: LIST_INVOICE_NUMBER_CONTENTS,
    settingInvoice_listResetSequences: LIST_TYPES_OF_RESET_SEQUENCE,
    settingInvoice_listTabsInvoicePreview: LIST_TABS_INVOICE_PREVIEW,
    settingInvoice_onCloseEditFooterContentDialog,
    settingInvoice_onCloseEditInvoiceNumberConfigurationDialog,
    settingInvoice_onShowEditFooterContentDialog,
    settingInvoice_onShowEditInvoiceNumberConfigurationDialog,
    settingInvoice_onUpdateSettingInvoice,
    settingInvoice_onUploadCompanylogo,
    settingInvoice_toggleEditableInvoiceConfiguration,
  };
};
