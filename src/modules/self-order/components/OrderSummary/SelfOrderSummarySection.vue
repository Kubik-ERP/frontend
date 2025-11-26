<script setup lang="ts">
// Constant
import { CASHIER_ORDER_TYPE } from '@/modules/cashier/constants';

// Components
import SelfOrderSummaryButtonOrderTable from './SelfOrderSummaryButtonOrderTable.vue';

// Interfaces
import { AutoCompleteCompleteEvent } from 'primevue';
import { ISelfOrderProvided, ISelfOrderOrderType } from '../../interfaces';
import { IDiscount, IFreeItems, ILoyaltyPointBenefit } from '@/modules/point-configuration/interfaces';

// Services
import { useLoyaltyPointBenefitService } from '@/modules/point-configuration/services/loyalty-point-benefit.service';
import { usePointConfigurationService } from '@/modules/point-configuration/services/point-configuration.service';
import { useCustomerDetailService } from '@/modules/customer/services/customer-detail.service';

// Vue
const route = useRoute();

/**
 * @description Inject all the data and methods what we need from service
 */
const {
  // State
  selfOrder_menuOrderItem,
  selfOrder_data,
  selfOrder_menuOrder,
  selfOrder_modalOrderType,
  selfOrder_modalSelectTable,
  selfOrder_customerState,
  selfOrder_selectedBenefit,
  selfOrder_showLoyaltyModal,
  selfOrder_displayUser,
  selfOrder_isSelfOrderRoute,
  selfOrder_phoneDisplay,
  selfOrder_loyaltyButtonText,

  // Actions
  selfOrder_onScrollFetchMoreCustomers,
  selfOrder_onSearchCustomer,
  selfOrder_onToggleExpanded,
  selfOrder_onModalAddCustomer,

  // Self Order User Management
  selfOrder_onSignInAsGuest,
  selfOrder_onNavigateToLogin,
  selfOrder_onOpenRegisterCustomerModal,

  // Loyalty Management
  selfOrder_onRequestCustomerLoyaltyPoint,
  selfOrder_onOpenLoyaltyModal,
  selfOrder_onCloseLoyaltyModal,
  selfOrder_onSelectBenefit,
  selfOrder_onRedeemPoints,
  selfOrder_onInitializeLoyalty,

  // Watchers
  selfOrder_onWatchRouteChanges,
  selfOrder_onWatchCustomerChanges,
  selfOrder_onWatchBenefitChanges,

  // Computed
  selfOrder_hasCustomerManagementPermission,
} = inject<ISelfOrderProvided>('selfOrder')!;

// External services for loyalty features
const { loyaltyPointBenefit_fetchList, loyaltyPointBenefit_list } = useLoyaltyPointBenefitService();
const { loyaltyPointSettings_value, loyaltyPointSettingsDetail } = usePointConfigurationService();
const { loyaltyPoints_list, customerDetails_fetchLoyaltyPointByCustomerId } = useCustomerDetailService();

/**
 * @description Initialize watchers from service
 */
onMounted(() => {
  // Initialize lifecycle watchers
  selfOrder_onWatchRouteChanges();
  selfOrder_onWatchCustomerChanges();
  selfOrder_onWatchBenefitChanges();

  // Initialize loyalty
  selfOrder_onInitializeLoyalty();

  // Fetch loyalty data
  loyaltyPointSettingsDetail();
  loyaltyPointBenefit_fetchList();

  if (selfOrder_customerState.value.selectedCustomer?.id) {
    selfOrder_onRequestCustomerLoyaltyPoint(selfOrder_customerState.value.selectedCustomer.id);
  }
});

// Wrapper methods that integrate service with external loyalty services
const openLoyaltyModal = async () => {
  await loyaltyPointSettingsDetail();
  loyaltyPointBenefit_fetchList();

  if (selfOrder_customerState.value.selectedCustomer?.id) {
    await customerDetails_fetchLoyaltyPointByCustomerId(selfOrder_customerState.value.selectedCustomer.id, {
      page: 1,
      limit: 1,
    });
  }

  await selfOrder_onOpenLoyaltyModal();
};

const selectBenefit = (benefit: ILoyaltyPointBenefit) => {
  // Only allow selection if user has enough points
  if (benefit.pointNeeds <= (loyaltyPoints_list.value?.total || 0)) {
    selfOrder_onSelectBenefit(benefit);
  }
};
</script>

