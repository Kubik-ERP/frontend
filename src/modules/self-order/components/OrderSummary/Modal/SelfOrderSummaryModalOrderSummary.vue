<script setup lang="ts">
// Interface
import { ISelfOrderProvided } from '@/modules/self-order/interfaces';

// Components
import SelfOrderSummaryProductList from '../SelfOrderSummaryProductList.vue';
import SelfOrderSummaryPromoPayment from '../SelfOrderSummaryPromoPayment.vue';
import SelfOrderSummaryTotal from '../SelfOrderSummaryTotal.vue';
import SelfOrderSummaryButtonOrderTable from '../SelfOrderSummaryButtonOrderTable.vue';

// Interfaces
import type { AutoCompleteCompleteEvent } from 'primevue';

// Route
const route = useRoute();

/**
 * @description Inject all the data and methods what we need
 */
const {
  selfOrder_modalOrderSummary,
  selfOrder_onModalAddCustomer,
  selfOrder_customerState,
  selfOrder_modalMenuOrderItem,
  selfOrder_modalPlaceOrderConfirmation,
  selfOrder_calculateEstimation,
  selfOrder_onScrollFetchMoreCustomers,
  selfOrder_onSearchCustomer,
  selfOrder_isButtonPlaceOrderDisabled,
  selfOrder_modalPaymentMethod,
  selfOrder_isLoadingUnpaidOrder,
  selfOrder_modalSelectTable,
  selfOrder_hasCustomerManagementPermission,
  selfOrder_isSelfOrderRoute,
  selfOrder_displayUser,
  selfOrder_phoneDisplay,
  selfOrder_onSignInAsGuest,
  selfOrder_onNavigateToLogin,
  selfOrder_onOpenRegisterCustomerModal,
} = inject<ISelfOrderProvided>('selfOrder')!;
</script>

