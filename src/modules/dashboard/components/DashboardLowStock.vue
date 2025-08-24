<template>
  <section
    id="low-stock-informations"
    class="col-span-full md:col-span-6 flex flex-col gap-2 border-r border-solid border-grayscale-10 pr-4"
  >
    <header class="flex items-center justify-between">
      <h6 class="font-semibold text-sm lg:text-base text-grayscale-70">Low Stock</h6>

      <section id="detail-informations" class="flex items-center gap-2">
        <PrimeVueChip class="bg-warning-background p-2">
          <span class="font-semibold text-warning-main text-xs w-fit lg:min-w-[60px]"> 10+ Items </span>
        </PrimeVueChip>

        <PrimeVueButton
          class="w-full bg-transparent border-none basic-smooth-animation hover:bg-grayscale-10 p-0 lg:p-4"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <span class="font-semibold text-text-primary text-sm">Show More</span>
              <AppBaseSvg name="chevron-right" class="!w-3 !h-3" />
            </section>
          </template>
        </PrimeVueButton>
      </section>
    </header>

    <table>
      <thead>
        <tr class="hidden">
          <th class="w-full max-w-80">Product</th>
          <th class="w-fit">Qty</th>
          <th class="w-full max-w-16">Amount</th>
          <th class="w-full max-w-14">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="index in 5" :key="index" class="h-8 border-b border-solid border-grayscale-10">
          <td class="w-fit py-2">
            <section id="product-name" class="flex items-center w-full gap-2">
              <span class="w-1 h-4 rounded-md bg-warning-main"> &nbsp; </span>

              <span class="font-normal text-grayscale-70 text-base"> Gyoza </span>
            </section>
          </td>

          <td class="font-normal text-sm text-text-disabled w-14 py-2">qty</td>

          <td class="font-semibold text-sm text-primary w-16 border-r border-solid border-grayscale-10 py-2">
            3
            <span class="font-normal text-text-disabled"> kg </span>
          </td>

          <td class="ps-4 w-14 py-2">
            <PrimeVueButton class="w-full bg-transparent border-none basic-smooth-animation hover:bg-grayscale-10">
              <template #default>
                <section id="content" class="flex items-center gap-2">
                  <span class="font-semibold text-primary text-sm">Order</span>
                </section>
              </template>
            </PrimeVueButton>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
