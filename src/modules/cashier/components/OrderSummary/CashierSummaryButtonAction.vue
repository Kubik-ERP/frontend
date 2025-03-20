<script setup lang="ts"></script>
<template>
  <section id="cashier-summary-button-action" class="flex gap-4 px-4 pt-2">
    <PrimeVueButton outlined class="p-4 w-1/2 border-primary">
      <template #default>
        <section class="flex gap-2 justify-center w-full items-center">
          <AppBaseSvg name="order-primary" class="!h-5 !w-5" />
          <span class="font-semibold text-primary">Save Unpaid Order</span>
        </section>
      </template>
    </PrimeVueButton>
    <PrimeVueButton label="Place Order" class="p-4 w-1/2 bg-primary border-primary">
      <template #default>
        <section class="flex gap-2 justify-center w-full items-center">
          <span class="font-semibold text-xl text-white">Place Order</span>
        </section>
      </template>
    </PrimeVueButton>
  </section>
</template>
