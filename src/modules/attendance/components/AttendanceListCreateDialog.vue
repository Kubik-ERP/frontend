<script setup lang="ts">
import { computed, inject } from 'vue';
// Interfaces
import type { IAttendanceListProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  attendanceList_formData,
  attendanceList_formMode,
  attendanceList_availableShifts,
  attendanceList_minDate,
  attendanceList_maxDate,
  attendanceList_formValidations,
  attendanceList_onCloseDialog,
  attendanceList_onSave,
  attendanceList_onShiftChange,
  attendanceList_updateAvailableShifts,
} = inject('attendance') as IAttendanceListProvided;

/**
 * @description Staff list for dropdown
 */
const staffList = [
  { label: 'Ahmad Rizki', value: 1 },
  { label: 'Sarah Putri', value: 2 },
  { label: 'Budi Santoso', value: 3 },
  { label: 'Dewi Sari', value: 4 },
  { label: 'Eko Prasetyo', value: 5 },
];

/**
 * @description Convert date string to Date object for PrimeVue Calendar
 */
const calendarDate = computed({
  get: () => {
    if (!attendanceList_formData.date) return null;
    return new Date(attendanceList_formData.date);
  },
  set: (value: Date | null) => {
    if (value) {
      // Convert Date to string format (YYYY-MM-DD)
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      attendanceList_formData.date = `${year}-${month}-${day}`;
    } else {
      attendanceList_formData.date = '';
    }
  },
});

/**
 * @description Convert clock in time string to Date object for PrimeVue DatePicker
 */
const clockInTime = computed({
  get: () => {
    if (!attendanceList_formData.clockIn) return null;
    const [hours, minutes] = attendanceList_formData.clockIn.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date;
  },
  set: (value: Date | null) => {
    if (value) {
      const hours = String(value.getHours()).padStart(2, '0');
      const minutes = String(value.getMinutes()).padStart(2, '0');
      attendanceList_formData.clockIn = `${hours}:${minutes}`;
    } else {
      attendanceList_formData.clockIn = '';
    }
  },
});

/**
 * @description Convert clock out time string to Date object for PrimeVue DatePicker
 */
const clockOutTime = computed({
  get: () => {
    if (!attendanceList_formData.clockOut) return null;
    const [hours, minutes] = attendanceList_formData.clockOut.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date;
  },
  set: (value: Date | null) => {
    if (value) {
      const hours = String(value.getHours()).padStart(2, '0');
      const minutes = String(value.getMinutes()).padStart(2, '0');
      attendanceList_formData.clockOut = `${hours}:${minutes}`;
    } else {
      attendanceList_formData.clockOut = '';
    }
  },
});
</script>

