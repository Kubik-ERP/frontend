<template>
  <section id="staff-member-commision-form" class="flex flex-col gap-4">
    <h6 class="font-semibold text-grayscale-70 text-base">Working Hours</h6>

    <section id="working-hours" class="grid-wrapper gap-4">
      <section
        v-for="(day, dayIndex) in LIST_OF_DAYS"
        :id="`working-hours-day-${day.value}`"
        :key="`day-${dayIndex}`"
        class="col-span-full lg:col-span-6 flex flex-col border border-solid border-primary-border gap-4 p-4 rounded-lg"
      >
        <header class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <PrimeVueCheckbox binary />
            <span class="font-semibold text-black text-base">
              {{ day.label }}
            </span>
          </div>

          <PrimeVueButton
            class="border border-solid border-primary basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
            severity="secondary"
            variant="outlined"
          >
            <template #default>
              <section id="content" class="flex items-center gap-2">
                <AppBaseSvg name="plus-line" />
              </section>
            </template>
          </PrimeVueButton>
        </header>

        <section id="working-hours-list" class="grid-wrapper gap-4">
          <section id="open-time" class="col-span-full lg:col-span-6 flex flex-col items-center gap-2">
            <label for="open-time" class="font-semibold text-black text-sm">Open Time</label>

            <PrimeVueInputGroup>
              <PrimeVueDatePicker
                id="datepicker-open-time"
                class="w-full"
                fluid
                time-only
                @value-change="
                  (event: Date | Date[] | (Date | null)[] | null | undefined) => {
                    console.log(event);
                  }
                "
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
                class="w-full"
                fluid
                time-only
                @value-change="
                  (event: Date | Date[] | (Date | null)[] | null | undefined) => {
                    console.log(event);
                  }
                "
              />

              <PrimeVueInputGroupAddon>
                <AppBaseSvg name="clock" class="!w-5 !h-6" />
              </PrimeVueInputGroupAddon>
            </PrimeVueInputGroup>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>
