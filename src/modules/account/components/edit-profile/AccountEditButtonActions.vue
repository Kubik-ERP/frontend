<script setup lang="ts">
// Interfaces
import type { IAccountEditProfileProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { accountEditProfile_onSubmit } = inject<IAccountEditProfileProvided>('accountEditProfile')!;
</script>

<template>
  <section id="account-edit-profile-button-actions" class="flex items-center mt-4 gap-4">
    <PrimeVueButton
      class="border-blue-primary bg-transparent font-semibold text-sm text-blue-primary w-36 basic-smooth-animation hover:bg-grayscale-10"
      :label="useLocalization('account.cancel')"
      severity="secondary"
      variant="outlined"
      @click="$router.back()"
    />

    <PrimeVueButton
      class="bg-blue-primary border-none text-sm py-[10px] px-8 w-fit"
      :label="useLocalization('account.save-changes')"
      type="submit"
      @click="accountEditProfile_onSubmit"
    />
  </section>
</template>
