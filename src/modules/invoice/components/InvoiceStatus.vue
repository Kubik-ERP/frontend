<template>
  <section
    id="invoice-status"
    class="overflow-y-auto hidden lg:flex col-span-4 relative inset-0 z-0 bg-white border-l border-solid border-grayscale-10 flex-col items-center px-4 py-5 gap-6"
  >
    <section id="invoice-id" class="flex flex-col items-center">
      <p id="label-invoice-id" class="font-normal text-text-disabled text-sm">Invoice ID</p>

      <p id="invoice-id" class="font-semibold text-black text-lg">202408010001</p>
    </section>

    <section
      id="box-icon"
      class="absolute top-5 right-5 bg-transparent basic-smooth-animation flex items-center gap-1 hover:bg-grayscale-10 p-2 rounded-md cursor-pointer"
    >
      <AppBaseSvg name="more" />
      <span class="font-normal text-text-disabled text-xs">More</span>
    </section>

    <PrimeVueChip class="bg-primary-background px-4 py-2 rounded-full">
      <AppBaseSvg name="paid" class="!w-8 !h-8" />

      <span class="font-semibold text-primary text-lg"> Paid </span>
    </PrimeVueChip>

    <table id="invoice-information">
      <thead>
        <tr class="hidden">
          <th class="font-normal text-black text-sm text-left py-2">Label</th>
          <th class="font-normal text-black text-sm text-right py-2">Value</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td class="font-normal text-text-disabled text-sm pe-2 py-1">Created on</td>
          <td class="font-normal text-grayscale-70 text-sm">01/08/2024 18:33</td>
        </tr>

        <tr>
          <td class="font-normal text-text-disabled text-sm pe-2 py-1">Paid On</td>
          <td class="font-normal text-grayscale-70 text-sm">01/08/2024 18:33</td>
        </tr>

        <tr>
          <td class="font-normal text-text-disabled text-sm pe-2 py-1">Payment Method</td>
          <td class="font-normal text-grayscale-70 text-sm">Cash</td>
        </tr>

        <tr>
          <td class="font-normal text-text-disabled text-sm pe-2 py-1">By</td>
          <td class="font-normal text-grayscale-70 text-sm">Samantha</td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td colspan="2" class="pt-6">
            <PrimeVueButton class="w-full" severity="secondary" variant="outlined">
              <template #default>
                <section id="content" class="flex items-center gap-2">
                  <AppBaseSvg name="edit" />
                  <span class="font-semibold text-primary text-sm">Edit Order</span>
                </section>
              </template>
            </PrimeVueButton>
          </td>
        </tr>
      </tfoot>
    </table>

    <PrimeVueDivider class="border-grayscale-10 py-4" />

    <section id="btn-actions" class="flex flex-col items-center gap-4 w-full">
      <section id="primary-buttons" class="flex items-center gap-4 w-full">
        <PrimeVueButton class="w-full py-4" severity="secondary" variant="outlined">
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="download" class="!w-6 !h-6" />
              <span class="font-semibold text-primary text-sm">Download</span>
            </section>
          </template>
        </PrimeVueButton>

        <PrimeVueButton class="bg-blue-primary border-none w-full py-4" severity="primary">
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="printer" class="!w-6 !h-6" />
              <span class="font-semibold text-white text-sm">Print Invoice</span>
            </section>
          </template>
        </PrimeVueButton>
      </section>

      <span class="font-normal text-text-disabled text-sm">other option</span>

      <section id="share-invoice" class="flex items-center gap-6">
        <section id="copy-link" class="flex flex-col items-center gap-1 cursor-pointer">
          <section
            id="box-icon"
            class="bg-primary-background flex items-center justify-center p-2 rounded-full w-10 h-10"
          >
            <AppBaseSvg name="link" class="!w-6 !h-6" />
          </section>

          <span class="font-normal text-grayscale-70 text-sm"> Copy Link </span>
        </section>

        <section id="email" class="flex flex-col items-center gap-1 cursor-pointer">
          <section
            id="box-icon"
            class="bg-primary-background flex items-center justify-center p-2 rounded-full w-10 h-10"
          >
            <AppBaseSvg name="mail" class="!w-6 !h-6" />
          </section>

          <span class="font-normal text-grayscale-70 text-sm"> Email </span>
        </section>

        <section id="whatsapp" class="flex flex-col items-center gap-1 cursor-pointer">
          <section
            id="box-icon"
            class="bg-primary-background flex items-center justify-center p-2 rounded-full w-10 h-10"
          >
            <AppBaseSvg name="whatsapp" class="!w-6 !h-6" />
          </section>

          <span class="font-normal text-grayscale-70 text-sm"> Whatsapp </span>
        </section>
      </section>
    </section>
  </section>
</template>
