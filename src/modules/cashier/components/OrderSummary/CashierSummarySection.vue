<script setup lang="ts">
// Constant
import { CASHIER_ORDER_TYPE } from '../../constants';

// Components`
import CashierSummaryButtonOrderTable from './CashierSummaryButtonOrderTable.vue';

// Interfaces
import { AutoCompleteCompleteEvent } from 'primevue';
import { ICashierOrderSummaryProvided } from '../../interfaces/cashier-order-summary';
import { ICashierOrderType } from '../../interfaces';

// Route
import { useRoute, useRouter } from 'vue-router';
import { useLoyaltyPointBenefitService } from '@/modules/point-configuration/services/loyalty-point-benefit.service';
import { IDiscount, IFreeItems, ILoyaltyPointBenefit } from '@/modules/point-configuration/interfaces';
import { usePointConfigurationService } from '@/modules/point-configuration/services/point-configuration.service';
import { useCustomerDetailService } from '@/modules/customer/services/customer-detail.service';
import { computed, inject, onMounted, provide, ref, watch } from 'vue';
import { ICashierCustomer } from '../../interfaces/cashier-response';
// import { useCustomerDetailsStore } from '@/modules/customer/store';

const route = useRoute();
const router = useRouter();

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashierOrderSummary_menuOrderItem,
  cashierOrderSummary_data,
  cashierOrderSummary_menuOrder,
  cashierOrderSummary_modalOrderType,
  cashierOrderSummary_modalSelectTable,
  cashierProduct_customerState,
  cashierOrderSummary_selectedLoyaltyBenefitId,
  cashierOrderSummary_selectedLoyaltyBenefit,
  cashierProduct_onScrollFetchMoreCustomers,
  cashierProduct_onSearchCustomer,
  cashierOrderSummary_handleIsExpandedToggle,
  hasCustomerManagementPermission,
  cashierOrderSummary_handleModalAddCustomer,
  cashierOrderSummary_setSelectedLoyaltyBenefit,
} = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;

const { loyaltyPointBenefit_fetchList, loyaltyPointBenefit_list } = useLoyaltyPointBenefitService();

const { loyaltyPointSettings_value, loyaltyPointSettingsDetail } = usePointConfigurationService();
const { loyaltyPoints_list, customerDetails_fetchLoyaltyPointByCustomerId } = useCustomerDetailService();

const showLoyaltyModal = ref(false);

// State for selected loyalty benefit
const selectedBenefit = ref<ILoyaltyPointBenefit | null>(null);

// Computed property for button text
const loyaltyButtonText = computed(() => {
  if (selectedBenefit.value) {
    return `${selectedBenefit.value.benefitName} (${selectedBenefit.value.pointNeeds} pts)`;
  }
  return 'Redeem Loyalty Point';
});

type SelfOrderDisplayUser = {
  name: string;
  code: string | null;
  number: string | null;
  email: string | null;
  isGuest: boolean;
};

const defaultSelfOrderDisplayUser: SelfOrderDisplayUser = {
  name: 'Guest',
  code: null,
  number: null,
  email: null,
  isGuest: true,
};

const isSelfOrderRoute = computed(() => route.name === 'self-order');

const selfOrderDisplayUser = ref<SelfOrderDisplayUser>({ ...defaultSelfOrderDisplayUser });

const setDisplayUserAsGuest = (name: string = defaultSelfOrderDisplayUser.name) => {
  selfOrderDisplayUser.value = {
    name,
    code: null,
    number: null,
    email: null,
    isGuest: true,
  };
};

const setDisplayUserFromCustomer = (customer: ICashierCustomer) => {
  selfOrderDisplayUser.value = {
    name: customer.name,
    code: customer.code,
    number: customer.number,
    email: customer.email,
    isGuest: false,
  };

  if (cashierProduct_customerState.value.selectedCustomer?.id !== customer.id) {
    cashierProduct_customerState.value.selectedCustomer = customer;
  }
};

