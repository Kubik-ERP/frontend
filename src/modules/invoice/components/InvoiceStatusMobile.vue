<template>
  <section
    id="invoice-status"
    class="flex lg:hidden relative inset-0 z-0 bg-white border-l border-solid border-grayscale-10 flex-col p-4 gap-2"
  >
    <section id="invoice-id" class="flex flex-col">
      <p id="label-invoice-id" class="font-normal text-text-disabled text-sm">Invoice ID</p>

      <p id="invoice-id" class="font-semibold text-black text-lg">202408010001</p>
    </section>

    <section
      id="box-icon"
      class="absolute top-5 right-5 bg-transparent basic-smooth-animation flex items-center gap-2 hover:bg-grayscale-10 p-2 rounded-md cursor-pointer"
    >
      <PrimeVueButton variant="outlined" severity="primary" size="small" class="rounded-lg">
        <AppBaseSvg name="share" class="!w-3 !h-3" />
        <span class="font-semibold text-primary text-xs"> Share </span>
      </PrimeVueButton>
      <AppBaseSvg name="more" class="!w-6 !h-6" />
    </section>

    <div>
      <PrimeVueChip class="bg-primary-background px-2 py-1 rounded-full">
        <AppBaseSvg name="paid" class="!w-3 !h-3" />

        <span class="font-semibold text-primary text-sm"> Paid </span>
      </PrimeVueChip>
    </div>

    <div class="grid grid-cols-2 w-full gap-2">
      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Created on</span>
        <span class="text-grayscale-70 text-sm">01/08/2024 18:33</span>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Paid On</span>
        <span class="text-grayscale-70 text-sm">01/08/2024 18:33</span>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Payment Method</span>
        <span class="text-grayscale-70 text-sm">Cash</span>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">By</span>
        <span class="text-grayscale-70 text-sm">Samantha</span>
      </div>
    </div>
  </section>
</template>
