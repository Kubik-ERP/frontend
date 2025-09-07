<script setup lang="ts">
// Interfaces
import type { ICashDrawerCashRegisterProvide } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashDrawerCashRegister_detail,
  cashDrawerCashRegister_formDataOfCloseTransaction,
  cashDrawerCashRegister_formValidationsOfCloseTransaction,
  cashDrawerCashRegister_isLoading,
  cashDrawerCashRegister_onCloseDialogCloseTransaction,
  cashDrawerCashRegister_onSubmitCloseTransaction,
  cashDrawerCashRegister_toggleCashRegisterSummary,
} = inject('cashDrawerCashRegister') as ICashDrawerCashRegisterProvide;
</script>

<template>
  <AppBaseDialog id="cash-drawer-close-transaction-dialog">
    <template #header>
      <header class="flex flex-col gap-2">
        <h6 class="font-semibold text-black text-lg">Close Register</h6>
      </header>
    </template>

    <template #content>
      <form class="grid-wrapper gap-4">
        <section id="expected-balance" class="col-span-full lg:col-span-6 flex flex-col gap-1">
          <span class="font-normal text-grayscale-70 text-sm"> Expected Balance </span>

          <p class="font-semibold text-base text-primary">
            {{
              useCurrencyFormat({
                data: cashDrawerCashRegister_detail?.expectedBalance || 0,
                addSuffix: true,
              })
            }}
          </p>
        </section>

        <section id="form-group" class="col-span-full lg:col-span-6 flex flex-col gap-4">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-normal leading-6 text-grayscale-70 w-full"
            is-name-as-label
            label-for="open-balance"
            name="Amount`"
            spacing-bottom="mb-0"
            :validators="cashDrawerCashRegister_formValidationsOfCloseTransaction.amount"
          >
            <PrimeVueInputNumber
              v-model="cashDrawerCashRegister_formDataOfCloseTransaction.balance"
              prefix="Rp "
              fluid
              :class="{
                ...classes,
              }"
              placeholder="Rp 0,00"
            />
            <span class="font-normal text-text-disabled text-sm">
              Difference

              <template
                v-if="
                  cashDrawerCashRegister_detail?.expectedBalance &&
                  cashDrawerCashRegister_formDataOfCloseTransaction?.balance
                "
              >
                <span class="text-text-primary">
                  {{
                    useCurrencyFormat({
                      data:
                        cashDrawerCashRegister_detail?.expectedBalance -
                        cashDrawerCashRegister_formDataOfCloseTransaction.balance,
                      addSuffix: true,
                    })
                  }}
                </span>
              </template>

              <template v-else>
                <span class="text-text-primary">
                  {{
                    useCurrencyFormat({
                      data: 0,
                      addSuffix: true,
                    })
                  }}
                </span>
              </template>
            </span>
          </AppBaseFormGroup>
        </section>

        <section class="col-span-full flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AppBaseSvg name="order-primary" class="w-4 h-4" />
            <span class="font-semibold text-primary text-sm"> Details </span>
          </div>

          <PrimeVueButton
            class="w-fit bg-transparent border-none basic-smooth-animation hover:bg-grayscale-10 py-3"
            @click="cashDrawerCashRegister_toggleCashRegisterSummary"
          >
            <template #default>
              <section id="content" class="flex items-center gap-2">
                <AppBaseSvg name="chevron-right" class="!w-[10px] !h-[10px]" />
              </section>
            </template>
          </PrimeVueButton>
        </section>
      </form>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary rounded-lg w-fit border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10 px-14 py-3"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="cashDrawerCashRegister_onCloseDialogCloseTransaction"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base rounded-lg w-fit px-5 py-3"
          label="Confirm & Close Cash Register"
          type="button"
          :disabled="
            cashDrawerCashRegister_formValidationsOfCloseTransaction.$invalid || cashDrawerCashRegister_isLoading
          "
          @click="cashDrawerCashRegister_onSubmitCloseTransaction"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
