<script setup lang="ts">
// Interfaces
import { IStaffProvided } from '../interfaces/staff-service';

/**
 * @description Inject all the data and methods what we need
 */
const { staff_filterTitle, staff_filterPermission, staff_isLoading, staff_onFilterData } =
  inject<IStaffProvided>('staffId')!;
</script>

<template>
  <section id="staff-filter-employee" class="p-4">
    <form class="flex flex-row items-center" @submit.prevent="staff_onFilterData(staff_filterTitle, staff_filterPermission)">
      <span class="me-4 text-base font-semibold">Filter By</span>
      <PrimeVueIconField class="w-60 me-4">
        <PrimeVueInputText
          v-model="staff_filterTitle"
          :loading="staff_isLoading"
          placeholder="Title"
          class="text-sm w-full"
        />

        <PrimeVueInputIcon>
          <template #default>
            <AppBaseSvg name="search" />
          </template>
        </PrimeVueInputIcon>
      </PrimeVueIconField>

      <PrimeVueIconField class="w-60">
        <PrimeVueInputText
          v-model="staff_filterPermission"
          :loading="staff_isLoading"
          placeholder="User Permission"
          class="text-sm w-full"
        />

        <PrimeVueInputIcon>
          <template #default>
            <AppBaseSvg name="search" />
          </template>
        </PrimeVueInputIcon>
      </PrimeVueIconField>
    </form>
  </section>
</template>

<style scoped></style>
