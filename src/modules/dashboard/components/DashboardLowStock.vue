<script setup lang="ts">
import type { IDashboardProvided } from '../interfaces';
// inject
const { dashboard_values } = inject<IDashboardProvided>('dashboard')!;
</script>

<template>
  <section
    id="low-stock-informations"
    class="col-span-full md:col-span-6 flex flex-col gap-2 border-r border-solid border-grayscale-10 pr-4"
  >
    <header class="flex items-center justify-between">
      <h6 class="font-semibold text-sm lg:text-base text-grayscale-70">
        {{ useLocalization('dashboard.lowStock.title') }}
      </h6>

      <section id="detail-informations" class="flex items-center gap-2">
        <PrimeVueChip class="bg-warning-background p-2">
          <span class="font-semibold text-warning-main text-xs w-fit lg:min-w-[60px]">
            {{ dashboard_values.stockStatus.detailedLowStock.count }}+
            {{ useLocalization('dashboard.lowStock.itemsUnit') }}
          </span>
        </PrimeVueChip>

        <router-link :to="{ name: 'items.list' }">
          <PrimeVueButton class="w-full bg-transparent border-none basic-smooth-animation hover:bg-grayscale-10">
            <template #default>
              <section id="content" class="flex items-center gap-2">
                <span class="font-semibold text-text-primary text-sm">{{
                  useLocalization('dashboard.lowStock.showMore')
                }}</span>
                <AppBaseSvg name="chevron-right" class="!w-3 !h-3" />
              </section>
            </template>
          </PrimeVueButton>
        </router-link>
      </section>
    </header>

    <table>
      <thead class="hidden">
        <tr></tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in dashboard_values.stockStatus.detailedLowStock.items"
          :key="index"
          class="h-8 border-b border-solid border-grayscale-10"
        >
          <td class="w-fit py-2">
            <section id="product-name" class="flex items-center w-full gap-2">
              <span class="w-1 h-4 rounded-md bg-warning-main"> &nbsp; </span>
              <span class="font-normal text-grayscale-70 text-base"> {{ item.name }} </span>
            </section>
          </td>

          <td class="font-normal text-sm text-text-disabled w-14 py-2">
            {{ useLocalization('dashboard.lowStock.quantityUnit') }}
          </td>

          <td class="font-semibold text-sm text-primary w-16 border-r border-solid border-grayscale-10 py-2">
            {{ item.stock }}
            <span class="font-normal text-text-disabled"> {{ item.unit }} </span>
          </td>

          <td class="ps-4 w-14 py-2">
            <router-link :to="{ name: 'purchase-order.create' }">
              <PrimeVueButton
                class="w-full bg-transparent border-none basic-smooth-animation hover:bg-grayscale-10"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2">
                    <span class="font-semibold text-primary text-sm">{{
                      useLocalization('dashboard.lowStock.orderAction')
                    }}</span>
                  </section>
                </template>
              </PrimeVueButton>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
