<script setup lang="ts">
// Interfaces
import type { ICashDrawerCashRegisterProvide } from '@/modules/cash-drawer/interfaces';
import type { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashDrawerCashRegister_detail,
  cashDrawerCashRegister_getIconOfTypeCashRegister,
  cashDrawerCashRegister_getValueOfTypeCashRegister,
  cashDrawerCashRegister_isLoading,
  cashDrawerCashRegister_listColumns,
  cashDrawerCashRegister_listTypesOfCashRegister,
  cashDrawerCashRegister_listValuesOfCashRegister,
  cashDrawerCashRegister_onOpenDialogAddTransaction,
  cashDrawerCashRegister_queryParamsOfTransaction,
} = inject('cashDrawerCashRegister') as ICashDrawerCashRegisterProvide;

const { cashierOrderSummary_onCloseDialogCashDrawerOverview } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>

<template>
  <AppBaseDialog id="cashier-cash-drawer-overview-dialog">
    <template #header>
      <header class="flex items-center gap-2">
        <AppBaseSvg name="cashier" class="w-5 h-5" />
        <h5 class="font-semibold text-black text-lg">Cash Drawer</h5>
      </header>
    </template>

    <template #content>
      <AppBaseDataTable
        :columns="cashDrawerCashRegister_listColumns"
        :data="cashDrawerCashRegister_listValuesOfCashRegister.items"
        :rows-per-page="cashDrawerCashRegister_listValuesOfCashRegister.meta.perPage"
        :total-records="cashDrawerCashRegister_listValuesOfCashRegister.meta.total"
        :first="
          (cashDrawerCashRegister_listValuesOfCashRegister.meta.currentPage - 1) *
          cashDrawerCashRegister_listValuesOfCashRegister.meta.perPage
        "
        :is-loading="cashDrawerCashRegister_isLoading"
        is-using-custom-body
        is-using-custom-filter
        is-using-custom-header
      >
        <template #header>
          <header class="flex flex-col">
            <div
              class="border border-b-0 border-solid border-grayscale-20 flex flex-col items-center w-full px-6 py-5 gap-2"
            >
              <section class="cash-register-actions flex items-end gap-6">
                <PrimeVueButton
                  v-rbac="{ permission: 'set_up_cash_drawer' }"
                  class="border border-solid border-primary basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
                  severity="secondary"
                  variant="outlined"
                  @click="cashDrawerCashRegister_onOpenDialogAddTransaction('in')"
                >
                  <template #default>
                    <section id="content" class="flex items-center gap-2">
                      <AppBaseSvg name="plus-line" class="w-4 h-4" />
                      <span class="font-semibold text-xs text-primary">Cash In</span>
                    </section>
                  </template>
                </PrimeVueButton>

                <section id="balances" class="flex flex-col items-center gap-2">
                  <h6 class="font-semibold text-grayscale-70 text-xs">Total Balance</h6>

                  <div class="flex items-end gap-1">
                    <span class="font-semibold text-text-disabled text-sm">Rp</span>

                    <h2 class="font-bold text-primary text-4xl">
                      {{
                        useCurrencyFormat({
                          data: cashDrawerCashRegister_detail?.expectedBalance ?? 0,
                          hidePrefix: true,
                          addSuffix: true,
                        })
                      }}
                    </h2>
                  </div>
                </section>

                <PrimeVueButton
                  v-rbac="{ permission: 'set_up_cash_drawer' }"
                  class="border border-solid border-primary basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
                  severity="secondary"
                  variant="outlined"
                  @click="cashDrawerCashRegister_onOpenDialogAddTransaction('out')"
                >
                  <template #default>
                    <section class="cash-out-button flex items-center gap-2">
                      <AppBaseSvg name="minus" class="w-4 h-4" />
                      <span class="font-semibold text-xs text-primary">Cash Out</span>
                    </section>
                  </template>
                </PrimeVueButton>
              </section>
            </div>

            <section
              id="sales-order-cash-register-filter"
              class="flex items-center justify-between w-full border border-solid border-grayscale-20 px-6 py-5"
            >
              <section id="detail-information">
                <table>
                  <tbody>
                    <tr>
                      <td class="font-normal text-grayscale-70 text-xs p-1">Opened On</td>
                      <td class="font-normal text-grayscale-70 text-xs p-1">:</td>
                      <td class="font-normal text-grayscale-70 text-xs p-1">
                        {{ useFormatDate(cashDrawerCashRegister_detail?.createdAt ?? 0) }}
                        by
                        {{ cashDrawerCashRegister_detail?.employees.name ?? '-' }}
                      </td>
                    </tr>

                    <tr>
                      <td class="font-normal text-grayscale-70 text-xs p-1">Closed On</td>
                      <td class="font-normal text-grayscale-70 text-xs p-1">:</td>
                      <td class="font-normal text-grayscale-70 text-xs p-1">
                        <template v-if="cashDrawerCashRegister_detail?.closedAt">
                          {{ useFormatDate(cashDrawerCashRegister_detail?.closedAt ?? 0) }}
                          by
                          {{ cashDrawerCashRegister_detail?.closedBy ?? '-' }}
                        </template>

                        <template v-else> - </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section id="form-filter" class="flex items-center gap-4 w-fit">
                <PrimeVueSelect
                  v-model="cashDrawerCashRegister_queryParamsOfTransaction.type"
                  :options="cashDrawerCashRegister_listTypesOfCashRegister"
                  option-label="label"
                  option-value="value"
                  placeholder="Type"
                  class="text-sm w-full min-w-60"
                >
                </PrimeVueSelect>
              </section>
            </section>
          </header>
        </template>

        <template #body="{ column, data }">
          <template v-if="column.value === 'type'">
            <section id="type" class="flex items-center gap-3">
              <AppBaseSvg
                :name="cashDrawerCashRegister_getIconOfTypeCashRegister(data[column.value])"
                class="!w-5 !h-5"
              />
              <span class="font-normal text-sm text-text-primary">{{
                cashDrawerCashRegister_getValueOfTypeCashRegister(data[column.value])
              }}</span>
            </section>
          </template>

          <template v-else-if="column.value === 'amountIn'">
            <span class="font-normal text-sm text-text-primary">
              {{
                useCurrencyFormat({
                  data: data[column.value],
                  addSuffix: true,
                })
              }}
            </span>
          </template>

          <template v-else-if="column.value === 'amountOut'">
            <span
              class="font-normal text-sm"
              :class="[data[column.value] > 0 ? 'text-text-action-error' : 'text-text-primary']"
            >
              {{
                useCurrencyFormat({
                  data: data[column.value],
                  addSuffix: true,
                })
              }}
            </span>
          </template>

          <template v-else-if="column.value === 'finalAmount'">
            <span class="font-semibold text-sm text-text-primary">
              {{
                useCurrencyFormat({
                  data: data[column.value],
                  addSuffix: true,
                })
              }}
            </span>
          </template>

          <template v-else-if="column.value === 'cashierName'">
            <span class="font-normal text-sm text-text-primary">
              {{ data.users?.fullname ?? '-' }}
            </span>
          </template>

          <template v-else-if="column.value === 'action'">
            <!-- 1. Cash In, 3. Cash Out -->
            <PrimeVueButton v-if="data.type === 1 || data.type === 3" variant="text" rounded aria-label="detail">
              <template #icon>
                <AppBaseSvg name="delete" class="!w-5 !h-5" />
              </template>
            </PrimeVueButton>
          </template>

          <template v-else>
            <span class="font-normal text-sm text-text-primary">{{ data[column.value] ?? '-' }}</span>
          </template>
        </template>
      </AppBaseDataTable>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary rounded-lg w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Close"
          severity="secondary"
          variant="outlined"
          @click="cashierOrderSummary_onCloseDialogCashDrawerOverview"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
