<script setup lang="ts">
// Components
import StaffMainSection from '../components/StaffMainSection.vue';

// interfaces
import type { IStaffProvided } from '../interfaces/staff-service';
import { useStaffService } from '../services/useStaff.service';

// Services

/**
 * @description Destructure all the data and methods what we need
 */
const {
  staff_isLoading,
  staff_searchQuery,
  staff_filterTitle,
  staff_filterPermission,
  staff_onSearchData,
  staff_onFilterData,
} = useStaffService();

/**
 * @description Provide all the data and methods what we need
 */
provide<IStaffProvided>('staffId', {
  staff_isLoading,
  staff_searchQuery,
  staff_filterTitle,
  staff_filterPermission,
  staff_onSearchData,
  staff_onFilterData,
});
</script>

<template>
  <section
    id="staff"
    class="grid-wrapper-fullscreen bg-background min-h-screen h-full default-wrapper-fullscreen"
  >
    <StaffMainSection />

  </section>
</template>

<style scoped></style>
