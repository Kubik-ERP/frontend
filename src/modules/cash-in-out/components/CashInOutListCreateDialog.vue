<script setup lang="ts">
// Interfaces
import type { ICashInOutListProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { cashInOutList_formData, cashInOutList_formValidations, cashInOutList_listTypes, cashInOutList_onClose } =
  inject('cashInOutList') as ICashInOutListProvided;
</script>

<template>
  <AppBaseDialog id="cash-in-out-list-create-dialog">
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
          :validators="cashInOutList_formValidations.title"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="cashInOutList_formData.title"
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
          :validators="cashInOutList_formValidations.type"
        >
          <PrimeVueSelect
            v-model="cashInOutList_formData.type"
            :options="cashInOutList_listTypes"
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
          :validators="cashInOutList_formValidations.amount"
        >
          <PrimeVueInputNumber
            v-model="cashInOutList_formData.amount"
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
          :validators="cashInOutList_formValidations.notes"
        >
          <PrimeVueIconField>
            <PrimeVueTextarea
              v-model="cashInOutList_formData.notes"
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
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="cashInOutList_onClose"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-[10px] w-full max-w-40"
          label="Save"
          type="button"
          :disabled="cashInOutList_formValidations.$invalid"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
