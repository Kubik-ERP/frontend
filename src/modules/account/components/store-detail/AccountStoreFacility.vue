<script setup lang="ts">
// Interfaces
import type { IAccountStoreDetailProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { accountStoreDetail_listColumnsOfStoreFacilities, accountStoreDetail_listValuesOfStoreFacilities } =
  inject<IAccountStoreDetailProvided>('accountStoreDetail')!;
</script>

<template>
  <AppBaseDataTable
    :columns="accountStoreDetail_listColumnsOfStoreFacilities"
    :data="accountStoreDetail_listValuesOfStoreFacilities"
    is-using-btn-cta-create
    is-using-custom-body
    is-using-custom-header
    :is-using-border-on-header="false"
  >
    <template #header>
      <header class="flex items-center justify-between py-5">
        <h6 class="font-semibold text-black text-lg">
          {{ useLocalization('account.facilities') }}
        </h6>

        <PrimeVueButton class="bg-primary border-none w-fit px-5" severity="secondary">
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="plus-line-white" />

              <span class="font-semibold text-base text-white">
                Add Store Facility
              </span>
            </section>
          </template>
        </PrimeVueButton>
      </header>
    </template>

    <template #body="{ column, data }">
      <template v-if="column.value === 'action'">
        <PrimeVueButton variant="text" rounded aria-label="detail">
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
