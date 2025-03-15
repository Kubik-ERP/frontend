<script setup lang="ts">
// Components
import OutletHeader from '../components/OutletHeader.vue';
import OutletAvailableList from '../components/OutletAvailableList.vue';
</script>

<template>
  <section id="outlet-list" class="flex flex-col gap-10 w-full">
    <OutletHeader />
    <OutletAvailableList />

    <section id="btn-actions" class="flex justify-center w-full">
      <PrimeVueButton class="bg-blue-primary border-none text-sm py-[10px] w-sm" label="Continue" />
    </section>
  </section>
</template>