<template>
  <section id="self-order-summary-modal-order-summary">
    <PrimeVueDialog
      v-model:visible="selfOrder_modalOrderSummary.show"
      :dismissable-mask="true"
      modal
      class="w-screen h-screen rounded-none relative p-0 m-0 max-h-dvh overflow-y-auto"
    >
      <template #container="{ closeCallback }">
        <section id="self-order-summary-modal-order-summary" class="flex flex-col bg-[#F9FAFB]">
          <section
            id="self-order-summary-modal-order-summary-header"
            class="p-4 bg-white flex items-center justify-between"
          >
            <div class="flex items-center gap-2" @click="selfOrder_modalOrderSummary.show = false">
              <AppBaseSvg name="chevron-left" class="!h-4 !w-4 cursor-pointer" @click="closeCallback" />
              <span class="text-lg font-semibold">{{ useLocalization('cashier.mainSection.cart') }}</span>
            </div>

            <section id="status" class="flex lg:hidden items-center gap-2">
              <section id="dot-status" class="w-2 h-2 rounded-full bg-success">&nbsp;</section>
              <span class="font-normal text-disabled text-xs">{{
                useLocalization('cashier.mainSection.online')
              }}</span>
            </section>
          </section>

          <hr class="border-b border-grayscale-10" />

          <section
            id="self-order-summary-modal-order-summary-customer-detail"
            class="flex flex-col gap-2 p-4 bg-white"
          >
            <span class="font-semibold text-sm">{{ useLocalization('cashier.mainSection.customerDetails') }}</span>

            <div v-if="!selfOrder_isSelfOrderRoute" class="flex flex-col text-sm">
              <span class="text-text-disabled font-normal">{{
                useLocalization('cashier.mainSection.tableNo')
              }}</span>

              <span>{{ selfOrder_modalSelectTable.selectedTable.toString() }}</span>
            </div>

            <!-- Customer Management Permission (Cashier/Admin) -->
            <template v-if="selfOrder_hasCustomerManagementPermission">
              <div class="flex flex-col gap-2 w-full">
                <label for="username" class="text-sm">
                  {{ useLocalization('cashier.mainSection.username') }}
                  <span class="text-text-disabled">(Optional)</span>
                </label>

                <PrimeVueIconField class="flex w-full">
                  <PrimeVueInputIcon class="pi pi-user" />

                  <PrimeVueAutoComplete
                    v-model="selfOrder_customerState.selectedCustomer"
                    :suggestions="selfOrder_customerState.customerList"
                    :options="selfOrder_customerState.customerList"
                    :field="'name'"
                    :option-value="'id'"
                    :option-value-key="'id'"
                    option-label="name"
                    :min-length="1"
                    :loading="selfOrder_customerState.isLoading"
                    dropdown
                    class="w-full text-sm"
                    placeholder="Select Customer Name (Optional)"
                    :disabled="route.name === 'self-order-order-edit'"
                    :virtual-scroller-options="{
                      itemSize: 50,
                      step: selfOrder_customerState.limit,
                      lazy: true,
                      delay: 300,
                      loading: selfOrder_customerState.isLoading,
                      onLazyLoad: selfOrder_onScrollFetchMoreCustomers,
                    }"
                    @complete="(event: AutoCompleteCompleteEvent) => selfOrder_onSearchCustomer(event.query)"
                  >
                    <template #option="slotProps">
                      <div class="flex gap-1 text-xs w-full items-center">
                        <div class="flex flex-col w-full">
                          <div class="font-semibold text-sm">{{ slotProps.option.name }}</div>
                          <span class="text-xs text-text-disabled">{{ slotProps.option.email }}</span>
                        </div>
                        <div class="text-xs">({{ slotProps.option.code }}) {{ slotProps.option.number }}</div>
                      </div>
                    </template>

                    <template #empty>
                      <div class="flex flex-col items-center justify-center p-4 h-full">
                        <p class="font-semibold text-sm text-black">No customer found</p>
                      </div>
                    </template>

                    <template #footer>
                      <div class="px-1 py-1">
                        <PrimeVueButton
                          label="Add New"
                          fluid
                          text
                          severity="secondary"
                          size="small"
                          icon="pi pi-plus"
                          class="text-sm"
                          @click="selfOrder_onModalAddCustomer(null)"
                        />
                      </div>
                    </template>
                  </PrimeVueAutoComplete>
                </PrimeVueIconField>
              </div>
            </template>

            <!-- Self-Order Customer (Guest/Logged In) -->
            <template v-else-if="selfOrder_isSelfOrderRoute">
              <div class="flex flex-col gap-3 w-full">
                <label for="self-order-customer" class="text-sm font-medium text-[#323232]">
                  {{ useLocalization('cashier.mainSection.username') }}
                </label>

                <!-- Guest User Card -->
                <template v-if="selfOrder_displayUser.isGuest">
                  <div class="flex flex-col gap-3 w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                    <div class="flex items-center gap-3">
                      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-[#E5E7EB]">
                        <i class="pi pi-user text-[#6B7280] text-lg"></i>
                      </div>
                      <div class="flex flex-col flex-1">
                        <span class="text-base font-semibold text-[#111827]">Guest</span>
                        <span class="text-xs text-[#6B7280]">Continue as guest or sign in</span>
                      </div>
                    </div>

                    <div class="flex gap-2">
                      <button
                        type="button"
                        class="flex-1 px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-lg hover:bg-primary-background transition-colors"
                        @click="selfOrder_onNavigateToLogin"
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        class="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-lg hover:bg-primary-dark transition-colors"
                        @click="selfOrder_onOpenRegisterCustomerModal"
                      >
                        Register
                      </button>
                    </div>

                    <div class="flex items-start gap-2 p-3 bg-[#EFF6FF] rounded-lg border border-[#BFDBFE]">
                      <i class="pi pi-info-circle text-[#3B82F6] text-sm mt-0.5"></i>
                      <span class="text-xs text-[#1E40AF] leading-relaxed">
                        Sign in to earn loyalty points and get exclusive offers
                      </span>
                    </div>
                  </div>
                </template>

                <!-- Logged In User Card -->
                <template v-else>
                  <div class="flex flex-col gap-3 w-full rounded-lg border border-primary bg-primary-background p-4">
                    <div class="flex items-center justify-between gap-3">
                      <div class="flex items-center gap-3">
                        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
                          <i class="pi pi-user text-white text-lg"></i>
                        </div>
                        <div class="flex flex-col">
                          <span class="text-base font-semibold text-[#111827]">{{ selfOrder_displayUser.name }}</span>
                          <span v-if="selfOrder_phoneDisplay" class="text-xs text-[#6B7280]">
                            {{ selfOrder_phoneDisplay }}
                          </span>
                          <span v-else-if="selfOrder_displayUser.email" class="text-xs text-[#6B7280]">
                            {{ selfOrder_displayUser.email }}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        class="px-3 py-1.5 text-xs font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
                        @click="selfOrder_onSignInAsGuest"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </section>

          <SelfOrderSummaryButtonOrderTable
            :is-self-order="route.name === 'self-order'"
          />

          <hr class="border-b border-grayscale-10" />

          <section class="flex flex-col gap-2">
            <span class="text-sm font-semibold mb-2 px-4 mt-4">{{
              useLocalization('cashier.mainSection.orderItem')
            }}</span>

            <SelfOrderSummaryProductList />
          </section>

          <SelfOrderSummaryPromoPayment />

          <SelfOrderSummaryTotal />
        </section>

        <section
          id="self-order-summary-modal-order-summary-footer"
          class="bottom-0 w-full flex flex-col gap-2 p-4 bg-white border-t border-grayscale-10"
        >
          <div class="flex justify-between items-center">
            <div class="flex gap-2 items-center">
              <AppBaseSvg name="cash" class="!h-6 !w-6" />
              <span v-if="!selfOrder_calculateEstimation.isLoading" class="font-semibold text-sm">{{
                useCurrencyFormat({
                  data: selfOrder_calculateEstimation?.data?.grandTotal || 0,
                })
              }}</span>
            </div>

            <PrimeVueButton
              text
              aria-haspopup="true"
              aria-controls="overlay_menu_summary_order"
              @click="selfOrder_modalMenuOrderItem.show = true"
            >
              <i class="pi pi-ellipsis-h text-primary"></i>
            </PrimeVueButton>
          </div>

          <PrimeVueButton
            :disabled="
              selfOrder_isButtonPlaceOrderDisabled ||
              selfOrder_modalPaymentMethod.selectedPaymentMethod === '' ||
              selfOrder_isLoadingUnpaidOrder
            "
            class="bg-primary border-none py-2.5 px-14"
            type="button"
            label="Place Order"
            @click="selfOrder_modalPlaceOrderConfirmation.show = true"
          ></PrimeVueButton>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
