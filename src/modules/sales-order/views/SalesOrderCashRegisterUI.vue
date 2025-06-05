<script setup lang="ts">
// Services
import { useCashDrawerService } from '../services/cash-drawer.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  cashDrawer_getIconOfTypeCashRegister,
  cashDrawer_listColumnsOfCashRegister,
  cashDrawer_listTypesOfCashRegister,
  cashDrawer_listValuesOfCashRegister
} = useCashDrawerService();
</script>


<template>
  <section id="sales-order-cash-register" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable :columns="cashDrawer_listColumnsOfCashRegister" :data="cashDrawer_listValuesOfCashRegister"
      is-using-custom-body is-using-custom-filter is-using-custom-header>
      <template #header>
        <header class="flex flex-col">
          <div class="flex flex-col items-center w-full px-6 py-5 gap-2">
            <section class="cash-register-actions flex items-end gap-6">
              <PrimeVueButton
                class="border-2 border-solid border-primary basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
                severity="secondary" variant="outlined">
                <template #default>
                  <section class="cash-out-button flex items-center gap-2">
                    <AppBaseSvg name="minus" />
                    <span class="font-semibold text-xs text-primary">Cash Out</span>
                  </section>
                </template>
              </PrimeVueButton>

              <section id="balances" class="flex flex-col items-center gap-2">
                <h6 class="font-semibold text-grayscale-70 text-xs">
                  Total Balance
                </h6>

                <div class="flex items-end gap-1">
                  <span class="font-semibold text-text-disabled text-sm">Rp</span>

                  <h2 class="font-bold text-primary text-4xl">
                    700.000,00
                  </h2>
                </div>
              </section>

              <PrimeVueButton
                class="border-2 border-solid border-primary basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
                severity="secondary" variant="outlined">
                <template #default>
                  <section id="content" class="flex items-center gap-2">
                    <AppBaseSvg name="plus-line" />
                    <span class="font-semibold text-xs text-primary">Cash In</span>
                  </section>
                </template>
              </PrimeVueButton>
            </section>

            <PrimeVueButton class="bg-error-main border-none w-fit px-4 py-2 rounded-lg basic-smooth-animation"
              severity="secondary" variant="outlined">
              <template #default>
                <section id="content" class="flex items-center gap-2">
                  <AppBaseSvg name="close-circle" class="!w-5 !h-5" />
                  <span class="font-semibold text-sm text-white">Close Register</span>
                </section>
              </template>
            </PrimeVueButton>
          </div>

          <section id="sales-order-cash-register-filter"
            class="flex items-center justify-between w-full border-b border-t border-solid border-grayscale-20 px-6 py-5">
            <section id="detail-information">
              <table>
                <tbody>
                  <tr>
                    <td class="font-normal text-grayscale-70 text-xs p-1">Opened On</td>
                    <td class="font-normal text-grayscale-70 text-xs p-1">:</td>
                    <td class="font-normal text-grayscale-70 text-xs p-1">01/08/2024, 09:00 AM by Samantha</td>
                  </tr>

                  <tr>
                    <td class="font-normal text-grayscale-70 text-xs p-1">Closed On</td>
                    <td class="font-normal text-grayscale-70 text-xs p-1">:</td>
                    <td class="font-normal text-grayscale-70 text-xs p-1">01/08/2024, 09:00 AM by Samantha</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section id="form-filter" class="flex items-center gap-4 w-fit">
              <PrimeVueButton
                class="border-2 border-solid border-primary basic-smooth-animation w-full px-3 py-2 rounded-lg hover:bg-grayscale-10"
                severity="secondary" variant="outlined">
                <template #default>
                  <section id="content" class="flex items-center gap-2">
                    <AppBaseSvg name="export" />
                    <span class="font-semibold text-sm text-primary">Export to PDF</span>
                  </section>
                </template>
              </PrimeVueButton>

              <PrimeVueSelect :options="cashDrawer_listTypesOfCashRegister" option-label="label" option-value="value"
                placeholder="Type" class="text-sm w-full min-w-60">
              </PrimeVueSelect>
            </section>
          </section>
        </header>
      </template>

      <template #body="{ column, data }">
        <template v-if="column.value === 'type'">
          <section id="type" class="flex items-center gap-3">
            <AppBaseSvg :name="cashDrawer_getIconOfTypeCashRegister(data[column.value])" class="!w-5 !h-5" />
            <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
          </section>
        </template>

        <template v-else-if="column.value === 'cashIn'">
          <span class="font-normal text-sm text-text-primary">
            {{ useCurrencyFormat(data[column.value]) }}
          </span>
        </template>

        <template v-else-if="column.value === 'cashOut'">
          <span class="font-normal text-sm" :class="[
            data[column.value] > 0 ? 'text-text-action-error' : 'text-text-primary'
          ]">
            {{ useCurrencyFormat(data[column.value]) }}
          </span>
        </template>

        <template v-else-if="column.value === 'balance'">
          <span class="font-semibold text-sm text-text-primary">
            {{ useCurrencyFormat(data[column.value]) }}
          </span>
        </template>

        <template v-else-if="column.value === 'action'">
          <PrimeVueButton v-if="data.type === 'Cash In' || data.type === 'Cash Out'" variant="text" rounded
            aria-label="detail">
            <template #icon>
              <AppBaseSvg name="delete" class="!w-5 !h-5" />
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