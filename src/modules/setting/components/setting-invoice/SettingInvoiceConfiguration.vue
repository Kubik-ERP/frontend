<script setup lang="ts">
// Interfaces
import type {
  ISettingInvoiceContentSettings,
  ISettingInvoiceGeneralSettings,
  ISettingInvoiceNumberConfigurations,
  ISettingInvoiceProvided,
} from '../../interfaces/setting-invoice.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  settingInvoice_formData,
  settingInvoice_formValidations,
  settingInvoice_isEditableInvoiceConfiguration,
  settingInvoice_isLoading,
  settingInvoice_listContentSettings,
  settingInvoice_listGeneralSettings,
  settingInvoice_listInvoiceNumberContents,
  settingInvoice_onShowEditFooterContentDialog,
  settingInvoice_onShowEditInvoiceNumberConfigurationDialog,
  settingInvoice_onUpdateSettingInvoice,
  settingInvoice_onUploadCompanylogo,
  settingInvoice_toggleEditableInvoiceConfiguration,
} = inject<ISettingInvoiceProvided>('settingInvoice')!;
</script>

<template>
  <section id="invoice-configuration" class="col-span-8 flex flex-col gap-2">
    <header class="flex items-center justify-between w-full">
      <h5 class="font-semibold text-black text-lg">Invoice Configuration</h5>

      <div
        class="flex items-center gap-2 cursor-pointer"
        @click="settingInvoice_toggleEditableInvoiceConfiguration"
      >
        <AppBaseSvg name="edit" />
        <span class="font-semibold text-primary text-sm"> Edit Invoice Config </span>
      </div>
    </header>

    <PrimeVueCard class="w-full border border-solid border-grayscale-20 shadow-none">
      <template #content>
        <section id="form-group" class="flex flex-col gap-4">
          <h6 class="font-semibold text-black-secondary text-sm">General Settings</h6>

          <section
            v-for="(generalSetting, generalSettingIndex) in settingInvoice_listGeneralSettings"
            :id="generalSetting.id"
            :key="`general-setting-${generalSettingIndex}`"
            class="flex items-center gap-3"
          >
            <PrimeVueCheckbox
              :id="`is-${generalSetting.id}`"
              v-model="
                settingInvoice_formData.generalSettings[generalSetting.key as keyof ISettingInvoiceGeneralSettings]
              "
              :disabled="!settingInvoice_isEditableInvoiceConfiguration"
              binary
            />

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
          <h6 class="font-semibold text-black-secondary text-sm">Content Settings</h6>

          <section
            v-for="(contentSetting, contentSettingIndex) in settingInvoice_listContentSettings"
            :id="contentSetting.id"
            :key="`content-setting-${contentSettingIndex}`"
            class="flex items-center gap-3 w-full"
          >
            <section
              id="content-setting"
              class="flex justify-between w-full"
              :class="[contentSetting.id === 'show-company-logo' ? 'items-start' : 'items-center']"
            >
              <section id="form-group" class="flex gap-3">
                <PrimeVueCheckbox
                  :id="`is-${contentSetting.id}`"
                  v-model="
                    settingInvoice_formData.contentSettings[
                      contentSetting.key as keyof ISettingInvoiceContentSettings
                    ]
                  "
                  :disabled="!settingInvoice_isEditableInvoiceConfiguration"
                  binary
                />

                <label :for="`is-${contentSetting.id}`" class="font-normal text-sm text-text-primary">
                  {{ contentSetting.label }}
                </label>
              </section>

              <template v-if="settingInvoice_isEditableInvoiceConfiguration">
                <template v-if="contentSetting.id === 'show-company-logo'">
                  <div class="flex flex-col items-end gap-2">
                    <PrimeVueFileUpload
                      v-model="settingInvoice_formData.contentSettings.companyLogo"
                      url="/api/upload"
                      accept="image/*"
                      custom-upload
                      :max-file-size="1000000"
                      :show-cancel-button="false"
                      :show-upload-button="false"
                      :pt="{
                        content: 'hidden',
                        header: 'p-0',
                      }"
                      @select="settingInvoice_onUploadCompanylogo"
                    >
                      <template #header="{ chooseCallback }">
                        <PrimeVueButton
                          class="text-primary border-solid border-primary basic-smooth-animation hover:bg-grayscale-10 w-fit px-[18px]"
                          severity="secondary"
                          variant="outlined"
                          @click="chooseCallback()"
                        >
                          <template #default>
                            <section id="content" class="flex items-center gap-2">
                              <AppBaseSvg name="image" />
                              <span class="font-normal text-sm">Change Image</span>
                            </section>
                          </template>
                        </PrimeVueButton>
                      </template>
                    </PrimeVueFileUpload>

                    <section id="description" class="flex gap-3">
                      <AppBaseSvg name="info" />
                      <span class="font-normal text-black-secondary text-xs">
                        Only square images (1:1 ratio) are supported. <br />
                        Please adjust your image before uploading.
                      </span>
                    </section>
                  </div>
                </template>

                <template v-if="contentSetting.id === 'show-footer'">
                  <div
                    class="flex items-center gap-2 cursor-pointer"
                    @click="settingInvoice_onShowEditFooterContentDialog"
                  >
                    <AppBaseSvg name="edit" />
                    <span class="font-semibold text-primary text-sm"> Edit footer content </span>
                  </div>
                </template>
              </template>
            </section>
          </section>
        </section>
      </template>
    </PrimeVueCard>

    <PrimeVueCard class="w-full border border-solid border-grayscale-20 shadow-none">
      <template #content>
        <section id="invoice-number" class="flex flex-col gap-4">
          <header class="flex items-center justify-between w-full">
            <h6 class="font-semibold text-black-secondary text-sm">Invoice Number</h6>

            <PrimeVueButton
              v-if="settingInvoice_isEditableInvoiceConfiguration"
              class="text-primary border-solid border-primary basic-smooth-animation hover:bg-grayscale-10 w-fit px-[18px]"
              severity="secondary"
              variant="outlined"
              @click="settingInvoice_onShowEditInvoiceNumberConfigurationDialog"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2">
                  <AppBaseSvg name="settings" />
                  <span class="font-normal text-sm">Invoice Number Configuration</span>
                </section>
              </template>
            </PrimeVueButton>
          </header>

          <section id="invoice-number-content" class="grid-wrapper gap-4">
            <div
              v-for="(invoiceNumberContent, invoiceNumberContentIndex) in settingInvoice_listInvoiceNumberContents"
              :key="`invoice-number-content-${invoiceNumberContentIndex}`"
              class="flex flex-col col-span-full md:col-span-6 gap-1"
            >
              <p class="font-normal text-text-secondary text-sm">
                {{ invoiceNumberContent.label }}
              </p>

              <span class="font-normal text-text-primary text-sm">
                {{
                  settingInvoice_formData.invoiceNumberConfigurations[
                    invoiceNumberContent.key as keyof ISettingInvoiceNumberConfigurations
                  ]
                }}
              </span>
            </div>
          </section>
        </section>
      </template>
    </PrimeVueCard>

    <section
      v-if="settingInvoice_isEditableInvoiceConfiguration"
      id="btn-actions"
      class="flex items-center w-full gap-4 mt-8"
    >
      <PrimeVueButton
        class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
        label="Cancel"
        severity="secondary"
        variant="outlined"
      />

      <PrimeVueButton
        class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40"
        label="Update"
        type="button"
        :disabled="settingInvoice_formValidations.$invalid"
        :loading="settingInvoice_isLoading"
        @click="settingInvoice_onUpdateSettingInvoice"
      />
    </section>
  </section>
</template>
