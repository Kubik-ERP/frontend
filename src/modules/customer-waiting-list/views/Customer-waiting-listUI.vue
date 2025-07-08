<script setup>
import { useCustomerWaitingListService } from '../services/customer-waiting-list.service';

const { getCustomerWaitingList, isLoading } = useCustomerWaitingListService();

const preparingOrder = ref([]);
const orderComplete = ref([]);

onMounted(async () => {
  const response = await getCustomerWaitingList(1,1000);
  console.log("🚀 ~ onMounted ~ response:", response)
  const allOrder = response.data.items;
  orderComplete.value = allOrder.filter(order => order.orderStatus === 'completed');
  preparingOrder.value = allOrder.filter(order => order.orderStatus !== 'completed');
});
</script>
<template>
  <div class="grid grid-cols-2 gap-4">
    <section class="flex flex-col gap-4">
      <h2 class="text-2xl font-bold text-warning-hover">Preparing Orders</h2>
      <div class="rounded-lg shadow-md border border-grayscale-20">
        <div class="p-2 border-b border-gray-200 bg-grayscale-10">
          <span class="font-semibold text-sm">Order Number</span>
        </div>

        <div
        v-if='!isLoading'
          class="grid min-h-96 max-h-96 overflow-y-auto"
          :style="{
            gridTemplateRows: 'repeat(8, minmax(0, 1fr))',
            gridAutoFlow: 'column',
            gridAutoColumns: '11rem',
          }"
        >
          <div
            v-for="order in preparingOrder"
            :key="order"
            class="border border-grayscale-20 p-4 font-semibold whitespace-nowrap flex items-center justify-center"
          >
            #{{ order.orderNumber }}
          </div>
        </div>
        <div v-else 
            class='min-h-96 max-h-96 flex items-center justify-center'
          >
            <PrimeVueProgressSpinner style="width: 50px; height: 50px" />
          </div>
      </div>
    </section>
    <section class="flex flex-col gap-4">
      <h2 class="text-2xl font-bold text-primary">Order Complete</h2>
      <div class="rounded-lg shadow-md border border-grayscale-20">
        <div class="p-2 border-b border-gray-200 bg-grayscale-10">
          <span class="font-semibold text-sm">Order Number</span>
        </div>

        <div v-if='!isLoading'
          class="grid min-h-96 max-h-96 overflow-y-auto"
          :style="{
            gridTemplateRows: 'repeat(8, minmax(0, 1fr))',
            gridAutoFlow: 'column',
            gridAutoColumns: '11rem',
          }"
        >
          <div
            v-for="order in orderComplete"
            :key="order"
            class="border border-grayscale-20 text-primary bg-primary-background p-4 font-semibold whitespace-nowrap flex items-center justify-center"
          >
            #{{ order.orderNumber }}
          </div>
        </div>

        <div v-else 
          class='min-h-96 max-h-96 flex items-center justify-center'
        >
          <PrimeVueProgressSpinner style="width: 50px; height: 50px" />
        </div>

      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped></style>
