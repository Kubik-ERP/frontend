<script setup lang="ts">
// Interfaces
import type { ICashDrawerListProvided } from '../interfaces/cash-drawer-list.interface';
import type { IStaffMemberListProvided } from '@/modules/staff-member/interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashDrawerList_formDataOfOpenRegister,
  cashDrawerList_formValidationsOfOpenRegister,
  cashDrawerList_isLoading,
  cashDrawerList_onCloseOpenRegisterDialog,
  cashDrawerList_onSubmitOpenRegisterForm,
  cashDrawerList_suggestionRegisterBalance,
} = inject('cashDrawerList') as ICashDrawerListProvided;

const { staffMemberList_dropdownItemStaff } = inject('staffMemberList') as IStaffMemberListProvided;
</script>

<template>
  <AppBaseDialog id="cash-drawer-list-open-register-dialog">
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
            :validators="cashDrawerList_formValidationsOfOpenRegister.balance"
          >
            <PrimeVueInputNumber
              v-model="cashDrawerList_formDataOfOpenRegister.balance"
              prefix="Rp "
              fluid
              :class="{
                ...classes,
              }"
              placeholder="Rp 0,00"
            />
          </AppBaseFormGroup>

          <section id="list-balances" class="flex flex-wrap items-center gap-2 w-full">
            <PrimeVueChip
              v-for="suggestionPrice in cashDrawerList_suggestionRegisterBalance"
              :key="suggestionPrice"
              class="bg-secondary-background cursor-pointer hover:bg-secondary basic-smooth-animation"
              @click="cashDrawerList_formDataOfOpenRegister.balance = suggestionPrice"
            >
              <template #default>
                <div class="flex items-center gap-2">
                  <AppBaseSvg name="plus-line" class="!w-[10px] !h-[10px]" />

                  <span class="font-semibold text-green-primary text-xs">
                    {{ useCurrencyFormat(suggestionPrice) }}
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
            :validators="cashDrawerList_formValidationsOfOpenRegister.userId"
          >
            <PrimeVueSelect
              id="staff"
              v-model="cashDrawerList_formDataOfOpenRegister.userId"
              filter
              :options="staffMemberList_dropdownItemStaff"
              option-label="label"
              option-value="value"
              placeholder="Select Staff"
              class="text-base text-text-primary w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(cashDrawerList_formValidationsOfOpenRegister, 'userId')"
            />
          </AppBaseFormGroup>
        </section>

        <section id="form-group" class="flex flex-col col-span-full gap-2">
          <label for="notes" class="font-normal text-sm text-text-secondary"> Notes </label>

          <PrimeVueIconField>
            <PrimeVueTextarea
              id="notes"
              v-model="cashDrawerList_formDataOfOpenRegister.notes"
              placeholder="Describe open register notes here"
              class="text-sm w-full"
              rows="5"
            />
          </PrimeVueIconField>
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
          @click="cashDrawerList_onCloseOpenRegisterDialog"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40"
          label="Save"
          type="button"
          :disabled="cashDrawerList_formValidationsOfOpenRegister.$invalid || cashDrawerList_isLoading"
          @click="cashDrawerList_onSubmitOpenRegisterForm"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
