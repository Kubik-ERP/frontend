<script setup lang="ts">
// Interfaces
import type { IAccountStoreDetailProvided } from '../../interfaces';

// Qrcode
import Qrcode from 'qrcode.vue';

// Stores
import { useOutletStore } from '@/modules/outlet/store';

/**
 * @description Injected variables
 */
const outletStore = useOutletStore();
const { outlet_selectedOutletOnAccountPage } = storeToRefs(outletStore);

/**
 * @description Inject all the data and methods what we need
 */
const {
  accountStoreDetail_onCloseDialogDetailTable,
  accountStoreDetail_selectedOutlet,
  accountStoreDetail_selectedTable,
} = inject<IAccountStoreDetailProvided>('accountStoreDetail')!;
</script>

<template>
  <AppBaseDialog id="account-store-table-configuration-detail-dialog">
    <template #header>
      <h5 class="font-semibold text-black text-lg">{{ useLocalization('account.table-details') }}</h5>
    </template>

    <template #content>
      <section id="form-groups" class="grid-wrapper gap-4">
        <section id="floor" class="col-span-full flex flex-col gap-1">
          <span class="font-normal text-grayscale-70 text-sm">{{
            useLocalization('account.form.table-name')
          }}</span>

          <p class="font-normal text-base text-text-primary">
            {{ accountStoreDetail_selectedTable?.name }}
          </p>
        </section>

        <section id="form-input" class="col-span-full lg:col-span-6 flex flex-col gap-1">
          <h6 class="font-normal text-grayscale-70 text-sm">{{ useLocalization('account.form.floor-name') }}</h6>

          <p class="font-normal text-base text-primary">
            {{ accountStoreDetail_selectedTable?.floorName }}
          </p>
        </section>

        <section id="form-input" class="col-span-full lg:col-span-6">
          <h6 class="font-normal text-grayscale-70 text-sm">{{ useLocalization('account.form.seat-count') }}</h6>

          <p class="font-normal text-base text-text-primary">
            {{ accountStoreDetail_selectedTable?.seats }} {{ useLocalization('account.seats') }}
          </p>
        </section>

        <section id="form-input" class="col-span-full">
          <h6 class="font-normal text-grayscale-70 text-sm">{{ useLocalization('account.form.table-shape') }}</h6>

          <p class="font-normal text-base text-text-primary">
            {{ accountStoreDetail_selectedTable?.shape }}
          </p>
        </section>

        <section id="form-input" class="col-span-full flex flex-col gap-2">
          <span class="font-normal text-grayscale-70 text-xs">{{ useLocalization('account.table-qr-code') }}</span>

          <div class="flex items-center gap-2">
            <Qrcode
              :value="`${APP_BASE_URL}/self-order?storeId=${outlet_selectedOutletOnAccountPage?.id}&floorName=${accountStoreDetail_selectedTable?.floorName ?? ''}&tablesName=${accountStoreDetail_selectedTable?.name ?? ''}`"
            />

            <PrimeVueButton
              class="bg-transparent border-none basic-smooth-animation w-fit p-4"
              severity="secondary"
              variant="outlined"
            >
              <template #default>
                <section id="content" class="flex items-center justify-center gap-2">
                  <AppBaseSvg name="download" class="!w-6 !h-6" />
                  <span class="font-semibold text-primary text-sm">{{
                    useLocalization('account.download-table-qr-code')
                  }}</span>
                </section>
              </template>
            </PrimeVueButton>
          </div>
        </section>
      </section>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-center text-primary w-full border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10 py-3"
          :label="useLocalization('account.buttons.cancel')"
          severity="secondary"
          variant="outlined"
          @click="accountStoreDetail_onCloseDialogDetailTable"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base text-center py-3 w-full h-full"
          severity="secondary"
          variant="outlined"
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
            <section id="content" class="flex items-center justify-center gap-2 w-full">
              <AppBaseSvg name="edit-white" class="w-4 h-4" />
              <span class="font-semibold text-sm lg:text-base text-center text-white">{{
                useLocalization('account.edit-table')
              }}</span>
            </section>
          </template>
        </PrimeVueButton>
      </footer>
    </template>
  </AppBaseDialog>
</template>
