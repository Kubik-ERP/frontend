<script setup lang="ts">
// components
import WasteLog from './WasteLog.vue';
// interfaces
import type { IBatchListProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  batchDetails_onCloseDialogCompleteBatch,
  batchDetail_values,
  batchList_getClassOfBatchStatus,
  batchDetails_formValidation,
  batch_wasteLog_formData,
  batchDetails_onCompleteBatch
} = inject<IBatchListProvided>('batchDetails')!;
</script>
<template>
  <AppBaseDialog
    id="batch-details-complete-batch-dialog"
    :closable="false"
    @close="batchDetails_onCloseDialogCompleteBatch"
  >
    <template #header>
      <header class="flex flex-col gap-2 border-b border-solid border-grayscale-20 pb-4">
        <h1 class="font-semibold text-black text-lg">Complete Post Batch Record</h1>
        <h6>
          Confirm your final production results before posting this batch. Once submitted, the system will record
          the actual yield, deduct ingredients, and add finished portions to your inventory.
        </h6>
        <section class="grid grid-cols-2 pt-4">
          <div class="flex flex-col">
            <label for="recipe-name"> Recipe </label>
            <span class="font-medium">{{ batchDetail_values?.menu_recipes?.recipe_name }}</span>
          </div>
          <div class="flex flex-col">
            <label for="recipe-name"> Batch Target Yield </label>
            <span class="font-medium">{{ batchDetail_values?.batch_target_yield }}</span>
          </div>
          <div class="flex flex-col">
            <label for="recipe-name"> Date </label>
            <span class="font-medium">{{ useFormatDate(batchDetail_values?.date, 'dd/mm/yyyy') }}</span>
          </div>
          <div class="flex flex-col">
            <label for="recipe-name"> Status </label>
            <span>
              <PrimeVueChip
                :class="[
                  batchList_getClassOfBatchStatus(batchDetail_values?.status),
                  'text-xs font-normal py-1 px-1.5 w-fit',
                ]"
                :label="useTitleCaseWithSpaces(batchDetail_values?.status?.toLowerCase())"
              />
            </span>
          </div>
        </section>
      </header>
    </template>

    <template #content>
      <main class="flex flex-col gap-4">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="actualBatchYield"
          name="Actual Batch Yield"
          spacing-bottom="mb-0"
          class="w-1/2"
          :validators="batchDetails_formValidation.batchWaste"
        >
          <PrimeVueInputNumber
            v-model="batch_wasteLog_formData.batchWaste"
            class="w-full"
            :class="{ ...classes }"
          />
        </AppBaseFormGroup>

        <div class="flex items-center gap-2">
          <PrimeVueCheckbox
            v-model="batch_wasteLog_formData.setWastePerItemIngridients"
            name="setWastePerItemIngridients"
            binary
          />
          <label for="setWastePerItemIngridients">Set waste per item ingredient</label>
        </div>

        <section v-if="batch_wasteLog_formData.setWastePerItemIngridients">
          <WasteLog />
        </section>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="notes"
          name="Notes"
          spacing-bottom="mb-0"
        >
          <PrimeVueTextarea v-model="batch_wasteLog_formData.notes" class="w-full" :class="{ ...classes }" />
        </AppBaseFormGroup>
      </main>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-fit min-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="batchDetails_onCloseDialogCompleteBatch"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-[10px] w-fit min-w-40"
          label="Complete & Post Batch"
          type="button"
          :disabled="batchDetails_formValidation.$invalid"
          @click="batchDetails_onCompleteBatch"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
