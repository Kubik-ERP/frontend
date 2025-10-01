<script setup lang="ts">
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
    // ✅ ADD THIS PROP
    type: Boolean,
    default: true, // Defaults to 'true' to avoid breaking other pages
  },
});

const emit = defineEmits(['update:startDate', 'update:endDate', 'update:type', 'update:dateTimeType']);

const dialogVisible = ref<boolean>(false);

const gmt = 0;

// ✅ 1. Use a single ref for the date range array
const localDateRange = ref<[Date, Date] | null>([props.startDate, props.endDate]);
const type = ref<string | null>(props.type);

// Watch props to update the local state
// watch(
//   () => [props.startDate, props.endDate],
//   ([newStart, newEnd]) => {
//     localDateRange.value = [newStart, newEnd];
//   },
//   { immediate: true },
// );

// The "Apply" button now emits the changes from the range array
const applyDateChange = () => {
  if (localDateRange.value && localDateRange.value[0]) {
    // Create a new Date object for 'start' to work with
    const start = new Date(localDateRange.value[0].getTime() + gmt * 60 * 60 * 1000);


    const end = localDateRange.value[1] ? new Date(localDateRange.value[1].getTime() + gmt * 60 * 60 * 1000) : start; // This creates a copy, not a reference

    emit('update:startDate', start);
    emit('update:endDate', end);

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

const onClickShortcut = (label: string) => {
  let today = new Date(Date.now() + gmt * 60 * 60 * 1000);
  let start = new Date(Date.now() + gmt * 60 * 60 * 1000);
  let end = new Date(Date.now() + gmt * 60 * 60 * 1000);
  let newType = '';

  switch (label) {
    case 'Today': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);
      start = today;

      end = today;

      newType = 'time';

      break;
    }

    case 'Yesterday': {
      const yesterday = new Date(Date.now() - (24 - gmt) * 60 * 60 * 1000);
      start = yesterday;

      end = yesterday;

      newType = 'time';

      break;
    }

    case 'This Week': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);

      const firstDayOfWeek = new Date(today);
      // Assuming Sunday is the first day of the week (day 0)
      firstDayOfWeek.setDate(today.getDate() - today.getDay());

      start = firstDayOfWeek;
      end = new Date(firstDayOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

      newType = 'days';
      break;
    }

    case 'This Month': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);

      // start = new Date(today.getFullYear(), today.getMonth(), 1);
      start = new Date(today.setDate(1));
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      end.setHours(end.getHours() + gmt);

      newType = 'days';
      break;
    }

    case 'Last Week': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);

      const firstDayOfWeek = new Date(today);
      // Assuming Sunday is the first day of the week (day 0)
      firstDayOfWeek.setDate(today.getDate() - today.getDay() - 7);

      start = firstDayOfWeek;
      end = new Date(firstDayOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

      newType = 'days';
      break;
    }

    case 'Last 30 Days': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      thirtyDaysAgo.setHours(thirtyDaysAgo.getHours() + gmt);

      start = thirtyDaysAgo;
      end = today;

      newType = 'days';
      break;
    }

    case 'Last Month': {
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

    case 'Last 7 Days': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      sevenDaysAgo.setHours(sevenDaysAgo.getHours() + 7);

      start = sevenDaysAgo;
      end = today;
      newType = 'days';
      break;
    }

    case 'This Year': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);

      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
      firstDayOfYear.setHours(firstDayOfYear.getHours() + gmt);
      const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
      lastDayOfYear.setHours(lastDayOfYear.getHours() + gmt);

      start = firstDayOfYear;
      end = lastDayOfYear;
      newType = 'days';
      break;
    }

    case 'Last Year': {
      today = new Date(Date.now() + gmt * 60 * 60 * 1000);

      const firstDayOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
      firstDayOfLastYear.setHours(firstDayOfLastYear.getHours() + gmt);
      const lastDayOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
      lastDayOfLastYear.setHours(lastDayOfLastYear.getHours() + gmt);

      start = firstDayOfLastYear;
      end = lastDayOfLastYear;
      newType = 'days';
      break;
    }
  }
  localDateRange.value = [start, end];
  type.value = newType;

  emit('update:startDate', start);
  emit('update:endDate', end);
  if (props.shouldUpdateType) {
    emit('update:type', newType);
  }

  dialogVisible.value = false;
};
</script>
<template>
  <section>
    <PrimeVueButton
      variant="text"
      class="px-3 py-2 border border-solid border-grayscale-20"
      @click="dialogVisible = true"
    >
      <template #default>
        <span class="text-text-disabled">Real Time</span>
        <span class="text-text-primary"
          >{{ useFormatDate(startDate, 'dd/mm/yyyy') }} - {{ useFormatDate(endDate, 'dd/mm/yyyy') }}</span
        >
        <span class="text-text-disabled"> <AppBaseSvg name="calendarBlank" class="!w-4 !h-4" /> </span>
      </template>
    </PrimeVueButton>

    <PrimeVueDialog
      v-model:visible="dialogVisible"
      :draggable="false"
      :close-button-props="{ class: 'hidden' }"
      class="w-full max-w-2xl"
    >
      <template #header>
        <h5 class="font-semibold text-black text-xl">Date Filter</h5>
      </template>
      <template #default>
        <section class="flex flex-col gap-4">
          <section id="date-range" class="flex gap-8 flex-wrap">
            <div class="flex flex-col w-full">
              <label class="text-sm" for="start-date">Start Date</label>
              <PrimeVueDatePicker
                v-model="localDateRange![0]"
                date-format="dd/mm/yy"
                fluid
                placeholder="dd/mm/yyyy"
                :show-on-focus="false"
              />
            </div>
            <div class="flex flex-col w-full">
              <label class="text-sm" for="end-date">End Date</label>
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
                v-for="label in [
                  'Today',
                  'Yesterday',
                  'This Month',
                  'Last Month',
                  'This Week',
                  'Last Week',
                  'This Year',
                  'Last Year',
                  'Last 7 Days',
                  'Last 30 Days',
                ]"
                :key="label"
                variant="text"
                class="w-full px-3 py-2 border border-solid border-grayscale-20"
                :label="label"
                @click="onClickShortcut(label)"
              />
            </div>
          </section>
        </section>
      </template>
      <template #footer>
        <PrimeVueButton label="Cancel" severity="secondary" variant="outlined" @click="cancelDateChange" />
        <PrimeVueButton label="Apply" @click="applyDateChange" />
      </template>
    </PrimeVueDialog>
  </section>
</template>