<template>
  <AppBaseDialog id="attendance-list-create-dialog">
    <template #header>
      <header class="flex flex-col gap-2 w-full">
        <h6 class="font-semibold text-black text-lg">
          {{ attendanceList_formMode === 'create' ? 'Add New Attendance' : 'Edit Attendance' }}
        </h6>
      </header>
    </template>

    <template #content>
      <form class="flex flex-col gap-4 w-full">
        <!-- Date Field -->
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="date"
          name="Date"
          spacing-bottom="mb-0"
          :validators="attendanceList_formValidations.date"
        >
          <PrimeVueCalendar
            v-model="calendarDate"
            :min-date="new Date(attendanceList_minDate)"
            :max-date="new Date(attendanceList_maxDate)"
            date-format="dd/mm/yy"
            placeholder="Select date"
            show-icon
            input-id="date"
            class="text-sm w-full"
            :class="{ ...classes }"
            @date-select="attendanceList_updateAvailableShifts"
          />
        </AppBaseFormGroup>

        <!-- Staff Selection -->
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="staffId"
          name="Staff Member"
          spacing-bottom="mb-0"
          :validators="attendanceList_formValidations.staffId"
        >
          <PrimeVueSelect
            v-model="attendanceList_formData.staffId"
            :options="staffList"
            option-label="label"
            option-value="value"
            placeholder="Select staff member"
            input-id="staffId"
            class="text-sm w-full"
            :class="{ ...classes }"
            @change="attendanceList_updateAvailableShifts"
          >
            <template #option="{ option }">
              <div class="flex items-center gap-3">
                <AppBaseSvg name="user" class="!w-4 !h-4 text-gray-500" />
                <span class="font-normal text-sm text-text-primary">{{ option.label }}</span>
              </div>
            </template>

            <template #value="{ value }">
              <div class="flex items-center gap-3">
                <AppBaseSvg name="user" class="!w-4 !h-4 text-gray-500" />
                <span class="font-normal text-sm text-text-primary">
                  {{ staffList.find(staff => staff.value === value)?.label }}
                </span>
              </div>
            </template>
          </PrimeVueSelect>
        </AppBaseFormGroup>

        <!-- Shift Selection -->
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="shift"
          name="Shift"
          spacing-bottom="mb-0"
          :validators="attendanceList_formValidations.shift"
        >
          <PrimeVueSelect
            v-model="attendanceList_formData.shift"
            :options="attendanceList_availableShifts"
            option-label="label"
            option-value="value"
            placeholder="Select shift"
            input-id="shift"
            class="text-sm w-full"
            :class="{ ...classes }"
            :disabled="!attendanceList_formData.staffId || !attendanceList_formData.date"
            @change="attendanceList_onShiftChange"
          >
            <template #option="{ option }">
              <div class="flex items-center gap-3">
                <AppBaseSvg name="clock" class="!w-4 !h-4 text-blue-500" />
                <span class="font-normal text-sm text-text-primary">{{ option.label }}</span>
              </div>
            </template>

            <template #value="{ value }">
              <div class="flex items-center gap-3">
                <AppBaseSvg name="clock" class="!w-4 !h-4 text-blue-500" />
                <span class="font-normal text-sm text-text-primary">{{ value }}</span>
              </div>
            </template>
          </PrimeVueSelect>
        </AppBaseFormGroup>

        <!-- Shift Time Display -->
        <div
          v-if="attendanceList_formData.shiftStart && attendanceList_formData.shiftEnd"
          class="grid grid-cols-2 gap-4"
        >
          <AppBaseFormGroup
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="shiftStart"
            name="Shift Start"
            spacing-bottom="mb-0"
          >
            <PrimeVueInputText
              v-model="attendanceList_formData.shiftStart"
              placeholder="Shift start time"
              input-id="shiftStart"
              class="text-sm w-full"
              readonly
            />
          </AppBaseFormGroup>

          <AppBaseFormGroup
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="shiftEnd"
            name="Shift End"
            spacing-bottom="mb-0"
          >
            <PrimeVueInputText
              v-model="attendanceList_formData.shiftEnd"
              placeholder="Shift end time"
              input-id="shiftEnd"
              class="text-sm w-full"
              readonly
            />
          </AppBaseFormGroup>
        </div>

        <!-- Clock In/Out Times -->
        <div class="grid grid-cols-2 gap-4">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="clockIn"
            name="Clock In"
            spacing-bottom="mb-0"
            :validators="attendanceList_formValidations.clockIn"
          >
            <PrimeVueInputGroup>
              <PrimeVueDatePicker
                id="datepicker-clock-in"
                v-model="clockInTime"
                class="text-sm w-full"
                :class="{ ...classes }"
                fluid
                time-only
                placeholder="Select clock in time"
              />
              <PrimeVueInputGroupAddon>
                <AppBaseSvg name="clock" class="!w-5 !h-6" />
              </PrimeVueInputGroupAddon>
            </PrimeVueInputGroup>
          </AppBaseFormGroup>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="clockOut"
            name="Clock Out"
            spacing-bottom="mb-0"
            :validators="attendanceList_formValidations.clockOut"
          >
            <PrimeVueInputGroup>
              <PrimeVueDatePicker
                id="datepicker-clock-out"
                v-model="clockOutTime"
                class="text-sm w-full"
                :class="{ ...classes }"
                fluid
                time-only
                placeholder="Select clock out time"
              />
              <PrimeVueInputGroupAddon>
                <AppBaseSvg name="clock" class="!w-5 !h-6" />
              </PrimeVueInputGroupAddon>
            </PrimeVueInputGroup>
          </AppBaseFormGroup>
        </div>

        <!-- Notes -->
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="notes"
          name="Notes"
          spacing-bottom="mb-0"
          :validators="attendanceList_formValidations.notes"
        >
          <PrimeVueIconField>
            <PrimeVueTextarea
              v-model="attendanceList_formData.notes"
              placeholder="Add notes (optional)"
              input-id="notes"
              class="text-sm w-full"
              rows="3"
              :class="{ ...classes }"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </form>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="attendanceList_onCloseDialog"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40"
          :label="attendanceList_formMode === 'create' ? 'Save' : 'Update'"
          type="button"
          :disabled="attendanceList_formValidations.$invalid"
          @click="attendanceList_onSave"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
