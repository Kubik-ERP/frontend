<script setup lang="ts">
// Interfaces
import { ICashierProductProvided } from '../../interfaces/cashier-product-service';

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashierProduct_modalAddEditItem,
  cashierProduct_selectedProductQty,
  cashierProduct_handleQuantity,
  cashierProduct_handleSelectProduct,
} = inject<ICashierProductProvided>('cashierProduct')!;

// Composables
import { useIsMobile, useIsTablet } from '@/app/composables/useBreakpoint';

const imageUrl = computed(() => {
  return import.meta.env.VITE_APP_BASE_API_URL + '/' + cashierProduct_modalAddEditItem.value.product?.pictureUrl;
});
</script>

<template>
  <PrimeVueDialog
    v-if="cashierProduct_modalAddEditItem.item"
    v-model:visible="cashierProduct_modalAddEditItem.show"
    modal
    :style="{ width: '34rem' }"
    :dismissable-mask="useIsMobile() || useIsTablet()"
    :position="useIsMobile() || useIsTablet() ? 'bottom' : 'center'"
    class="p-0 m-0 rounded-t-4xl lg:rounded-lg"
  >
    <template #container="{ closeCallback }">
      <div
        v-if="cashierProduct_modalAddEditItem.product"
        class="overflow-auto flex flex-col gap-6 text-sm lg:text-lg p-6"
      >
        <div class="font-semibold">Add Item</div>

        <div class="flex w-full items-center justify-between">
          <div class="flex items-center gap-4">
            <AppBaseImage
              class="w-20 h-20 object-cover"
              :alt="cashierProduct_modalAddEditItem.product.name"
              :src="imageUrl"
            />

            <div class="flex flex-col gap-1">
              <span class="font-semibold">{{ cashierProduct_modalAddEditItem.product.name }}</span>
              <span class="text-sm"
                >Rp{{
                  cashierProduct_modalAddEditItem.product.discountPrice ??
                  cashierProduct_modalAddEditItem.product.price
                }}</span
              >
            </div>
          </div>

          <div class="flex items-center gap-2">
            <PrimeVueButton
              type="button"
              class="border border-primary text-primary px-4"
              variant="outlined"
              label="-"
              :disabled="Number(cashierProduct_modalAddEditItem.item.quantity) <= 1"
              @click="cashierProduct_handleQuantity('decrease')"
            />
            <PrimeVueInputNumber
              v-model="cashierProduct_selectedProductQty"
              input-class="w-14 text-center justify-items-center"
              type="number"
              :min="1"
            />
            <PrimeVueButton
              type="button"
              class="border border-primary text-primary px-4"
              variant="outlined"
              label="+"
              @click="cashierProduct_handleQuantity('increase')"
            />
          </div>
        </div>

        <section
          v-if="(cashierProduct_modalAddEditItem?.product?.variantHasProducts?.length || 0) > 0"
          id="list-variant"
        >
          <span class="font-semibold">Variant</span>

          <div class="border rounded-md border-grayscale-10 overflow-auto flex flex-col max-h-48 flex-grow">
            <div
              v-for="variant in cashierProduct_modalAddEditItem.product.variantHasProducts"
              :key="variant.variant.id"
              class="flex justify-between w-full p-2"
            >
              <div class="flex items-center gap-2">
                <PrimeVueRadioButton
                  v-model="cashierProduct_modalAddEditItem.item.variant"
                  :input-id="variant.variant.id"
                  :name="variant.variant.name"
                  :value="variant.variant"
                />

                <label :for="variant.variant.id">{{ variant.variant.name }}</label>
              </div>

              <span class="text-sm text-text-disabled">{{
                variant.variant.price == 0 ? 'Free' : `+ Rp ${variant.variant.price}`
              }}</span>
            </div>
          </div>
        </section>

        <PrimeVueButton
          v-if="!cashierProduct_modalAddEditItem.isAddNotesActive"
          variant="text"
          class="w-fit hidden lg:flex"
          @click="cashierProduct_modalAddEditItem.isAddNotesActive = true"
        >
          <AppBaseSvg name="add-notes" />

          <span class="font-semibold text-primary">Add Notes</span>
        </PrimeVueButton>

        <section v-else id="cashier-add-edit-product-notes" class="flex flex-col gap-2">
          <label class="font-semibold"> Notes </label>

          <PrimeVueTextarea
            v-model="cashierProduct_modalAddEditItem.item.notes"
            placeholder="Describe order notes here"
            rows="4"
          />

          <section id="cashier-add-edit-product-delete-notes" class="flex w-full justify-end">
            <PrimeVueButton
              text
              class="text-error-main"
              @click="
                cashierProduct_modalAddEditItem.isAddNotesActive = false;
                cashierProduct_modalAddEditItem.item.notes = '';
              "
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

        <div class="lg:hidden flex flex-col gap-2 justify-end">
          <label class="font-normal"> Notes <span class="text-text-disabled">(optional)</span> </label>

          <PrimeVueTextarea
            v-model="cashierProduct_modalAddEditItem.item.notes"
            placeholder="Describe order notes here"
            rows="4"
          />
        </div>

        <div class="lg:flex justify-end gap-2 hidden">
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
            :disabled="!cashierProduct_modalAddEditItem.item.variant"
            @click="
              cashierProduct_handleSelectProduct(
                cashierProduct_modalAddEditItem.product,
                cashierProduct_modalAddEditItem.item,
              );

              closeCallback();
            "
          ></PrimeVueButton>
        </div>

        <PrimeVueButton
          class="lg:hidden flex bg-primary border-none text-white py-2.5 px-14"
          type="button"
          label="Add Item"
          :disabled="!cashierProduct_modalAddEditItem.item?.variant"
          @click="
            cashierProduct_handleSelectProduct(
              cashierProduct_modalAddEditItem.product,
              cashierProduct_modalAddEditItem.item,
            );

            closeCallback();
          "
        ></PrimeVueButton>
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
