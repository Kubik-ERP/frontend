<script setup lang="ts">
/**
 * @description Define the props     <!-- Top Separator -->
    <div cl    <!-- Items Separator -->
    <div class="separator-dashed"></div>"separator-line"></div>rface
 */
interface IProps {
  customerName?: string;
  orderDate?: string;
  invoiceNumber?: string;
  staffName?: string;
  orderType?: string;
  tableNumber?: string;
  queueNumber?: number;
  items?: Array<{
    id: string;
    name: string;
    quantity: number;
    additionalItems?: Array<{
      name: string;
      quantity: number;
    }>;
  }>;
}

import { useAuthenticationStore } from '@/modules/authentication/store';
const authenticationStore = useAuthenticationStore();
const { authentication_userData } = storeToRefs(authenticationStore);

/**
 * @description Define props with default values and interfaces
 */
const props = withDefaults(defineProps<IProps>(), {
  customerName: 'George',
  orderDate: '01/08/2024 18:33',
  invoiceNumber: '20240801001',
  staffName: 'Samantha',
  orderType: 'Dine In',
  tableNumber: 'A1',
  queueNumber: 39,
  items: () => [
    {
      id: '1',
      name: 'Product A',
      quantity: 2,
      additionalItems: [
        {
          name: 'Additional +1 Cup Sugar',
          quantity: 1,
        },
      ],
    },
    {
      id: '2',
      name: 'Product B',
      quantity: 1,
    },
  ],
});
</script>

<template>
  <section id="kitchen-table-ticket" class="bg-white flex flex-col items-center gap-3 w-full p-4">
    <!-- Customer Name -->
    <h2 id="customer-name" class="font-semibold text-black text-base text-center">
      {{ authentication_userData?.fullname }}
    </h2>

    <!-- Top Separator -->
    <div class="separator-line"></div>

    <!-- Order Information -->
    <section id="order-information" class="flex flex-col gap-2 w-full">
      <div class="flex items-center justify-between w-full">
        <span class="font-normal text-black text-sm">Order Date</span>
        <span class="font-normal text-black text-sm">{{ props.orderDate }}</span>
      </div>

      <div class="flex items-center justify-between w-full">
        <span class="font-normal text-black text-sm">Invoice Number</span>
        <span class="font-normal text-black text-sm">{{ props.invoiceNumber }}</span>
      </div>

      <div class="flex items-center justify-between w-full">
        <span class="font-normal text-black text-sm">Staff</span>
        <span class="font-normal text-black text-sm">{{ authentication_userData?.fullname }}</span>
      </div>

      <div class="flex items-center justify-between w-full">
        <span class="font-normal text-black text-sm">Order Type</span>
        <span class="font-normal text-black text-sm">{{ props.orderType }}</span>
      </div>
    </section>

    <!-- Dashed Separator -->
    <div class="separator-dashed"></div>

    <!-- Items Header -->
    <section id="items-header" class="flex items-center gap-3 w-full">
      <table id="items-list" class="w-full">
        <tbody>
          <!-- Main Item -->
          <tr>
            <td class="font-normal text-black text-sm py-1 align-top w-16">Qty</td>
            <td class="font-normal text-black text-sm py-1 align-top">Order Item</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Items Separator -->
    <div class="separator-dashed"></div>

    <!-- Items List -->
    <table id="items-list" class="w-full">
      <tbody>
        <template v-for="item in props.items" :key="item.id">
          <!-- Main Item -->
          <tr>
            <td class="font-bold text-black text-sm py-1 align-top w-16">{{ item.quantity }} x</td>
            <td class="font-bold text-black text-sm py-1 align-top">
              {{ item.name }}
              <!-- Additional Items nested under main item -->
              <div v-if="item.additionalItems && item.additionalItems.length > 0" class="additional-items my-2">
                <div
                  v-for="(additional, index) in item.additionalItems"
                  :key="`${item.id}-additional-${index}`"
                  class="flex items-start gap-2 mt-1"
                >
                  <span class="font-bold text-black text-sm italic w-fit flex-shrink-0"
                    >{{ additional.quantity }} x</span
                  >
                  <span class="font-bold text-black text-sm italic">{{ additional.name }}</span>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </section>
</template>

<style lang="css" scoped>
#kitchen-table-ticket {
  box-shadow: 0px 0px 10px 2px #00000026;
  max-width: 400px;
  margin: 0 auto;
}

.separator-line {
  width: 100%;
  height: 14px;
  position: relative;
  display: flex;
  align-items: center;
}

.separator-line::before {
  content: '';
  width: 100%;
  height: 2px;
  background-image: repeating-linear-gradient(to right, #000 0, #000 6px, transparent 6px, transparent 8px);
  background-size: 8px 2px;
  position: relative;
}

.separator-line::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background-image: repeating-linear-gradient(to right, #000 0, #000 6px, transparent 6px, transparent 8px);
  background-size: 8px 2px;
  transform: translateY(2px);
}

.separator-dashed {
  width: 100%;
  height: 14px;
  position: relative;
  display: flex;
  align-items: center;
}

.separator-dashed::before {
  content: '';
  width: 100%;
  height: 1px;
  background-image: repeating-linear-gradient(to right, #000 0, #000 0.8ch, transparent 0.8ch, transparent 1.2ch);
  background-size: 1.2ch 1px;
}

#items-list {
  border-collapse: collapse;
  border-spacing: 0;
}

#items-list td {
  border: none;
  padding: 2px 0;
  vertical-align: top;
}

#items-list tr {
  border: none;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  #customer-name {
    font-size: 20px;
  }

  #order-information span,
  #items-header span,
  #items-list span {
    font-size: 14px;
  }
}
</style>
