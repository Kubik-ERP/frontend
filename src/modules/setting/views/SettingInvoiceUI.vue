<script setup lang="ts">
// Components
import SettingInvoiceConfiguration from '../components/SettingInvoiceConfiguration.vue';
import SettingInvoiceDialogFooterContent from '../components/SettingInvoiceDialogFooterContent.vue';
import SettingInvoiceDialogInvoiceConfiguration from '../components/SettingInvoiceDialogInvoiceConfiguration.vue';
import SettingInvoicePreview from '../components/SettingInvoicePreview.vue';

// Services
import { useSettingInvoiceService } from '../services/setting-invoice.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  settingInvoice_activeTab,
  settingInvoice_bindings,
  settingInvoice_fetchSettingDetail,
  settingInvoice_formData,
  settingInvoice_formValidations,
  settingInvoice_isEditableInvoiceConfiguration,
  settingInvoice_isLoading,
  settingInvoice_listContentSettings,
  settingInvoice_listGeneralSettings,
  settingInvoice_listInvoiceNumberContents,
  settingInvoice_listResetSequences,
  settingInvoice_listTabsInvoicePreview,
  settingInvoice_onCloseEditFooterContentDialog,
  settingInvoice_onCloseEditInvoiceNumberConfigurationDialog,
  settingInvoice_onShowEditFooterContentDialog,
  settingInvoice_onShowEditInvoiceNumberConfigurationDialog,
  settingInvoice_onUpdateSettingInvoice,
  settingInvoice_onUploadCompanylogo,
  settingInvoice_toggleEditableInvoiceConfiguration,
} = useSettingInvoiceService();

/**
 * @description Provide all the data and methods what we need
 */
provide('settingInvoice', {
  settingInvoice_activeTab,
  settingInvoice_bindings,
  settingInvoice_formData,
  settingInvoice_formValidations,
  settingInvoice_isEditableInvoiceConfiguration,
  settingInvoice_isLoading,
  settingInvoice_listContentSettings,
  settingInvoice_listGeneralSettings,
  settingInvoice_listInvoiceNumberContents,
  settingInvoice_listResetSequences,
  settingInvoice_listTabsInvoicePreview,
  settingInvoice_onCloseEditFooterContentDialog,
  settingInvoice_onCloseEditInvoiceNumberConfigurationDialog,
  settingInvoice_onShowEditFooterContentDialog,
  settingInvoice_onShowEditInvoiceNumberConfigurationDialog,
  settingInvoice_onUpdateSettingInvoice,
  settingInvoice_onUploadCompanylogo,
  settingInvoice_toggleEditableInvoiceConfiguration,
})

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await settingInvoice_fetchSettingDetail();
});
</script>

<template>
  <section id="setting-invoice" class="grid-wrapper gap-8">
    <SettingInvoiceConfiguration />
    <SettingInvoicePreview />
    <SettingInvoiceDialogFooterContent />
    <SettingInvoiceDialogInvoiceConfiguration />
  </section>
</template>
