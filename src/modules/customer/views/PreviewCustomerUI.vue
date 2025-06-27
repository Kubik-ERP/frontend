<script setup lang="ts">
import detailCustomer from '../components/detailCustomer/index.vue';
import loyaltyPoint from '../components/detailCustomer/loyaltyPoint.vue';
import salesInvoice from '../components/detailCustomer/salesInvoice.vue';

import { useCustomerDetailService } from '../services/customer-detail.service';

const { customerDetails_fetchSalesInvoice } = useCustomerDetailService();

const route = useRoute();

const selectedPage = ref('Sales Invoice');
const pageOption = ref(['Sales Invoice', 'Loyalty Point']);

const customer = ref({});
const invoices = ref([]);

onMounted(async () => {
  const response = await customerDetails_fetchSalesInvoice(route.params.id as string);
  // console.log('🚀 ~ onMounted ~ response:', response);
  customer.value = response.data;
  invoices.value = response.data.invoices;
});

provide('customerDetails', { customer, invoices });
</script>
<template>
  <div>
    <detailCustomer />

    <PrimeVueSelectButton v-model="selectedPage" :options="pageOption" class="mb-8" unstyled>
      <template #option="slotProps">
        <button
          class="px-4 py-2 text-sm font-medium transition-all"
          :class="[slotProps.option === selectedPage ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
        >
          {{ slotProps.option }}
        </button>
      </template>
    </PrimeVueSelectButton>

    <template v-if="selectedPage === 'Sales Invoice'">
      <salesInvoice />
    </template>

    <template v-if="selectedPage === 'Loyalty Point'">
      <loyaltyPoint />
    </template>

    <!-- <p>Preview {{ route.params.id }}</p> -->
  </div>
</template>
