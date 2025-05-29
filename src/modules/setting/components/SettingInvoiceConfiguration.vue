<script setup lang="ts">
// Interfaces
import type { ISettingInvoiceContentSettings, ISettingInvoiceGeneralSettings, ISettingInvoiceProvided } from '../interfaces/setting-invoice.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  settingInvoice_formData,
  settingInvoice_isEditableInvoiceConfiguration,
  settingInvoice_listContentSettings,
  settingInvoice_listGeneralSettings,
  settingInvoice_listInvoiceNumberContents,
  settingInvoice_toggleEditableInvoiceConfiguration,
} = inject<ISettingInvoiceProvided>('settingInvoice')!;
</script>

<template>
  <section id="invoice-configuration" class="col-span-8 flex flex-col gap-2">
    <header class="flex items-center justify-between w-full">
      <h5 class="font-semibold text-black text-lg">Invoice Configuration</h5>

      <div class="flex items-center gap-2 cursor-pointer" @click="settingInvoice_toggleEditableInvoiceConfiguration">
        <AppBaseSvg name="edit" />
        <span class="font-semibold text-primary text-sm"> Edit Invoice Config </span>
      </div>
    </header>

    <PrimeVueCard class="w-full border border-solid border-grayscale-20 shadow-none">
      <template #content>
        <section id="form-group" class="flex flex-col gap-4">
          <h6 class="font-semibold text-black-secondary text-sm">
            General Settings
          </h6>

          <section v-for="(generalSetting, generalSettingIndex) in settingInvoice_listGeneralSettings" :key="`general-setting-${generalSettingIndex}`" :id="generalSetting.id" class="flex items-center gap-3">
            <PrimeVueCheckbox v-model="settingInvoice_formData.generalSettings[generalSetting.key as keyof ISettingInvoiceGeneralSettings]" :id="`is-${generalSetting.id}`" :disabled="settingInvoice_isEditableInvoiceConfiguration" binary />

            <label :for="`is-${generalSetting.id}`" class="font-normal text-sm text-text-primary">
              {{ generalSetting.label }}
            </label>
          </section>
        </section>
      </template>
    </PrimeVueCard>

    <PrimeVueCard class="w-full border border-solid border-grayscale-20 shadow-none">
      <template #content>
        <section id="form-group" class="flex flex-col gap-4">
          <h6 class="font-semibold text-black-secondary text-sm">
            Content Settings
          </h6>

          <section v-for="(contentSetting, contentSettingIndex) in settingInvoice_listContentSettings" :key="`content-setting-${contentSettingIndex}`" :id="contentSetting.id" class="flex items-center gap-3">
            <PrimeVueCheckbox v-model="settingInvoice_formData.contentSettings[contentSetting.key as keyof ISettingInvoiceContentSettings]" :id="`is-${contentSetting.id}`" :disabled="settingInvoice_isEditableInvoiceConfiguration" binary />

            <label :for="`is-${contentSetting.id}`" class="font-normal text-sm text-text-primary">
              {{ contentSetting.label }}
            </label>
          </section>
        </section>
      </template>
    </PrimeVueCard>

    <PrimeVueCard class="w-full border border-solid border-grayscale-20 shadow-none">
      <template #content>
        <section id="invoice-number" class="flex flex-col gap-4">
          <h6 class="font-semibold text-black-secondary text-sm">
            Content Settings
          </h6>

          <section id="invoice-number-content" class="grid-wrapper gap-4">
            <div v-for="(invoiceNumberContent, invoiceNumberContentIndex) in settingInvoice_listInvoiceNumberContents" :key="`invoice-number-content-${invoiceNumberContentIndex}`" class="flex flex-col col-span-full md:col-span-6 gap-1">
              <p class="font-normal text-text-secondary text-sm">
                {{ invoiceNumberContent.label }}
              </p>

              <span class="font-normal text-text-primary text-sm">
                10001
              </span>
            </div>
          </section>
        </section>
      </template>
    </PrimeVueCard>
  </section>
</template>

