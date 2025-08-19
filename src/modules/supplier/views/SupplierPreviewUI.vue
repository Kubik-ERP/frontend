<script setup lang="ts">
// Services

import SupplierItemListTable from '../components/SupplierItemListTable.vue';
import SupplierListDetail from '../components/SupplierListDetail.vue';
</script>
<template>
  <section id="supplier-detail">
    <SupplierListDetail />
  </section>
  <section id="item-preview" class="flex justify-center my-10">
    <div class="w-full">
      <SupplierItemListTable />
    </div>
  </section>
</template>
