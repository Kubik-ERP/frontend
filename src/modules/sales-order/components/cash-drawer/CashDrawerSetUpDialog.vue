<script setup lang="ts">
// Interfaces
import type { ICashDrawerProvided } from '../../interfaces/cash-drawer.interface';

/**
 * @description Inject all the data and methods what we need
 */
const { cashDrawer_formData, cashDrawer_formValidations, cashDrawer_onCloseRegister } = inject(
  'cashDrawer',
) as ICashDrawerProvided;
</script>

<template>
  <AppBaseDialog id="cash-drawer-setup-dialog">
    <template #header>
      <header class="flex flex-col gap-2">
        <h6 class="font-semibold text-black text-lg">Set Up Cash Drawer</h6>

        <span class="font-normal text-black-secondary text-sm">
          Please enter the opening cash amount to ensure accurate transactions.
        </span>
      </header>
    </template>

    <template #content>
      <form action="" class="grid-wrapper gap-4">
        <section id="form-group" class="flex flex-col col-span-full lg:col-span-6 gap-4">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="open-balance"
            name="Open Register Balance"
            spacing-bottom="mb-0"
            :validators="cashDrawer_formValidations.openBalance"
          >
            <PrimeVueInputNumber
              v-model="cashDrawer_formData.openBalance"
              prefix="Rp "
              fluid
              :class="{
                ...classes,
              }"
              placeholder="Rp 0,00"
            />
          </AppBaseFormGroup>

          <section id="list-balances" class="flex flex-wrap items-center gap-2 w-full">
            <PrimeVueChip v-for="index in 5" :key="index" class="bg-secondary-background">
              <template #default>
                <div class="flex items-center gap-2">
                  <AppBaseSvg name="plus-line" class="!w-[10px] !h-[10px]" />

                  <span class="font-semibold text-green-primary text-xs">
                    {{ useCurrencyFormat(100000) }}
                  </span>
                </div>
              </template>
            </PrimeVueChip>
          </section>
        </section>

        <section id="form-group" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="staff"
            name="Staff"
            spacing-bottom="mb-0"
            :validators="cashDrawer_formValidations.staffName"
          >
            <PrimeVueInputText
              v-model="cashDrawer_formData.staffName"
              placeholder=""
              class="text-sm w-full"
              :class="{ ...classes }"
            />
          </AppBaseFormGroup>
        </section>

        <section id="form-group" class="col-span-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="notes"
            name="Notes"
            spacing-bottom="mb-0"
            :validators="cashDrawer_formValidations.notes"
          >
            <PrimeVueIconField>
              <PrimeVueTextarea
                v-model="cashDrawer_formData.notes"
                placeholder="Describe open register notes here"
                class="text-sm w-full"
                rows="5"
                :class="{ ...classes }"
              />
            </PrimeVueIconField>
          </AppBaseFormGroup>
        </section>
      </form>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border-2 border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="cashDrawer_onCloseRegister"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40"
          label="Save"
          type="button"
          :disabled="cashDrawer_formValidations.$invalid"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
