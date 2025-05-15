<script setup lang="ts">
const home = ref({
  icon: 'pi pi-home',
});
const items = ref([{ label: 'Sales Order' }]);
</script>

<template>
  <section id="breadcrumbs" class="px-7 py-3 border-b borer-solid border-grayscale-10">
    <PrimeVueBreadcrumb
      :home="home"
      :model="items"
      :pt="{
        root: 'p-0',
        itemLabel: 'font-normal text-sm text-primary',
      }"
    />
  </section>
</template>
