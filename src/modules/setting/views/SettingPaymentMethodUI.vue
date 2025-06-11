<script setup lang="ts">
// COmponents
import SettingPaymentMethodCreateEditDialog from '../components/setting-payment-method/SettingPaymentMethodCreateEditDialog.vue';

// Services
import { useSettingPaymentMethodService } from '../services/setting-payment-method.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  settingPaymentMethod_fetchListPaymentMethods,
  settingPaymentMethod_formData,
  settingPaymentMethod_formValidations,
  settingPaymentMethod_isLoading,
  settingPaymentMethod_listColumns,
  settingPaymentMethod_listValues,
  settingPaymentMethod_onClose,
  settingPaymentMethod_onCreateOrEdit,
  settingPaymentMethod_onDeactivate,
  settingPaymentMethod_onSubmit,
} = useSettingPaymentMethodService();

/**
 * @description Provide all the data and methods what we need
 */
provide('settingPaymentMethod', {
  settingPaymentMethod_formData,
  settingPaymentMethod_formValidations,
  settingPaymentMethod_isLoading,
  settingPaymentMethod_onClose,
  settingPaymentMethod_onDeactivate,
  settingPaymentMethod_onSubmit,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await settingPaymentMethod_fetchListPaymentMethods();
});
</script>

<template>
  <section id="setting-payment-method" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      btn-cta-create-title="Add Payment Method"
      :columns="settingPaymentMethod_listColumns"
      :data="settingPaymentMethod_listValues"
      header-title="Payment Methods"
      is-using-btn-cta-create
      is-using-custom-body
      :is-using-filter="false"
      :is-using-pagination="false"
      @click-btn-cta-create="settingPaymentMethod_onCreateOrEdit"
    >
      <template #body="{ column, data, index }">
        <template v-if="column.value === 'index'">
          <span class="font-normal text-sm text-text-primary">{{ index + 1 }}</span>
        </template>

        <template v-else-if="column.value === 'action'">
          <PrimeVueButton
            variant="text"
            rounded
            aria-label="detail"
            @click="settingPaymentMethod_onCreateOrEdit(data)"
          >
            <template #icon>
              <AppBaseSvg name="edit" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>
        </template>

        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>

    <SettingPaymentMethodCreateEditDialog />
    <AppBaseDialogConfirmation id="setting-payment-method-delete-confirmation-dialog" />
  </section>
</template>
