<script setup lang="ts">
// Interfaces
import { IAccountStoreEditProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { accountStoreEdit_formData } = inject<IAccountStoreEditProvided>('accountStoreEdit')!;
</script>

<template>
  <section id="outlet-create-edit-form-operational" class="flex flex-col gap-4">
    <section id="information" class="flex flex-col gap-2">
      <h5 class="font-semibold text-black text-lg">{{ useLocalization('account.operational') }}</h5>
      <h6 class="font-semibold text-base text-black">{{ useLocalization('account.business-hours') }}</h6>
    </section>

    <section id="working-hours" class="grid-wrapper gap-4">
      <section
        v-for="(day, dayIndex) in accountStoreEdit_formData.businessHours"
        :id="`working-hours-day-${dayIndex}`"
        :key="`day-${dayIndex}`"
        class="col-span-full lg:col-span-6 flex flex-col border border-solid border-primary-border gap-4 p-4 rounded-lg"
      >
        <header class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <PrimeVueCheckbox v-model="day.isOpen" binary />
            <span class="font-semibold text-black text-base">
              {{ day.day }}
            </span>
          </div>

          <PrimeVueButton
            class="border border-solid border-primary basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
            severity="secondary"
            variant="outlined"
            @click="
              () => {
                day.timeSlots.push({ openTime: null, closeTime: null });
              }
            "
          >
            <template #default>
              <section id="content" class="flex items-center gap-2">
                <AppBaseSvg name="plus-line" class="w-4 h-4" />
              </section>
            </template>
          </PrimeVueButton>
        </header>

        <section id="working-hours-list" class="grid-wrapper gap-4">
          <template v-for="(timeSlot, timeSlotIndex) in day.timeSlots" :key="`business-hour-${timeSlotIndex}`">
            <section id="open-time" class="col-span-full lg:col-span-6 flex flex-col items-center gap-2">
              <label for="open-time" class="font-semibold text-black text-sm">{{
                useLocalization('account.form.open-time')
              }}</label>

              <PrimeVueInputGroup>
                <PrimeVueDatePicker
                  id="datepicker-open-time"
                  v-model="timeSlot.openTime"
                  class="w-full"
                  fluid
                  time-only
                />

                <PrimeVueInputGroupAddon>
                  <AppBaseSvg name="clock" class="!w-5 !h-6" />
                </PrimeVueInputGroupAddon>
              </PrimeVueInputGroup>
            </section>

            <section id="close-time" class="col-span-full lg:col-span-6 flex flex-col items-center gap-2">
              <label for="close-time" class="font-semibold text-black text-sm">{{
                useLocalization('account.form.close-time')
              }}</label>

              <PrimeVueInputGroup>
                <PrimeVueDatePicker
                  id="datepicker-close-time"
                  v-model="timeSlot.closeTime"
                  class="w-full"
                  fluid
                  time-only
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
