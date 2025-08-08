<script setup lang="ts">
import type { IStaffMemberCreateEditProvided } from '../interfaces';
// import { LIST_OF_DAYS } from '@/app/constants/day.constant';
// const getWorkingHourForDay = (dayValue: string | null) => {
//   return staffMemberCreateEdit_formData.shift.find(wh => wh.day?.toUpperCase() === dayValue)!;
// };
const { staffMemberCreateEdit_formData } = inject<IStaffMemberCreateEditProvided>('staffMemberCreateEdit')!;
</script>

<template>
  <section id="staff-member-working-hours-form" class="flex flex-col gap-4">
    <section id="information" class="flex flex-col gap-2">
      <h5 class="font-semibold text-black text-lg">Working Hours</h5>
    </section>

    <section id="working-hours" class="grid-wrapper gap-4">
      <section
        v-for="(day, dayIndex) in staffMemberCreateEdit_formData.shift"
        :id="`working-hours-day-${dayIndex}`"
        :key="`day-${dayIndex}`"
        class="col-span-full lg:col-span-6 flex flex-col border border-solid border-primary-border gap-4 p-4 rounded-lg"
      >
        <header class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <PrimeVueCheckbox v-model="day.isActive" binary />
            <span class="font-semibold text-black text-base">
              {{ day.day }}
            </span>
          </div>
          <PrimeVueButton
            class="border border-solid border-primary basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
            severity="secondary"
            variant="outlined"
            @click="() => day.timeSlots.push({ startTime: null, endTime: null })"
          >
            <template #default>
              <section id="content" class="flex items-center gap-2">
                <AppBaseSvg name="plus-line" />
              </section>
            </template>
          </PrimeVueButton>
        </header>

        <section id="working-hours-list" class="grid-wrapper gap-4">
          <template v-for="(timeSlot, timeSlotIndex) in day.timeSlots" :key="`working-hour-${timeSlotIndex}`">
            <section id="open-time" class="col-span-full lg:col-span-6 flex flex-col items-center gap-2">
              <label for="open-time" class="font-semibold text-black text-sm">Open Time</label>
              <PrimeVueInputGroup>
                <PrimeVueDatePicker
                  id="datepicker-open-time"
                  v-model="timeSlot.startTime"
                  class="w-full"
                  fluid
                  time-only
                  :disabled="!day.isActive"
                />
                <PrimeVueInputGroupAddon>
                  <AppBaseSvg name="clock" class="!w-5 !h-6" />
                </PrimeVueInputGroupAddon>
              </PrimeVueInputGroup>
            </section>
            <section id="close-time" class="col-span-full lg:col-span-6 flex flex-col items-center gap-2">
              <label for="close-time" class="font-semibold text-black text-sm">Close Time</label>
              <PrimeVueInputGroup>
                <PrimeVueDatePicker
                  id="datepicker-close-time"
                  v-model="timeSlot.endTime"
                  class="w-full"
                  fluid
                  time-only
                  :disabled="!day.isActive"
                />
                <PrimeVueInputGroupAddon>
                  <AppBaseSvg name="clock" class="!w-5 !h-6" />
                </PrimeVueInputGroupAddon>
              </PrimeVueInputGroup>
            </section>
          </template>
        </section>
      </section>
    </section>
  </section>
</template>
