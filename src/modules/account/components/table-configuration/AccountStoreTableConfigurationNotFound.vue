<script setup lang="ts">
// Interfaces
import type { IAccountStoreTableConfigurationProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { accountStoreTableConfiguration_onShowDialogAddFloor } = inject<IAccountStoreTableConfigurationProvided>(
  'accountStoreTableConfiguration',
)!;
</script>

<template>
  <section
    id="account-store-table-configuration-not-found"
    class="flex flex-col lg:flex-row items-start lg:items-center justify-between border border-solid border-grayscale-10 p-4 rounded-lg w-full gap-4 lg:gap-0"
  >
    <h6 class="font-bold text-primary text-base lg:text-lg">
      {{ useLocalization('account.please-create-floor-before-tables') }}
    </h6>

    <PrimeVueButton
      class="bg-primary border-none w-full lg:w-fit px-5"
      severity="secondary"
      @click="accountStoreTableConfiguration_onShowDialogAddFloor"
    >
      <template #default>
        <section id="content" class="flex items-center gap-2">
          <AppBaseSvg name="plus-line-white" class="w-4 h-4" />

          <span class="font-semibold text-sm lg:text-base text-white">{{
            useLocalization('account.buttons.add-floor')
          }}</span>
        </section>
      </template>
    </PrimeVueButton>
  </section>
</template>
