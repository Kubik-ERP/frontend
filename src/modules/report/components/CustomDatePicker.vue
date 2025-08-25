<script setup lang="ts">
// 1. Define individual props for start and end dates
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

// 2. Define separate update events for each prop
const emit = defineEmits(['update:startDate', 'update:endDate']);

// Internal state for the dialog remains the same
const dialogVisible = ref<boolean>(false);
const localStartDate = ref<Date>(new Date());
const localEndDate = ref<Date>(new Date());

// 3. Watch both props and update the local state
watch(
  () => [props.startDate, props.endDate],
  ([newStart, newEnd]) => {
    localStartDate.value = newStart;
    localEndDate.value = newEnd;
  },
  { immediate: true },
);

// 4. The "Apply" button now emits two separate events
const applyDateChange = () => {
  emit('update:startDate', localStartDate.value);
  emit('update:endDate', localEndDate.value);
  dialogVisible.value = false;
};

const onClickShortcut = (label: string) => {
  const today = new Date();

  switch (label) {
    case 'Today': {
      localStartDate.value = new Date(today.setHours(0, 0, 0, 0));
      localEndDate.value = new Date();
      break;
    }

    case 'Yesterday': {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      localStartDate.value = yesterday;
      localEndDate.value = new Date(today.setHours(0, 0, 0, 0) - 1); // End of yesterday
      break;
    }

    case 'This Week': {
      const firstDayOfWeek = new Date(today);
      // Assuming Sunday is the first day of the week (day 0)
      firstDayOfWeek.setDate(today.getDate() - today.getDay());
      firstDayOfWeek.setHours(0, 0, 0, 0);
      localStartDate.value = firstDayOfWeek;
      localEndDate.value = new Date();
      break;
    }

    case 'This Month': {
      localStartDate.value = new Date(today.getFullYear(), today.getMonth(), 1);
      localEndDate.value = new Date();
      break;
    }

    case 'Last 30 Days': {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      localStartDate.value = thirtyDaysAgo;
      localEndDate.value = new Date();
      break;
    }

    case 'Last Month': {
      const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      lastDayOfLastMonth.setHours(23, 59, 59, 999);
      localStartDate.value = firstDayOfLastMonth;
      localEndDate.value = lastDayOfLastMonth;
      break;
    }
  }
};

const isEditStartDate = ref<boolean>(true);

const onEditStartDate = () => {
  isEditStartDate.value = true;
};

const onEditEndDate = () => {
  isEditStartDate.value = false;
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

    <PrimeVueDialog v-model:visible="dialogVisible" :draggable="false" :close-button-props="{ class: 'hidden' }" class="w-1/2">
      <template #header>
        <h5 class="font-semibold text-black text-xl">Date Filter</h5>
      </template>
      <template #default>
        <section class="flex flex-col gap-4">
          <section id="date-range" class="flex gap-8">
            <div class="flex flex-col w-full">
              <label class="text-sm" for="start-date">Start Date</label>
              <!-- <PrimeVueDatePicker v-model="localStartDate" show-on-focus show-icon fluid /> -->
              <PrimeVueButton
                unstyled
                class="w-full px-3 py-1 rounded-md bg-grayscale-10 text-text-primary text-left hover:cursor-pointer"
                @click="onEditStartDate"
                >{{ useFormatDate(localStartDate, 'dd/mm/yyyy') }}</PrimeVueButton
              >
            </div>
            <div class="flex flex-col w-full">
              <label class="text-sm" for="end-date">End Date</label>
              <!-- <PrimeVueDatePicker v-model="localEndDate" show-on-focus show-icon fluid /> -->
              <PrimeVueButton
                unstyled
                class="w-full px-3 py-1 rounded-md bg-grayscale-10 text-text-primary text-left hover:cursor-pointer"
                @click="onEditEndDate"
                >{{ useFormatDate(localEndDate, 'dd/mm/yyyy') }}</PrimeVueButton
              >
            </div>
          </section>
          <section id="calendar-board">
            <label for="calendar" class="font-semibold text-lg">{{
              isEditStartDate ? 'Start Date : ' : 'End Date : '
            }}</label>
            <PrimeVueDatePicker v-if="isEditStartDate" v-model="localStartDate" inline class="w-full" />
            <PrimeVueDatePicker v-else v-model="localEndDate" inline class="w-full" />

            <!-- <PrimeVueCard class="p-4">
              <template #header>
                <section class="flex items-center justify-between w-full">
                  <h5 class="font-semibold text-black text-xl">August 2025</h5>
                  <div class="flex items-center">
                    <PrimeVueButton
                      class="rounded-none border-grayscale-20"
                      variant="outlined"
                      size="small"
                      label="Previous Month"
                    />
                    <PrimeVueButton
                      class="rounded-none border-grayscale-20"
                      variant="outlined"
                      size="small"
                      label="Today"
                    />
                    <PrimeVueButton
                      class="rounded-none border-grayscale-20"
                      variant="outlined"
                      size="small"
                      label="Next Month"
                    />
                  </div>
                </section>
              </template>
              <template #content>
                <PrimeVueDatePicker v-model="localStartDate" inline show-week class="w-full" />
              </template>
            </PrimeVueCard> -->
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
        <PrimeVueButton label="Cancel" severity="secondary" variant="outlined" @click="dialogVisible = false" />
        <PrimeVueButton label="Apply" @click="applyDateChange" />
      </template>
    </PrimeVueDialog>
  </section>
</template>
