<script setup lang="ts">
import detailCustomer from '../components/detailCustomer/index.vue';
import loyaltyPoint from '../components/detailCustomer/loyaltyPoint.vue';
import salesInvoice from '../components/detailCustomer/salesInvoice.vue';
// import SalesOrderDailySales from '../../sales-order/components/SalesOrderDailySales.vue';
// const route = useRoute();
const selectedPage = ref('Sales Invoice');
const pageOption = ref(['Sales Invoice', 'Loyalty Point']);
</script>
<template>
  <div>
    <detailCustomer />

    <PrimeVueSelectButton v-model="selectedPage" :options="pageOption" />

    <template v-if="selectedPage === 'Sales Invoice'">
      <salesInvoice />
    </template>

    <template v-if="selectedPage === 'Loyalty Point'">
      <loyaltyPoint />
    </template>

    <!-- <p>Preview {{ route.params.id }}</p> -->
  </div>
</template>