<script setup lang="ts">
/**
 * @description Define the props interface
 */
interface IProps {
  companyLogo?: File | null;
  companyLogoUrl?: string | null;
  footerText?: string | null;
  businessType?: string;
  isAutomaticallyPrintReceipt: boolean;
  isAutomaticallyPrintKitchen: boolean;
  isAutomaticallyPrintTable: boolean;
  isShowCompanyLogo: boolean;
  isShowStoreLocation: boolean;
  isHideCashierName: boolean;
  isHideOrderType: boolean;
  isHideQueueNumber: boolean;
  isShowTableNumber: boolean;
  isHideItemPrices: boolean;
  isShowFooter: boolean;
  isShowLoyaltyPointsUsed: boolean;
  isShowTotalPointsAccumulated: boolean;
  incrementBy?: number;
  resetSequence?: string;
  startingNumber?: number;
}

/**
 * @description Define props with default values and interfaces
 */
const props = withDefaults(defineProps<IProps>(), {
  companyLogo: null,
  companyLogoUrl: null,
  footerText: null,
  businessType: 'Restaurant',
  isAutomaticallyPrintReceipt: false,
  isAutomaticallyPrintKitchen: false,
  isAutomaticallyPrintTable: false,
  isShowCompanyLogo: true,
  isShowStoreLocation: true,
  isHideCashierName: false,
  isHideOrderType: false,
  isHideQueueNumber: false,
  isShowTableNumber: true,
  isHideItemPrices: false,
  isShowFooter: true,
  isShowLoyaltyPointsUsed: true,
  isShowTotalPointsAccumulated: true,
  incrementBy: 1,
  resetSequence: 'daily',
  startingNumber: 1,
});
const URL = window.URL;

import { useOutletStore } from '@/modules/outlet/store';
import { useAuthenticationStore } from '@/modules/authentication/store';
const outletStore = useOutletStore();
const authenticationStore = useAuthenticationStore();
const { outlet_currentOutlet } = storeToRefs(outletStore);
const { authentication_userData } = storeToRefs(authenticationStore);
</script>

