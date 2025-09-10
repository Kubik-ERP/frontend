<script setup lang="ts">
// Components
import AccountStoreTableLayout from './AccountStoreTableLayout.vue';

// Interfaces
import type { IAccountStoreDetailProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  accountStoreDetail_listAvailableFloor,
  accountStoreDetail_selectedFloor,
  accountStoreDetail_selectedOutlet,
  accountStoreDetail_selectedTableLayout,
  accountStoreDetail_storeTables,
} = inject<IAccountStoreDetailProvided>('accountStoreDetail')!;
</script>

<template>
  <header class="flex items-center justify-between w-full mb-4">
    <section id="left-content" class="flex items-center gap-2">
      <h6 class="font-semibold text-black text-lg w-fit">{{ useLocalization('account.table') }}</h6>
    </section>

    <PrimeVueButton
      v-if="accountStoreDetail_listAvailableFloor.length > 0"
      class="bg-primary border-none w-fit px-5"
      @click="
        $router.push({
          name: 'account.store.table-configuration',
          params: {
            id: accountStoreDetail_selectedOutlet?.id,
          },
        })
      "
    >
      <template #default>
        <section class="flex items-center gap-2">
          <AppBaseSvg name="plus-line-white" class="w-4 h-4" />
          <span class="font-semibold text-sm lg:text-base text-white">{{
            useLocalization('account.edit-table')
          }}</span>
        </section>
      </template>
    </PrimeVueButton>
  </header>

  <section
    v-if="accountStoreDetail_storeTables && accountStoreDetail_storeTables.length > 0"
    class="flex flex-col gap-4 p-4 border border-solid border-grayscale-10"
  >
    <header class="flex items-center justify-between w-full">
      <section id="left-content" class="flex items-center gap-2">
        <h6 class="font-semibold text-black text-lg w-fit">{{ useLocalization('account.floor') }}</h6>

        <PrimeVueSelect
          v-model="accountStoreDetail_selectedFloor"
          :options="accountStoreDetail_listAvailableFloor"
          option-label="label"
          option-value="value"
          class="text-sm w-full min-w-40"
        />
      </section>
    </header>

    <AccountStoreTableLayout
      v-if="accountStoreDetail_selectedTableLayout"
      :store-table="accountStoreDetail_selectedTableLayout"
    />
  </section>

  <template v-else>
    <section
      id="account-store-table-configuration"
      class="flex flex-col lg:flex-row items-start lg:items-center justify-between border border-solid border-grayscale-10 p-4 rounded-lg gap-4 lg:gap-0"
    >
      <section id="no-tables-configuration-information" class="flex flex-col gap-2">
        <h6 class="font-bold text-primary text-base lg:text-lg">
          {{ useLocalization('account.no-tables-configured') }}
        </h6>

        <p class="font-normal text-sm lg:text-base text-grayscale-70">
          {{ useLocalization('account.start-adding-tables-description') }}
        </p>
      </section>

      <PrimeVueButton
        class="bg-blue-primary border-none text-sm lg:text-base py-3 px-5 w-full lg:w-fit"
        :label="useLocalization('account.set-up-table')"
        type="button"
        @click="$router.push({ name: 'account.store.table-configuration' })"
      />
    </section>
  </template>
</template>
