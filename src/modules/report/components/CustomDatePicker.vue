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
});

const emit = defineEmits(['update:startDate', 'update:endDate']);

const dialogVisible = ref<boolean>(false);

// ✅ 1. Use a single ref for the date range array
const localDateRange = ref<[Date, Date] | null>([props.startDate, props.endDate]);

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
    const start = localDateRange.value[0];
    // If only one date is selected, make the end date the same as the start date
    const end = localDateRange.value[1] || start;

    emit('update:startDate', start);
    emit('update:endDate', end);
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

  switch (label) {
    case 'Today': {
      start = new Date(new Date().setHours(0, 0, 0, 0));
      break;
    }

    case 'Yesterday': {
      start = new Date(new Date().setDate(today.getDate() - 1));
      start.setHours(0, 0, 0, 0);
      end = new Date(new Date().setHours(0, 0, 0, 0) - 1);
      break;
    }

    case 'This Week': {
      const firstDayOfWeek = new Date(today);
      // Assuming Sunday is the first day of the week (day 0)
      firstDayOfWeek.setDate(today.getDate() - today.getDay());
      firstDayOfWeek.setHours(0, 0, 0, 0);
      start = firstDayOfWeek;
      end = new Date();
      break;
    }

    case 'This Month': {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date();
      break;
    }

    case 'Last 30 Days': {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      start = thirtyDaysAgo;
      end = new Date();
      break;
    }

    case 'Last Month': {
      const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      lastDayOfLastMonth.setHours(23, 59, 59, 999);
      start = firstDayOfLastMonth;
      end = lastDayOfLastMonth;
      break;
    }
  }
  localDateRange.value = [start, end];
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
