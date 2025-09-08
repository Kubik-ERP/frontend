<script setup lang="ts">
// Interfaces
import type { IAccountProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { account_isLoadingOfOutlet, account_listColumns, account_listStores, account_onDirectToDetailOutlet } =
  inject<IAccountProvided>('account')!;
</script>

<template>
  <AppBaseDataTable
    btn-cta-create-title="Create Store"
    :columns="account_listColumns"
    :data="account_listStores.items"
    :is-loading="account_isLoadingOfOutlet"
    :rows-per-page="account_listStores.meta.pageSize || 10"
    :total-records="account_listStores.meta.total || 0"
    :first="account_listStores.meta ? (account_listStores.meta.page - 1) * account_listStores.meta.pageSize : 0"
    header-title="Stores"
    is-using-btn-cta-create
    is-using-custom-body
    is-using-custom-header
    :is-using-border-on-header="false"
  >
    <template #header>
      <header class="flex items-center justify-between py-5">
        <h6 class="font-semibold text-black text-lg">
          {{ useLocalization('app.stores') }}
        </h6>

        <PrimeVueButton
          class="bg-primary border-none w-fit px-5"
          severity="secondary"
          @click="$router.push({ name: 'outlet.create' })"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="plus-line-white" class="w-4 h-4" />

              <span class="font-semibold text-sm lg:text-base text-white">
                {{ useLocalization('app.create-store') }}
              </span>
            </section>
          </template>
        </PrimeVueButton>
      </header>
    </template>

    <template #body="{ column, data }">
      <template v-if="column.value === 'action'">
        <PrimeVueButton variant="text" rounded aria-label="detail" @click="account_onDirectToDetailOutlet(data)">
          <template #icon>
            <AppBaseSvg name="eye-visible" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>
      </template>

      <template v-else>
        <span class="font-normal text-sm text-text-primary">{{ data[column.value] ?? '-' }}</span>
      </template>
    </template>
  </AppBaseDataTable>
</template>
