<script setup lang="ts">
// type
import type { ILoyaltyPointBenefitProvided } from '@/modules/point-configuration/interfaces/loyalty-point-benefit.interface';

//components
import Discount from './DiscountFreeItems/Discount.vue';
import FreeItems from './DiscountFreeItems/FreeItems.vue';

// services
const {
  loyaltyPointBenefit_columns,
  loyaltyPointBenefit_onShowDialogDiscount,
  loyaltyPointBenefit_onShowEditDialogDiscount,
  loyaltyPointBenefit_onShowDialogFreeItems,
  loyaltyPointBenefit_onShowEditDialogFreeItems,
  dailySalesList_onChangePage,
  loyaltyPointBenefit_list,
  loyaltyPointBenefit_isLoading,
} = inject<ILoyaltyPointBenefitProvided>('loyaltyPointBenefit')!;

const popover = ref();

import { useRbac } from '@/app/composables/useRbac';
const rbac = useRbac();
const hasPermission = rbac.hasPermission('general_loyalty_point_configuration');
// v-if="hasPermission"
</script>
<template>
  <section id="loyalty-point-benefit-table" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      :data="loyaltyPointBenefit_list.loyaltyBenefits?.items || []"
      :columns="loyaltyPointBenefit_columns"
      header-title="Loyalty Point Benefit"
      :rows-per-page="
        !loyaltyPointBenefit_list.loyaltySettingsStatus
          ? 10
          : loyaltyPointBenefit_list.loyaltyBenefits.meta.pageSize
      "
      :total-records="
        !loyaltyPointBenefit_list.loyaltySettingsStatus ? 100 : loyaltyPointBenefit_list.loyaltyBenefits.meta.total
      "
      :first="
        !loyaltyPointBenefit_list.loyaltySettingsStatus
          ? 1
          : (loyaltyPointBenefit_list.loyaltyBenefits.meta.page - 1) *
            loyaltyPointBenefit_list.loyaltyBenefits.meta.pageSize
      "
      is-using-server-side-pagination
      :is-using-filter="false"
      :is-loading="loyaltyPointBenefit_isLoading"
      is-using-custom-body
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      @update:currentPage="dailySalesList_onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Loyalty Point Benefit</h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton
          v-if="hasPermission"
          class="w-fit"
          label="Add Benefit"
          :disabled="!loyaltyPointBenefit_list.loyaltySettingsStatus"
          @click="popover.toggle($event)"
        >
          <template #icon>
            <AppBaseSvg name="plus-line-white" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>
        <PrimeVuePopover
          ref="popover"
          :pt="{
            content: 'p-0',
          }"
        >
          <section id="popover-content" class="flex flex-col">
            <PrimeVueButton
              class="w-full px-4 py-3"
              variant="text"
              @click="loyaltyPointBenefit_onShowDialogDiscount()"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="cash" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Discount</span>
                </section>
              </template>
            </PrimeVueButton>
            <PrimeVueButton
              class="w-full px-4 py-3"
              variant="text"
              @click="loyaltyPointBenefit_onShowDialogFreeItems()"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="inventory" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Free Items</span>
                </section>
              </template>
            </PrimeVueButton>
          </section>
        </PrimeVuePopover>
      </template>
      <template #body="{ column, data, index }">
        <template v-if="column.value === 'index'">
          <span class="font-normal text-sm text-text-primary"> {{ index + 1 }}</span>
        </template>
        <template v-else-if="column.value === 'type'">
          <span class="font-normal text-sm text-text-primary">
            {{ data[column.value] === 'discount' ? 'Discount' : 'Free Items' }}</span
          >
        </template>
        <template v-else-if="column.value === 'discountFreeItems'">
          <div v-if="data['type'] === 'discount'" class="font-normal text-sm text-text-primary">
            <Discount :data="data[column.value]" />
          </div>
          <div v-else class="font-normal text-sm text-text-primary">
            <FreeItems :data="data[column.value]" />
          </div>
        </template>
        <template v-else-if="column.value === 'action'">
          <PrimeVueButton
            v-if="hasPermission"
            variant="text"
            rounded
            aria-label="detail"
            @click="
              data.type === 'discount'
                ? loyaltyPointBenefit_onShowEditDialogDiscount(data)
                : loyaltyPointBenefit_onShowEditDialogFreeItems(data)
            "
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
</template>
