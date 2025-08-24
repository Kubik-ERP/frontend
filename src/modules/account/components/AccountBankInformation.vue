<script setup lang="ts">
// Interfaces
import type { IAccountProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { account_profile, account_onEditBankAccount, account_onSetUpBankAccount } =
  inject<IAccountProvided>('account')!;
</script>

<template>
  <section id="bank-information" class="flex flex-col gap-2">
    <header class="flex items-center gap-4">
      <h6 class="font-semibold text-black text-lg">
        {{ useLocalization('account.bank-information') }}
      </h6>

      <section
        v-if="(account_profile?.user?.banks?.length ?? 0) > 0"
        id="edit-bank"
        class="flex items-center gap-2 cursor-pointer"
        @click="account_onEditBankAccount"
      >
        <AppBaseSvg name="edit" />

        <span class="font-semibold text-primary text-sm"> Edit Bank Information </span>
      </section>
    </header>

    <section
      id="content"
      class="flex items-center justify-between p-4 border border-solid border-grayscale-20 rounded-lg w-full"
    >
      <template v-if="(account_profile?.user.banks?.length ?? 0) > 0">
        <section id="bank" class="grid grid-rows-1 grid-cols-6 relative inset-0 z-0 gap-4 w-full">
          <section id="bank-name" class="col-span-full lg:col-span-2 flex flex-col gap-1">
            <span class="font-normal text-text-disabled text-sm"> Bank Name </span>

            <span class="font-normal text-black text-base">
              {{ account_profile?.user.banks[0].bankName ?? '-' }}
            </span>
          </section>

          <section id="account-number" class="col-span-full lg:col-span-4 flex flex-col gap-1">
            <span class="font-normal text-text-disabled text-sm"> Account Number </span>

            <span class="font-normal text-black text-base">
              {{ account_profile?.user.banks[0].accountNumber ?? '-' }}
            </span>
          </section>

          <section id="account-name" class="col-span-full lg:col-span-2 flex flex-col gap-1">
            <span class="font-normal text-text-disabled text-sm"> Account Name </span>

            <span class="font-normal text-black text-base">
              {{ account_profile?.user.banks[0].accountName ?? '-' }}
            </span>
          </section>
        </section>
      </template>

      <template v-else>
        <div class="flex flex-col w-full gap-4">
          <section id="information" class="flex flex-col gap-2">
            <h6 class="font-bold text-primary text-baes lg:text-lg">
              {{ useLocalization('account.havenot-added-bank-account') }}
            </h6>

            <p class="font-normal text-grayscale-70 text-sm lg:text-base">
              {{ useLocalization('account.havenot-added-bank-account-description') }}
            </p>
          </section>

          <PrimeVueButton
            class="bg-blue-primary border-none text-sm lg:text-base py-[10px] px-[18px] w-fit"
            :label="useLocalization('account.setup-bank-information')"
            type="button"
            @click="account_onSetUpBankAccount"
          />
        </div>
      </template>
    </section>
  </section>
</template>
