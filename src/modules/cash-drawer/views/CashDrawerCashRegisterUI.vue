<script setup lang="ts">
// Components
import CashDrawerAddTransactionDialog from '../components/CashDrawerAddTransactionDialog.vue';
import CashDrawerCloseTransactionDialog from '../components/CashDrawerCloseTransactionDialog.vue';
import CashDrawerRegisterSummary from '../components/CashDrawerRegisterSummary.vue';
import CashDrawerRegisterPdfTemplate from '../components/CashDrawerRegisterPdfTemplate.vue';

// Services
import { useCashDrawerCashRegisterService } from '../services/cash-drawer-cash-register.service';

// Stores
import { useOutletStore } from '@/modules/outlet/store';

/**
 * @description Injected variables
 */
const outletStore = useOutletStore();
const { outlet_currentOutlet } = storeToRefs(outletStore);

/**
 * @description Destructure all the data and methods what we need
 */
const {
  cashDrawerCashRegister_detail,
  cashDrawerCashRegister_fetchCashDrawerDetails,
  cashDrawerCashRegister_fetchTrasanctions,
  cashDrawerCashRegister_formDataOfCloseTransaction,
  cashDrawerCashRegister_formDataOfTransaction,
  cashDrawerCashRegister_formValidationsOfCloseTransaction,
  cashDrawerCashRegister_formValidationsOfTransaction,
  cashDrawerCashRegister_getIconOfTypeCashRegister,
  cashDrawerCashRegister_getValueOfTypeCashRegister,
  cashDrawerCashRegister_isFormInvalid,
  cashDrawerCashRegister_isLoading,
  cashDrawerCashRegister_isOpenCashRegisterSummary,
  cashDrawerCashRegister_listColumns,
  cashDrawerCashRegister_listTypesOfCashRegister,
  cashDrawerCashRegister_listValuesOfCashRegister,
  cashDrawerCashRegister_onCloseDialogAddTransaction,
  cashDrawerCashRegister_onCloseDialogCloseTransaction,
  cashDrawerCashRegister_onExportToPdf,
  cashDrawerCashRegister_onOpenDialogAddTransaction,
  cashDrawerCashRegister_onOpenDialogCloseTransaction,
  cashDrawerCashRegister_onSubmitAddTransaction,
  cashDrawerCashRegister_onSubmitCloseTransaction,
  cashDrawerCashRegister_queryParamsOfTransaction,
  cashDrawerCashRegister_suggestionRegisterBalance,
  cashDrawerCashRegister_toggleCashRegisterSummary,
  cashDrawerCashRegister_typeOfTransaction,
} = useCashDrawerCashRegisterService();

/**
 * @description Provide all the data and methods what we need
 */
provide('cashDrawerCashRegister', {
  cashDrawerCashRegister_detail,
  cashDrawerCashRegister_formDataOfCloseTransaction,
  cashDrawerCashRegister_formDataOfTransaction,
  cashDrawerCashRegister_formValidationsOfCloseTransaction,
  cashDrawerCashRegister_formValidationsOfTransaction,
  cashDrawerCashRegister_isFormInvalid,
  cashDrawerCashRegister_isLoading,
  cashDrawerCashRegister_isOpenCashRegisterSummary,
  cashDrawerCashRegister_onCloseDialogAddTransaction,
  cashDrawerCashRegister_onCloseDialogCloseTransaction,
  cashDrawerCashRegister_onOpenDialogAddTransaction,
  cashDrawerCashRegister_onSubmitAddTransaction,
  cashDrawerCashRegister_onSubmitCloseTransaction,
  cashDrawerCashRegister_suggestionRegisterBalance,
  cashDrawerCashRegister_toggleCashRegisterSummary,
  cashDrawerCashRegister_typeOfTransaction,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await Promise.all([cashDrawerCashRegister_fetchCashDrawerDetails(), cashDrawerCashRegister_fetchTrasanctions()]);
});

// 3. Buat ref untuk menampung elemen template PDF
const pdfTemplateRef = ref<InstanceType<typeof CashDrawerRegisterPdfTemplate> | null>(null);

// 4. Siapkan DUMMY DATA (sesuai permintaan Anda)
const dummySummaryData = computed(() => {
  const detail = cashDrawerCashRegister_detail.value;
  // Format yang benar untuk tanggal dan waktu
  // Format date like this, 24 July, 2025
  const dateFormat = 'dd MMMM, yyyy';
  const timeFormat = 'HH:mm';

  return {
    storeName: outlet_currentOutlet.value?.name ?? 'KUBIK',
    staffName: detail?.employees?.name ?? 'Samantha',
    openRegisterDate: useFormatDate(detail?.createdAt ?? '2025-07-24T09:00:00', dateFormat),
    openRegisterTime: useFormatDate(detail?.createdAt ?? '2025-07-24T09:00:00', timeFormat),
    closeRegisterDate: useFormatDate(detail?.closedAt ?? '2025-07-24T12:00:00', dateFormat),
    closeRegisterTime: useFormatDate(detail?.closedAt ?? '2025-07-24T12:00:00', timeFormat),
    printDate: useFormatDate(new Date(), dateFormat),
    printTime: useFormatDate(new Date(), timeFormat),
    financials: [
      { label: 'Open Register Balance', value: 500000 },
      { label: 'Cash In', value: 100000 },
      { label: 'Cash Out', value: -200000 },
      { label: 'Sub Total', value: 400000 },
      { label: 'Item Discount', value: 0 },
      { label: 'Tax', value: 40000 },
      { label: 'Rounding', value: 0 },
      { label: 'Total Sales', value: 440000 },
      { label: 'Expected Cash In Drawer', value: 840000 },
      { label: 'Counted Cash', value: 840000 },
      { label: 'Cash Difference', value: 0 },
    ],
    paymentBreakdown: [
      { label: 'Cash', value: 840000 },
      { label: 'Debit', value: 0 },
      { label: 'Credit', value: 0 },
      { label: 'QRIS', value: 0 }, // Memperbaiki nilai yang salah
      { label: 'Voucher', value: 0 },
      { label: 'Loyalty Point', value: 0 },
    ],
  };
});

