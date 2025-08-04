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
    class="flex items-center justify-between border border-solid border-grayscale-10 p-4 rounded-lg w-full"
  >
    <h6 class="font-bold text-primary text-lg">Please create a floor name before setting up tables</h6>

    <PrimeVueButton
      class="bg-primary border-none w-fit px-5"
      severity="secondary"
      @click="accountStoreTableConfiguration_onShowDialogAddFloor"
    >
      <template #default>
        <section id="content" class="flex items-center gap-2">
          <AppBaseSvg name="plus-line-white" />

          <span class="font-semibold text-base text-white"> Add Floor </span>
        </section>
      </template>
    </PrimeVueButton>
  </section>
</template>
