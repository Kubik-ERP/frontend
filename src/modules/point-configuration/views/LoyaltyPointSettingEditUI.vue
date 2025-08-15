<script setup lang="ts">
import { usePointConfigurationService } from '../services/point-configuration.service';
import DialogSelectItems from '../components/LoyaltyPointSettings/Dialog.vue';
import DialogEditSelectedItems from '../components/LoyaltyPointSettings/DialogEdit.vue';

const {
  // data
  loyaltyPointSettingsProduct_value,
  // loyaltyPointSettings_value,
  loyaltyPointSettingsDetail,
  // table
  loyaltyPointSettingsProduct_isLoading,
  loyaltyPointSettingsProduct_columns,
  loyaltyPointSettingsProduct_onChangePage,
  // form
  loyaltyPointSettings_formData,
  loyaltyPointSettings_formValidations,
  loyaltyPointSettings_onSubmit,
  loyaltyPointSettings_isLoading,
  // dialog
  loyaltyPointSettings_onShowDialog,
  loyaltyPointSettings_onCloseDialog,
  loyaltyPointSettings_columns,
  loyaltyPointSettings_fetchAllProduct,
  loyaltyPointSettings_allProductList,
  allProductList_isLoading,
  loyaltyPointSettingAllProductQueryParams,
  loyaltyPointSettingsAllProduct_onChangePage,
  selectedProducts,
  loyaltyPointSettings_onSubmitDialog,
  loyaltyPointSettingsProduct,
  loyaltyPointSettings_onShowDialogEditProduct,
  loyaltyPointSettings_onCloseDialogEditProduct,

  isProductSelected,
  getSelectedProductData,
  loyaltyPointSettings_toggleSelection,
  loyaltyPointSettings_updateProductValue,
} = usePointConfigurationService();

provide('loyaltyPointSettings', {
  // dialog
  loyaltyPointSettings_onShowDialog,
  loyaltyPointSettings_onCloseDialog,
  loyaltyPointSettings_columns,
  loyaltyPointSettings_fetchAllProduct,
  loyaltyPointSettings_allProductList,
  allProductList_isLoading,
  loyaltyPointSettingAllProductQueryParams,
  loyaltyPointSettingsAllProduct_onChangePage,
  selectedProducts,
  loyaltyPointSettings_onSubmitDialog,
  loyaltyPointSettingsProduct,
  loyaltyPointSettings_onCloseDialogEditProduct,

  isProductSelected,
  getSelectedProductData,
  loyaltyPointSettings_toggleSelection,
  loyaltyPointSettings_updateProductValue,
});

