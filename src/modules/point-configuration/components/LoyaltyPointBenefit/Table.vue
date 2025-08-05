<script setup lang="ts">
//components
import Discount from './DiscountFreeItems/Discount.vue';
import FreeItems from './DiscountFreeItems/FreeItems.vue';

// services
import { useLoyaltyPointBenefitService } from '../../services/loyalty-point-benefit.service';
const {
  loyaltyPointBenefit_values,
  loyaltyPointBenefit_columns,
  loyaltyPointBenefit_onCreate,
  dailySalesList_onChangePage,
} = useLoyaltyPointBenefitService();
</script>
<template>
  <section id="loyalty-point-benefit-table" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      is-using-btn-cta-create
      btn-cta-create-title="Add Benefit"
      :data="loyaltyPointBenefit_values"
      :columns="loyaltyPointBenefit_columns"
      header-title="Loyalty Point Benefit"
      :rows-per-page="10"
      :total-records="100"
      :first="1"
      is-using-server-side-pagination
      is-using-custom-body
      is-using-custom-filter
      @update:currentPage="dailySalesList_onChangePage"
      @click-btn-cta-create="loyaltyPointBenefit_onCreate"
    >
      <template #body="{ column, data, index }">
        <template v-if="column.value === 'index'">
          <span class="font-normal text-sm text-text-primary"> {{ index + 1 }}</span>
        </template>
        <template v-else-if="column.value === 'discountFreeItems'">
          <div v-if="data['type'] === 'Discount'" class="font-normal text-sm text-text-primary">
            <Discount :data="data[column.value]" />
          </div>
          <div v-else class="font-normal text-sm text-text-primary">
            <FreeItems :data="data[column.value]" />
          </div>
        </template>
        <template v-else-if="column.value === 'action'">
          <PrimeVueButton variant="text" rounded aria-label="detail">
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
</template>
