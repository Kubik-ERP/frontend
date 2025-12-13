<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  type: {
    type: [String, null],
    required: false,
    default: 'time',
  },
  shouldUpdateType: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:startDate', 'update:endDate', 'update:type', 'update:dateTimeType']);

const dialogVisible = ref<boolean>(false);

const gmt = 0;

// 1. Use a single ref for the date range array
const localDateRange = ref<[Date, Date] | null>([props.startDate, props.endDate]);
const type = ref<string | null>(props.type);

// 2. Define the shortcuts with stable Keys and Translation paths
const shortcuts = [
  { key: 'today', labelKey: 'components.date_picker.shortcuts.today' },
  { key: 'yesterday', labelKey: 'components.date_picker.shortcuts.yesterday' },
  { key: 'this_week', labelKey: 'components.date_picker.shortcuts.this_week' },
  { key: 'this_month', labelKey: 'components.date_picker.shortcuts.this_month' },
  { key: 'last_week', labelKey: 'components.date_picker.shortcuts.last_week' },
  { key: 'last_30_days', labelKey: 'components.date_picker.shortcuts.last_30_days' },
  { key: 'last_month', labelKey: 'components.date_picker.shortcuts.last_month' },
  { key: 'last_7_days', labelKey: 'components.date_picker.shortcuts.last_7_days' },
  { key: 'this_year', labelKey: 'components.date_picker.shortcuts.this_year' },
  { key: 'last_year', labelKey: 'components.date_picker.shortcuts.last_year' },
];

// The "Apply" button now emits the changes from the range array
const applyDateChange = () => {
  if (localDateRange.value && localDateRange.value[0]) {
    // Create a new Date object for 'start' to work with
    const start = new Date(localDateRange.value[0].getTime() + gmt * 60 * 60 * 1000);

    const end = localDateRange.value[1]
      ? new Date(localDateRange.value[1].getTime() + gmt * 60 * 60 * 1000)
      : start; // This creates a copy, not a reference

    const startDateWithZeroTime = new Date(start.getTime());
    startDateWithZeroTime.setHours(0, 0, 0, 0);
    emit('update:startDate', startDateWithZeroTime);
    const endDateWith2359Time = new Date(end.getTime());
    endDateWith2359Time.setHours(23, 59, 59, 999);
    emit('update:endDate', endDateWith2359Time);

    type.value = 'custom';

    emit('update:dateTimeType', type.value);
    if (props.shouldUpdateType) {
      emit('update:type', type.value);
    }
  }
  dialogVisible.value = false;
};

const cancelDateChange = () => {
  localDateRange.value = [props.startDate, props.endDate];
  dialogVisible.value = false;
};

const onClickShortcut = (key: string) => {
  let today = new Date(Date.now() + gmt * 60 * 60 * 1000);
  let start = new Date(Date.now() + gmt * 60 * 60 * 1000);
  let end = new Date(Date.now() + gmt * 60 * 60 * 1000);
  let newType = '';

  switch (key) {
    case 'today': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);
      start = today;
      end = today;
      newType = 'time';
      break;
    }

    case 'yesterday': {
      const yesterday = new Date(Date.now() - (24 - gmt) * 60 * 60 * 1000);
      start = yesterday;
      end = yesterday;
      newType = 'time';
      break;
    }

    case 'this_week': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);
      const firstDayOfWeek = new Date(today);
      // Assuming Sunday is the first day of the week (day 0)
      firstDayOfWeek.setDate(today.getDate() - today.getDay());
      start = firstDayOfWeek;
      end = new Date(firstDayOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
      newType = 'days';
      break;
    }

    case 'this_month': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);
      start = new Date(today.setDate(1));
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      end.setHours(end.getHours() + gmt);
      newType = 'days';
      break;
    }

    case 'last_week': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay() - 7);
      start = firstDayOfWeek;
      end = new Date(firstDayOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
      newType = 'days';
      break;
    }

    case 'last_30_days': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      thirtyDaysAgo.setHours(thirtyDaysAgo.getHours() + gmt);
      start = thirtyDaysAgo;
      end = today;
      newType = 'days';
      break;
    }

    case 'last_month': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);
      const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      firstDayOfLastMonth.setHours(firstDayOfLastMonth.getHours() + gmt);
      const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      lastDayOfLastMonth.setHours(lastDayOfLastMonth.getHours() + gmt);
      start = firstDayOfLastMonth;
      end = lastDayOfLastMonth;
      newType = 'days';
      break;
    }

    case 'last_7_days': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      sevenDaysAgo.setHours(sevenDaysAgo.getHours() + 7);
      start = sevenDaysAgo;
      end = today;
      newType = 'days';
      break;
    }

    case 'this_year': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
      firstDayOfYear.setHours(firstDayOfYear.getHours() + gmt);
      const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
      lastDayOfYear.setHours(lastDayOfYear.getHours() + gmt);
      start = firstDayOfYear;
      end = lastDayOfYear;
      newType = 'month';
      break;
    }

    case 'last_year': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);
      const firstDayOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
      firstDayOfLastYear.setHours(firstDayOfLastYear.getHours() + gmt);
      const lastDayOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
      lastDayOfLastYear.setHours(lastDayOfLastYear.getHours() + gmt);
      start = firstDayOfLastYear;
      end = lastDayOfLastYear;
      newType = 'month';
      break;
    }
  }
  
  localDateRange.value = [start, end];
  type.value = newType;

  const startDateWithZeroTime = new Date(start.getTime());
  startDateWithZeroTime.setHours(0, 0, 0, 0);
  emit('update:startDate', startDateWithZeroTime);
  const endDateWith2359Time = new Date(end.getTime());
  endDateWith2359Time.setHours(23, 59, 59, 999);
  emit('update:endDate', endDateWith2359Time);
  if (props.shouldUpdateType) {
    emit('update:type', newType);
  }

  dialogVisible.value = false;
};
</script>

