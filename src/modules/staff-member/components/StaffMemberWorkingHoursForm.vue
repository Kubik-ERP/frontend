<script setup lang="ts">
import type { IStaffMemberCreateEditProvided } from '../interfaces';
import { LIST_OF_DAYS } from '@/app/constants/day.constant';

const { staffMemberCreateEdit_formData } = inject<IStaffMemberCreateEditProvided>('staffMemberCreateEdit')!;

const getWorkingHourForDay = (dayValue: string | null) => {
  return staffMemberCreateEdit_formData.shift.find(wh => wh.day?.toUpperCase() === dayValue)!;
};
</script>

<template>
  <section id="staff-member-commision-form" class="flex flex-col gap-4">
    <h6 class="font-semibold text-grayscale-70 text-base">Working Hours</h6>

    <section id="working-hours-cards" class="grid-wrapper gap-4">
      <section
        v-for="(day, dayIndex) in LIST_OF_DAYS"
        :id="`working-hours-day-${day.value}`"
        :key="`day-${dayIndex}`"
        class="col-span-full lg:col-span-6 flex flex-col border border-solid border-primary-border gap-4 p-4 rounded-lg"
      >
        <template v-if="getWorkingHourForDay(String(day.value))">
          <header class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <PrimeVueCheckbox v-model="getWorkingHourForDay(String(day.value)).isActive" binary />
              <span class="font-semibold text-black text-base">
                {{ day.label }}
              </span>
            </div>
          </header>

          <section id="working-hours-list" class="grid-wrapper gap-4">
            <section id="open-time" class="col-span-full lg:col-span-6 flex flex-col gap-2">
              <label class="font-semibold text-black text-sm">Open Time</label>
              <PrimeVueInputGroup class="w-full">
                <PrimeVueDatePicker
                  v-model="getWorkingHourForDay(String(day.value)).start_time"
                  class="w-full"
                  fluid
                  time-only
                  placeholder="Select Time"
                  :disabled="!getWorkingHourForDay(String(day.value)).isActive"
                />
                <PrimeVueInputGroupAddon>
                  <AppBaseSvg name="clock" class="!w-5 !h-5" />
                </PrimeVueInputGroupAddon>
              </PrimeVueInputGroup>
            </section>
            <section id="close-time" class="col-span-full lg:col-span-6 flex flex-col gap-2">
              <label class="font-semibold text-black text-sm">Close Time</label>
              <PrimeVueInputGroup class="w-full">
                <PrimeVueDatePicker
                  v-model="getWorkingHourForDay(String(day.value)).end_time"
                  class="w-full"
                  fluid
                  time-only
                  placeholder="Select Time"
                  :disabled="!getWorkingHourForDay(String(day.value)).isActive"
                />
                <PrimeVueInputGroupAddon>
                  <AppBaseSvg name="clock" class="!w-5 !h-5" />
                </PrimeVueInputGroupAddon>
              </PrimeVueInputGroup>
            </section>
          </section>
        </template>
      </section>
    </section>
  </section>
</template>
