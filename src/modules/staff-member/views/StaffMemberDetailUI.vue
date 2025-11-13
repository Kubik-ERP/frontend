<script setup lang="ts">
import detailStaff from '../components/detailStaff/index.vue';
import commissions from '../components/detailStaff/commissions.vue';

import { useStaffMemberDetailService } from '../services/staff-member-detail.service';

const { staffMemberDetails_fetchInformation } = useStaffMemberDetailService();
onMounted(async () => {
  await staffMemberDetails_fetchInformation();
});
</script>
<template>
  <div>
    <detailStaff />
    <commissions />
  </div>
</template>
