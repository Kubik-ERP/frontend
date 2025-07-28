<script setup lang="ts">
// Interfaces
import type { ICashDrawerCashRegisterProvide } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashDrawerCashRegister_formDataOfTransaction,
  cashDrawerCashRegister_formValidationsOfTransaction,
  cashDrawerCashRegister_isLoading,
  cashDrawerCashRegister_onCloseDialogAddTransaction,
  cashDrawerCashRegister_onSubmitAddTransaction,
  cashDrawerCashRegister_suggestionRegisterBalance,
  cashDrawerCashRegister_typeOfTransaction,
} = inject('cashDrawerCashRegister') as ICashDrawerCashRegisterProvide;
</script>

<template>
  <AppBaseDialog id="cash-drawer-add-transaction-dialog">
    <template #header>
      <header class="flex flex-col gap-2">
        <h6 class="font-semibold text-black text-lg">
          {{ cashDrawerCashRegister_typeOfTransaction === 'in' ? 'Cash In' : 'Cash Out' }}
        </h6>
      </header>
    </template>

    <template #content>
      <form class="grid-wrapper gap-4">
        <section id="form-group" class="col-span-full flex flex-col gap-4">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-normal leading-6 text-grayscale-70 w-full"
            is-name-as-label
            label-for="open-balance"
            :name="`Cash ${cashDrawerCashRegister_typeOfTransaction === 'in' ? 'In' : 'Out'} Amount`"
            spacing-bottom="mb-0"
            :validators="cashDrawerCashRegister_formValidationsOfTransaction.amount"
          >
            <PrimeVueInputNumber
              v-model="cashDrawerCashRegister_formDataOfTransaction.amount"
              prefix="Rp "
              fluid
              :class="{
                ...classes,
              }"
              placeholder="Rp 0,00"
            />
          </AppBaseFormGroup>
        </section>

        <section id="list-balances" class="col-span-full flex flex-wrap items-center gap-2">
          <PrimeVueChip
            v-for="suggestionPrice in cashDrawerCashRegister_suggestionRegisterBalance.reverse()"
            :key="suggestionPrice"
            class="bg-secondary-background cursor-pointer hover:bg-secondary basic-smooth-animation"
            @click="cashDrawerCashRegister_formDataOfTransaction.amount = suggestionPrice"
          >
            <template #default>
              <div class="flex items-center gap-2">
                <AppBaseSvg name="plus-line" class="!w-[10px] !h-[10px]" />

                <span class="font-semibold text-green-primary text-xs">
                  {{
                    useCurrencyFormat({
                      data: suggestionPrice,
                      addSuffix: true,
                    })
                  }}
                </span>
              </div>
            </template>
          </PrimeVueChip>
        </section>

        <section id="form-group" class="flex flex-col col-span-full gap-2">
          <label for="notes" class="font-normal text-sm text-text-secondary"> Notes </label>

          <PrimeVueIconField>
            <PrimeVueTextarea
              id="notes"
              v-model="cashDrawerCashRegister_formDataOfTransaction.notes"
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
          class="font-semibold text-base text-primary rounded-lg w-full border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="cashDrawerCashRegister_onCloseDialogAddTransaction"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] rounded-lg w-full"
          label="Save"
          type="button"
          :disabled="
            cashDrawerCashRegister_formValidationsOfTransaction.$invalid || cashDrawerCashRegister_isLoading
          "
          @click="cashDrawerCashRegister_onSubmitAddTransaction"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
