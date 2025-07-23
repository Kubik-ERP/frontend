<script setup lang="ts">
// Components
import StaffMemberListTable from '../components/StaffMemberListTable.vue';

// Services
import { useStaffMemberListService } from '../services/staff-member-list.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  staffMemberList_columns,
  staffMemberList_fetchListMembers,
  staffMemberList_isLoading,
  staffMemberList_values,
  staffMemberList_queryParams,
  staffMemberList_dropdownItemTitles,
  staffMemberList_typesOfUserPermissions,
  staffMemberList_deleteStaffMember,
  staffMemberList_onChangePage,
} = useStaffMemberListService();

/**
 * @description Provide all the data and methods what we need
 */
provide('staffMemberList', {
  staffMemberList_columns,
  staffMemberList_isLoading,
  staffMemberList_values,
  staffMemberList_queryParams,
  staffMemberList_dropdownItemTitles,
  staffMemberList_typesOfUserPermissions,
  staffMemberList_deleteStaffMember,
  staffMemberList_onChangePage,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await staffMemberList_fetchListMembers();
});
</script>

<template>
  <section id="staff-member-list" class="flex flex-col relative inset-0 z-0">
    <StaffMemberListTable />
  </section>
</template>
