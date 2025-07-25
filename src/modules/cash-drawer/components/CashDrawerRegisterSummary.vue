<script setup lang="ts">
// Interfaces
import type { ICashDrawerCashRegisterProvide } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { cashDrawerCashRegister_isOpenCashRegisterSummary } = inject(
  'cashDrawerCashRegister',
) as ICashDrawerCashRegisterProvide;
</script>

<template>
  <PrimeVueDrawer
    v-model:visible="cashDrawerCashRegister_isOpenCashRegisterSummary"
    header="Cash Register Summary"
    position="right"
    :pt="{
      content: 'p-0',
      root: 'w-[25rem]',
      title: 'font-semibold text-black text-lg',
    }"
  >
    <header class="flex items-center justify-between border-t border-solid border-grayscale-10 p-4">
      <span class="font-normal text-base text-text-disabled"> Payment Method </span>

      <span class="font-normal text-base text-text-disabled"> Expected </span>
    </header>

    <section id="content" class="flex flex-col border-t border-solid border-grayscale-10 gap-3 p-4">
      <section id="promo-voucher" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black"> Promo Voucher </span>

        <span class="font-normal text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>

      <section id="debit" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black"> Debit </span>

        <span class="font-normal text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>

      <section id="credit" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black"> Credit </span>

        <span class="font-normal text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>

      <section id="e-wallet" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black"> E-Wallet </span>

        <span class="font-normal text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>
    </section>

    <section id="summary" class="flex flex-col border-t border-solid border-grayscale-10 gap-3 p-4">
      <section id="actual-balance" class="flex items-center justify-between w-full">
        <span class="font-semibold text-base text-black"> Actual Balance </span>

        <span class="font-semibold text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>

      <section id="sales" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black"> Sales </span>

        <span class="font-normal text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>

      <section id="cash-in" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black"> Cash In </span>

        <span class="font-normal text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>

      <section id="cash-out" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black"> Cash Out </span>

        <span class="font-normal text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>
    </section>
  </PrimeVueDrawer>
</template>
