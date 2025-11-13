<script setup lang="ts">
// Interfaces
import type { IWorkingHoursListProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  workingHoursList_columns,
  workingHoursList_getCurrentWeekDateString,
  workingHoursList_getWeekDateRange,
  workingHoursList_listValues,
  workingHoursList_listViewTypes,
  workingHoursList_onChangeSelectedMonth,
  // workingHoursList_onDelete,
  workingHoursList_onNavigateNext,
  workingHoursList_onNavigatePrevious,
  workingHoursList_onOpenDialog,
  workingHoursList_selectedMonth,
  workingHoursList_selectedViewType,
} = inject('workingHoursList') as IWorkingHoursListProvided;

/**
 * @description Convert month string to Date object for DatePicker
 */
const selectedMonthAsDate = computed({
  get: () => {
    if (!workingHoursList_selectedMonth.value) return null;

    // Convert "YYYY-MM" to Date object (first day of the month)
    const [year, month] = workingHoursList_selectedMonth.value.split('-').map(Number);
    return new Date(year, month - 1, 1);
  },
  set: (date: Date | null) => {
    if (!date) return;

    // Convert Date to "YYYY-MM" format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    workingHoursList_onChangeSelectedMonth(`${year}-${month}`);
  },
});

/**
 * @description Handle adding a new shift (opens dialog)
 */
const handleAddShift = (staffId: string, columnValue: string) => {
  let targetDate: string;

  if (workingHoursList_selectedViewType.value === 'Week') {
    // For week view, get the actual date for the specific day of the current week
    const dayOfWeek = parseInt(columnValue.replace('week_day_', ''));
    targetDate = workingHoursList_getCurrentWeekDateString(dayOfWeek);
  } else {
    // For month view, extract day from column value
    if (!workingHoursList_selectedMonth.value) return;
    const [year, month] = workingHoursList_selectedMonth.value.split('-').map(Number);
    const day = parseInt(columnValue.replace('day_', ''));
    const targetDay = String(day).padStart(2, '0');
    const targetMonth = String(month).padStart(2, '0');
    targetDate = `${year}-${targetMonth}-${targetDay}`;
  }

  // Open dialog with pre-filled data using id (UUID) instead of userId
  workingHoursList_onOpenDialog('create', staffId, targetDate);
};

/**
 * @description Handle clicking on absent cell (opens dialog for month view)
 */
const handleAbsentClick = (staffId: string, columnValue: string) => {
  if (workingHoursList_selectedViewType.value === 'Month') {
    handleAddShift(staffId, columnValue);
  }
};
</script>

<template>
  <section id="working-hours-list" class="flex flex-col gap-4 w-full">
    <!-- Data Table -->
    <div class="w-full overflow-x-auto">
      <AppBaseDataTable
        :columns="workingHoursList_columns"
        :data="workingHoursList_listValues"
        header-title="Working Hours"
        is-using-custom-body
        is-using-custom-filter
        is-using-custom-table
        search-placeholder="Search by Employee ID or Name"
      >
        <template #filter>
          <div class="flex items-center gap-4 mt-4">
            <span class="font-semibold text-base text-gray-900"> View </span>

            <PrimeVueSelect
              v-model="workingHoursList_selectedViewType"
              :options="workingHoursList_listViewTypes"
              option-label="label"
              option-value="value"
              class="text-sm w-full min-w-40"
            />

            <!-- Week view: Navigation arrows with date range -->
            <template v-if="workingHoursList_selectedViewType === 'Week'">
              <div class="flex items-center gap-2">
                <div
                  class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white min-w-44 h-10"
                >
                  <PrimeVueButton
                    class="bg-white border-none shadow-xs hover:bg-grayscale-10/50 basic-smooth-animation rounded-lg p-2"
                    @click="workingHoursList_onNavigatePrevious"
                  >
                    <AppBaseSvg name="chevron-left" class="w-3 h-3" />
                  </PrimeVueButton>

                  <svg width="16" height="16" fill="currentColor" class="text-gray-400 flex-shrink-0">
                    <path
                      d="M4 2v2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1h-1V2a1 1 0 10-2 0v2H6V2a1 1 0 10-2 0zM4 7h8v7H4V7z"
                    />
                  </svg>
                  <span class="text-sm text-gray-700 font-medium whitespace-nowrap">
                    {{ workingHoursList_getWeekDateRange }}
                  </span>

                  <PrimeVueButton
                    class="bg-white border-none shadow-xs hover:bg-grayscale-10/50 basic-smooth-animation rounded-lg p-2"
                    @click="workingHoursList_onNavigateNext"
                  >
                    <AppBaseSvg name="chevron-right" class="w-3 h-3" />
                  </PrimeVueButton>
                </div>
              </div>
            </template>

            <!-- Month view: Date picker -->
            <template v-else>
              <PrimeVueDatePicker
                v-model="selectedMonthAsDate"
                view="month"
                date-format="MM/yy"
                placeholder="Select Month"
                show-icon
                class="text-sm w-full min-w-40"
              />
            </template>
          </div>
        </template>

        <template #body="{ column, data }">
          <template v-if="column.value === 'staff'">
            <div class="flex items-center justify-between w-full">
              <span class="font-medium text-sm text-text-primary">
                {{ data[column.value] }}
              </span>

              <PrimeVueButton variant="text" rounded aria-label="detail">
                <template #icon>
                  <AppBaseSvg name="three-dots" class="w-5 h-5" />
                </template>
              </PrimeVueButton>
            </div>
          </template>

          <template v-else-if="workingHoursList_selectedViewType === 'Week'">
            <!-- Week view: Show time slots and Add Shift button -->
            <div
              class="flex flex-col items-center justify-center gap-1 p-2 min-h-[60px]"
              :class="!data[column.value] || data[column.value].trim() === '' ? 'bg-background' : ''"
            >
              <template v-if="data[column.value] && data[column.value].trim() !== ''">
                <!-- Show existing shifts -->
                <div class="text-sm text-text-disabled">
                  {{ data[column.value] }}
                </div>
              </template>

              <template v-else>
                <PrimeVueButton
                  class="border-none basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
                  severity="secondary"
                  variant="outlined"
                  @click="handleAddShift(data.id, column.value)"
                >
                  <template #default>
                    <section id="content" class="flex items-center gap-2">
                      <AppBaseSvg name="plus-line" class="filter-primary-color w-4 h-4" />
                      <span class="font-semibold text-xs text-primary">Add Shift</span>
                    </section>
                  </template>
                </PrimeVueButton>
              </template>
            </div>
          </template>

          <template v-else>
            <!-- Month view: Show Present/Absent indicators -->
            <div class="flex justify-center">
              <span
                v-if="data[column.value] === 'Present'"
                class="w-10 h-10 bg-blue-500 rounded flex items-center justify-center"
              >
                <AppBaseSvg name="check" class="w-6 h-6 text-white" />
              </span>
              <button
                v-else-if="data[column.value] === 'Absent'"
                class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                title="Click to add working hours"
                @click="handleAbsentClick(data.id, column.value)"
              >
                <span class="w-4 h-4 bg-gray-400 rounded-full"></span>
              </button>
              <button
                v-else
                class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                title="Click to add working hours"
                @click="handleAbsentClick(data.id, column.value)"
              >
                <span class="text-xs text-gray-400">-</span>
              </button>
            </div>
          </template>
        </template>
      </AppBaseDataTable>
    </div>
  </section>
</template>
