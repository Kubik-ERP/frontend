<script setup lang="ts">
// Interfaces
import { ICashierProductProvided } from '../../interfaces/cashier-product-service';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_modalAddEditItem, cashierProduct_handleSelectProduct } =
  inject<ICashierProductProvided>('cashierProduct')!;
</script>

<template>
  <PrimeVueDialog
    v-if="cashierProduct_modalAddEditItem.item"
    v-model:visible="cashierProduct_modalAddEditItem.show"
    modal
    :style="{ width: '34rem' }"
  >
    <template #container="{ closeCallback }">
      <div class="font-semibold overflow-auto flex flex-col gap-6 text-lg p-6">
        <div class="">Add Item</div>

        <div class="flex w-full items-center justify-between">
          <div class="flex items-center gap-4">
            <img class="w-20 h-20 object-cover" :src="cashierProduct_modalAddEditItem.product?.image" />

            <div class="flex flex-col gap-1">
              <span class="font-semibold">{{ cashierProduct_modalAddEditItem.product?.name }}</span>
              <span class="text-sm">Rp.{{ cashierProduct_modalAddEditItem.product?.price }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <PrimeVueButton
              type="button"
              class="border border-primary text-primary px-4"
              variant="outlined"
              label="-"
              @click="
                cashierProduct_modalAddEditItem.item &&
                (cashierProduct_modalAddEditItem.item.qty = (
                  +cashierProduct_modalAddEditItem.item.qty - 1
                ).toString())
              "
            />
            <PrimeVueInputText
              v-model="cashierProduct_modalAddEditItem.item.qty"
              class="w-14 justify-items-center"
              type="number"
            />
            <PrimeVueButton
              type="button"
              class="border border-primary text-primary px-4"
              variant="outlined"
              label="+"
              @click="
                cashierProduct_modalAddEditItem.item &&
                (cashierProduct_modalAddEditItem.item.qty = (
                  +cashierProduct_modalAddEditItem.item.qty + 1
                ).toString())
              "
            />
          </div>
        </div>

        <span class="font-semibold">Variant</span>

        <div class="border rounded-md border-grayscale-10 overflow-auto h-44">
          <div
            v-for="category in cashierProduct_modalAddEditItem.product?.variant"
            :key="category.id"
            class="flex items-center gap-2 p-2"
          >
            <PrimeVueRadioButton
              v-model="cashierProduct_modalAddEditItem.item.variant"
              :input-id="category.name"
              name="dynamic"
              :value="category.name"
            />
            <label :for="category.name">{{ category.name }}</label>
          </div>
        </div>

        <PrimeVueButton
          v-if="!cashierProduct_modalAddEditItem.isAddNotesActive"
          variant="text"
          class="w-fit"
          @click="cashierProduct_modalAddEditItem.isAddNotesActive = true"
        >
          <AppBaseSvg name="add-notes" />

          <span class="font-semibold text-primary">Add Notes</span>
        </PrimeVueButton>

        <section v-else id="cashier-add-edit-product-notes" class="flex flex-col gap-2">
          <label class="font-semibold"> Variant </label>

          <PrimeVueTextarea
            v-model="cashierProduct_modalAddEditItem.item.notes"
            placeholder="Describe order notes here"
            rows="4"
          />

          <section id="cashier-add-edit-product-delete-notes" class="flex w-full justify-end">
            <PrimeVueButton
              text
              class="text-error-main"
              @click="cashierProduct_modalAddEditItem.isAddNotesActive = false"
            >
              <template #default>
                <div class="flex gap-2 items-center">
                  <AppBaseSvg name="trash" />

                  <span> Delete Notes </span>
                </div>
              </template>
            </PrimeVueButton>
          </section>
        </section>

        <section id="cashier-add-edit-product"></section>

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
            :disabled="!cashierProduct_modalAddEditItem.item?.variant"
            @click="
              cashierProduct_handleSelectProduct(
                cashierProduct_modalAddEditItem.product!,
                cashierProduct_modalAddEditItem.item!,
              );

              closeCallback();
            "
          ></PrimeVueButton>
        </div>
      </div>
    </template>
  </PrimeVueDialog>
</template>

<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
