<script setup lang="ts">
// Components
import AccountStoreDetailInformation from '../components/store-detail/AccountStoreDetailInformation.vue';

// Services
import { useAccountStoreDetailsService } from '../services/account-store-detail.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  accountStoreDetail_activeTab,
  accountStoreDetail_listColumnsOfAssignedStaff,
  accountStoreDetail_listColumnsOfOperationalHours,
  accountStoreDetail_listColumnsOfStoreFacilities,
  accountStoreDetail_listValuesOfAssignedStaff,
  accountStoreDetail_listValuesOfOperationalHours,
  accountStoreDetail_listValuesOfStoreFacilities,
  accountStoreDetail_listTabs,
} = useAccountStoreDetailsService();

/**
 * @description Provide all the data and methods what we need
 */
provide('accountStoreDetail', {
  accountStoreDetail_listColumnsOfAssignedStaff,
  accountStoreDetail_listColumnsOfOperationalHours,
  accountStoreDetail_listColumnsOfStoreFacilities,
  accountStoreDetail_listValuesOfOperationalHours,
  accountStoreDetail_listValuesOfStoreFacilities,
  accountStoreDetail_listValuesOfAssignedStaff,
});
</script>

<template>
  <section id="account-store-detail" class="flex flex-col gap-6 w-full">
    <AccountStoreDetailInformation />
    <AppBaseTabs v-model:value="accountStoreDetail_activeTab" :items="accountStoreDetail_listTabs" />
  </section>
</template>
