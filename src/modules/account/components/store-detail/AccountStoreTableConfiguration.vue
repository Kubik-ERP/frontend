<script setup lang="ts">
// Components
import AccountStoreTableLayout from './AccountStoreTableLayout.vue';

// Interfaces
import type { IAccountStoreDetailProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { accountStoreDetail_listAvailableFloor, accountStoreDetail_selectedFloor, accountStoreDetail_storeTables } =
  inject<IAccountStoreDetailProvided>('accountStoreDetail')!;
</script>

<template>
  <header class="flex items-center justify-between w-full mb-4">
    <section id="left-content" class="flex items-center gap-2">
      <h6 class="font-semibold text-black text-lg w-fit">Table</h6>
    </section>

    <PrimeVueButton class="bg-primary border-none w-fit px-5">
      <template #default>
        <section class="flex items-center gap-2">
          <AppBaseSvg name="plus-line-white" />
          <span class="font-semibold text-base text-white">Edit Table</span>
        </section>
      </template>
    </PrimeVueButton>
  </header>

  <section
    v-if="accountStoreDetail_storeTables?.length > 0"
    class="flex flex-col gap-4 p-4 border border-solid border-grayscale-10"
  >
    <header class="flex items-center justify-between w-full">
      <section id="left-content" class="flex items-center gap-2">
        <h6 class="font-semibold text-black text-lg w-fit">Floor</h6>

        <PrimeVueSelect
          v-model="accountStoreDetail_selectedFloor"
          :options="accountStoreDetail_listAvailableFloor"
          option-label="label"
          option-value="value"
          class="text-sm w-full min-w-40"
        />
      </section>
    </header>

    <section
      v-for="(storeTable, storeTableIndex) in accountStoreDetail_storeTables"
      :key="`store-table-${storeTableIndex}`"
    >
      <AccountStoreTableLayout :store-table="storeTable" />
    </section>
  </section>

  <template v-else>
    <section
      id="account-store-table-configuration"
      class="flex items-center justify-between border border-solid border-grayscale-10 p-4 rounded-lg"
    >
      <section id="no-tables-configuration-information" class="flex flex-col gap-2">
        <h6 class="font-bold text-primary text-lg">No tables configured yet</h6>

        <p class="font-normal text-base text-grayscale-70">Start by adding tables to set up your floor layout</p>
      </section>

      <PrimeVueButton
        class="bg-blue-primary border-none text-base py-3 px-5 w-fit"
        label="Set Up Table"
        type="button"
        @click="$router.push({ name: 'account.store.table-configuration' })"
      />
    </section>
  </template>
</template>
