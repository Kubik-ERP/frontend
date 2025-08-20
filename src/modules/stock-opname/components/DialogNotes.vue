<script setup lang="ts">
import type { IStockOpnameProvided } from '../interfaces';
const { notesBuffer, notesBufferValidation, stockOpname_onSubmitNotesDialog, stockOpname_onCloseNotesDialog } =
  inject<IStockOpnameProvided>('stockOpname')!;
</script>
<template>
  <AppBaseDialog id="stock-opname-dialog-notes">
    <template #header>
      <h5 class="font-semibold text-black text-lg">Notes</h5>
    </template>
    <template #content>
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label="Notes"
        name="Notes"
        spacing-bottom="mb-0"
        :validators="notesBufferValidation.notesBuffer"
      >
        <PrimeVueTextarea
          v-model="notesBuffer"
          rows="5"
          cols="30"
          class="w-full"
          :class="{ ...classes }"
          placeholder="Enter your notes here..."
          auto-resize
        />
      </AppBaseFormGroup>
    </template>
    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="stockOpname_onCloseNotesDialog()"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40"
          :label="'Save Notes'"
          type="button"
          :disabled="notesBufferValidation.$invalid"
          @click="stockOpname_onSubmitNotesDialog()"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
