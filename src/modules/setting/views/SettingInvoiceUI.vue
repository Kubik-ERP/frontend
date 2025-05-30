<script setup lang="ts">
// Components
import SettingInvoiceConfiguration from '../components/SettingInvoiceConfiguration.vue';
import SettingInvoicePreview from '../components/SettingInvoicePreview.vue';

// Services
import { useSettingInvoiceService } from '../services/setting-invoice.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  settingInvoice_activeTab,
  settingInvoice_bindings,
  settingInvoice_formData,
  settingInvoice_isEditableInvoiceConfiguration,
  settingInvoice_listContentSettings,
  settingInvoice_listGeneralSettings,
  settingInvoice_listInvoiceNumberContents,
  settingInvoice_listTabsInvoicePreview,
  settingInvoice_toggleEditableInvoiceConfiguration,
} = useSettingInvoiceService();

/**
 * @description Provide all the data and methods what we need
 */
provide('settingInvoice', {
  settingInvoice_activeTab,
  settingInvoice_bindings,
  settingInvoice_formData,
  settingInvoice_isEditableInvoiceConfiguration,
  settingInvoice_listContentSettings,
  settingInvoice_listGeneralSettings,
  settingInvoice_listInvoiceNumberContents,
  settingInvoice_listTabsInvoicePreview,
  settingInvoice_toggleEditableInvoiceConfiguration,
})
</script>

<template>
  <section id="setting-invoice" class="grid-wrapper gap-8">
    <SettingInvoiceConfiguration />
    <SettingInvoicePreview />
  </section>
</template>
