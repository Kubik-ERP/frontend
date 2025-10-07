<script setup lang="ts">
import type { ILoyaltyPointSettingsProvided } from '@/modules/point-configuration/interfaces/point-configuration.interface';
const {
  // dialog
  loyaltyPointSettings_onCloseDialog,
  loyaltyPointSettings_columns,
  // loyaltyPointSettings_fetchAllProduct,
  loyaltyPointSettings_allProductList,
  allProductList_isLoading,
  loyaltyPointSettingAllProductQueryParams,
  loyaltyPointSettingsAllProduct_onChangePage,
  // selectedProducts,
  loyaltyPointSettings_onSubmitDialog,
  // loyaltyPointSettings_onShowDialogEditProduct,
  // loyaltyPointSettings_toggleSelection,
  isProductSelected,
  getSelectedProductData,
  loyaltyPointSettings_toggleSelection,
  loyaltyPointSettings_updateProductValue,
} = inject<ILoyaltyPointSettingsProvided>('loyaltyPointSettings')!;
</script>
<template>
  <AppBaseDialog id="loyalty-point-settings-dialog-select-product">
    <template #header>
      <h1 class="font-bold text-2xl text-text-primary">Select Product</h1>
    </template>

    <template #content>
      <section id="content" class="flex flex-col gap-4">
        <PrimeVueIconField class="w-full">
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="search" class="!w-4 !h-4" />
            </template>
          </PrimeVueInputIcon>
          <PrimeVueInputText
            v-model="loyaltyPointSettingAllProductQueryParams.search"
            placeholder="Search"
            class="w-full"
          />
        </PrimeVueIconField>
        <!-- <pre>
          {{ selectedProducts }}
        </pre> -->
        <AppBaseDataTable
          header-title="Product Item"
          :is-using-filter="false"
          :columns="loyaltyPointSettings_columns"
          :data="loyaltyPointSettings_allProductList.products"
          :is-loading="allProductList_isLoading"
          :rows-per-page="5"
          :total-records="loyaltyPointSettings_allProductList.total"
          :first="(loyaltyPointSettings_allProductList.page - 1) * 5"
          is-using-server-side-pagination
          is-using-custom-body
          is-using-custom-header-prefix
          is-using-custom-header-suffix
          @update:currentPage="loyaltyPointSettingsAllProduct_onChangePage"
        >
          <template #header-prefix>
            <h1 class="font-semibold text-black text-xl">Product Item</h1>
          </template>
          <template #body="{ column, data }">
            <template v-if="column.value === 'productName'">
              <div class="flex gap-4 items-center">
                <!-- <PrimeVueCheckbox v-model="data.isSelected" binary /> -->
                <PrimeVueCheckbox
                  :model-value="isProductSelected(data)"
                  binary
                  @update:modelValue="loyaltyPointSettings_toggleSelection(data)"
                />
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
                :model-value="getSelectedProductData(data)?.pointsEarned"
                :disabled="!isProductSelected(data)"
                class="text-sm text-center"
                show-buttons
                button-layout="horizontal"
                fluid
                :min="0"
                :step="1"
                @update:modelValue="
                  (newValue: number) => loyaltyPointSettings_updateProductValue(data, 'pointsEarned', newValue)
                "
              >
                <template #decrementicon>
                  <span><AppBaseSvg name="minus" class="!w-5 !h-5" /></span>
                </template>

                <template #incrementicon> <AppBaseSvg name="plus-line" class="!w-5 !h-5" /></template>
              </PrimeVueInputNumber>
            </template>

            <template v-else-if="column.value === 'minimumTransaction'">
              <PrimeVueInputNumber
                :model-value="getSelectedProductData(data)?.minimumPurchase"
                :disabled="!isProductSelected(data)"
                class="text-sm text-center"
                show-buttons
                button-layout="horizontal"
                fluid
                :min="0"
                :step="1"
                @update:modelValue="
                  (newValue: number) => loyaltyPointSettings_updateProductValue(data, 'minimumPurchase', newValue)
                "
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
          @click="loyaltyPointSettings_onCloseDialog()"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base max-w-44 w-full"
          label="Add Product"
          @click="loyaltyPointSettings_onSubmitDialog()"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