<template>
  <section id="invoice-paper" class="bg-white flex flex-col items-center gap-2 w-full">
    <template v-if="props.isShowCompanyLogo">
      <template v-if="props.companyLogo">
        <img :src="URL.createObjectURL(props.companyLogo)" alt="Company Logo" class="w-20 h-20 object-cover" />
      </template>

      <template v-else-if="props.companyLogoUrl">
        <img :src="props.companyLogoUrl" alt="Company Logo" class="w-20 h-20 object-cover" />
      </template>

      <template v-else>
        <section v-if="props.isShowCompanyLogo" id="logo" class="w-20 h-20 bg-grayscale-10">&nbsp;</section>
      </template>
    </template>

    <h6 id="outlet-name" class="font-semibold text-black text-sm">{{ outlet_currentOutlet?.name }}</h6>
    <p
      v-if="props.isShowStoreLocation"
      id="outlet-address"
      class="font-normal text-black text-center text-sm px-4"
    >
      {{ outlet_currentOutlet?.address }}, {{ outlet_currentOutlet?.building }}, {{ outlet_currentOutlet?.city }},
      {{ outlet_currentOutlet?.postalCode }}
    </p>

    <div class="invoice-datetime-or-status">
      <div class="invoice-datetime-or-status-content">
        <span class="date">2024/01/01 05:33</span>
        <span class="cashier">KASIR 202408010001</span>
      </div>
    </div>

    <section
      v-if="!props.isHideCashierName"
      id="cashier-information"
      class="flex items-center justify-between w-full"
    >
      <p id="label-cashier" class="font-normal text-black text-sm">Cashier</p>
      <p id="cashier-name" class="font-normal text-black text-sm">{{ authentication_userData?.fullname }}</p>
    </section>

    <section id="customer-information" class="flex items-center justify-between w-full">
      <p id="label-customer" class="font-normal text-black text-sm">Cust. Name</p>
      <p id="customer-name" class="font-normal text-black text-sm">{{ authentication_userData?.fullname }}</p>
    </section>

    <section
      v-if="!props.isHideOrderType && props.businessType !== 'Retail'"
      id="order-type"
      class="flex items-center justify-between w-full"
    >
      <p id="label-order-type" class="font-normal text-black text-sm">Order Type</p>
      <p id="order-type-value" class="font-normal text-black text-sm">Dine In</p>
    </section>

    <section
      v-if="!props.isHideQueueNumber && props.businessType !== 'Retail'"
      id="queue"
      class="flex items-center justify-between w-full"
    >
      <p id="label-queue" class="font-normal text-black text-sm">Queue</p>
      <p id="queue-value" class="font-normal text-black text-sm">39</p>
    </section>

    <section
      v-if="props.isShowTableNumber && props.businessType !== 'Retail'"
      id="queue"
      class="flex items-center justify-between w-full"
    >
      <p id="label-table-no" class="font-normal text-black text-sm">Table No.</p>
      <p id="table-no-value" class="font-normal text-black text-sm">A1, A9, A10</p>
    </section>

    <table id="product-items" class="w-full">
      <thead>
        <tr class="border-y border-dashed border-black py-2">
          <th class="font-normal text-black text-sm text-left w-28 py-2">Deskripsi</th>
          <th class="font-normal text-black text-sm text-center w-10 py-2">Qty</th>
          <th class="font-normal text-black text-sm text-center w-28 py-2">Harga</th>
          <th class="font-normal text-black text-sm text-right w-28 py-2">Sub Total</th>
        </tr>
      </thead>

      <tbody class="border-b border-solid border-black">
        <tr v-for="index in 2" :key="index">
          <td class="font-normal text-black text-sm py-2">Product A</td>
          <td class="font-normal text-black text-sm text-center py-2">2</td>
          <td v-if="!props.isHideItemPrices" class="font-normal text-black text-sm text-center py-2">100.000</td>
          <td v-if="!props.isHideItemPrices" class="font-normal text-black text-sm text-right py-2">100.000</td>
        </tr>
        <tr>
          <td class="font-normal text-black text-sm py-2">Product B</td>
          <td class="font-normal text-black text-sm text-center py-2">1</td>
          <td v-if="!props.isHideItemPrices" class="font-normal text-black text-sm text-center py-2">0</td>
          <td v-if="!props.isHideItemPrices" class="font-normal text-black text-sm text-right py-2">0</td>
        </tr>
      </tbody>

      <tfoot class="border-b border-solid border-grayscale-10">
        <tr>
          <td class="font-normal text-black text-sm py-2">Sub Total</td>
          <td class="font-normal text-black text-sm text-center py-2">5</td>
          <td colspan="2" class="font-normal text-black text-sm text-right py-2">250.500</td>
        </tr>

        <tr>
          <td class="font-normal text-black text-sm py-2">Promo</td>
          <td class="font-normal text-black text-sm text-center py-2"></td>
          <td colspan="2" class="font-normal text-black text-sm text-right py-2">-50.000</td>
        </tr>

        <tr v-if="props.isShowLoyaltyPointsUsed">
          <td class="font-normal text-black text-sm py-2">Loyalty Point</td>
          <td class="font-normal text-black text-sm text-center py-2"></td>
          <td colspan="2" class="font-normal text-black text-sm text-right py-2">-4 pts</td>
        </tr>

        <tr v-if="props.isShowLoyaltyPointsUsed">
          <td class="font-normal text-black text-sm py-2 italic">Benefit Name</td>
          <td class="font-normal text-black text-sm text-center py-2"></td>
          <td colspan="2" class="font-normal text-black text-sm text-right py-2">Rp 10,000 Off</td>
        </tr>

        <tr v-if="props.isShowTotalPointsAccumulated">
          <td class="font-normal text-black text-sm py-2">Points Accumulated</td>
          <td class="font-normal text-black text-sm text-center py-2"></td>
          <td colspan="2" class="font-normal text-black text-sm text-right py-2">4 pts</td>
        </tr>

        <tr class="border-b border-solid border-black">
          <td class="font-normal text-black text-sm py-2">PB1 10%</td>
          <td colspan="3" class="font-normal text-black text-sm text-right py-2">25.050</td>
        </tr>

        <tr class="border-b border-dashed border-black">
          <td colspan="2" class="font-semibold text-black text-sm text-center py-2">Total</td>
          <td colspan="2" class="font-semibold text-black text-sm text-right py-2">225.550</td>
        </tr>

        <tr>
          <td class="font-normal text-black text-sm py-2">Debit</td>
          <td colspan="3" class="font-normal text-black text-sm text-right py-2">225.550</td>
        </tr>

        <tr>
          <td class="font-normal text-black text-sm py-2">Kembali</td>
          <td colspan="3" class="font-normal text-black text-sm text-right py-2">0</td>
        </tr>
      </tfoot>
    </table>

    <section v-if="props.isShowFooter" id="closing" class="flex flex-col items-center gap-2 w-full">
      <section v-if="props.footerText" id="footer-content" v-html="props.footerText"></section>

      <template v-else>
        <p id="label-social-media" class="font-normal text-black text-sm text-center">Social Media</p>
        <p id="social-media-ig" class="font-normal text-black text-sm text-center">Instagram : @lawsonkal</p>
        <p id="closing-text" class="font-normal text-black text-sm text-center">
          Terima kasih dan kami tunggu kehadiran Anda kembali
        </p>
      </template>
    </section>
  </section>
</template>

<style lang="css" scoped>
.invoice-paper {
  box-shadow: 0px 0px 10px 2px #00000026;
}

.invoice-datetime-or-status {
  position: relative;
  width: 100%;
  font-family: 'Inter', monospace;
  /* Ensures uniform spacing */
  font-size: 12px;
}

.invoice-datetime-or-status::before {
  content: '============================================';
  display: block;
  text-align: center;
  color: #000;
  max-width: 100%;
}

.invoice-datetime-or-status::after {
  content: '============================================';
  display: block;
  text-align: center;
  color: #000;
}

@media (max-width: 1024px) {
  .invoice-datetime-or-status::before {
    content: '====================================';
  }

  .invoice-datetime-or-status::after {
    content: '====================================';
  }
}

/* Content styling with flexbox for alignment */
.invoice-datetime-or-status-content {
  display: flex;
  justify-content: space-between;
  /* Pushes date and cashier to opposite ends */
}

.date {
  text-align: left;
}

.cashier {
  text-align: right;
}
</style>
