<script setup lang="ts">
// Interface
import type { ICashierCustomerProvided } from '@/modules/cashier/interfaces/cashier-customer.interface';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierCustomer_modalInvoiceDetail } = inject<ICashierCustomerProvided>(
  'cashierCustomer'
)!;
</script>
<template>
  <section id="cashier-summary-modal-place-order-detail">
    <PrimeVueDialog
      v-model:visible="cashierCustomer_modalInvoiceDetail.show"
      modal
      :style="{ width: '34rem' }"
    >
      <template #container="{ closeCallback }">
        <section id="cashier-summary-modal-place-order-detail-content" class="flex flex-col gap-6 p-6 h-full">
          <section
            id="cashier-summary-modal-place-order-detail-content-body"
            class="flex flex-col gap-5 flex-grow overflow-y-auto"
          >
            <span class="text-lg font-semibold">{{
              useLocalization('cashier.orderSummary.invoiceDetail.title')
            }}</span>

            <div class="flex flex-col gap-1">
              <label for="received-by" class="text-sm">{{
                useLocalization('cashier.orderSummary.invoiceDetail.receivedBy')
              }}</label>
              <PrimeVueInputText
                id="received-by"
                v-model="cashierCustomer_modalInvoiceDetail.form.received_by"
                class="w-full"
                placeholder="Select"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label for="username" class="text-sm">{{ useLocalization('cashier.mainSection.notes') }}</label>
              <PrimeVueTextarea
                id="notes"
                v-model="cashierCustomer_modalInvoiceDetail.form.notes"
                class="w-full"
                rows="4"
                placeholder="Describe order notes here"
              />
            </div>
          </section>

          <div class="flex justify-end gap-4">
            <PrimeVueButton
              class="border-primary text-primary py-2.5 px-8"
              type="button"
              :label="useLocalization('cashier.cancel')"
              outlined
              @click="closeCallback"
            ></PrimeVueButton>

            <PrimeVueButton
              class="bg-primary border-none text-white py-2.5 px-8"
              type="button"
              :label="useLocalization('cashier.add')"
              @click="cashierCustomer_modalInvoiceDetail.show = false"
            ></PrimeVueButton>
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