<template>
  <section id="self-order-summary-section" class="flex flex-col gap-2 p-4">
    <section id="self-order-summary-section-header" class="flex justify-between items-center">
      <span class="font-semibold text-lg">{{ useLocalization('cashier.orderSummary.orderSummary') }}</span>

      <PrimeVueButton
        text
        aria-haspopup="true"
        aria-controls="overlay_menu_summary_order"
        @click="selfOrder_menuOrder.toggle($event)"
      >
        <i class="pi pi-ellipsis-h text-primary"></i>

        <span class="text-text-disabled text-xs">{{ useLocalization('cashier.more') }}</span>
      </PrimeVueButton>

      <PrimeVueMenu
        id="overlay_menu_summary_order"
        ref="selfOrder_menuOrder"
        append-to="body"
        :popup="true"
        :model="selfOrder_menuOrderItem"
      >
      </PrimeVueMenu>
    </section>

    <section
      v-if="selfOrder_data.isExpanded"
      id="self-order-summary-section-order-item"
      class="flex flex-col gap-2"
    >
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
              :dropdown="true"
              class="w-full text-sm placeholder:text-sm"
              :placeholder="'Select Customer Name (Optional)'"
              :disabled="route.name === 'cashier-order-edit'"
              :virtual-scroller-options="{
                itemSize: 50,
                step: selfOrder_customerState.limit,
                lazy: true,
                delay: 300,
                loading: selfOrder_customerState.isLoading,
                onLazyLoad: selfOrder_onScrollFetchMoreCustomers,
              }"
              :pt="{
                pcInputText: 'text-sm placeholder:text-sm',
                option: 'text-sm',
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
                    @click="
                      async () => {
                        selfOrder_onModalAddCustomer(null);
                      }
                    "
                  />
                </div>
              </template>
            </PrimeVueAutoComplete>
          </PrimeVueIconField>
        </div>
      </template>

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

      <button
        v-if="selfOrder_customerState.selectedCustomer != null"
        type="button"
        class="flex items-center justify-between w-full h-10 px-4 rounded-lg shadow-sm transition"
        :class="[
          route.name === 'cashier-order-edit'
            ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed opacity-70'
            : 'bg-primary-background border border-primary-border hover:bg-primary-background cursor-pointer',
        ]"
        :disabled="route.name === 'cashier-order-edit'"
        @click="openLoyaltyModal"
      >
        <div class="flex items-center gap-2">
          <i class="pi pi-star text-primary text-[16px]"></i>
          <div class="flex flex-col gap-1">
            <span class="text-primary font-semibold text-base leading-5">
              {{ selfOrder_selectedBenefit ? selfOrder_loyaltyButtonText : 'Redeem Loyalty Point' }}
            </span>
          </div>
        </div>
        <i class="pi pi-chevron-right text-primary text-[16px]"></i>
      </button>

      <!-- Modal -->
      <div v-if="selfOrder_showLoyaltyModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div
          class="flex flex-col w-[604px] max-h-[720px] bg-white rounded-lg shadow-[0_0_10px_5px_rgba(0,0,0,0.15)] p-6 gap-5"
        >
          <!-- Title -->
          <h2 class="text-[18px] font-semibold text-black">Redeem Loyalty Point</h2>

          <!-- Customer Info Card -->
          <div class="flex flex-col items-center border border-primary-border rounded-lg p-4 w-full">
            <span class="text-lg font-semibold text-[#070707]">{{
              selfOrder_customerState.selectedCustomer?.name
            }}</span>
            <div class="flex items-center gap-1 text-primary text-xs font-semibold">
              <i class="pi pi-star-fill text-primary"></i>
              {{ loyaltyPoints_list?.total }} pts
            </div>
            <span class="text-[#323232] text-sm mt-1">{{
              selfOrder_customerState.selectedCustomer?.code +
              ' ' +
              selfOrder_customerState.selectedCustomer?.number
            }}</span>
          </div>

          <!-- Promo List -->
          <div
            v-if="loyaltyPointBenefit_list.loyaltyBenefits.items.length > 0"
            class="flex flex-col border border-[#EDEDED] rounded-md p-3 space-y-3 overflow-y-auto max-h-[420px]"
          >
            <div
              v-for="benefit in loyaltyPointBenefit_list.loyaltyBenefits.items"
              :key="benefit.id ?? ''"
              class="flex justify-between items-center border rounded-md p-3 cursor-pointer"
              :class="{
                'bg-grayscale-10': benefit.pointNeeds > loyaltyPoints_list?.total,
                'border-grayscale-20': selfOrder_selectedBenefit?.id !== benefit.id,
                'border-primary border-2':
                  selfOrder_selectedBenefit?.id === benefit.id && benefit.pointNeeds <= loyaltyPoints_list?.total,
              }"
              @click="selectBenefit(benefit)"
            >
              <div>
                <div
                  class="font-semibold text-base"
                  :class="benefit.pointNeeds > loyaltyPoints_list?.total ? 'text-[#8E8E8E]' : 'text-[#434343]'"
                >
                  {{ benefit.benefitName }}

                  <span v-if="benefit.pointNeeds > loyaltyPoints_list?.total" class="text-xs font-normal ml-2"
                    >This benefit not applicable for this transaction</span
                  >
                </div>
                <div class="text-xs text-[#8E8E8E] mt-1">
                  Minimum Transaction :
                  {{
                    loyaltyPointSettings_value?.minimumTransaction == null
                      ? 'Rp 0'
                      : useCurrencyFormat({
                          data: loyaltyPointSettings_value?.minimumTransaction,
                          addSuffix: true,
                        })
                  }}
                  <span class="mx-2">|</span> Point Needs : {{ benefit.pointNeeds }} pts
                </div>
              </div>
              <div v-if="benefit.type === 'discount'" class="text-right">
                <div class="text-xs text-[#8E8E8E]">Discount</div>
                <div
                  v-if="(benefit.discountFreeItems as IDiscount).isPercent"
                  class="text-base font-semibold"
                  :class="benefit.pointNeeds > loyaltyPoints_list?.total ? 'text-[#8E8E8E]' : 'text-[#434343]'"
                >
                  {{ (benefit.discountFreeItems as IDiscount).value }}%
                </div>
                <div
                  v-else
                  class="text-base font-semibold"
                  :class="benefit.pointNeeds > loyaltyPoints_list?.total ? 'text-[#8E8E8E]' : 'text-[#434343]'"
                >
                  {{
                    useCurrencyFormat({
                      data: (benefit.discountFreeItems as IDiscount).value,
                      addSuffix: true,
                    })
                  }}
                </div>
              </div>
              <div v-if="benefit.type === 'free_items'" class="flex flex-col items-end">
                <span class="text-xs text-[#8E8E8E]">Free Product</span>
                <div
                  v-for="item in benefit.discountFreeItems as IFreeItems[]"
                  :key="item.id"
                  class="bg-primary-background rounded-full px-2 py-0.5"
                >
                  <span class="text-primary text-xs font-medium"> ({{ item.quantity }}) {{ item.name }} </span>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex justify-end gap-4 mt-4">
            <button
              class="border border-primary text-primary font-semibold text-base px-5 py-2 rounded-lg shadow-sm hover:bg-primary-background"
              @click="selfOrder_onCloseLoyaltyModal"
            >
              Cancel
            </button>
            <button
              :disabled="
                !selfOrder_selectedBenefit ||
                (selfOrder_selectedBenefit && selfOrder_selectedBenefit.pointNeeds > (loyaltyPoints_list?.total || 0))
              "
              :class="{
                'bg-primary text-white hover:bg-primary':
                  selfOrder_selectedBenefit && selfOrder_selectedBenefit.pointNeeds <= (loyaltyPoints_list?.total || 0),
                'bg-[#D9D9D9] text-white cursor-not-allowed':
                  !selfOrder_selectedBenefit ||
                  (selfOrder_selectedBenefit && selfOrder_selectedBenefit.pointNeeds > (loyaltyPoints_list?.total || 0)),
              }"
              class="font-semibold text-base px-5 py-2 rounded-lg shadow-sm transition"
              @click="selfOrder_onRedeemPoints"
            >
              Redeem Point
            </button>
          </div>
        </div>
      </div>

      <SelfOrderSummaryButtonOrderTable />
    </section>

    <div
      v-if="!selfOrder_data.isExpandedVisible"
      class="border-b-0 lg:border-b-2 border-b-grayscale-10"
    ></div>
    <div v-else>
      <div class="flex gap-2 mb-2">
        <div class="flex items-center gap-1">
          <AppBaseSvg name="order-primary" class="h-4 w-4 text-primary filter-primary-color" />

          <span class="text-primary text-sm font-semibold">
            {{
              CASHIER_ORDER_TYPE.find(
                (f: ISelfOrderOrderType) => f.code === selfOrder_modalOrderType.selectedOrderType,
              )?.label || 'Order Type'
            }}
          </span>
        </div>

        <div v-if="selfOrder_hasCustomerManagementPermission" class="flex items-center gap-1">
          <AppBaseSvg name="table-primary" class="h-4 w-4 text-primary filter-primary-color" />

          <span
            v-if="selfOrder_modalSelectTable.selectedTable.length > 0"
            class="text-primary text-sm font-semibold"
          >
            {{ selfOrder_modalSelectTable.selectedTable.toString() }}
          </span>
        </div>
      </div>

      <div
        class="relative flex justify-center items-center w-full border-b-2 border-b-grayscale-10 cursor-pointer"
        @click="selfOrder_onToggleExpanded"
      >
        <div class="absolute top-full rounded-full p-1 bg-white -translate-y-1/2 px-1">
          <AppBaseSvg
            :name="selfOrder_data.isExpanded ? 'chevron-up' : 'chevron-down'"
            class="h-4 w-4 filter-primary-color"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.text-text-action-error .p-menu-item-content {
  color: var(--color-text-action-error) !important;
}

input {
  font-size: 14px !important;
}
</style>
