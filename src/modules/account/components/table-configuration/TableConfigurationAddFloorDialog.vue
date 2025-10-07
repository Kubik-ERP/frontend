<script setup lang="ts">
// Interfaces
import type { IAccountStoreTableConfigurationProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  accountStoreTableConfiguration_formDataOfAddFloor,
  accountStoreTableConfiguration_formValidationsOfAddFloor,
  accountStoreTableConfiguration_isEditableMode,
  accountStoreTableConfiguration_onCloseDialogAddFloor,
  accountStoreTableConfiguration_onSubmitFormAddFloor,
} = inject<IAccountStoreTableConfigurationProvided>('accountStoreTableConfiguration')!;
</script>

<template>
  <AppBaseDialog id="table-configuration-add-floor-dialog">
    <template #header>
      <h5 class="font-semibold text-black text-lg">
        {{
          accountStoreTableConfiguration_isEditableMode
            ? useLocalization('account.buttons.edit-floor')
            : useLocalization('account.buttons.add-floor')
        }}
      </h5>
    </template>

    <template #content>
      <section id="form-groups" class="grid-wrapper gap-4">
        <section id="form-input" class="col-span-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="floor-name"
            :name="useLocalization('account.form.floor-name')"
            spacing-bottom="mb-0"
            :validators="accountStoreTableConfiguration_formValidationsOfAddFloor.floorName"
          >
            <PrimeVueInputText
              v-model="accountStoreTableConfiguration_formDataOfAddFloor.floorName"
              :class="{ ...classes }"
              class="text-sm w-full"
            />
          </AppBaseFormGroup>
        </section>
      </section>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          :label="useLocalization('account.buttons.cancel')"
          severity="secondary"
          variant="outlined"
          @click="accountStoreTableConfiguration_onCloseDialogAddFloor"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-[10px] w-full max-w-40"
          :label="
            accountStoreTableConfiguration_isEditableMode
              ? useLocalization('account.buttons.update')
              : useLocalization('account.buttons.add-floor')
          "
          type="button"
          @click="accountStoreTableConfiguration_onSubmitFormAddFloor"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
