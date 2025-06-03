<script setup lang="ts">
// Interfaces
import { IOutletCreateEditProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { outletCreateEdit_formData } = inject<IOutletCreateEditProvided>('outletCreateEdit')!;
</script>

<template>
  <section id="outlet-create-edit-form-operational" class="flex flex-col gap-4">
    <section id="information" class="flex flex-col gap-2">
      <h5 class="font-semibold text-black text-lg">Operational</h5>
      <h6 class="font-semibold text-base text-black">Busines Hours</h6>
    </section>

    <template v-for="(businessHour, businessHourIndex) in outletCreateEdit_formData.businessHours"
      :key="`business-hour-${businessHourIndex}`">
      <section id="business-operational" class="grid grid-rows-1 grid-cols-6 gap-4">
        <section :id="`business-operational-day-${businessHourIndex}`" class="flex items-center gap-2">
          <PrimeVueCheckbox v-model="businessHour.isOpen" binary />

          <span class="font-normal text-black text-sm">
            {{ businessHour.day }}
          </span>
        </section>

        <section :id="`business-hour-${businessHourIndex}`" class="flex items-center gap-4">
          <PrimeVueDatePicker :id="`datepicker-business-start-hour-${businessHourIndex}-timeonly`" fluid time-only
            @value-change="
              (event: Date | Date[] | (Date | null)[] | null | undefined) => {
                outletCreateEdit_formData.businessHours[businessHourIndex].openTime = event?.toString() ?? '';
              }
            " />

          <PrimeVueDatePicker :id="`datepicker-business-end-hour-${businessHourIndex}-timeonly`" fluid time-only
            @value-change="
              (event: Date | Date[] | (Date | null)[] | null | undefined) => {
                outletCreateEdit_formData.businessHours[businessHourIndex].closeTime = event?.toString() ?? '';
              }
            " />
        </section>
      </section>
    </template>
  </section>
</template>
