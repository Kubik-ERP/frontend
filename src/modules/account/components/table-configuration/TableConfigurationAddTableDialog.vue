<script setup lang="ts">
// Interfaces
import type { IAccountStoreTableConfigurationProvided } from '../../interfaces';

// Qrcode
import Qrcode from 'qrcode.vue';

// Stores
import { useOutletStore } from '@/modules/outlet/store';

/**
 * @description Injected variables
 */
const outletStore = useOutletStore();
const { outlet_selectedOutletOnAccountPage } = storeToRefs(outletStore);

/**
 * @description Inject all the data and methods what we need
 */
const {
  accountStoreTableConfiguration_formDataOfAddTable,
  accountStoreTableConfiguration_formValidationsOfAddTable,
  accountStoreTableConfiguration_isEditableMode,
  accountStoreTableConfiguration_listShapes,
  accountStoreTableConfiguration_onCloseDialogAddTable,
  accountStoreTableConfiguration_onShowDialogDeleteTable,
  accountStoreTableConfiguration_onShowDialogEnableQrCode,
  accountStoreTableConfiguration_onSubmitFormAddTable,
} = inject<IAccountStoreTableConfigurationProvided>('accountStoreTableConfiguration')!;
</script>

<template>
  <AppBaseDialog id="table-configuration-add-table-dialog">
    <template #header>
      <h5 class="font-semibold text-black text-lg">
        {{
          accountStoreTableConfiguration_isEditableMode
            ? useLocalization('account.edit-table')
            : useLocalization('account.add-table')
        }}
      </h5>
    </template>

    <template #content>
      <section id="form-groups" class="grid-wrapper gap-4">
        <section id="floor" class="col-span-full flex flex-col gap-1">
          <span class="font-normal text-grayscale-70 text-sm">{{
            useLocalization('account.form.floor-name')
          }}</span>

          <p class="font-normal text-base text-primary">
            {{ accountStoreTableConfiguration_formDataOfAddTable.floorName }}
          </p>
        </section>

        <section id="form-input" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="table-name"
            :name="useLocalization('account.form.table-name')"
            spacing-bottom="mb-0"
            :validators="accountStoreTableConfiguration_formValidationsOfAddTable.name"
          >
            <PrimeVueInputText
              v-model="accountStoreTableConfiguration_formDataOfAddTable.name"
              :class="{ ...classes }"
              class="text-sm w-full"
              v-on="useListenerForm(accountStoreTableConfiguration_formValidationsOfAddTable, 'name')"
            />
          </AppBaseFormGroup>
        </section>

        <section id="form-input" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="seat-count"
            :name="useLocalization('account.form.seat-count')"
            spacing-bottom="mb-0"
            :validators="accountStoreTableConfiguration_formValidationsOfAddTable.seats"
          >
            <PrimeVueInputGroup>
              <PrimeVueInputNumber
                v-model="accountStoreTableConfiguration_formDataOfAddTable.seats"
                fluid
                :class="{
                  ...classes,
                }"
                placeholder="0"
                v-on="useListenerForm(accountStoreTableConfiguration_formValidationsOfAddTable, 'seats')"
              />

              <PrimeVueInputGroupAddon>
                <span class="font-normal text-text-disabled text-sm"> Seats </span>
              </PrimeVueInputGroupAddon>
            </PrimeVueInputGroup>
          </AppBaseFormGroup>
        </section>

        <section id="form-input" class="col-span-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="table-shape"
            :name="useLocalization('account.form.table-shape')"
            spacing-bottom="mb-0"
            :validators="accountStoreTableConfiguration_formValidationsOfAddTable.shape"
          >
            <PrimeVueSelect
              v-model="accountStoreTableConfiguration_formDataOfAddTable.shape"
              :options="accountStoreTableConfiguration_listShapes"
              option-label="label"
              option-value="value"
              placeholder="Select Table Shape"
              class="text-sm w-full"
              filter
              :class="{ ...classes }"
              v-on="useListenerForm(accountStoreTableConfiguration_formValidationsOfAddTable, 'shape')"
            />
          </AppBaseFormGroup>
        </section>

        <section id="form-input" class="col-span-full flex flex-col gap-2">
          <template v-if="accountStoreTableConfiguration_formDataOfAddTable.isEnableQrCode">
            <span class="font-normal text-grayscale-70 text-xs"> Table QR Code </span>

            <div class="flex items-center gap-2">
              <Qrcode
                :value="`${APP_BASE_URL}/self-order/login?storeId=${outlet_selectedOutletOnAccountPage?.id}&floorName=${accountStoreTableConfiguration_formDataOfAddTable.floorName}&tablesName=${accountStoreTableConfiguration_formDataOfAddTable.name}`"
              />

              <PrimeVueButton
                class="border border-solid border-error-hover w-fit px-4 py-3"
                variant="text"
                @click="accountStoreTableConfiguration_formDataOfAddTable.isEnableQrCode = false"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="delete" class="!w-4 !h-4" />
                    <span class="font-semibold text-sm text-error-main">Remove Table QR Code</span>
                  </section>
                </template>
              </PrimeVueButton>
            </div>
          </template>

          <template v-else>
            <div class="flex gap-4">
              <PrimeVueCheckbox
                v-model="accountStoreTableConfiguration_formDataOfAddTable.isEnableQrCode"
                binary
                @change="accountStoreTableConfiguration_onShowDialogEnableQrCode"
              />

              <div class="flex flex-col gap-1">
                <span class="font-normal text-text-primary text-sm"> Enable QR Code for Customer Self-Order </span>

                <span class="font-normal text-grayscale-70 text-sm">
                  Generate a QR code with table details for customers to order directly from their devices
                </span>
              </div>
            </div>
          </template>
        </section>
      </section>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          v-if="accountStoreTableConfiguration_isEditableMode"
          class="w-full px-4 py-3"
          variant="text"
          @click="
            accountStoreTableConfiguration_onShowDialogDeleteTable(
              accountStoreTableConfiguration_formDataOfAddTable.floorName,
              accountStoreTableConfiguration_formDataOfAddTable.name,
            )
          "
        >
          <template #default>
            <section id="content" class="flex items-center gap-2 w-full">
              <AppBaseSvg name="delete" class="!w-5 !h-5" />
              <span class="font-semibold text-base text-error-main">Delete Table</span>
            </section>
          </template>
        </PrimeVueButton>

        <PrimeVueButton
          class="font-semibold text-base text-center text-primary w-full border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10 py-3"
          :label="useLocalization('account.buttons.cancel')"
          severity="secondary"
          variant="outlined"
          @click="accountStoreTableConfiguration_onCloseDialogAddTable"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base text-center py-3 w-full"
          :label="
            accountStoreTableConfiguration_isEditableMode
              ? useLocalization('account.buttons.update')
              : useLocalization('account.buttons.add-table')
          "
          type="button"
          @click="accountStoreTableConfiguration_onSubmitFormAddTable"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
