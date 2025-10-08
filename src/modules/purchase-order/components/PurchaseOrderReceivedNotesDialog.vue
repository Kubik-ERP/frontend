<script setup lang="ts">
import type { IPurchaseOrderReceivedProvided } from '../interfaces/purchase-order-received.interface';

const {
  notesBuffer,
  onSubmitNotesDialog,
  onCloseNotesDialog
} = inject<IPurchaseOrderReceivedProvided>('purchaseOrderReceived')!;
</script>
<template>
  <AppBaseDialog id="po-received-notes-dialog">
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
          @click="onCloseNotesDialog()"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-[10px] w-full max-w-40"
          label="Save Notes"
          type="button"
          @click="onSubmitNotesDialog()"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
