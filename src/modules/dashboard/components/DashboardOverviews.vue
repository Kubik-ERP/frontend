<template>
  <section id="dashboard-overview" class="flex flex-col gap-4">
    <section id="filter" class="flex flex-col gap-1">
      <label for="" class="font-semibold text-black text-xs"> Data Period </label>

      <PrimeVueDatePicker class="w-full max-w-80" placeholder="Real time: " show-on-focus show-icon fluid />
    </section>

    <section id="overview-cards" class="grid grid-rows-1 grid-cols-12 gap-4">
      <section
        id="card-total-sales"
        class="col-span-3 flex flex-col justify-between bg-white border border-solid border-grayscale-10 p-4 rounded-sm gap-6"
      >
        <section id="summary" class="flex items-center gap-1">
          <p class="font-semibold text-grayscale-70 text-xs">Total Sales</p>

          <PrimeVueChip class="bg-secondary-background py-1 px-2">
            <AppBaseSvg name="arrow-up-success" class="w-3 h-3" />

            <span class="font-semibold text-secondary-hover text-xs"> 10% </span>
          </PrimeVueChip>
        </section>

        <section id="total-amount" class="flex items-center justify-between">
          <span class="font-semibold text-text-disabled text-sm"> Rp </span>

          <span class="font-semibold text-primary text-2xl">
            884 <span class="font-semibold text-text-disabled text-sm">jt</span>
          </span>
        </section>
      </section>

      <section
        id="card-total-cost-of-good-sold"
        class="col-span-3 flex flex-col justify-between bg-white border border-solid border-grayscale-10 p-4 rounded-sm gap-6"
      >
        <section id="summary" class="flex items-center gap-1">
          <p class="font-semibold text-grayscale-70 text-xs">Total Cost of Good Sold</p>

          <AppBaseSvg name="info" class="w-3 h-3" />
          <PrimeVueChip class="bg-error-background py-1 px-2">
            <AppBaseSvg name="arrow-down-danger" class="w-3 h-3" />

            <span class="font-semibold text-error-hover text-xs"> 5% </span>
          </PrimeVueChip>
        </section>

        <section id="total-amount" class="flex items-center justify-between">
          <span class="font-semibold text-text-disabled text-sm"> Rp </span>

          <span class="font-semibold text-primary text-2xl">
            450 <span class="font-semibold text-text-disabled text-sm">jt</span>
          </span>
        </section>
      </section>

      <section
        id="card-total-gross-profit"
        class="col-span-3 flex flex-col justify-between bg-white border border-solid border-grayscale-10 p-4 rounded-sm gap-6"
      >
        <section id="summary" class="flex items-center gap-1">
          <p class="font-semibold text-grayscale-70 text-xs">Total Gross Profit</p>

          <AppBaseSvg name="info" class="w-3 h-3" />

          <PrimeVueChip class="bg-secondary-background py-1 px-2">
            <AppBaseSvg name="arrow-up-success" class="w-3 h-3" />

            <span class="font-semibold text-secondary-hover text-xs"> 10% </span>
          </PrimeVueChip>
        </section>

        <section id="total-amount" class="flex items-center justify-between">
          <span class="font-semibold text-text-disabled text-sm"> Rp </span>

          <span class="font-semibold text-primary text-2xl">
            450 <span class="font-semibold text-text-disabled text-sm">jt</span>
          </span>
        </section>
      </section>

      <section
        id="card-total-nett-profit"
        class="col-span-3 flex flex-col justify-between bg-white border border-solid border-grayscale-10 p-4 rounded-sm gap-6"
      >
        <section id="summary" class="flex items-center gap-1">
          <p class="font-semibold text-grayscale-70 text-xs">Total Nett Profit</p>

          <AppBaseSvg name="info" class="w-3 h-3" />

          <PrimeVueChip class="bg-secondary-background py-1 px-2">
            <AppBaseSvg name="arrow-up-success" class="w-3 h-3" />

            <span class="font-semibold text-secondary-hover text-xs"> 10% </span>
          </PrimeVueChip>
        </section>

        <section id="total-amount" class="flex items-center justify-between">
          <span class="font-semibold text-text-disabled text-sm"> Rp </span>

          <span class="font-semibold text-primary text-2xl">
            450 <span class="font-semibold text-text-disabled text-sm">jt</span>
          </span>
        </section>
      </section>
    </section>
  </section>
</template>