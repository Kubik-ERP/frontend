<script setup lang="ts">
// Interfaces
import type { ICashInOutProvided } from '../interfaces/cash-in-out.interface';

/**
 * @description Inject all the data and methods what we need
 */
const { cashInOut_formData, cashInOut_formValidations, cashInOut_listTypes, cashInOut_onClose } = inject(
  'cashInOut',
) as ICashInOutProvided;
</script>

<template>
  <AppBaseDialog>
    <template #header>
      <header class="flex flex-col gap-2 w-full">
        <h6 class="font-semibold text-black text-lg">Add Cash In/Out</h6>
      </header>
    </template>

    <template #content>
      <form action="" class="flex flex-col gap-4 w-full max-w-md">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="title"
          name="Title"
          spacing-bottom="mb-0"
          :validators="cashInOut_formValidations.title"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="cashInOut_formData.title"
              placeholder=""
              class="text-sm w-full"
              :class="{ ...classes }"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="type"
          name="Type"
          spacing-bottom="mb-0"
          :validators="cashInOut_formValidations.type"
        >
          <PrimeVueSelect
            v-model="cashInOut_formData.type"
            :options="cashInOut_listTypes"
            option-label="label"
            option-value="value"
            placeholder="Select type"
            class="text-sm w-full"
            :class="{
              ...classes,
            }"
          >
            <template #option="{ option }">
              <div class="flex items-center gap-3">
                <AppBaseSvg
                  :name="option.value === 'Cash Out' ? 'arrow-left-circle-danger' : 'arrow-right-circle-success'"
                  class="!w-5 !h-5"
                />
                <span class="font-normal text-sm text-text-primary">{{ option.label }}</span>
              </div>
            </template>

            <template #value="{ value }">
              <div class="flex items-center gap-3">
                <AppBaseSvg
                  :name="value === 'Cash Out' ? 'arrow-left-circle-danger' : 'arrow-right-circle-success'"
                  class="!w-5 !h-5"
                />
                <span class="font-normal text-sm text-text-primary">{{ value }}</span>
              </div>
            </template>
          </PrimeVueSelect>
        </AppBaseFormGroup>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="amount"
          name="Amount"
          spacing-bottom="mb-0"
          :validators="cashInOut_formValidations.amount"
        >
          <PrimeVueInputNumber
            v-model="cashInOut_formData.amount"
            prefix="Rp "
            fluid
            :class="{
              ...classes,
            }"
            placeholder="Rp 0,00"
          />
        </AppBaseFormGroup>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="notes"
          name="Notes"
          spacing-bottom="mb-0"
          :validators="cashInOut_formValidations.notes"
        >
          <PrimeVueIconField>
            <PrimeVueTextarea
              v-model="cashInOut_formData.notes"
              placeholder="Input your store notes"
              class="text-sm w-full"
              rows="5"
              :class="{ ...classes }"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </form>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border-2 border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="cashInOut_onClose"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40"
          label="Save"
          type="button"
          :disabled="cashInOut_formValidations.$invalid"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
