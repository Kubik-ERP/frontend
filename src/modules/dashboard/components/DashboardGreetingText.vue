<script setup lang="ts">
// type
import type { IDashboardProvided } from '../interfaces';
// inject
const { authentication_userData } = inject<IDashboardProvided>('dashboard')!;

const greeting = computed(() => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return useLocalization('dashboard.greeting.morning');
  } else if (currentHour < 18) {
    return useLocalization('dashboard.greeting.afternoon');
  } else {
    return useLocalization('dashboard.greeting.evening');
  }
});

const currentDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date().toLocaleDateString('en-US', options);
});
</script>

<template>
  <section id="dashboard-greeting-text" class="flex flex-col gap-2">
    <h5 class="font-semibold text-black text-lg">{{ greeting }}, {{ authentication_userData?.fullname }}!</h5>

    <span class="font-normal text-sm text-text-disabled"> {{ currentDate }} </span>
  </section>
</template>
