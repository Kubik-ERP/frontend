<script setup lang="ts">
// Interfaces
import type { IWorkingHoursListProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  workingHoursList_formData,
  workingHoursList_formValidations,
  workingHoursList_createEditFormMode,
  workingHoursList_createEditMinDate,
  workingHoursList_createEditMaxDate,
  workingHoursList_createEditStaffList,
  workingHoursList_createEditRepeatOptions,
  workingHoursList_onAddTimeSlot,
  workingHoursList_onRemoveTimeSlot,
  workingHoursList_onCloseDialog,
  workingHoursList_onSave,
  // Computed properties from service
  workingHoursList_calendarDate,
  workingHoursList_formattedDate,
  workingHoursList_selectedStaffName,
  workingHoursList_hasValidHeaderData,
} = inject('workingHoursList') as IWorkingHoursListProvided;
</script>

<template>
  <AppBaseDialog id="working-hours-create-edit-dialog">
    <template #header>
      <header class="flex flex-col gap-2 w-full">
        <h6 class="font-semibold text-black text-lg">
          {{ workingHoursList_createEditFormMode === 'create' ? 'Working Hour - Add New' : 'Working Hour - Edit' }}
          <template v-if="workingHoursList_hasValidHeaderData">
            {{ workingHoursList_selectedStaffName.split(' ')[0] }}
            {{ workingHoursList_selectedStaffName.split(' ')[1] }}
          </template>
        </h6>

        <template v-if="workingHoursList_hasValidHeaderData">
          <div class="flex flex-col gap-1">
            <span class="text-sm font-medium text-gray-600">Day</span>
            <span class="text-base font-medium text-gray-900">{{ workingHoursList_formattedDate }}</span>
          </div>
        </template>
      </header>
    </template>

    <template #content>
      <form class="flex flex-col gap-6 w-full">
        <!-- Staff and Date Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Staff Selection -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="staffId"
            name="Staff Member"
            spacing-bottom="mb-0"
            :validators="workingHoursList_formValidations.staffId"
          >
            <PrimeVueSelect
              v-model="workingHoursList_formData.staffId"
              :options="workingHoursList_createEditStaffList"
              option-label="label"
              option-value="value"
              placeholder="Select staff member"
              input-id="staffId"
              class="text-sm w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(workingHoursList_formValidations, 'staffId')"
            >
              <template #option="{ option }">
                <span>{{ option.label }}</span>
              </template>

              <template #value="{ value }">
                <span v-if="value">
                  {{ workingHoursList_createEditStaffList.find(s => s.value === value)?.label }}
                </span>
                <span v-else class="text-gray-400">Select staff member</span>
              </template>
            </PrimeVueSelect>
          </AppBaseFormGroup>

          <!-- Date Field -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="date"
            name="Date"
            spacing-bottom="mb-0"
            :validators="workingHoursList_formValidations.date"
          >
            <PrimeVueCalendar
              v-model="workingHoursList_calendarDate"
              :min-date="new Date(workingHoursList_createEditMinDate)"
              :max-date="new Date(workingHoursList_createEditMaxDate)"
              date-format="dd/mm/yy"
              placeholder="Select date"
              show-icon
              input-id="date"
              class="text-sm w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(workingHoursList_formValidations, 'date')"
            />
          </AppBaseFormGroup>
        </div>

        <!-- Working Shift Section -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <h6 class="font-semibold text-base text-black">Working Shift</h6>

            <PrimeVueButton
              class="border border-solid border-primary basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
              severity="secondary"
              variant="outlined"
              @click="workingHoursList_onAddTimeSlot"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2">
                  <AppBaseSvg name="plus-line" />
                  <span class="font-medium text-sm">Add another shift</span>
                </section>
              </template>
            </PrimeVueButton>
          </div>

          <!-- Time Slots -->
          <div class="flex flex-col gap-4">
            <template v-for="(timeSlot, index) in workingHoursList_formData.timeSlots" :key="`time-slot-${index}`">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-solid border-gray-200 rounded-lg"
              >
                <!-- Start Shift -->
                <AppBaseFormGroup
                  v-slot="{ classes }"
                  class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
                  is-name-as-label
                  :label-for="`start-shift-${index}`"
                  name="Start Shift"
                  spacing-bottom="mb-0"
                  :validators="
                    useFormValidateEach({
                      validation: workingHoursList_formValidations.timeSlots,
                      fieldIndex: index,
                      field: 'openTime',
                    })
                  "
                >
                  <PrimeVueInputGroup>
                    <PrimeVueDatePicker
                      :id="`start-shift-${index}`"
                      v-model="timeSlot.openTime"
                      class="w-full"
                      :class="{ ...classes }"
                      fluid
                      time-only
                      placeholder="Select start time"
                    />

                    <PrimeVueInputGroupAddon>
                      <AppBaseSvg name="clock" class="!w-5 !h-6" />
                    </PrimeVueInputGroupAddon>
                  </PrimeVueInputGroup>
                </AppBaseFormGroup>

                <!-- End Shift -->
                <div class="flex items-end gap-2">
                  <AppBaseFormGroup
                    v-slot="{ classes }"
                    class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
                    is-name-as-label
                    :label-for="`end-shift-${index}`"
                    name="End Shift"
                    spacing-bottom="mb-0"
                    :validators="
                      useFormValidateEach({
                        validation: workingHoursList_formValidations.timeSlots,
                        fieldIndex: index,
                        field: 'closeTime',
                      })
                    "
                  >
                    <PrimeVueInputGroup>
                      <PrimeVueDatePicker
                        :id="`end-shift-${index}`"
                        v-model="timeSlot.closeTime"
                        class="w-full"
                        :class="{ ...classes }"
                        fluid
                        time-only
                        placeholder="Select end time"
                      />

                      <PrimeVueInputGroupAddon>
                        <AppBaseSvg name="clock" class="!w-5 !h-6" />
                      </PrimeVueInputGroupAddon>
                    </PrimeVueInputGroup>
                  </AppBaseFormGroup>

                  <!-- Remove Time Slot Button -->
                  <PrimeVueButton
                    v-if="workingHoursList_formData.timeSlots.length > 1"
                    class="border border-solid border-red-500 text-red-500 hover:bg-red-50 w-fit px-3 py-2 rounded-lg"
                    severity="danger"
                    variant="outlined"
                    @click="workingHoursList_onRemoveTimeSlot(index)"
                  >
                    <template #default>
                      <AppBaseSvg name="trash" class="!w-5 !h-5" />
                    </template>
                  </PrimeVueButton>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Repeat Options -->
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="repeatType"
          name="Repeat"
          spacing-bottom="mb-0"
          :validators="workingHoursList_formValidations.repeatType"
        >
          <PrimeVueSelect
            v-model="workingHoursList_formData.repeatType"
            :options="workingHoursList_createEditRepeatOptions"
            option-label="label"
            option-value="value"
            placeholder="Select repeat option"
            input-id="repeatType"
            class="text-sm w-full"
            :class="{ ...classes }"
            v-on="useListenerForm(workingHoursList_formValidations, 'repeatType')"
          />
        </AppBaseFormGroup>

        <!-- Notes -->
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="notes"
          name="Notes"
          spacing-bottom="mb-0"
          :validators="workingHoursList_formValidations.notes"
        >
          <PrimeVueTextarea
            v-model="workingHoursList_formData.notes"
            input-id="notes"
            placeholder="Add any additional notes..."
            rows="3"
            class="text-sm w-full"
            :class="{ ...classes }"
            v-on="useListenerForm(workingHoursList_formValidations, 'notes')"
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
          @click="workingHoursList_onCloseDialog"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40"
          label="Save"
          type="button"
          :disabled="workingHoursList_formValidations.$invalid"
          @click="workingHoursList_onSave"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
