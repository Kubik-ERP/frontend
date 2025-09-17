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
const {
  outletCreateEdit_isEditable,
  outletCreateEdit_isLoading,
  outletCreateEdit_onCancel,
  outletCreateEdit_onShowDialogDeleteOutlet,
  outletCreateEdit_onSubmit,
} = inject<IOutletCreateEditProvided>('outletCreateEdit')!;
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="outletCreateEdit_onSubmit()">
    <OutletCreateEditFormDetail />
    <OutletCreateEditFormLocation />
    <OutletCreateEditFormOperational />

    <section id="button-actions" class="flex items-center justify-between mt-4">
      <section id="left-contents" class="flex items-center gap-4 w-fit">
        <PrimeVueButton
          class="border-blue-primary bg-transparent font-semibold text-base text-blue-primary w-36 basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="outletCreateEdit_onCancel()"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-sm py-[10px] w-36"
          :label="outletCreateEdit_isEditable ? 'Update Store' : 'Create Store'"
          type="submit"
          :loading="outletCreateEdit_isLoading"
        />
      </section>

      <section id="right-contents" class="flex items-center gap-4">
        <PrimeVueButton
          v-if="outletCreateEdit_isEditable"
          class="w-36 border-none bg-transparent basic-smooth-animation hover:bg-grayscale-10"
          severity="secondary"
          @click="outletCreateEdit_onShowDialogDeleteOutlet()"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="delete" class="w-4 h-4" />
              <span class="font-semibold text-base text-error-main">Delete Store</span>
            </section>
          </template>
        </PrimeVueButton>
      </section>
    </section>
  </form>
</template>
