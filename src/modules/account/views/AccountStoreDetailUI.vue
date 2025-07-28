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
  accountStoreDetail_fetchOutletListOperationalHours,
  // accountStoreDetail_isLoadingOfOutlet,
  accountStoreDetail_listAvailableFloor,
  accountStoreDetail_listColumnsOfAssignedStaff,
  accountStoreDetail_listColumnsOfOperationalHours,
  accountStoreDetail_listColumnsOfStoreFacilities,
  accountStoreDetail_listValuesOfAssignedStaff,
  accountStoreDetail_listValuesOfOperationalHours,
  accountStoreDetail_listValuesOfStoreFacilities,
  accountStoreDetail_listTabs,
  accountStoreDetail_operationalHours,
  accountStoreDetail_selectedFloor,
  accountStoreDetail_storeTables,
} = useAccountStoreDetailsService();

/**
 * @description Provide all the data and methods what we need
 */
provide('accountStoreDetail', {
  accountStoreDetail_listAvailableFloor,
  accountStoreDetail_listColumnsOfAssignedStaff,
  accountStoreDetail_listColumnsOfOperationalHours,
  accountStoreDetail_listColumnsOfStoreFacilities,
  accountStoreDetail_listValuesOfOperationalHours,
  accountStoreDetail_listValuesOfStoreFacilities,
  accountStoreDetail_listValuesOfAssignedStaff,
  accountStoreDetail_operationalHours,
  accountStoreDetail_selectedFloor,
  accountStoreDetail_storeTables,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await accountStoreDetail_fetchOutletListOperationalHours();
});
</script>

<template>
  <section id="account-store-detail" class="flex flex-col gap-6 w-full">
    <!-- <template v-if="accountStoreDetail_isLoadingOfOutlet">
      <AppBaseLoader />
    </template> -->

    <!-- <template v-else> -->
    <AccountStoreDetailInformation />
    <AppBaseTabs v-model:value="accountStoreDetail_activeTab" :items="accountStoreDetail_listTabs" />
    <!-- </template> -->
  </section>
</template>
