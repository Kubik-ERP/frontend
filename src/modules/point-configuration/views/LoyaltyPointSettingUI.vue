<script setup lang="ts">
import { usePointConfigurationService } from '../services/point-configuration.service';

const {
  loyaltyPointSettingsProduct_isLoading,
  loyaltyPointSettingsProduct_value,
  // loyaltyPointSettings_isLoading,
  loyaltyPointSettings_value,
  loyaltyPointSettingsDetail,
  // table
  loyaltyPointSettingsProduct,
  loyaltyPointSettingsProduct_columns,
  loyaltyPointSettingsProduct_onChangePage,
} = usePointConfigurationService();


onMounted(async () => {
  await loyaltyPointSettingsDetail();
  await loyaltyPointSettingsProduct();
});
</script>

<template>
  <section id="loyalty-point-setting" class="flex flex-col gap-8 relative inset-0 z-0 mt-4">
    <PrimeVueCard class="w-full border border-solid border-grayscale-20 shadow-none">
      <template #content>
        <section class="flex gap-4">
          <h1 class="font-semibold text-black text-xl">Spend Base Point Earning</h1>
          <PrimeVueChip>
            <span class="text-primary bg-primary-background text-xs">
              {{ loyaltyPointSettings_value?.spendBased ? 'Active' : 'Inactive' }}
            </span>
          </PrimeVueChip>
        </section>
        <section class="grid grid-cols-2 gap-4">
          <div class="flex flex-col">
            <h6 class="text-black-secondary text-sm">Minimum Transaction</h6>
            <span class="font-normal text-text-primary">
              {{ useCurrencyFormat({ data: loyaltyPointSettings_value?.minimumTransaction || 0 }) }}
            </span>
          </div>
          <div class="flex flex-col">
            <h6 class="text-black-secondary text-sm">Point apply in multiple</h6>
            <span class="font-normal text-text-primary">
              {{ loyaltyPointSettings_value?.spendBasedPointsApplyMultiple ? 'Yes' : 'No' }}
            </span>
          </div>
          <div class="flex flex-col">
            <h6 class="text-black-secondary text-sm">Point Earn</h6>
            <span class="font-normal text-text-primary">
              {{ loyaltyPointSettings_value?.pointsPerTransaction || 0 }}
            </span>
          </div>
          <div class="flex flex-col">
            <h6 class="text-black-secondary text-sm">
              Customers will still earn points even when redeeming points
            </h6>
            <span class="font-normal text-text-primary">
              {{ loyaltyPointSettings_value?.spendBasedGetPointsOnRedemption ? 'Yes' : 'No' }}
            </span>
          </div>
          <div>
            <h6 class="text-black-secondary text-sm">Point Expiration</h6>
            <span class="font-normal text-text-primary">
              {{
                loyaltyPointSettings_value?.spendBasedPointsExpiryDays || 0
                  ? loyaltyPointSettings_value?.spendBasedPointsExpiryDays + ' days'
                  : 'No Expiration'
              }}
            </span>
          </div>
        </section>
      </template>
    </PrimeVueCard>
    <PrimeVueCard class="w-full border border-solid border-grayscale-20 shadow-none">
      <template #content>
        <section class="flex gap-4">
          <h1 class="font-semibold text-black text-xl">Product Base Point Earning</h1>
          <PrimeVueChip>
            <span class="text-primary bg-primary-background text-xs">
              {{ loyaltyPointSettings_value?.productBased ? 'Active' : 'Inactive' }}
            </span>
          </PrimeVueChip>
        </section>
        <section class="grid grid-cols-1 gap-4">
          <div class="flex flex-col">
            <h6 class="text-black-secondary text-sm">Point Expiration</h6>
            <span class="font-normal text-text-primary">
              {{
                loyaltyPointSettings_value?.productBasedPointsExpiryDays || 0
                  ? loyaltyPointSettings_value?.productBasedPointsExpiryDays + ' days'
                  : 'No Expiration'
              }}
            </span>
          </div>
          <div class="flex flex-col">
            <h6 class="text-black-secondary text-sm">Point apply in multiple</h6>
            <span class="font-normal text-text-primary">
              {{ loyaltyPointSettings_value?.productBasedPointsApplyMultiple ? 'Yes' : 'No' }}
            </span>
          </div>
          <div class="flex flex-col">
            <h6 class="text-black-secondary text-sm">
              Customers will still earn points even when redeeming points
            </h6>
            <span class="font-normal text-text-primary">
              {{ loyaltyPointSettings_value?.productBasedGetPointsOnRedemption ? 'Yes' : 'No' }}
            </span>
          </div>
        </section>
        <section id="loyalty-point-setting-product" class="mt-4">
          <AppBaseDataTable
            header-title="Product Item"
            :is-using-filter="false"
            :columns="loyaltyPointSettingsProduct_columns"
            :data="loyaltyPointSettingsProduct_value.data"
            :is-loading="loyaltyPointSettingsProduct_isLoading"
            :rows-per-page="loyaltyPointSettingsProduct_value.meta.limit"
            :total-records="loyaltyPointSettingsProduct_value.meta.total"
            :first="
              (loyaltyPointSettingsProduct_value.meta.page - 1) * loyaltyPointSettingsProduct_value.meta.limit
            "
            is-using-server-side-pagination
            is-using-custom-body
            @update:currentPage="loyaltyPointSettingsProduct_onChangePage"
          >
            <template #body="{ column, data, index }">
              <template v-if="column.value === 'index'">
                <span class="font-normal text-sm text-text-primary">
                  {{ loyaltyPointSettingsProduct_value.meta.page - 1 + index + 1 }}</span
                >
              </template>
              <template v-else-if="column.value === 'price'">
                <span class="font-normal text-sm text-text-primary">
                  {{ useCurrencyFormat({ data: data[column.value] || 0 }) }}</span
                >
              </template>
              <template v-else>
                <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
              </template>
            </template>
          </AppBaseDataTable>
        </section>
      </template>
    </PrimeVueCard>

    <footer>
      <router-link :to="{ name: 'loyalty-point-setting.edit' }">
        <PrimeVueButton
          class="font-semibold text-base text-primary border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Edit Loyalty Point Settings"
          severity="secondary"
          variant="outlined"
        >
          <template #icon>
            <AppBaseSvg name="edit" class="!w-4 !h-4" />
          </template>
        </PrimeVueButton>
      </router-link>
    </footer>
  </section>
</template>
