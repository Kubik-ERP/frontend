<script setup lang="ts">
// Interfaces
import type { IWorkingHoursListProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  workingHoursList_calendarDate,
  workingHoursList_createEditFormMode,
  workingHoursList_createEditMaxDate,
  workingHoursList_createEditMinDate,
  workingHoursList_createEditRepeatOptions,
  workingHoursList_createEditStaffList,
  workingHoursList_customRecurrenceEndDate,
  workingHoursList_customRecurrenceFrequencyOptions,
  workingHoursList_formData,
  workingHoursList_formValidations,
  workingHoursList_formattedDate,
  workingHoursList_hasValidHeaderData,
  workingHoursList_onAddTimeSlot,
  workingHoursList_onCloseDialog,
  workingHoursList_onRemoveTimeSlot,
  workingHoursList_onSave,
  workingHoursList_selectedStaffName,
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
              :editable="false"
              show-clear
              class="text-sm w-full h-9"
              :class="{ ...classes }"
              v-on="useListenerForm(workingHoursList_formValidations, 'staffId')"
            >
              <template #option="{ option }">
                <div class="flex items-center gap-2">
                  <span>{{ option.label }}</span>
                  <span class="text-xs text-gray-400">({{ option.value }})</span>
                </div>
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
              class="[&>input]:!text-sm text-text-disabled [&>input]:placeholder:!text-sm placeholder:text-text-disabled w-full max-w-full"
              :class="{ ...classes }"
              :pt="{
                pcInputText: '!text-sm',
                dayCell: '!text-sm',
                title: '!text-sm',
                tableHeaderCell: '!text-sm',
              }"
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
                  <AppBaseSvg name="plus-line" class="filter-primary-color w-4 h-4" />
                  <span class="font-medium text-sm text-primary">Add another shift</span>
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
                  is-required
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
                      class="[&>input]:!text-sm text-text-disabled [&>input]:placeholder:!text-sm placeholder:text-text-disabled w-full max-w-full"
                      :class="{ ...classes }"
                      fluid
                      time-only
                      placeholder="Select start time"
                      :pt="{
                        pcInputText: '!text-sm',
                        dayCell: '!text-sm',
                        title: '!text-sm',
                        tableHeaderCell: '!text-sm',
                      }"
                      v-on="useListenerFormEach(workingHoursList_formValidations.timeSlots, index, 'openTime')"
                    />

                    <PrimeVueInputGroupAddon>
                      <AppBaseSvg name="clock" class="!w-5 !h-6" />
                    </PrimeVueInputGroupAddon>
                  </PrimeVueInputGroup>
                </AppBaseFormGroup>

                <!-- End Shift -->
                <div class="flex items-end gap-2 w-full">
                  <AppBaseFormGroup
                    v-slot="{ classes }"
                    class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
                    class="w-full"
                    is-name-as-label
                    is-required
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
                        class="[&>input]:!text-sm text-text-disabled [&>input]:placeholder:!text-sm placeholder:text-text-disabled w-full max-w-full"
                        :class="{ ...classes }"
                        fluid
                        time-only
                        placeholder="Select end time"
                        :pt="{
                          pcInputText: '!text-sm',
                          dayCell: '!text-sm',
                          title: '!text-sm',
                          tableHeaderCell: '!text-sm',
                        }"
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

        <!-- Custom Recurrence Section -->
        <div
          v-if="workingHoursList_formData.repeatType === 'custom'"
          class="flex flex-col gap-4 p-4 border border-solid border-gray-200 rounded-lg"
        >
          <h6 class="font-semibold text-base text-black">Custom Recurrence</h6>

          <!-- Repeat Every -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="customInterval"
              name="Repeat every"
              spacing-bottom="mb-0"
              :validators="workingHoursList_formValidations.customRecurrence?.interval"
            >
              <PrimeVueInputNumber
                v-model="workingHoursList_formData.customRecurrence.interval"
                input-id="customInterval"
                :min="1"
                :max="100"
                class="text-sm w-full"
                :class="{ ...classes }"
                @input="workingHoursList_formValidations.customRecurrence?.interval?.$touch"
                @blur="workingHoursList_formValidations.customRecurrence?.interval?.$touch"
              />
            </AppBaseFormGroup>

            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="customFrequency"
              name="Frequency"
              spacing-bottom="mb-0"
              :validators="workingHoursList_formValidations.customRecurrence?.frequency"
            >
              <PrimeVueSelect
                v-model="workingHoursList_formData.customRecurrence.frequency"
                :options="workingHoursList_customRecurrenceFrequencyOptions"
                option-label="label"
                option-value="value"
                placeholder="Select frequency"
                input-id="customFrequency"
                class="text-sm w-full"
                :class="{ ...classes }"
                @change="workingHoursList_formValidations.customRecurrence?.frequency?.$touch"
                @blur="workingHoursList_formValidations.customRecurrence?.frequency?.$touch"
              />
            </AppBaseFormGroup>
          </div>

          <!-- Ends -->
          <div class="flex flex-col gap-4">
            <span class="text-sm font-medium text-gray-900">Ends</span>

            <div class="flex flex-col gap-3">
              <!-- Never -->
              <div class="flex items-center gap-2">
                <PrimeVueRadioButton
                  v-model="workingHoursList_formData.customRecurrence.endType"
                  value="never"
                  input-id="endNever"
                />
                <label for="endNever" class="text-sm font-medium text-gray-700">Never</label>
              </div>

              <!-- On Date -->
              <div class="flex items-center gap-2">
                <PrimeVueRadioButton
                  v-model="workingHoursList_formData.customRecurrence.endType"
                  value="on"
                  input-id="endOn"
                />
                <label for="endOn" class="text-sm font-medium text-gray-700">On</label>
                <PrimeVueCalendar
                  v-if="workingHoursList_formData.customRecurrence.endType === 'on'"
                  v-model="workingHoursList_customRecurrenceEndDate"
                  date-format="dd/mm/yy"
                  placeholder="Select end date"
                  show-icon
                  class="text-sm"
                  :class="workingHoursList_formValidations.customRecurrence?.endDate?.$error ? 'p-invalid' : ''"
                />
              </div>

              <!-- After Occurrences -->
              <div class="flex items-center gap-2">
                <PrimeVueRadioButton
                  v-model="workingHoursList_formData.customRecurrence.endType"
                  value="after"
                  input-id="endAfter"
                />
                <label for="endAfter" class="text-sm font-medium text-gray-700">After</label>
                <PrimeVueInputNumber
                  v-if="workingHoursList_formData.customRecurrence.endType === 'after'"
                  v-model="workingHoursList_formData.customRecurrence.occurrences"
                  :min="1"
                  :max="1000"
                  placeholder="Number"
                  class="text-sm w-20"
                  :class="
                    workingHoursList_formValidations.customRecurrence?.occurrences?.$error ? 'p-invalid' : ''
                  "
                />
                <span
                  v-if="workingHoursList_formData.customRecurrence.endType === 'after'"
                  class="text-sm text-gray-700"
                  >occurrences</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <section id="notes" class="flex flex-col gap-1">
          <span class="font-medium text-sm text-gray-900"> Notes </span>

          <PrimeVueTextarea
            v-model="workingHoursList_formData.notes"
            input-id="notes"
            placeholder="Add any additional notes..."
            rows="3"
            class="text-sm w-full"
          />
        </section>
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
          class="bg-primary border-none text-base py-[10px] w-full max-w-40"
          label="Save"
          type="button"
          :disabled="workingHoursList_formValidations.$invalid"
          @click="workingHoursList_onSave"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
