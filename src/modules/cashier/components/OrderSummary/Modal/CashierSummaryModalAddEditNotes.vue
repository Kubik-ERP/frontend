<script setup lang="ts">
// Interfaces
import type { ICashierOrderProvided } from '../../../interfaces/cashier-order.interface';
import { ICashierProductProvided } from '../../../interfaces/cashier-product-service.interface';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrder_modalAddEditNotes } = inject<ICashierOrderProvided>('cashierOrder')!;
const { cashierProduct_selectedProduct } = inject<ICashierProductProvided>('cashierProduct')!;
</script>

<template>
  <PrimeVueDialog
    v-if="cashierOrder_modalAddEditNotes.item !== null"
    v-model:visible="cashierOrder_modalAddEditNotes.show"
    modal
    :style="{ width: '34rem' }"
  >
    <template #container="{ closeCallback }">
      <section id="cashier-summary-add-edit-notes" class="flex flex-col gap-6 p-6">
        <section id="cashier-summary-add-edit-notes-form" class="flex flex-col gap-3">
          <label class="font-semibold"> {{ useLocalization('cashier.mainSection.notes') }} </label>

          <PrimeVueTextarea
            v-model="cashierOrder_modalAddEditNotes.tempValue"
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
              cashierOrder_modalAddEditNotes.show = false;
              cashierProduct_selectedProduct[cashierOrder_modalAddEditNotes.item].notes =
                cashierOrder_modalAddEditNotes.tempValue;
            "
          ></PrimeVueButton>
        </div>
      </section>
    </template>
  </PrimeVueDialog>
</template>
