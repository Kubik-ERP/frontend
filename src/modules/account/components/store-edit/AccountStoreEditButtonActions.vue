<script setup lang="ts">
// Interfaces
import { IAccountStoreEditProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  accountStoreEdit_isLoading,
  accountStoreEdit_onCancel,
  accountStoreEdit_onShowDialogDeleteOutlet,
  accountStoreEdit_onSubmit,
} = inject<IAccountStoreEditProvided>('accountStoreEdit')!;
</script>

<template>
  <section id="account-store-edit-button-actions" class="flex flex-col gap-6 w-full">
    <section id="account-store-edit-primary-button-actions" class="flex items-center justify-between w-full">
      <section id="left-contents" class="flex items-center gap-4 w-fit">
        <PrimeVueButton
          class="border-blue-primary bg-transparent font-semibold text-base text-blue-primary w-36 basic-smooth-animation hover:bg-grayscale-10"
          :label="useLocalization('account.buttons.cancel')"
          severity="secondary"
          variant="outlined"
          @click="accountStoreEdit_onCancel()"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-sm py-[10px] w-36"
          :label="useLocalization('account.buttons.update')"
          type="submit"
          :loading="accountStoreEdit_isLoading"
          @click="accountStoreEdit_onSubmit()"
        />
      </section>

      <section id="right-contents" class="flex items-center gap-4">
        <PrimeVueButton
          class="w-fit border border-solid border-error-main bg-transparent basic-smooth-animation hover:bg-grayscale-10 px-5 py-3 rounded-lg"
          severity="danger"
          @click="accountStoreEdit_onShowDialogDeleteOutlet()"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="account-company-danger" />
              <span class="font-semibold text-base text-error-main">{{
                useLocalization('account.buttons.closeStorePermanent')
              }}</span>
            </section>
          </template>
        </PrimeVueButton>
      </section>
    </section>

    <PrimeVueDivider />

    <section id="information" class="flex flex-col gap-2">
      <h5 class="font-semibold text-error-main text-xl">{{ useLocalization('account.delete-store') }}</h5>

      <p class="font-normal text-base text-grayscale-70">
        {{ useLocalization('account.delete-store-warning') }}
      </p>
    </section>

    <PrimeVueButton
      class="w-36 border-none bg-transparent basic-smooth-animation hover:bg-grayscale-10"
      severity="secondary"
      @click="accountStoreEdit_onShowDialogDeleteOutlet()"
    >
      <template #default>
        <section id="content" class="flex items-center gap-2">
          <AppBaseSvg name="delete" />
          <span class="font-semibold text-base text-error-main">{{
            useLocalization('account.buttons.delete-store')
          }}</span>
        </section>
      </template>
    </PrimeVueButton>
  </section>
</template>
