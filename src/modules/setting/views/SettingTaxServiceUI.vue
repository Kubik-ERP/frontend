<script setup lang="ts">
// Components
import SettingServiceContent from '../components/setting-tax-service/SettingServiceContent.vue';
import SettingTaxContent from '../components/setting-tax-service/SettingTaxContent.vue';

// Services
import { useSettingTaxAndServiceService } from '../services/setting-tax-service.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  settingTaxService_fetchListCharges,
  settingTaxService_formDataOfService,
  settingTaxService_formDataOfTax,
  settingTaxService_formValidationsOfService,
  settingTaxService_formValidationsOfTax,
  settingTaxService_isLoading,
  settingTaxService_onSubmit,
} = useSettingTaxAndServiceService();

/**
 * @description Provide all the data and methods what we need
 */
provide('settingTaxService', {
  settingTaxService_fetchListCharges,
  settingTaxService_formDataOfService,
  settingTaxService_formDataOfTax,
  settingTaxService_formValidationsOfService,
  settingTaxService_formValidationsOfTax,
  settingTaxService_isLoading,
  settingTaxService_onSubmit,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await settingTaxService_fetchListCharges();
});
</script>

<template>
  <section id="setting-tax-service" class="grid-wrapper gap-4">
    <SettingTaxContent />
    <SettingServiceContent />
  </section>
</template>
