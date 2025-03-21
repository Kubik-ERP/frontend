<script setup lang="ts">
// Components
import StaffSearchEmployee from './StaffSearchEmployee.vue';
import StaffFilterEmployee from './StaffFilterEmployee.vue';
import StaffTableEmployee from './StaffTableEmployee.vue';

</script>

<template>
  <section id="staff-main-section" class="flex flex-col mx-10 my-6 bg-white w-254 border-2 border-solid border-grayscale-20 rounded-lg h-fit">
    <StaffSearchEmployee />
    <StaffFilterEmployee />
    <StaffTableEmployee />
  </section>
</template>

<style scoped></style>
