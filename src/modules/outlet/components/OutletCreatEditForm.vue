<script setup lang="ts">
// Components
import OutletCreateEditFormDetail from './OutletCreateEditFormDetail.vue';
import OutletCreateEditFormLocation from './OutletCreateEditFormLocation.vue';
import OutletCreateEditFormOperational from './OutletCreateEditFormOperational.vue';

// Interfaces
import { IOutletCreateEditProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { outletCreateEdit_isLoading, outletCreateEdit_onCancel, outletCreateEdit_onSubmit } =
  inject<IOutletCreateEditProvided>('outletCreateEdit')!;
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="outletCreateEdit_onSubmit()">
    <OutletCreateEditFormDetail />
    <OutletCreateEditFormLocation />
    <OutletCreateEditFormOperational />

    <section id="button-actions" class="flex items-center gap-4 mt-4">
      <PrimeVueButton
        class="border-blue-primary bg-transparent font-semibold text-base text-blue-primary w-full max-w-36"
        label="Cancel"
        severity="secondary"
        variant="outlined"
        @click="outletCreateEdit_onCancel()"
      />

      <PrimeVueButton
        class="bg-blue-primary border-none text-sm py-[10px] w-full max-w-36"
        label="Create Store"
        type="submit"
        :loading="outletCreateEdit_isLoading"
      />
    </section>
  </form>
</template>
