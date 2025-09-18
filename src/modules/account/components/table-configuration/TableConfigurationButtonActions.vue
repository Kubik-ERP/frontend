<script setup lang="ts">
// Interfaces
import type { IAccountStoreTableConfigurationProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { accountStoreTableConfiguration_onShowDialogAddFloor, accountStoreTableConfiguration_onSubmit } =
  inject<IAccountStoreTableConfigurationProvided>('accountStoreTableConfiguration')!;
</script>

<template>
  <section
    id="account-table-configuration-button-actions"
    class="flex items-center justify-center gap-4 w-full pb-5"
  >
    <PrimeVueButton
      class="border border-solid border-green-primary bg-transparent w-fit px-5 basic-smooth-animation hover:bg-green-primary hover:[&_span]:!text-white"
      severity="secondary"
      @click="accountStoreTableConfiguration_onSubmit"
    >
      <template #default>
        <section id="content" class="flex items-center gap-2">
          <span class="font-medium text-base text-green-primary">{{
            useLocalization('account.save-changes')
          }}</span>
        </section>
      </template>
    </PrimeVueButton>

    <PrimeVueButton
      class="bg-primary border-none w-fit px-5"
      severity="secondary"
      @click="accountStoreTableConfiguration_onShowDialogAddFloor"
    >
      <template #default>
        <section id="content" class="flex items-center gap-2">
          <AppBaseSvg name="plus-line-white" class="w-4 h-4" />

          <span class="font-semibold text-base text-white">{{
            useLocalization('account.buttons.add-floor')
          }}</span>
        </section>
      </template>
    </PrimeVueButton>
  </section>
</template>
