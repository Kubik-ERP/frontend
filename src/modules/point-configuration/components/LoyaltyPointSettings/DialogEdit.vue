<script setup lang="ts">
import type { ILoyaltyPointSettingsProvided } from '@/modules/point-configuration/interfaces/point-configuration.interface';
const {
  // dialog
  loyaltyPointSettings_onCloseDialogEditProduct,
  loyaltyPointSettings_columns,
  // loyaltyPointSettings_allProductList,
  loyaltyPointSettings_EditProduct,
  allProductList_isLoading,
  loyaltyPointSettings_onSubmitDialogEditProduct
} = inject<ILoyaltyPointSettingsProvided>('loyaltyPointSettings')!;
</script>
<template>
  <AppBaseDialog id="loyalty-point-settings-dialog-edit-product">
    <template #header>
      <h1 class="font-bold text-2xl text-text-primary">Edit Product</h1>
    </template>

    <template #content>
      <!-- <pre>
        {{ loyaltyPointSettings_EditProduct }}
      </pre> -->
      <section id="content" class="flex flex-col gap-4 border-t border-grayscale-20">
        <AppBaseDataTable
          :is-using-pagination="false"
          :is-using-filter="false"
          :is-using-header="false"
          :columns="loyaltyPointSettings_columns"
          :data="loyaltyPointSettings_EditProduct"
          :is-loading="allProductList_isLoading"
          is-using-custom-body
        >
          <template #header-prefix>
            <h1 class="font-semibold text-black text-xl">Product Item</h1>
          </template>
          <template #body="{ column, data }">
            <template v-if="column.value === 'productName'">
              <div class="flex gap-4 items-center">
                <span>{{ data.name ?? '-' }}</span>
              </div>
            </template>

            <template v-else-if="column.value === 'price'">
              <span>
                {{ useCurrencyFormat({ data: data[column.value] || 0 }) }}
              </span>
            </template>

            <template v-else-if="column.value === 'points'">
              <PrimeVueInputNumber
                v-model="data.pointsEarned"
                class="text-sm text-center"
                show-buttons
                button-layout="horizontal"
                fluid
                :min="0"
                :step="1"
              >
                <template #decrementicon>
                  <span><AppBaseSvg name="minus" class="!w-5 !h-5" /></span>
                </template>

                <template #incrementicon> <AppBaseSvg name="plus-line" class="!w-5 !h-5" /></template>
              </PrimeVueInputNumber>
            </template>

            <template v-else-if="column.value === 'minimumTransaction'">
              <PrimeVueInputNumber
                v-model="data.minimumPurchase"
                class="text-sm text-center"
                show-buttons
                button-layout="horizontal"
                fluid
                :min="0"
                :step="1"
              >
                <template #decrementicon>
                  <AppBaseSvg name="minus" class="!w-5 !h-5" />
                </template>

                <template #incrementicon> <AppBaseSvg name="plus-line" class="!w-5 !h-5" /></template>
              </PrimeVueInputNumber>
            </template>

            <template v-else> </template>
          </template>
        </AppBaseDataTable>
      </section>
    </template>
    <template #footer>
      <footer class="col-span-2 flex items-center justify-end w-full gap-4 pb-8">
        <PrimeVueButton
          class="bg-transparent border-primary text-primary w-full max-w-44"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="loyaltyPointSettings_onCloseDialogEditProduct()"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base max-w-44 w-full"
          label="Edit Product"
          @click="loyaltyPointSettings_onSubmitDialogEditProduct()"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
