<script setup lang="ts">
// Interfaces
import type { IAccountProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { account_onSetUpBankAccount } = inject<IAccountProvided>('account')!;
</script>

<template>
  <section id="bank-information" class="flex flex-col gap-2">
    <header>
      <h6 class="font-semibold text-black text-lg">
        {{ useLocalization('account.bank-information') }}
      </h6>
    </header>

    <section
      id="content"
      class="flex items-center justify-between p-4 border border-solid border-grayscale-20 rounded-lg w-full"
    >
      <section id="information" class="flex flex-col gap-2">
        <h6 class="font-bold text-primary text-lg">
          {{ useLocalization('account.havenot-added-bank-account') }}
        </h6>

        <p class="font-normal text-grayscale-70 text-base">
          {{ useLocalization('account.havenot-added-bank-account-description') }}
        </p>
      </section>

      <PrimeVueButton
        class="bg-blue-primary border-none text-base py-[10px] px-[18px] w-fit"
        :label="useLocalization('account.setup-bank-information')"
        type="button"
        @click="account_onSetUpBankAccount"
      />
    </section>
  </section>
</template>
