<script setup lang="ts">
// Interfaces
import type { IStaffMemberCreateEditProvided } from '../interfaces';

const { staffMemberCreateEdit_isEditable, staffMemberCreateEdit_isLoading,staffMemberCreateEdit_onCancel, staffMemberCreateEdit_onSubmit } =
  inject<IStaffMemberCreateEditProvided>('staffMemberCreateEdit')!;
</script>

<template>
  <section id="button-actions" class="flex items-center mt-4 gap-4">
    <PrimeVueButton
      class="border-blue-primary bg-transparent font-semibold text-sm text-blue-primary w-36 basic-smooth-animation hover:bg-grayscale-10"
      label="Cancel"
      severity="secondary"
      variant="outlined"
      @click="staffMemberCreateEdit_onCancel"
    />

    <PrimeVueButton
      class="bg-blue-primary border-none text-sm py-[10px] px-4 w-fit"
      :label="staffMemberCreateEdit_isEditable ? 'Save' : 'Add Staff Member'"
      type="submit"
      :loading="staffMemberCreateEdit_isLoading"
      @click="staffMemberCreateEdit_onSubmit"
    />
  </section>
</template>