/**
 * @function handleExport
 * @description Handles the export functionality when the export button is clicked. This function checks if the PDF template
 * reference (`pdfTemplateRef`) is available and calls the `cashDrawerCashRegister_onExportToPdf` function to generate a PDF.
 * Logs an error if the PDF template element is not found.
 *
 * @throws {Error} Logs an error to the console if the PDF template element is not available.
 */
function handleExport() {
  console.log('fired');

  if (pdfTemplateRef.value?.$el) {
    cashDrawerCashRegister_onExportToPdf(pdfTemplateRef.value.$el);
  } else {
    console.error('PDF template element not found.');
  }
}
</script>

<template>
  <section id="cash-drawer-cash-register" class="flex flex-col relative inset-0 z-0">
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
          <template v-if="cashDrawerCashRegister_detail?.status === 'close'">
            <div class="flex flex-col items-center gap-2 py-4">
              <section id="information-balances" class="flex items-center gap-6">
                <section id="total-balances" class="flex flex-col items-center gap-2">
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

                <PrimeVueDivider layout="vertical" class="h-16" />

                <section id="actual-balances" class="flex flex-col items-center gap-2">
                  <h6 class="font-semibold text-grayscale-70 text-xs">Actual Balance</h6>

                  <div class="flex items-end gap-1">
                    <span class="font-semibold text-text-disabled text-sm">Rp</span>

                    <h2 class="font-bold text-primary text-4xl">
                      {{
                        useCurrencyFormat({
                          data: cashDrawerCashRegister_detail?.actualBalance ?? 0,
                          hidePrefix: true,
                          addSuffix: true,
                        })
                      }}
                    </h2>
                  </div>
                </section>
              </section>

              <PrimeVueButton
                class="w-fit px-4 py-3"
                variant="text"
                @click="cashDrawerCashRegister_onOpenDialogCloseTransaction"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="edit" class="!w-4 !h-4" />
                    <span class="font-semibold text-base text-text-primary">Edit Cash Register</span>
                  </section>
                </template>
              </PrimeVueButton>
            </div>
          </template>

          <template v-else>
            <div class="flex flex-col items-center w-full px-6 py-5 gap-2">
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
                      <AppBaseSvg name="plus-line" class="filter-primary-color w-4 h-4" />
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
                      <AppBaseSvg name="minus" class="filter-primary-color w-4 h-4" />
                      <span class="font-semibold text-xs text-primary">Cash Out</span>
                    </section>
                  </template>
                </PrimeVueButton>
              </section>

              <PrimeVueButton
                v-rbac="{ permission: 'close_cash_register' }"
                class="bg-error-main border-none w-fit px-4 py-2 rounded-lg basic-smooth-animation"
                severity="secondary"
                variant="outlined"
                @click="cashDrawerCashRegister_onOpenDialogCloseTransaction"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2">
                    <AppBaseSvg name="close-circle" class="!w-5 !h-5" />
                    <span class="font-semibold text-sm text-white">Close Register</span>
                  </section>
                </template>
              </PrimeVueButton>
            </div>
          </template>

          <section
            id="sales-order-cash-register-filter"
            class="flex items-center justify-between w-full border-b border-t border-solid border-grayscale-20 px-6 py-5"
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
                      {{ cashDrawerCashRegister_detail?.employees?.name ?? cashDrawerCashRegister_detail?.openedBy ?? '-' }}
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
              <PrimeVueButton
                class="border border-solid border-primary basic-smooth-animation w-full px-3 py-2 rounded-lg hover:bg-grayscale-10"
                severity="secondary"
                variant="outlined"
                @click="handleExport"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2">
                    <AppBaseSvg name="export" class="filter-primary-color w-4 h-4" />
                    <span class="font-semibold text-sm text-primary">Export to PDF</span>
                  </section>
                </template>
              </PrimeVueButton>

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

    <CashDrawerAddTransactionDialog />
    <CashDrawerCloseTransactionDialog />
    <CashDrawerRegisterSummary />

    <div class="absolute -top-[9999px] -left-[9999px]">
      <CashDrawerRegisterPdfTemplate ref="pdfTemplateRef" :summary-data="dummySummaryData" />
    </div>
  </section>
</template>
