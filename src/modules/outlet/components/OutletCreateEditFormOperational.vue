<script setup lang="ts">
// Components
import DatePicker from 'primevue/datepicker';

// Constants
import { OUTLET_CREATE_EDIT_BUSINESS_HOURS } from '../constants/outlet-create-edit.constant';

// Interfaces
// import type { IOutletCreateEditProvided } from '../interfaces/outlet-create-edit.interface';

/**
 * @description Inject all the data and methods what we need
 */
// const { outletCreateEdit_formData, outletCreateEdit_formValidations } =
//   inject<IOutletCreateEditProvided>('outletCreateEdit')!;
</script>

<template>
  <section id="outlet-create-edit-form-operational" class="flex flex-col gap-4">
    <section id="information" class="flex flex-col gap-2">
      <h5 class="font-semibold text-black text-lg">Operational</h5>
      <h6 class="font-semibold text-base text-black">Busines Hours</h6>
    </section>

    <template
      v-for="(businessHour, businessHourIndex) in OUTLET_CREATE_EDIT_BUSINESS_HOURS"
      :key="`business-hour-${businessHourIndex}`"
    >
      <section id="business-operational" class="grid grid-rows-1 grid-cols-6 gap-4">
        <section :id="`business-operational-day-${businessHourIndex}`" class="flex items-center gap-2">
          <PrimeVueCheckbox binary />

          <span class="font-normal text-black text-sm">
            {{ businessHour }}
          </span>
        </section>

        <section :id="`business-hour-${businessHourIndex}`" class="flex items-center gap-4">
          <DatePicker :id="`datepicker-business-start-hour-${businessHourIndex}-timeonly`" fluid time-only />
          <DatePicker :id="`datepicker-business-end-hour-${businessHourIndex}-timeonly`" fluid time-only />
        </section>
      </section>
    </template>
  </section>
</template>
