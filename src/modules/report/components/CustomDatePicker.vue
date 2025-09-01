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

const emit = defineEmits(['update:startDate', 'update:endDate', 'update:type']);

const dialogVisible = ref<boolean>(false);

// ✅ 1. Use a single ref for the date range array
const localDateRange = ref<[Date, Date] | null>([props.startDate, props.endDate]);
const type = ref<string | null>(props.type);

// Watch props to update the local state
watch(
  () => [props.startDate, props.endDate],
  ([newStart, newEnd]) => {
    localDateRange.value = [newStart, newEnd];
  },
  { immediate: true },
);

// The "Apply" button now emits the changes from the range array
const applyDateChange = () => {
  if (localDateRange.value && localDateRange.value[0]) {
    // Create a new Date object for 'start' to work with
    const start = new Date(localDateRange.value[0]);
    start.setHours(0, 0, 0, 0);

    // If an end date exists, create a new object from it.
    // If not, create a new object by COPYING the start date.
    const end = localDateRange.value[1] ? new Date(localDateRange.value[1]) : new Date(start); // This creates a copy, not a reference

    // Now, this only modifies the 'end' object
    end.setHours(23, 59, 59, 999);

    emit('update:startDate', start);
    emit('update:endDate', end);

    type.value = null;
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
  const today = new Date();
  let start = new Date();
  let end = new Date();
  let newType = '';

  switch (label) {
    case 'Today': {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      end = new Date();
      end.setHours(23, 59, 59, 999);
      newType = 'time';

      break;
    }

    case 'Yesterday': {
      start = new Date(new Date().setDate(today.getDate() - 1));
      start.setHours(0, 0, 0, 0);
      end = new Date(new Date().setHours(0, 0, 0, 0) - 1);
      newType = 'time';
      break;
    }

    case 'This Week': {
      const firstDayOfWeek = new Date(today);
      // Assuming Sunday is the first day of the week (day 0)
      firstDayOfWeek.setDate(today.getDate() - today.getDay());
      firstDayOfWeek.setHours(0, 0, 0, 0);
      start = firstDayOfWeek;
      end = new Date();
      end.setHours(23, 59, 59, 999);
      newType = 'days';
      break;
    }

    case 'This Month': {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date();
      end.setHours(23, 59, 59, 999);
      newType = 'days';
      break;
    }

    case 'Last 30 Days': {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      start = thirtyDaysAgo;
      end = new Date();
      end.setHours(23, 59, 59, 999);
      newType = 'days';
      break;
    }

    case 'Last Month': {
      const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      lastDayOfLastMonth.setHours(23, 59, 59, 999);
      start = firstDayOfLastMonth;
      end = lastDayOfLastMonth;
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
  <section class="pt-4">
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
      class="w-1/2"
    >
      <template #header>
        <h5 class="font-semibold text-black text-xl">Date Filter</h5>
      </template>
      <template #default>
        <section class="flex flex-col gap-4">
          <section id="date-range" class="flex gap-8">
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
            <div id="shortcut-button" class="grid grid-cols-2 gap-2">
              <PrimeVueButton
                v-for="label in ['Today', 'Yesterday', 'This Month', 'This Week', 'Last 30 Days', 'Last Month']"
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