const syncSelfOrderUserFromStorage = () => {
  if (!isSelfOrderRoute.value || typeof window === 'undefined') {
    return;
  }

  const stored = window.localStorage.getItem('userinfo');

  if (!stored) {
    setDisplayUserAsGuest();
    return;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<ICashierCustomer> & { isGuest?: boolean; name?: string };

    if (parsed?.isGuest) {
      setDisplayUserAsGuest(parsed.name ?? defaultSelfOrderDisplayUser.name);
      cashierProduct_customerState.value.selectedCustomer = null;
      return;
    }

    if (parsed && typeof parsed === 'object' && parsed.name) {
      setDisplayUserFromCustomer(parsed as ICashierCustomer);
      return;
    }

    setDisplayUserAsGuest();
  } catch (error) {
    console.error('Failed to parse stored user info', error);
    setDisplayUserAsGuest();
  }
};

const handleSignInAsGuest = () => {
  if (!isSelfOrderRoute.value || typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    'userinfo',
    JSON.stringify({ isGuest: true, name: defaultSelfOrderDisplayUser.name }),
  );
  window.localStorage.setItem('shoppingCart', JSON.stringify({}));
  cashierProduct_customerState.value.selectedCustomer = null;
  setDisplayUserAsGuest();
};

const navigateToSelfOrderLogin = () => {
  if (!isSelfOrderRoute.value) {
    return;
  }

  router.push({
    name: 'login-self-order',
    query: {
      ...route.query,
      redirect: route.fullPath,
    },
  });
};

const selfOrderPhoneDisplay = computed(() => {
  if (!selfOrderDisplayUser.value.number) {
    return null;
  }

  const segments = [selfOrderDisplayUser.value.code, selfOrderDisplayUser.value.number].filter(Boolean);
  return segments.join(' ');
});

// const selectedBenefitDiscount = computed<IDiscount | null>(() => {
//   if (selectedBenefit.value?.type === 'discount') {
//     return selectedBenefit.value.discountFreeItems as IDiscount;
//   }

//   return null;
// });

// const selectedBenefitFreeItems = computed<IFreeItems[]>(() => {
//   if (selectedBenefit.value?.type === 'free_items') {
//     return (selectedBenefit.value.discountFreeItems as IFreeItems[]) ?? [];
//   }

//   return [];
// });

// Provide the selected benefit to parent components
provide('selectedLoyaltyBenefit', {
  benefit: selectedBenefit,
  pointsUsed: computed(() => (selectedBenefit.value ? selectedBenefit.value.pointNeeds : 0)),
});

const requestCustomerLoyaltyPoint = (customerId: string) => {
  return customerDetails_fetchLoyaltyPointByCustomerId(customerId, {
    page: 1,
    limit: 1,
  });
};

const openLoyaltyModal = async () => {
  await loyaltyPointSettingsDetail();
  loyaltyPointBenefit_fetchList();
  requestCustomerLoyaltyPoint(cashierProduct_customerState.value.selectedCustomer!.id);

  showLoyaltyModal.value = true;
};

const closeLoyaltyModal = () => {
  showLoyaltyModal.value = false;
};

onMounted(() => {
  if (isSelfOrderRoute.value) {
    syncSelfOrderUserFromStorage();
  }

  loyaltyPointSettingsDetail();
  loyaltyPointBenefit_fetchList();

  if (cashierProduct_customerState.value.selectedCustomer?.id) {
    requestCustomerLoyaltyPoint(cashierProduct_customerState.value.selectedCustomer!.id);
  }
});

watch(
  () => route.name,
  newName => {
    if (newName === 'self-order') {
      syncSelfOrderUserFromStorage();
    }
  },
);

