<script setup lang="ts">
// Interfaces
import type { IAccountStoreDetailProvided } from '../../../interfaces';

const {
  accountDetail_AssignedStaff_formData,
  accountDetail_AssignedStaff_formValidations,
  accountStoreDetail_onCloseAddStaff,
  accountDetail_AssignedStaff_onSubmit,
  accountDetail_listAssignedStaff,
  // accountDetail_listAvailableStaff,
} = inject<IAccountStoreDetailProvided>('accountStoreDetail')!;
</script>

<template>
  <AppBaseDialog id="assigned-staff-dialog">
    <!-- HEADER -->
    <template #header>
      <h5 class="font-semibold text-black text-lg">{{ useLocalization('account.assign-staff') }}</h5>
    </template>

    <!-- CONTENT -->
    <template #content>
      <section id="form-groups" class="grid-wrapper gap-4">
        <!-- SELECT STAFF -->
        <div class="flex flex-col gap-2">
          <label for="staff" class="font-medium text-sm text-text-primary">
            {{ useLocalization('account.staff') }} <span class="text-red-500">*</span>
          </label>
          <PrimeVueDropdown
            id="staff"
            v-model="accountDetail_AssignedStaff_formData.employeeId"
            :options="accountDetail_listAssignedStaff"
            option-label="name"
            option-value="id"
            :placeholder="useLocalization('account.select-staff')"
            class="w-full"
            :class="{ 'p-invalid': accountDetail_AssignedStaff_formValidations.staffId?.$invalid }"
          />
        </div>

        <!-- PREVIEW STAFF INFO -->
        <div class="flex flex-col gap-2">
          <p class="text-sm">
            <span class="font-semibold">{{ useLocalization('account.staff-name') }} :</span>
            {{
              accountDetail_listAssignedStaff.find(s => s.id === accountDetail_AssignedStaff_formData.employeeId)
                ?.name ?? '-'
            }}
          </p>
          <p class="text-sm">
            <span class="font-semibold">{{ useLocalization('account.staff-title') }} :</span>
            {{
              accountDetail_listAssignedStaff.find(s => s.id === accountDetail_AssignedStaff_formData.employeeId)
                ?.title ?? '-'
            }}
          </p>
        </div>
      </section>
    </template>

    <!-- FOOTER -->
    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          :label="useLocalization('account.buttons.cancel')"
          severity="secondary"
          variant="outlined"
          @click="accountStoreDetail_onCloseAddStaff"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40"
          :label="useLocalization('account.assign-staff')"
          type="button"
          :disabled="accountDetail_AssignedStaff_formValidations.$invalid"
          @click="accountDetail_AssignedStaff_onSubmit"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
