<script setup lang="ts">
// Interfaces
import { IOutletCreateEditProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { outletCreateEdit_onCloseDialogVerifyPIN, outletCreateEdit_onSubmitDialogVerifyPIN } =
  inject<IOutletCreateEditProvided>('outletCreateEdit')!;
</script>

<template>
  <AppBaseDialog id="outlet-create-edit-dialog-verify-pin">
    <template #header>
      <header class="flex flex-col gap-2 w-full">
        <h6 class="font-semibold text-black text-lg">Enter Your PIN</h6>

        <p class="font-normal text-grayscale-70 text-sm">For security, please enter your PIN to proceed</p>
      </header>
    </template>

    <template #content>
      <PrimeVueInputOtp
        class="[&>input]:bg-white [&>input]:border-grayscale-30 [&>input]:font-bold [&>input]:text-2xl [&>input]:w-16 [&>input]:h-16!"
        :length="6"
        mask
      />
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="outletCreateEdit_onCloseDialogVerifyPIN"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-fit px-4"
          label="Create Store"
          type="button"
          @click="outletCreateEdit_onSubmitDialogVerifyPIN"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
