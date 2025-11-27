<script setup lang="ts">
// Interfaces
import { ISelfOrderProvided } from '../../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { selfOrder_modalAddEditNotes, selfOrder_selectedProduct } = inject<ISelfOrderProvided>('selfOrder')!;
</script>

<template>
  <PrimeVueDialog
    v-if="selfOrder_modalAddEditNotes.item !== null"
    v-model:visible="selfOrder_modalAddEditNotes.show"
    modal
    :style="{ width: '34rem' }"
  >
    <template #container="{ closeCallback }">
      <section id="self-order-summary-add-edit-notes" class="flex flex-col gap-6 p-6">
        <section id="self-order-summary-add-edit-notes-form" class="flex flex-col gap-3">
          <label class="font-semibold"> {{ useLocalization('cashier.mainSection.notes') }} </label>

          <PrimeVueTextarea
            v-model="selfOrder_modalAddEditNotes.tempValue"
            placeholder="Describe order notes here"
            rows="4"
          />
        </section>

        <div class="flex justify-end gap-2">
          <PrimeVueButton
            class="border-primary text-primary py-2.5 px-14"
            type="button"
            label="Cancel"
            outlined
            @click="closeCallback"
          ></PrimeVueButton>

          <PrimeVueButton
            class="bg-primary border-none text-white py-2.5 px-14"
            type="button"
            label="Save"
            @click="
              selfOrder_modalAddEditNotes.show = false;
              selfOrder_selectedProduct[selfOrder_modalAddEditNotes.item].notes =
                selfOrder_modalAddEditNotes.tempValue;
            "
          ></PrimeVueButton>
        </div>
      </section>
    </template>
  </PrimeVueDialog>
</template>
