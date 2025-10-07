<script setup lang="ts">
// Interfaces
import type { IStaffMemberCreateEditProvided } from '../interfaces';

const {
  staffMemberCreateEdit_isEditable,
  staffMemberCreateEdit_isLoading,
  staffMemberCreateEdit_onCancel,
  staffMemberCreateEdit_onSubmit,
  staffMemberCreateEdit_onDelete,
} = inject<IStaffMemberCreateEditProvided>('staffMemberCreateEdit')!;
</script>

<template>
  <section class="flex items-center justify-between mt-4">
    <div id="button-actions" class="flex items-center gap-4">
      <PrimeVueButton
        class="border-primary bg-transparent font-semibold text-sm text-primary w-36 basic-smooth-animation hover:bg-grayscale-10"
        label="Cancel"
        severity="secondary"
        variant="outlined"
        @click="staffMemberCreateEdit_onCancel"
      />

      <PrimeVueButton
        class="bg-primary border-none text-sm py-[10px] px-4 w-fit"
        :label="staffMemberCreateEdit_isEditable ? 'Save' : 'Add Staff Member'"
        type="submit"
        :loading="staffMemberCreateEdit_isLoading"
        @click="staffMemberCreateEdit_onSubmit"
      />

    </div>
    <PrimeVueButton
      v-if="staffMemberCreateEdit_isEditable"
      label="Delete Staff Member"
      class="py-2 border-2 border-none cursor-pointer  text-red-500 bg-transparent font-semibold"
      @click="staffMemberCreateEdit_onDelete"
    >
      <template #icon>
        <AppBaseSvg name="trash" class="!w-5 !h-5" />
      </template>
    </PrimeVueButton>
  </section>
</template>
