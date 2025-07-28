<script setup lang="ts">
// Components
import AccountBankInformation from '../components/AccountBankInformation.vue';
import AccountDetails from '../components/AccountDetails.vue';
import AccountSetUpBankDialog from '../components/AccountSetUpBankDialog.vue';
import AccountStores from '../components/AccountStores.vue';

// Services
import { useAccountService } from '../services/account.service';
import { useOutletListService } from '@/modules/outlet/services/outlet-list.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  account_bankAccountFormData,
  account_bankAccountFormValidations,
  account_fetchOutletProfile,
  account_fetchUserBanks,
  account_isLoadingOfOutlet,
  account_listColumns,
  account_onCloseDialogSetUpBank,
  account_onSetUpBankAccount,
  account_onSubmitBankAccount,
  account_profile,
} = useAccountService();
const { outletList_fetchOutletLists, outletList_isLoading, outletList_lists } = useOutletListService();

/**
 * @description Provide all the data and methods what we need
 */
provide('account', {
  account_bankAccountFormData,
  account_bankAccountFormValidations,
  account_isLoadingOfOutlet,
  account_listColumns,
  account_onCloseDialogSetUpBank,
  account_onSetUpBankAccount,
  account_onSubmitBankAccount,
  account_profile,
});
provide('outletList', {
  outletList_isLoading,
  outletList_lists,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await Promise.all([account_fetchOutletProfile(), account_fetchUserBanks(), outletList_fetchOutletLists()]);
});
</script>

<template>
  <section id="account" class="default-wrapper gap-6">
    <template v-if="account_isLoadingOfOutlet">
      <AppBaseLoader />
    </template>

    <template v-else>
      <AccountDetails />
      <AccountBankInformation />
      <AccountStores />

      <AccountSetUpBankDialog />
    </template>
  </section>
</template>
