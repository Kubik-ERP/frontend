<script setup lang="ts">
// Interfaces
import { IStaffProvided } from '../interfaces/staff-service';

/**
 * @description Inject all the data and methods what we need
 */
const { staff_searchQuery, staff_isLoading, staff_onSearchData } =
  inject<IStaffProvided>('staffId')!;
</script>

<template>
  <section id="staff-seach-employee" class="border-solid border-grayscale-20 border-b-2 p-4 flex flex-row justify-between">
    <div class="flex items-center">
      <p class="me-4 text-xl font-semibold">Staff</p>
      <p class="rounded-full px-4 py-1 bg-secondary-background text-green-primary text-xs"><span>100</span> Members</p>
    </div>
    <form class="flex flex-row" @submit.prevent="staff_onSearchData(staff_searchQuery)">
      <PrimeVueIconField class="w-80">
        <PrimeVueInputIcon>
          <template #default>
            <AppBaseSvg name="search" />
          </template>
        </PrimeVueInputIcon>

        <PrimeVueInputText
          v-model="staff_searchQuery"
          :loading="staff_isLoading"
          placeholder="Search by Employee ID or Name"
          class="text-sm w-full"
        />
      </PrimeVueIconField>
      <button class="bg-blue-primary text-white w-51.5 text-s ms-4 rounded-lg">
        <i class="pi pi-plus"></i>
        Add Staff Member
      </button>
    </form>
  </section>
</template>

<style scoped></style>