watch(
  () => cashierProduct_customerState.value.selectedCustomer?.id,
  newCustomerId => {
    if (!newCustomerId) {
      cashierOrderSummary_setSelectedLoyaltyBenefit(null);
      selectedBenefit.value = null;
      return;
    }

    selectedBenefit.value = null;

    if (loyaltyPoints_list.value) {
      loyaltyPoints_list.value.total = 0;
    }

    requestCustomerLoyaltyPoint(newCustomerId);
  },
  { immediate: true },
);

watch(
  () => cashierProduct_customerState.value.selectedCustomer,
  newCustomer => {
    if (!isSelfOrderRoute.value) {
      return;
    }

    if (newCustomer) {
      setDisplayUserFromCustomer(newCustomer);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('userinfo', JSON.stringify(newCustomer));
      }

      return;
    }

    if (typeof window === 'undefined') {
      setDisplayUserAsGuest();
      return;
    }

    const stored = window.localStorage.getItem('userinfo');

    if (!stored) {
      setDisplayUserAsGuest();
      return;
    }

    try {
      const parsed = JSON.parse(stored) as { isGuest?: boolean; name?: string };

      if (parsed?.isGuest) {
        setDisplayUserAsGuest(parsed.name ?? defaultSelfOrderDisplayUser.name);
      }
    } catch {
      setDisplayUserAsGuest();
    }
  },
  { deep: true },
);

watch(
  () => selectedBenefit.value,
  benefit => {
    cashierOrderSummary_setSelectedLoyaltyBenefit(benefit ?? null);
  },
  { immediate: true },
);

watch(
  () => cashierOrderSummary_selectedLoyaltyBenefitId.value,
  benefitId => {
    if (!benefitId) {
      selectedBenefit.value = null;
      return;
    }

    if (cashierOrderSummary_selectedLoyaltyBenefit?.value?.id === benefitId) {
      selectedBenefit.value = cashierOrderSummary_selectedLoyaltyBenefit.value;
    }
  },
);

const selectBenefit = (benefit: ILoyaltyPointBenefit) => {
  // Only allow selection if user has enough points
  if (benefit.pointNeeds <= (loyaltyPoints_list.value?.total || 0)) {
    selectedBenefit.value = benefit.id === selectedBenefit.value?.id ? null : benefit;
  }
};

const redeemPoints = () => {
  if (selectedBenefit.value) {
    closeLoyaltyModal();
    // After closing modal, the button text will be updated to show the selected benefit
  }
};
</script>

