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
    :header="useLocalization('cash-drawer.cash-register-summary')"
    position="right"
    :pt="{
      content: 'p-0',
      root: 'w-[25rem]',
      title: 'font-semibold text-black text-lg',
    }"
  >
    <header class="flex items-center justify-between border-t border-solid border-grayscale-10 p-4">
      <span class="font-normal text-base text-text-disabled">{{
        useLocalization('cash-drawer.payment-method')
      }}</span>

      <span class="font-normal text-base text-text-disabled">{{ useLocalization('cash-drawer.expected') }}</span>
    </header>

    <section id="content" class="flex flex-col border-t border-solid border-grayscale-10 gap-3 p-4">
      <section id="promo-voucher" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black">{{ useLocalization('cash-drawer.promo-voucher') }}</span>

        <span class="font-normal text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>

      <section id="debit" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black">{{ useLocalization('cash-drawer.debit') }}</span>

        <span class="font-normal text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>

      <section id="credit" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black">{{ useLocalization('cash-drawer.credit') }}</span>

        <span class="font-normal text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>

      <section id="e-wallet" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black">{{ useLocalization('cash-drawer.e-wallet') }}</span>

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
        <span class="font-semibold text-base text-black">{{ useLocalization('cash-drawer.actual-balance') }}</span>

        <span class="font-semibold text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>

      <section id="sales" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black">{{ useLocalization('cash-drawer.sales') }}</span>

        <span class="font-normal text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>

      <section id="cash-in" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black">{{ useLocalization('cash-drawer.cash-in') }}</span>

        <span class="font-normal text-base text-black">
          {{
            useCurrencyFormat({
              data: 0,
            })
          }}
        </span>
      </section>

      <section id="cash-out" class="flex items-center justify-between w-full">
        <span class="font-normal text-base text-black">{{ useLocalization('cash-drawer.cash-out') }}</span>

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
