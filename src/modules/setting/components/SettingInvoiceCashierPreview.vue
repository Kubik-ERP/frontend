<script setup lang="ts">
// Interfaces
import type { ISettingInvoiceProvided } from '../interfaces/setting-invoice.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  settingInvoice_bindings
} = inject<ISettingInvoiceProvided>('settingInvoice')!;
</script>

<template>
  <section id="setting-invoice-cashier-preview">
    <AppBaseInvoicePaper v-bind="settingInvoice_bindings" />
  </section>
</template>