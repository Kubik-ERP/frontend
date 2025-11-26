<script setup lang="ts">
// Composables
import { useIsMobile, useIsTablet } from '@/app/composables/useBreakpoint';

// Interfaces
import { ISelfOrderProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  selfOrder_modalAddEditItem,
  selfOrder_selectedProductQty,
  selfOrder_handleQuantity,
  selfOrder_handleSelectProduct,
} = inject<ISelfOrderProvided>('selfOrder')!;


const imageUrl = computed(() => {
  return APP_BASE_BUCKET_URL + selfOrder_modalAddEditItem.value.product?.pictureUrl;
});
</script>

<template>
  <PrimeVueDialog
    v-if="selfOrder_modalAddEditItem.item"
    v-model:visible="selfOrder_modalAddEditItem.show"
    modal
    :style="{ width: '34rem' }"
    :dismissable-mask="useIsMobile() || useIsTablet()"
    :position="useIsMobile() || useIsTablet() ? 'bottom' : 'center'"
    class="p-0 m-0 rounded-t-4xl lg:rounded-lg"
  >
    <template #container="{ closeCallback }">
      <div
        v-if="selfOrder_modalAddEditItem.product"
        class="overflow-auto flex flex-col gap-6 text-sm lg:text-lg p-6"
      >
        <div class="font-semibold">{{ useLocalization('cashier.mainSection.addItem') }}</div>

        <div class="flex w-full items-center justify-between">
          <div class="flex items-center gap-4">
            <AppBaseImage
              class="w-20 h-20 object-cover"
              :alt="selfOrder_modalAddEditItem.product.name"
              :src="imageUrl"
            />

            <div class="flex flex-col gap-1">
              <span class="font-semibold">{{ selfOrder_modalAddEditItem.product.name }}</span>
              <span class="text-sm"
                >Rp{{
                  selfOrder_modalAddEditItem.product.discountPrice ??
                  selfOrder_modalAddEditItem.product.price
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
              :disabled="Number(selfOrder_modalAddEditItem.item.quantity) <= 1"
              @click="selfOrder_handleQuantity('decrease')"
            />
            <PrimeVueInputNumber
              v-model="selfOrder_selectedProductQty"
              input-class="w-14 text-center justify-items-center"
              type="number"
              :min="1"
            />
            <PrimeVueButton
              type="button"
              class="border border-primary text-primary px-4"
              variant="outlined"
              label="+"
              @click="selfOrder_handleQuantity('increase')"
            />
          </div>
        </div>

        <section v-if="(selfOrder_modalAddEditItem?.product?.variant?.length || 0) > 0" id="list-variant">
          <span class="font-semibold">{{ useLocalization('cashier.mainSection.variant') }}</span>

          <div class="border rounded-md border-grayscale-10 overflow-auto flex flex-col max-h-48 flex-grow">
            <div
              v-for="variant in selfOrder_modalAddEditItem.product.variant"
              :key="variant.id"
              class="flex justify-between w-full p-2"
            >
              <div class="flex items-center gap-2">
                <PrimeVueRadioButton
                  v-model="selfOrder_modalAddEditItem.item.variant"
                  :input-id="variant.id"
                  :name="variant.name"
                  :value="variant"
                />

                <label :for="variant.id">{{ variant.name }}</label>
              </div>

              <span class="text-sm text-text-disabled">{{
                variant.price == 0 ? 'Free' : `+ Rp ${variant.price}`
              }}</span>
            </div>
          </div>
        </section>

        <section v-if="(selfOrder_modalAddEditItem?.product?.products?.length || 0) > 0" id="list-variant">
          <span class="font-semibold">{{ useLocalization('cashier.mainSection.products') }}</span>

          <div class="border rounded-md border-grayscale-10 overflow-auto flex flex-col max-h-48 flex-grow">
            <div
              v-for="product in selfOrder_modalAddEditItem.product.products"
              :key="product.product_id"
              class="flex justify-between w-full p-2"
            >
              <div class="flex items-center gap-2">


                <label :for="product.product_id">{{ product.name }}</label>
              </div>

              <span class="text-sm text-text-disabled">{{
                product.price == 0 ? 'Free' : `Rp ${product.price}`
              }}</span>
            </div>
          </div>
        </section>

        <PrimeVueButton
          v-if="!selfOrder_modalAddEditItem.isAddNotesActive"
          variant="text"
          class="w-fit hidden lg:flex"
          @click="selfOrder_modalAddEditItem.isAddNotesActive = true"
        >
          <AppBaseSvg name="add-notes" class="h-4 w-4 filter-primary-color" />

          <span class="font-semibold text-primary">{{ useLocalization('cashier.mainSection.addNotes') }}</span>
        </PrimeVueButton>

        <section v-else id="self-order-add-edit-product-notes" class="flex flex-col gap-2">
          <label class="font-semibold"> {{ useLocalization('cashier.mainSection.notes') }} </label>

          <PrimeVueTextarea
            v-model="selfOrder_modalAddEditItem.item.notes"
            :placeholder="useLocalization('cashier.mainSection.describeNotes')"
            rows="4"
          />

          <section id="self-order-add-edit-product-delete-notes" class="flex w-full justify-end">
            <PrimeVueButton
              text
              class="text-error-main"
              @click="
                selfOrder_modalAddEditItem.isAddNotesActive = false;
                selfOrder_modalAddEditItem.item.notes = '';
              "
            >
              <template #default>
                <div class="flex gap-2 items-center">
                  <AppBaseSvg name="trash" class="h-4 w-4" />

                  <span> {{ useLocalization('cashier.mainSection.deleteNotes') }} </span>
                </div>
              </template>
            </PrimeVueButton>
          </section>
        </section>

        <div class="lg:hidden flex flex-col gap-2 justify-end">
          <label class="font-normal">
            {{ useLocalization('cashier.mainSection.notes') }}
            <span class="text-text-disabled">({{ useLocalization('cashier.optional') }})</span>
          </label>

          <PrimeVueTextarea
            v-model="selfOrder_modalAddEditItem.item.notes"
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
            :disabled="!selfOrder_modalAddEditItem.item.variant"
            @click="
              selfOrder_handleSelectProduct(
                selfOrder_modalAddEditItem.product,
                selfOrder_modalAddEditItem.item,
              );

              closeCallback();
            "
          ></PrimeVueButton>
        </div>

        <PrimeVueButton
          class="lg:hidden flex bg-primary border-none text-white py-2.5 px-14"
          type="button"
          label="Add Item"
          :disabled="!selfOrder_modalAddEditItem.item?.variant"
          @click="
            selfOrder_handleSelectProduct(
              selfOrder_modalAddEditItem.product,
              selfOrder_modalAddEditItem.item,
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