onMounted(async () => {
  await loyaltyPointSettingsDetail();
  await loyaltyPointSettingsProduct();
  loyaltyPointSettings_formData.productBasedItems = loyaltyPointSettingsProduct_value.value.data.map(
    ({ productId, points, minimumTransaction, products }) => ({
      productId: productId,
      name: products.name,
      price: products.price,
      pointsEarned: points,
      minimumPurchase: minimumTransaction,
    }),
  );
});
</script>
<template>
  <section class="container mx-auto py-8">
    <form class="grid grid-cols-2 gap-8 relative inset-0 z-0" @submit.prevent="loyaltyPointSettings_onSubmit">
      <!-- <pre class="p-4 bg-grayscale-10 border border-grayscale-20 text-lg rounded-lg col-span-2">
        {{ loyaltyPointSettings_value }}
      </pre>
      <pre class="p-4 bg-grayscale-10 border border-grayscale-20 text-lg rounded-lg col-span-2">
        {{ loyaltyPointSettings_formData }}
      </pre> -->
      <section id="toggle spend base point" class="flex flex-col gap-4 col-span-2">
        <div class="flex items-center gap-4">
          <h1 class="font-semibold text-black text-xl">Spend Base Point Earning</h1>
          <PrimeVueToggleSwitch v-model="loyaltyPointSettings_formData.spendBased" />
        </div>
        <div
          class="flex items-center gap-4 border-2 border-primary bg-primary-background rounded-lg p-4 max-w-[30rem]"
        >
          <AppBaseSvg name="info" class="!w-12 !h-12" />
          <p class="text-text-disabled">
            Customers will earn points after making a purchase that meets the minimum transaction amount.
          </p>
        </div>
      </section>
      <section class="col-span-2 w-1/2 pr-4">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="bank-name"
          :name="'Minimum Transaction'"
          spacing-bottom="mb-0"
          class="col-span-1"
          :validators="loyaltyPointSettings_formValidations.spendBasedMinTransaction"
        >
          <PrimeVueInputNumber
            v-model="loyaltyPointSettings_formData.spendBasedMinTransaction"
            :disabled="!loyaltyPointSettings_formData.spendBased"
            prefix="Rp "
            :min="0"
            fluid
            placeholder="Rp 0"
            class="text-sm w-full"
            :class="{
              ...classes,
            }"
            v-on="useListenerForm(loyaltyPointSettings_formValidations, 'spendBasedMinTransaction')"
          />
        </AppBaseFormGroup>
      </section>

      <section class="col-span-2 w-1/2 pr-4">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="bank-name"
          :name="'Point Earning'"
          spacing-bottom="mb-0"
          :validators="loyaltyPointSettings_formValidations.spendBasedPointEarned"
        >
          <div class="flex items-center gap-2">
            <PrimeVueInputNumber
              v-model="loyaltyPointSettings_formData.spendBasedPointEarned"
              :disabled="!loyaltyPointSettings_formData.spendBased"
              class="text-sm text-center"
              show-buttons
              button-layout="horizontal"
              fluid
              :min="0"
              :step="1"
              :class="{
                ...classes,
              }"
              v-on="useListenerForm(loyaltyPointSettings_formValidations, 'spendBasedPointEarned')"
            >
              <template #decrementicon>
                <span><AppBaseSvg name="minus" class="!w-5 !h-5" /></span>
              </template>
              <template #incrementicon>
                <AppBaseSvg name="plus-line" class="!w-5 !h-5" />
              </template>
            </PrimeVueInputNumber>
            <p class="text-sm text-text-disabled">Points</p>
          </div>
        </AppBaseFormGroup>
      </section>

      <section class="col-span-2 w-1/2 pr-4">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="bank-name"
          :name="'Point Expiration'"
          spacing-bottom="mb-0"
          :validators="loyaltyPointSettings_formValidations.spendBasedExpiration"
        >
          <PrimeVueInputNumber
            v-model="loyaltyPointSettings_formData.spendBasedExpiration"
            :disabled="!loyaltyPointSettings_formData.spendBased"
            class="text-sm text-center"
            show-buttons
            button-layout="horizontal"
            fluid
            :min="0"
            :step="1"
            :class="{
              ...classes,
            }"
            v-on="useListenerForm(loyaltyPointSettings_formValidations, 'spendBasedExpiration')"
          >
            <template #decrementicon>
              <span><AppBaseSvg name="minus" class="!w-5 !h-5" /></span>
            </template>
            <template #incrementicon>
              <AppBaseSvg name="plus-line" class="!w-5 !h-5" />
            </template>
          </PrimeVueInputNumber>
        </AppBaseFormGroup>
      </section>

      <section class="col-span-2 w-1/2 pr-4">
        <AppBaseFormGroup
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="bank-name"
          :name="'Point apply in multiples'"
          spacing-bottom="mb-0"
        >
          <div class="flex items-center gap-2">
            <span class="text-text-disabled">No</span>
            <PrimeVueToggleSwitch
              v-model="loyaltyPointSettings_formData.spendBasedApplyMultiple"
              :disabled="!loyaltyPointSettings_formData.spendBased"
            />
            <span class="text-primary">Yes</span>
          </div>
        </AppBaseFormGroup>
      </section>

      <section class="col-span-2 w-1/2 pr-4">
        <AppBaseFormGroup
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="bank-name"
          :name="'Customers will still earn points even when redeeming points'"
          spacing-bottom="mb-0"
        >
          <div class="flex items-center gap-2">
            <span class="text-text-disabled">No</span>
            <PrimeVueToggleSwitch
              v-model="loyaltyPointSettings_formData.spendBasedEarnWhenRedeem"
              :disabled="!loyaltyPointSettings_formData.spendBased"
            />
            <span class="text-primary">Yes</span>
          </div>
        </AppBaseFormGroup>
      </section>

      <section id="toggle product base point" class="flex flex-col gap-4 col-span-2">
        <div class="flex items-center gap-4">
          <h1 class="font-semibold text-black text-xl">Spend Base Point Earning</h1>
          <PrimeVueToggleSwitch v-model="loyaltyPointSettings_formData.productBased" />
        </div>
        <div
          class="flex items-center gap-4 border-2 border-primary bg-primary-background rounded-lg p-4 max-w-[30rem]"
        >
          <AppBaseSvg name="info" class="!w-8 !h-8" />
          <p class="text-text-disabled">Customers will earn points when purchasing selected products</p>
        </div>
      </section>

      <section class="col-span-2">
        <!-- <pre>{{ loyaltyPointSettings_formData }}</pre> -->
        <PrimeVueButton
          unstyled
          :disabled="!loyaltyPointSettings_formData.productBased"
          class="flex items-center justify-center cursor-pointer"
          @click="loyaltyPointSettings_onShowDialogEditProduct('123')"
        >
          <AppBaseSvg name="edit" />
        </PrimeVueButton>
        <AppBaseDataTable
          header-title="Product Item"
          :is-using-filter="false"
          :columns="loyaltyPointSettingsProduct_columns"
          :data="loyaltyPointSettings_formData.productBasedItems"
          :is-loading="loyaltyPointSettingsProduct_isLoading"
          :rows-per-page="loyaltyPointSettingsProduct_value.meta.pageSize"
          :total-records="loyaltyPointSettingsProduct_value.meta.total"
          :first="
            (loyaltyPointSettingsProduct_value.meta.page - 1) * loyaltyPointSettingsProduct_value.meta.pageSize
          "
          is-using-server-side-pagination
          is-using-custom-body
          is-using-custom-header-prefix
          is-using-custom-header-suffix
          @update:currentPage="loyaltyPointSettingsProduct_onChangePage"
        >
          <template #header-prefix>
            <h1 class="font-semibold text-black text-xl">Product Item</h1>
          </template>
          <template #header-suffix>
            <PrimeVueButton
              class="w-fit"
              label="Select Product"
              :disabled="!loyaltyPointSettings_formData.productBased"
              @click="loyaltyPointSettings_onShowDialog()"
            >
              <template #icon>
                <AppBaseSvg name="plus-line-white" class="!w-5 !h-5" />
              </template>
            </PrimeVueButton>
          </template>
          <template #body="{ column, data, index }">
            <template v-if="column.value === 'index'">
              <span class="font-normal text-sm text-text-primary">
                {{ loyaltyPointSettingsProduct_value.meta.page - 1 + index + 1 }}</span
              >
            </template>
            <template v-else-if="column.value === 'productName'">
              {{ data.name }}
            </template>
            <template v-else-if="column.value === 'points'">
              {{ data.pointsEarned }}
            </template>
            <template v-else-if="column.value === 'minimumTransaction'">
              {{ data.minimumPurchase }}
            </template>
            <template v-else-if="column.value === 'price'">
              <span class="font-normal text-sm text-text-primary">
                {{ useCurrencyFormat({ data: data.price || 0 }) }}</span
              >
            </template>
            <template v-else-if="column.value === 'action'">
              <PrimeVueButton
                unstyled
                :disabled="!loyaltyPointSettings_formData.productBased"
                class="flex items-center justify-center cursor-pointer"
                @click="loyaltyPointSettings_onShowDialogEditProduct(data.id)"
              >
                <template #icon>
                  <AppBaseSvg name="edit" class="!w-5 !h-5" />
                </template>
              </PrimeVueButton>
            </template>
            <template v-else>
              <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
            </template>
          </template>
        </AppBaseDataTable>
      </section>

      <section class="col-span-2 w-1/2 pr-4">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="bank-name"
          :name="'Point Expiration'"
          spacing-bottom="mb-0"
          :validators="loyaltyPointSettings_formValidations.productBasedExpiration"
        >
          <PrimeVueInputNumber
            v-model="loyaltyPointSettings_formData.productBasedExpiration"
            :disabled="!loyaltyPointSettings_formData.spendBased"
            class="text-sm text-center"
            show-buttons
            button-layout="horizontal"
            fluid
            :min="0"
            :step="1"
            :class="{
              ...classes,
            }"
            v-on="useListenerForm(loyaltyPointSettings_formValidations, 'productBasedExpiration')"
          >
            <template #decrementicon>
              <span><AppBaseSvg name="minus" class="!w-5 !h-5" /></span>
            </template>
            <template #incrementicon>
              <AppBaseSvg name="plus-line" class="!w-5 !h-5" />
            </template>
          </PrimeVueInputNumber>
        </AppBaseFormGroup>
      </section>

      <section class="col-span-2 w-1/2 pr-4">
        <AppBaseFormGroup
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="bank-name"
          :name="'Point apply in multiples'"
          spacing-bottom="mb-0"
        >
          <div class="flex items-center gap-2">
            <span class="text-text-disabled">No</span>
            <PrimeVueToggleSwitch
              v-model="loyaltyPointSettings_formData.productBasedApplyMultiple"
              :disabled="!loyaltyPointSettings_formData.productBased"
            />
            <span class="text-primary">Yes</span>
          </div>
        </AppBaseFormGroup>
      </section>

      <section class="col-span-2 w-1/2 pr-4">
        <AppBaseFormGroup
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="bank-name"
          :name="'Customers will still earn points even when redeeming points'"
          spacing-bottom="mb-0"
        >
          <div class="flex items-center gap-2">
            <span class="text-text-disabled">No</span>
            <PrimeVueToggleSwitch
              v-model="loyaltyPointSettings_formData.productBasedEarnWhenRedeem"
              :disabled="!loyaltyPointSettings_formData.productBased"
            />
            <span class="text-primary">Yes</span>
          </div>
        </AppBaseFormGroup>
      </section>

      <footer class="col-span-2 flex items-center w-full gap-4 pb-8">
        <router-link :to="{ name: 'point-configuration.index' }">
          <PrimeVueButton
            class="bg-transparent border-primary w-full max-w-44"
            label="Cancel"
            severity="secondary"
            variant="outlined"
          />
        </router-link>

        <PrimeVueButton
          class="bg-blue-primary border-none text-base max-w-44 w-full"
          label="Update"
          type="submit"
          :loading="loyaltyPointSettings_isLoading"
          :disabled="loyaltyPointSettings_formValidations.$invalid"
        />
      </footer>
    </form>
  </section>
  <DialogSelectItems />
  <DialogEditSelectedItems />
</template>
