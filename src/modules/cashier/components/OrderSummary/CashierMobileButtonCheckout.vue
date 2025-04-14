<script setup lang="ts"></script>
<template>
  <section
    id="cashier-main-section-order-summary"
    class="block lg:hidden absolute z-10 inset-x-0 bottom-0 bg-white p-4"
  >
    <PrimeVueButton class="border-none w-full text-white py-2.5 px-8" type="button" label="Place Order">
      <template #default>
        <section class="flex gap-2 justify-between w-full items-center">
          <div class="flex gap-2 items-center">
            <AppBaseSvg name="cart" class="!h-4 !w-5" />
            <span class="font-semibold text-sm text-white">10 Items</span>
          </div>
          <span class="font-semibold text-sm text-white">Rp.120.000</span>
        </section>
      </template>
    </PrimeVueButton>
  </section>
</template>
