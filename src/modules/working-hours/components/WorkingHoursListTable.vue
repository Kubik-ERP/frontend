<script setup lang="ts">
// Interfaces
import type { IWorkingHoursListProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  workingHoursList_computedColumns,
  workingHoursList_getWeekDateRange,
  workingHoursList_listValues,
  workingHoursList_listViewTypes,
  workingHoursList_selectedViewType,
  workingHoursList_selectedMonth,
  workingHoursList_onChangeSelectedMonth,
  workingHoursList_onNavigateNext,
  workingHoursList_onNavigatePrevious,
  workingHoursList_onOpenDialog,
} = inject('workingHoursList') as IWorkingHoursListProvided;

/**
 * @description Format column label to add superscript for ordinal suffixes
 */
const formatColumnLabelWithSuperscript = (label: string): string => {
  // Match patterns like "Mon (2nd)", "Tue (3rd)", etc.
  return label.replace(/(\d+)(st|nd|rd|th)/, '$1<sup>$2</sup>');
};

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
const handleAddShift = (staffId: number, columnValue: string) => {
  if (!workingHoursList_selectedMonth.value) return;

  const [year, month] = workingHoursList_selectedMonth.value.split('-').map(Number);
  let targetDate: string;

  if (workingHoursList_selectedViewType.value === 'Week') {
    // For week view, calculate the actual date based on the column
    const dayOfWeek = parseInt(columnValue.replace('week_day_', ''));
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Go back to Sunday

    const actualDate = new Date(startDate);
    actualDate.setDate(startDate.getDate() + dayOfWeek);

    // Format to YYYY-MM-DD
    const targetYear = actualDate.getFullYear();
    const targetMonth = String(actualDate.getMonth() + 1).padStart(2, '0');
    const targetDay = String(actualDate.getDate()).padStart(2, '0');
    targetDate = `${targetYear}-${targetMonth}-${targetDay}`;
  } else {
    // For month view, extract day from column value
    const day = parseInt(columnValue.replace('day_', ''));
    const targetDay = String(day).padStart(2, '0');
    const targetMonth = String(month).padStart(2, '0');
    targetDate = `${year}-${targetMonth}-${targetDay}`;
  }

  // Open dialog with pre-filled data
  workingHoursList_onOpenDialog('create', staffId, targetDate);
};

/**
 * @description Handle clicking on absent cell (opens dialog for month view)
 */
const handleAbsentClick = (staffId: number, columnValue: string) => {
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
        :columns="workingHoursList_computedColumns"
        :data="workingHoursList_listValues"
        header-title="Working Hours"
        is-using-custom-body
        is-using-custom-column-headers
        is-using-custom-filter
        is-using-search-on-header
        search-placeholder="Search by Employee ID or Name"
      >
        <template #filter>
          <div class="flex items-center gap-4">
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
                <button
                  type="button"
                  class="p-2 rounded hover:bg-gray-100 transition-colors"
                  @click="workingHoursList_onNavigatePrevious"
                >
                  <svg width="16" height="16" fill="currentColor" class="text-gray-600">
                    <path d="M10 3l-5 5 5 5 1.4-1.4L7.8 8l3.6-3.6L10 3z" />
                  </svg>
                </button>

                <span class="text-sm font-medium text-gray-700 min-w-0 px-2">
                  {{ workingHoursList_getWeekDateRange }}
                </span>

                <button
                  type="button"
                  class="p-2 rounded hover:bg-gray-100 transition-colors"
                  @click="workingHoursList_onNavigateNext"
                >
                  <svg width="16" height="16" fill="currentColor" class="text-gray-600">
                    <path d="M6 3L4.6 4.4 8.2 8l-3.6 3.6L6 13l5-5-5-5z" />
                  </svg>
                </button>
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

        <template #columnHeader="{ column }">
          <template v-if="column.value === 'staff'">
            <span class="text-sm font-normal text-grayscale-70">{{ column.label }}</span>
          </template>
          <template v-else-if="workingHoursList_selectedViewType === 'Week'">
            <!-- Week view: Show day name and date on separate lines -->
            <div class="text-center">
              <div class="text-sm font-medium text-grayscale-70">
                {{ column.label.split('|')[0] }}
              </div>
              <div class="text-xs text-grayscale-60 mt-1">
                {{ column.label.split('|')[1] }}
              </div>
            </div>
          </template>
          <template v-else>
            <!-- Month view: Show day with superscript -->
            <span
              class="text-sm font-normal text-grayscale-70"
              v-html="formatColumnLabelWithSuperscript(column.label)"
            ></span>
          </template>
        </template>

        <template #body="{ column, data }">
          <template v-if="column.value === 'staff'">
            <div class="flex items-center justify-between w-full">
              <span class="font-medium text-sm text-text-primary">
                {{ data[column.value] }}
              </span>

              <PrimeVueButton variant="text" rounded aria-label="detail">
                <template #icon>
                  <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
                </template>
              </PrimeVueButton>
            </div>
          </template>

          <template v-else-if="workingHoursList_selectedViewType === 'Week'">
            <!-- Week view: Show time slots and Add Shift button -->
            <div class="flex flex-col gap-1 p-2">
              <template v-if="data[column.value]">
                <!-- Show existing shifts -->
                <div class="text-xs text-gray-600 whitespace-pre-line">
                  {{ data[column.value] }}
                </div>
              </template>

              <!-- Add Shift button -->
              <button
                class="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                @click="handleAddShift(data.id, column.value)"
              >
                <span class="text-lg leading-none">+</span>
                <span>Add Shift</span>
              </button>
            </div>
          </template>

          <template v-else>
            <!-- Month view: Show Present/Absent indicators -->
            <div class="flex justify-center">
              <span
                v-if="data[column.value] === 'Present'"
                class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center"
              >
                <AppBaseSvg name="check" class="w-4 h-4 text-white" />
              </span>
              <button
                v-else-if="data[column.value] === 'Absent'"
                class="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                title="Click to add working hours"
                @click="handleAbsentClick(data.id, column.value)"
              >
                <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
              </button>
              <button
                v-else
                class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                title="Click to add working hours"
                @click="handleAbsentClick(1, column.value)"
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
