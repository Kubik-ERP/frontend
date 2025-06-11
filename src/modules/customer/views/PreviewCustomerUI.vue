<script setup lang="ts">
import detailCustomer from '../components/detailCustomer/index.vue';
import detailCustomerSales from '../components/detailCustomer/sales.vue';
const route = useRoute();
</script>
<template>
  <div>
    <detailCustomer />
    <detailCustomerSales />
    <p>Preview {{ route.params.id }}</p>
  </div>
</template>