<template>
  <section class="w-full">
    <PrimeVueButton
      variant="text"
      class="px-3 py-2 border w-full border-solid border-grayscale-20 hover:bg-secondary"
      @click="dialogVisible = true"
    >
      <template #default>
        <section class="flex items-center justify-between gap-2 w-full">
          <span class="text-text-disabled">{{ useLocalization('components.date_picker.labels.real_time') }}</span>
          <div class="flex items-center gap-2">
            <span class="text-text-primary">
              {{ useFormatDate(startDate, 'dd/mm/yyyy') }} - {{ useFormatDate(endDate, 'dd/mm/yyyy') }}
            </span>
            <span class="text-text-disabled">
              <AppBaseSvg name="calendarBlank" class="!w-5 !h-5 filter-primary-color" />
            </span>
          </div>
        </section>
      </template>
    </PrimeVueButton>

    <PrimeVueDialog
      v-model:visible="dialogVisible"
      :draggable="false"
      :close-button-props="{ class: 'hidden' }"
      class="w-full max-w-2xl"
    >
      <template #header>
        <h5 class="font-semibold text-black text-xl">
          {{ useLocalization('components.date_picker.title') }}
        </h5>
      </template>
      <template #default>
        <section class="flex flex-col gap-4">
          <section id="date-range" class="flex gap-8 flex-wrap">
            <div class="flex flex-col w-full">
              <label class="text-sm" for="start-date">
                {{ useLocalization('components.date_picker.labels.start_date') }}
              </label>
              <PrimeVueDatePicker
                v-model="localDateRange![0]"
                date-format="dd/mm/yy"
                fluid
                placeholder="dd/mm/yyyy"
                :show-on-focus="false"
              />
            </div>
            <div class="flex flex-col w-full">
              <label class="text-sm" for="end-date">
                {{ useLocalization('components.date_picker.labels.end_date') }}
              </label>
              <PrimeVueDatePicker
                v-model="localDateRange![1]"
                date-format="dd/mm/yy"
                fluid
                placeholder="dd/mm/yyyy"
                :show-on-focus="false"
              />
            </div>
          </section>
          <section id="calendar-board">
            <PrimeVueDatePicker v-model="localDateRange" selection-mode="range" inline class="w-full" />
          </section>
          <section id="shortcut-button">
            <div id="shortcut-button" class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <PrimeVueButton
                v-for="shortcut in shortcuts"
                :key="shortcut.key"
                variant="text"
                class="w-full px-3 py-2 border border-solid border-grayscale-20 text-primary hover:bg-secondary"
                :label="useLocalization(shortcut.labelKey)"
                @click="onClickShortcut(shortcut.key)"
              />
            </div>
          </section>
        </section>
      </template>
      <template #footer>
        <PrimeVueButton
          :label="useLocalization('components.date_picker.buttons.cancel')"
          severity="secondary"
          variant="outlined"
          class="border-primary-border text-primary"
          @click="cancelDateChange"
        />
        <PrimeVueButton
          :label="useLocalization('components.date_picker.buttons.apply')"
          class="bg-primary border-none"
          @click="applyDateChange"
        />
      </template>
    </PrimeVueDialog>
  </section>
</template>