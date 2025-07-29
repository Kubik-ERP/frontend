<script setup lang="ts">
// Interfaces
import type { IAccountProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { account_isLoadingOfOutlet, account_listColumns, account_profile } = inject<IAccountProvided>('account')!;
</script>

<template>
  <AppBaseDataTable
    btn-cta-create-title="Create Store"
    :columns="account_listColumns"
    :data="account_profile?.stores"
    :is-loading="account_isLoadingOfOutlet"
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

        <PrimeVueButton class="bg-primary border-none w-fit px-5" severity="secondary">
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="plus-line-white" />

              <span class="font-semibold text-base text-white">
                {{ useLocalization('app.create-store') }}
              </span>
            </section>
          </template>
        </PrimeVueButton>
      </header>
    </template>

    <template #body="{ column, data }">
      <template v-if="column.value === 'action'">
        <PrimeVueButton
          variant="text"
          rounded
          aria-label="detail"
          @click="$router.push({ name: 'account.store.detail', params: { id: data.id } })"
        >
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
