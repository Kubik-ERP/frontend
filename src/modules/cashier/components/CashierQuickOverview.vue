<script setup lang="ts">
// Components
import CashierSearchProductCategory from './CashierSearchProductCategory.vue';

// Interface
import type { ICashDrawerListProvided } from '@/modules/cash-drawer/interfaces';
import type { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';
import type { IDailySalesListProvided } from '@/modules/daily-sales/interfaces/daily-sales-list.interface';

/**
 * @description Inject all the data and methods what we need
 */
const { cashDrawerList_todayStatus, cashDrawerList_onShowOpenRegisterDialog } =
  inject<ICashDrawerListProvided>('cashDrawerList')!;
const {
  cashierOrderSummary_isRetailBusinessType,
  cashierOrderSummary_isShowQuickOverview,
  cashierOrderSummary_onOpenDialogCashDrawerOverview,
  cashierOrderSummary_onOpenDialogQueueOverview,
  cashierOrderSummary_onOpenDialogTableOverview,
  cashierOrderSummary_onOpenDialogStockOverview,
} = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
const { dailySalesList_values } = inject<IDailySalesListProvided>('dailySalesList')!;
</script>

<template>
  <section
    id="cashier-quick-overview"
    class="default-wrapper bg-white static xl:sticky inset-0 z-10 gap-4 px-10 py-6"
  >
    <section id="main-section" class="flex flex-col gap-4 bg-white">
      <header class="flex items-center justify-between">
        <section id="left-content" class="flex items-center gap-4">
          <PrimeVueButton
            class="w-fit border-none bg-transparent basic-smooth-animation hover:bg-grayscale-10 p-2 rounded-sm"
            severity="secondary"
            @click="$router.back()"
          >
            <template #default>
              <section id="content" class="flex items-center gap-2">
                <AppBaseSvg name="chevron-left" class="w-4 h-4 cursor-pointer tinted-by-css" />
              </section>
            </template>
          </PrimeVueButton>

          <h6 class="font-semibold text-lg text-black">Cashier</h6>
        </section>

        <section id="right-content" class="flex items-center gap-2">
          <PrimeVueButton
            class="w-full px-4 py-3"
            variant="text"
            @click="
              () => {
                cashierOrderSummary_isShowQuickOverview = !cashierOrderSummary_isShowQuickOverview;
              }
            "
          >
            <template #default>
              <section id="content" class="flex items-center gap-2 w-full">
                <AppBaseSvg
                  :name="cashierOrderSummary_isShowQuickOverview ? 'eye-invisible-primary' : 'eye-visible-primary'"
                  class="w-5 h-5 tinted-by-css"
                />
                <span class="font-semibold text-sm text-primary">
                  {{ cashierOrderSummary_isShowQuickOverview ? 'Hide' : 'Show' }} Quick Overview
                </span>
              </section>
            </template>
          </PrimeVueButton>
        </section>
      </header>

      <section
        v-show="cashierOrderSummary_isShowQuickOverview"
        id="overviews"
        class="grid grid-rows-1 grid-cols-12 gap-4"
      >
        <section
          v-if="!cashierOrderSummary_isRetailBusinessType"
          id="customer-queue"
          class="border border-solid border-grayscale-10 col-span-full lg:col-span-4 flex flex-col gap-4 p-4 rounded-2xl"
        >
          <header class="flex items-center justify-between">
            <section id="left-content" class="flex items-center gap-2">
              <AppBaseSvg name="customer-queue" class="w-5 h-5 tinted-by-css" />
              <span class="font-semibold text-sm text-grayscale-70"> Customer Queue </span>
            </section>

            <section id="right-content" class="flex items-center gap-2">
              <PrimeVueButton
                class="w-full p-0 bg-transparent"
                variant="text"
                @click="cashierOrderSummary_onOpenDialogQueueOverview"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <span class="font-semibold text-xs text-primary">View All</span>
                    <AppBaseSvg name="arrow-right" class="w-4 h-4 tinted-by-css" />
                  </section>
                </template>
              </PrimeVueButton>
            </section>
          </header>

          <section id="content" class="flex items-end gap-1">
            <h4 class="font-bold text-primary text-2xl">
              {{ dailySalesList_values.data.items.length }}
            </h4>

            <span class="font-semibold text-disabled text-sm"> queue </span>
          </section>
        </section>

        <section
          id="cash-drawer"
          class="border border-solid border-grayscale-10 col-span-full flex flex-col gap-4 p-4 rounded-2xl"
          :class="[cashierOrderSummary_isRetailBusinessType ? 'lg:col-span-6' : 'lg:col-span-4']"
        >
          <header class="flex items-center justify-between">
            <section id="left-content" class="flex items-center gap-2">
              <AppBaseSvg name="cashier" class="w-5 h-5 tinted-by-css" />
              <span class="font-semibold text-sm text-grayscale-70"> Cash Drawer </span>
            </section>

            <section id="right-content" class="flex items-center gap-2">
              <PrimeVueButton
                v-if="!!cashDrawerList_todayStatus"
                class="w-full p-0 bg-transparent"
                variant="text"
                @click="cashierOrderSummary_onOpenDialogCashDrawerOverview"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <span class="font-semibold text-xs text-primary">View Details</span>
                    <AppBaseSvg name="arrow-right" class="w-4 h-4 tinted-by-css" />
                  </section>
                </template>
              </PrimeVueButton>
            </section>
          </header>

          <section id="content" class="flex items-center gap-3">
            <section
              id="custom-chip"
              class="flex items-center gap-2 p-2 rounded-full w-fit"
              :class="[!!cashDrawerList_todayStatus ? 'bg-success-background' : 'bg-error-background']"
            >
              <section
                id="dots"
                class="w-3 h-3 rounded-full"
                :class="[!!cashDrawerList_todayStatus ? 'bg-success-hover' : 'bg-error-main']"
              >
                &nbsp;
              </section>

              <span
                class="font-semibold text-xs"
                :class="[!!cashDrawerList_todayStatus ? 'text-success-hover' : 'text-error-main']"
              >
                {{ !!cashDrawerList_todayStatus ? 'Open' : 'Closed' }}
              </span>
            </section>

            <PrimeVueButton
              v-if="!cashDrawerList_todayStatus"
              class="flex items-center gap-2 font-semibold text-primary bg-white border border-solid border-primary py-2 rounded-full text-xs hover:bg-gray-50 w-full"
              @click="cashDrawerList_onShowOpenRegisterDialog"
            >
              Open Cash Register
            </PrimeVueButton>
          </section>
        </section>

        <section
          v-if="cashierOrderSummary_isRetailBusinessType"
          id="current-stock"
          class="border border-solid border-grayscale-10 col-span-full lg:col-span-6 flex flex-col gap-4 p-4 rounded-2xl"
        >
          <header class="flex items-center justify-between">
            <section id="left-content" class="flex items-center gap-2">
              <AppBaseSvg name="inventory" class="w-5 h-5 tinted-by-css" />
              <span class="font-semibold text-sm text-grayscale-70"> Current Stock </span>
            </section>
          </header>

          <section id="content" class="flex items-center gap-1">
            <PrimeVueButton
              class="flex items-center gap-2 font-semibold text-primary bg-white border border-solid border-primary py-2 rounded-md text-sm hover:bg-gray-50 w-full"
              @click="cashierOrderSummary_onOpenDialogStockOverview"
            >
              <AppBaseSvg name="eye-visible" class="w-4 h-4 tinted-by-css" color="primary" />
              View Stock Items
            </PrimeVueButton>
          </section>
        </section>

        <section
          v-if="!cashierOrderSummary_isRetailBusinessType"
          id="table-summary"
          class="border border-solid border-grayscale-10 col-span-full lg:col-span-4 flex flex-col gap-4 p-4 rounded-2xl"
        >
          <header class="flex items-center justify-between">
            <section id="left-content" class="flex items-center gap-2">
              <AppBaseSvg name="table" class="w-5 h-5 tinted-by-css" />
              <span class="font-semibold text-sm text-grayscale-70"> Table Summary </span>
            </section>
          </header>

          <section id="content" class="flex items-center gap-1">
            <PrimeVueButton
              class="flex items-center gap-2 font-semibold text-primary bg-white border border-solid border-primary py-2 rounded-md text-sm hover:bg-gray-50 w-full"
              @click="cashierOrderSummary_onOpenDialogTableOverview"
            >
              <AppBaseSvg name="eye-visible" class="w-4 h-4 tinted-by-css" color="primary" />
              View Table Summary
            </PrimeVueButton>
          </section>
        </section>
      </section>
    </section>

    <CashierSearchProductCategory />
  </section>
</template>
