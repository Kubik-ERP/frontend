<script setup lang="ts">
// Interfaces
import type { IAttendanceListProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  attendanceList_calendarDate,
  attendanceList_clockInTime,
  attendanceList_clockOutTime,
  attendanceList_currentShift,
  attendanceList_formData,
  attendanceList_formMode,
  attendanceList_formValidations,
  attendanceList_formattedShiftEnd,
  attendanceList_formattedShiftStart,
  attendanceList_availableShifts,
  attendanceList_isLoadingShifts,
  attendanceList_maxDate,
  attendanceList_minDate,
  attendanceList_onCloseDialog,
  attendanceList_onSave,
  attendanceList_onShiftChange,
  attendanceList_selectedShiftValue,
  attendanceList_staffList,
  attendanceList_updateAvailableShifts,
} = inject('attendance') as IAttendanceListProvided;
</script>

<template>
  <AppBaseDialog id="attendance-list-create-edit-dialog">
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
            v-model="attendanceList_calendarDate"
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
            :options="attendanceList_staffList"
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
                  {{ attendanceList_staffList.find(staff => staff.value === value)?.label }}
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
        >
          <PrimeVueSelect
            v-model="attendanceList_selectedShiftValue"
            :options="attendanceList_availableShifts"
            option-label="label"
            option-value="value"
            placeholder="Select shift"
            input-id="shift"
            class="text-sm w-full"
            :class="{ ...classes }"
            :disabled="!attendanceList_formData.staffId || !attendanceList_formData.date || attendanceList_isLoadingShifts"
            :loading="attendanceList_isLoadingShifts"
            @change="(event: any) => attendanceList_onShiftChange(event.value)"
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
          v-if="attendanceList_currentShift?.shiftStart && attendanceList_currentShift?.shiftEnd"
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
              :model-value="attendanceList_formattedShiftStart"
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
              :model-value="attendanceList_formattedShiftEnd"
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
          >
            <PrimeVueInputGroup>
              <PrimeVueDatePicker
                id="datepicker-clock-in"
                v-model="attendanceList_clockInTime"
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
          >
            <PrimeVueInputGroup>
              <PrimeVueDatePicker
                id="datepicker-clock-out"
                v-model="attendanceList_clockOutTime"
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
        >
          <PrimeVueTextarea
            v-if="attendanceList_currentShift"
            v-model="attendanceList_currentShift.notes"
            placeholder="Add notes (optional)"
            input-id="notes"
            class="text-sm w-full"
            rows="3"
            :class="{ ...classes }"
          />
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
          class="bg-primary border-none text-base py-[10px] w-full max-w-40"
          :label="attendanceList_formMode === 'create' ? 'Save' : 'Update'"
          type="button"
          :disabled="attendanceList_formValidations.$invalid"
          @click="attendanceList_onSave"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
