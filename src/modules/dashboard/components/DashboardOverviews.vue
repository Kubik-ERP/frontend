<script setup lang="ts">
// components
import CustomDatePicker from '@/modules/report/components/CustomDatePicker.vue';
// type
import type { IDashboardProvided } from '../interfaces';
// inject
const {
  dashboard_queryParams,
  // dashboard_values //uncomment this for using overview cards
} = inject<IDashboardProvided>('dashboard')!;
</script>
<template>
  <section id="dashboard-overview" class="flex flex-col gap-4">
    <section id="filter" class="flex flex-col">
      <label for="" class="font-semibold text-black text-xs"> Data Period </label>
      <CustomDatePicker
        v-model:start-date="dashboard_queryParams.startDate"
        v-model:end-date="dashboard_queryParams.endDate"
        v-model:type="dashboard_queryParams.type"
      />
    </section>

    <!-- <section id="overview-cards" class="grid grid-rows-1 grid-cols-12 gap-4">
      <section
        id="card-total-sales"
        class="col-span-6 lg:col-span-3 flex flex-col justify-between bg-white border border-solid border-grayscale-10 p-4 rounded-sm gap-6"
      >
        <section id="summary" class="flex items-center gap-1">
          <p class="font-semibold text-grayscale-70 text-xs">Total Sales</p>

          <PrimeVueChip
            class="py-1 px-2"
            :class="[
              {
                'bg-error-background': dashboard_values.summary.totalSales.percentageChange < 0,
                'bg-disabled': dashboard_values.summary.totalSales.percentageChange === 0,
                'bg-success-background': dashboard_values.summary.totalSales.percentageChange > 0,
              },
            ]"
          >
            <AppBaseSvg
              v-if="dashboard_values.summary.totalSales.percentageChange !== 0"
              :name="
                dashboard_values.summary.totalSales.percentageChange < 0 ? 'arrow-down-danger' : 'arrow-up-success'
              "
              class="w-3 h-3"
            />

            <span class="font-semibold text-secondary-hover text-xs">
              {{ dashboard_values.summary.totalSales.percentageChange }}%
            </span>
          </PrimeVueChip>
        </section>

        <section id="total-amount" class="flex items-center justify-between">
          <span class="font-semibold text-text-disabled text-sm"> Rp </span>

          <span class="font-semibold text-primary text-2xl">
            {{ useCurrencyFormat({ data: dashboard_values.summary.totalSales.value, hidePrefix: true }) }}
          </span>
        </section>
      </section>

      <section
        id="card-total-cost-of-good-sold"
        class="col-span-6 lg:col-span-3 flex flex-col justify-between bg-white border border-solid border-grayscale-10 p-4 rounded-sm gap-6"
      >
        <section id="summary" class="flex items-center gap-1">
          <p class="font-semibold text-grayscale-70 text-xs">Total Cost of Good Sold</p>

          <PrimeVueChip
            class="py-1 px-2"
            :class="[
              {
                'bg-error-background': dashboard_values.summary.totalCostOfGoodSold.percentageChange < 0,
                'bg-disabled': dashboard_values.summary.totalCostOfGoodSold.percentageChange === 0,
                'bg-success-background': dashboard_values.summary.totalCostOfGoodSold.percentageChange > 0,
              },
            ]"
          >
            <AppBaseSvg
              v-if="dashboard_values.summary.totalCostOfGoodSold.percentageChange !== 0"
              :name="
                dashboard_values.summary.totalCostOfGoodSold.percentageChange < 0
                  ? 'arrow-down-danger'
                  : 'arrow-up-success'
              "
              class="w-3 h-3"
            />

            <span class="font-semibold text-secondary-hover text-xs">
              {{ dashboard_values.summary.totalCostOfGoodSold.percentageChange }}%
            </span>
          </PrimeVueChip>
        </section>

        <section id="total-amount" class="flex items-center justify-between">
          <span class="font-semibold text-text-disabled text-sm"> Rp </span>

          <span class="font-semibold text-primary text-2xl">
            {{ useCurrencyFormat({ data: dashboard_values.summary.totalCostOfGoodSold.value, hidePrefix: true }) }}
          </span>
        </section>
      </section>

      <section
        id="card-total-gross-profit"
        class="col-span-6 lg:col-span-3 flex flex-col justify-between bg-white border border-solid border-grayscale-10 p-4 rounded-sm gap-6"
      >
        <section id="summary" class="flex items-center gap-1">
          <p class="font-semibold text-grayscale-70 text-xs">Total Gross Profit</p>


          <PrimeVueChip
            class="py-1 px-2"
            :class="[
              {
                'bg-error-background': dashboard_values.summary.totalGrossProfit.percentageChange < 0,
                'bg-disabled': dashboard_values.summary.totalGrossProfit.percentageChange === 0,
                'bg-success-background': dashboard_values.summary.totalGrossProfit.percentageChange > 0,
              },
            ]"
          >
            <AppBaseSvg
              v-if="dashboard_values.summary.totalGrossProfit.percentageChange !== 0"
              :name="
                dashboard_values.summary.totalGrossProfit.percentageChange < 0
                  ? 'arrow-down-danger'
                  : 'arrow-up-success'
              "
              class="w-3 h-3"
            />

            <span class="font-semibold text-secondary-hover text-xs">
              {{ dashboard_values.summary.totalGrossProfit.percentageChange }}%
            </span>
          </PrimeVueChip>
        </section>

        <section id="total-amount" class="flex items-center justify-between">
          <span class="font-semibold text-text-disabled text-sm"> Rp </span>

          <span class="font-semibold text-primary text-2xl">
            {{ useCurrencyFormat({ data: dashboard_values.summary.totalGrossProfit.value, hidePrefix: true }) }}
          </span>
        </section>
      </section>

      <section
        id="card-total-nett-profit"
        class="col-span-6 lg:col-span-3 flex flex-col justify-between bg-white border border-solid border-grayscale-10 p-4 rounded-sm gap-6"
      >
        <section id="summary" class="flex items-center gap-1">
          <p class="font-semibold text-grayscale-70 text-xs">Total Nett Profit</p>


          <PrimeVueChip
            class="py-1 px-2"
            :class="[
              {
                'bg-error-background': dashboard_values.summary.totalNettProfit.percentageChange < 0,
                'bg-disabled': dashboard_values.summary.totalNettProfit.percentageChange === 0,
                'bg-success-background': dashboard_values.summary.totalNettProfit.percentageChange > 0,
              },
            ]"
          >
            <AppBaseSvg
              v-if="dashboard_values.summary.totalNettProfit.percentageChange !== 0"
              :name="
                dashboard_values.summary.totalNettProfit.percentageChange < 0
                  ? 'arrow-down-danger'
                  : 'arrow-up-success'
              "
              class="w-3 h-3"
            />

            <span class="font-semibold text-secondary-hover text-xs">
              {{ dashboard_values.summary.totalNettProfit.percentageChange }}%
            </span>
          </PrimeVueChip>
        </section>

        <section id="total-amount" class="flex items-center justify-between">
          <span class="font-semibold text-text-disabled text-sm"> Rp </span>

          <span class="font-semibold text-primary text-2xl">
            {{ useCurrencyFormat({ data: dashboard_values.summary.totalNettProfit.value, hidePrefix: true }) }}
          </span>
        </section>
      </section>
    </section> -->
  </section>
</template>
