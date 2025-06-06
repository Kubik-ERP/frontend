<script setup lang="ts">
// Interfaces
import type { ISettingInvoiceProvided } from '../../interfaces/setting-invoice.interface';

/**
 * @description Inject all the data and methods what we need
 */
const { settingInvoice_activeTab, settingInvoice_listTabsInvoicePreview } =
  inject<ISettingInvoiceProvided>('settingInvoice')!;
</script>

<template>
  <section id="invoice-preview" class="col-span-4 flex flex-col gap-6">
    <header class="flex flex-col w-full gap-2">
      <h5 class="font-semibold text-black text-lg">Invoice Preview</h5>

      <AppBaseTabs
        v-model:value="settingInvoice_activeTab"
        :items="settingInvoice_listTabsInvoicePreview"
        size="small"
      />
    </header>
  </section>
</template>