<template>
  <section id="cashier-summary-section" class="flex flex-col gap-2 p-4">
    <section id="cashier-summary-section-header" class="flex justify-between items-center">
      <span class="font-semibold text-lg">{{ useLocalization('cashier.orderSummary.orderSummary') }}</span>

      <PrimeVueButton
        text
        aria-haspopup="true"
        aria-controls="overlay_menu_summary_order"
        @click="cashierOrderSummary_menuOrder.toggle($event)"
      >
        <i class="pi pi-ellipsis-h text-primary"></i>

        <span class="text-text-disabled text-xs">{{ useLocalization('cashier.more') }}</span>
      </PrimeVueButton>

      <PrimeVueMenu
        id="overlay_menu_summary_order"
        ref="cashierOrderSummary_menuOrder"
        append-to="body"
        :popup="true"
        :model="cashierOrderSummary_menuOrderItem"
      >
      </PrimeVueMenu>
    </section>

    <section
      v-if="cashierOrderSummary_data.isExpanded"
      id="cashier-summary-section-order-item"
      class="flex flex-col gap-2"
    >
      <template v-if="hasCustomerManagementPermission">
        <div class="flex flex-col gap-2 w-full">
          <label for="username" class="text-sm">
            {{ useLocalization('cashier.mainSection.username') }}
            <span class="text-text-disabled">(Optional)</span>
          </label>

          <PrimeVueIconField class="flex w-full">
            <PrimeVueInputIcon class="pi pi-user" />

            <PrimeVueAutoComplete
              v-model="cashierProduct_customerState.selectedCustomer"
              :suggestions="cashierProduct_customerState.customerList"
              :options="cashierProduct_customerState.customerList"
              :field="'name'"
              :option-value="'id'"
              :option-value-key="'id'"
              option-label="name"
              :min-length="1"
              :loading="cashierProduct_customerState.isLoading"
              :dropdown="true"
              class="w-full text-sm placeholder:text-sm"
              :placeholder="'Select Customer Name (Optional)'"
              :disabled="route.name === 'cashier-order-edit'"
              :virtual-scroller-options="{
                itemSize: 50,
                step: cashierProduct_customerState.limit,
                lazy: true,
                delay: 300,
                loading: cashierProduct_customerState.isLoading,
                onLazyLoad: cashierProduct_onScrollFetchMoreCustomers,
              }"
              :pt="{
                pcInputText: 'text-sm placeholder:text-sm',
                option: 'text-sm',
              }"
              @complete="(event: AutoCompleteCompleteEvent) => cashierProduct_onSearchCustomer(event.query)"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center gap-2">
                  <span class="text-sm">{{ slotProps.value.name }}</span>
                  <span
                    v-if="loyaltyPoints_list?.total != null"
                    class="flex items-center gap-1 text-xs font-semibold text-[#18618B]"
                  >
                    <i class="pi pi-star text-[#0F3C56] text-[12px]"></i>
                    <span>{{ loyaltyPoints_list?.total }} pts</span>
                  </span>
                </div>
                <span v-else>{{ slotProps.placeholder ?? 'Select Customer Name (Optional)' }}</span>
              </template>
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
                        cashierOrderSummary_handleModalAddCustomer(null);
                      }
                    "
                  />
                </div>
              </template>
            </PrimeVueAutoComplete>
          </PrimeVueIconField>
        </div>
      </template>

      <template v-else-if="isSelfOrderRoute">
        <div class="flex flex-col gap-2 w-full">
          <label for="self-order-customer" class="text-sm">
            {{ useLocalization('cashier.mainSection.username') }}
          </label>

          <div class="flex flex-col gap-3 w-full rounded-lg border border-primary-border bg-white p-3 shadow-sm">
            <div class="flex items-start justify-between gap-3">
              <div class="flex flex-col">
                <span class="text-sm font-semibold">{{ selfOrderDisplayUser.name }}</span>
                <span v-if="selfOrderPhoneDisplay" class="text-xs text-text-disabled">
                  {{ selfOrderPhoneDisplay }}
                </span>
                <span v-else-if="selfOrderDisplayUser.email" class="text-xs text-text-disabled">
                  {{ selfOrderDisplayUser.email }}
                </span>
                <span v-else class="text-xs text-text-disabled">
                  {{ selfOrderDisplayUser.isGuest ? 'Guest checkout' : '' }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <PrimeVueButton
                  v-if="selfOrderDisplayUser.isGuest"
                  text
                  size="small"
                  @click="navigateToSelfOrderLogin"
                >
                  Sign In
                </PrimeVueButton>
                <PrimeVueButton text size="small" severity="secondary" @click="handleSignInAsGuest">
                  Sign In as Guest
                </PrimeVueButton>
              </div>
            </div>

            <span v-if="selfOrderDisplayUser.isGuest" class="text-xs text-text-disabled">
              Sign in to earn loyalty points and access personalized offers.
            </span>
          </div>
        </div>
      </template>

      <button
        v-if="cashierProduct_customerState.selectedCustomer != null"
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
              {{ selectedBenefit ? loyaltyButtonText : 'Redeem Loyalty Point' }}
            </span>
            <!-- <span v-if="selectedBenefitDiscount" class="text-[#18618B] text-xs font-medium">
              <template v-if="selectedBenefitDiscount.isPercent">
                {{ selectedBenefitDiscount.value }}% discount
              </template>
              <template v-else>
                {{
                  useCurrencyFormat({
                    data: selectedBenefitDiscount.value,
                    addSuffix: true,
                  })
                }}
                discount
              </template>
            </span>
            <div
              v-else-if="selectedBenefitFreeItems.length"
              class="flex flex-wrap gap-1 text-primary text-xs font-medium"
            >
              <span
                v-for="item in selectedBenefitFreeItems"
                :key="item.id ?? item.name"
                class="bg-primary-background rounded-full px-2 py-0.5"
              >
                ({{ item.quantity }}) {{ item.name }}
              </span>
            </div> -->
          </div>
        </div>
        <i class="pi pi-chevron-right text-primary text-[16px]"></i>
      </button>

      <!-- Modal -->
      <div v-if="showLoyaltyModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div
          class="flex flex-col w-[604px] max-h-[720px] bg-white rounded-lg shadow-[0_0_10px_5px_rgba(0,0,0,0.15)] p-6 gap-5"
        >
          <!-- Title -->
          <h2 class="text-[18px] font-semibold text-black">Redeem Loyalty Point</h2>

          <!-- Customer Info Card -->
          <div class="flex flex-col items-center border border-primary-border rounded-lg p-4 w-full">
            <span class="text-lg font-semibold text-[#070707]">{{
              cashierProduct_customerState.selectedCustomer?.name
            }}</span>
            <div class="flex items-center gap-1 text-primary text-xs font-semibold">
              <i class="pi pi-star-fill text-primary"></i>
              {{ loyaltyPoints_list?.total }} pts
            </div>
            <span class="text-[#323232] text-sm mt-1">{{
              cashierProduct_customerState.selectedCustomer?.code +
              ' ' +
              cashierProduct_customerState.selectedCustomer?.number
            }}</span>
          </div>

          <!-- Promo List -->
          <div
            v-if="loyaltyPointBenefit_list.loyaltyBenefits.items.length > 0"
            class="flex flex-col border border-[#EDEDED] rounded-md p-3 space-y-3 overflow-y-auto max-h-[420px]"
          >
            <!-- Disabled Promo -->
            <!-- <div class="flex justify-between items-center border border-[#D9D9D9] rounded-md bg-[#EDEDED] p-3">
              <div>
                <div class="text-[#8E8E8E] font-semibold text-base">
                  Discount Rp 10.000
                  <span class="text-xs font-normal ml-2">This benefit not applicable for this transaction</span>
                </div>
                <div class="text-xs text-[#8E8E8E] mt-1">
                  Minimum Transaction : Rp 100.000 <span class="mx-2">|</span> Point Needs : 10 pts
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs text-[#8E8E8E]">Discount</div>
                <div class="text-base font-semibold text-[#8E8E8E]">Rp 10.000</div>
              </div>
            </div> -->

            <!-- Active Discount -->
            <div
              v-for="benefit in loyaltyPointBenefit_list.loyaltyBenefits.items"
              :key="benefit.id ?? ''"
              class="flex justify-between items-center border rounded-md p-3 cursor-pointer"
              :class="{
                'bg-grayscale-10': benefit.pointNeeds > loyaltyPoints_list?.total,
                'border-grayscale-20': selectedBenefit?.id !== benefit.id,
                'border-primary border-2':
                  selectedBenefit?.id === benefit.id && benefit.pointNeeds <= loyaltyPoints_list?.total,
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
              <!-- <div
                v-if="selectedBenefit?.id === benefit.id && benefit.pointNeeds <= loyaltyPoints_list?.total"
                class="absolute right-8 top-1/2 -translate-y-1/2"
              >
                <i class="pi pi-check-circle text-primary text-lg"></i>
              </div> -->
            </div>

            <!-- Free Product -->
            <!-- <div class="flex justify-between items-center border border-[#D9D9D9] rounded-md p-3">
              <div>
                <div class="text-[#434343] font-semibold text-base">Free Product Deals</div>
                <div class="text-xs text-[#8E8E8E] mt-1">
                  Minimum Transaction : Rp 100.000 <span class="mx-2">|</span> Point Needs : 10 pts
                </div>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-xs text-[#8E8E8E]">Free Product</span>
                <div class="bg-[#EDF6FC] rounded-full px-2 py-0.5">
                  <span class="text-[#18618B] text-xs font-medium">(1) Spaghetti Aglio Olio</span>
                </div>
              </div>
            </div> -->

            <!-- Birthday Promo -->
            <!-- <div class="flex justify-between items-center border border-[#D9D9D9] rounded-md p-3">
              <div>
                <div class="text-[#434343] font-semibold text-base">Birthday Promo</div>
                <div class="text-xs text-[#8E8E8E] mt-1">
                  Minimum Transaction : Rp 100.000 <span class="mx-2">|</span> Point Needs : 10 pts
                </div>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-xs text-[#8E8E8E]">Free Product</span>
                <div class="bg-[#EDF6FC] rounded-full px-2 py-0.5">
                  <span class="text-[#18618B] text-xs font-medium">(1) Spaghetti Aglio Olio</span>
                </div>
              </div>
            </div> -->
          </div>

          <!-- CTA Buttons -->
          <div class="flex justify-end gap-4 mt-4">
            <button
              class="border border-primary text-primary font-semibold text-base px-5 py-2 rounded-lg shadow-sm hover:bg-primary-background"
              @click="closeLoyaltyModal"
            >
              Cancel
            </button>
            <button
              :disabled="
                !selectedBenefit ||
                (selectedBenefit && selectedBenefit.pointNeeds > (loyaltyPoints_list?.total || 0))
              "
              :class="{
                'bg-primary text-white hover:bg-primary':
                  selectedBenefit && selectedBenefit.pointNeeds <= (loyaltyPoints_list?.total || 0),
                'bg-[#D9D9D9] text-white cursor-not-allowed':
                  !selectedBenefit ||
                  (selectedBenefit && selectedBenefit.pointNeeds > (loyaltyPoints_list?.total || 0)),
              }"
              class="font-semibold text-base px-5 py-2 rounded-lg shadow-sm transition"
              @click="redeemPoints"
            >
              Redeem Point
            </button>
          </div>
        </div>
      </div>

      <CashierSummaryButtonOrderTable />
    </section>

    <div
      v-if="!cashierOrderSummary_data.isExpandedVisible"
      class="border-b-0 lg:border-b-2 border-b-grayscale-10"
    ></div>
    <div v-else>
      <div class="flex gap-2 mb-2">
        <div class="flex items-center gap-1">
          <AppBaseSvg name="order-primary" class="h-4 w-4 text-primary filter-primary-color" />

          <span class="text-primary text-sm font-semibold">
            {{
              CASHIER_ORDER_TYPE.find(
                (f: ICashierOrderType) => f.code === cashierOrderSummary_modalOrderType.selectedOrderType,
              )?.label || 'Order Type'
            }}
          </span>
        </div>

        <div v-if="hasCustomerManagementPermission" class="flex items-center gap-1">
          <AppBaseSvg name="table-primary" class="h-4 w-4 text-primary filter-primary-color" />

          <span
            v-if="cashierOrderSummary_modalSelectTable.selectedTable.length > 0"
            class="text-primary text-sm font-semibold"
          >
            {{ cashierOrderSummary_modalSelectTable.selectedTable.toString() }}
          </span>
        </div>
      </div>

      <div
        class="relative flex justify-center items-center w-full border-b-2 border-b-grayscale-10 cursor-pointer"
        @click="cashierOrderSummary_handleIsExpandedToggle"
      >
        <div class="absolute top-full rounded-full p-1 bg-white -translate-y-1/2 px-1">
          <AppBaseSvg
            :name="cashierOrderSummary_data.isExpanded ? 'chevron-up' : 'chevron-down'"
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
