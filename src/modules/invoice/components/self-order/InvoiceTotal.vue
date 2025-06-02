<script setup lang="ts"></script>

<template>
  <section id="invoice-total" class="w-full flex flex-col gap-2 bg-white py-5 px-4">
    <div class="flex justify-between">
      <span class="font-semibold">Sub Total</span>

      <div class="flex flex-col items-end">
        <span class="text-xs font-semibold">Rp 100.000</span>
      </div>
    </div>

    <div class="flex justify-between">
      <span class="text-text-disabled text-xs">Tax</span>

      <div class="flex flex-col items-end">
        <span class="text-xs text-text-disabled">Rp 100.000</span>
      </div>
    </div>

    <div class="flex justify-between">
      <span class="text-text-disabled text-xs">BIRTHDAY PROMO</span>

      <div class="flex flex-col items-end">
        <span class="text-xs text-text-disabled">Rp 100.000</span>
      </div>
    </div>

    <div class="flex justify-between">
      <span class="text-text-disabled text-xs">INDEPENDENCE DAY PROMO</span>

      <div class="flex flex-col items-end">
        <span class="text-xs text-text-disabled">Rp 100.000</span>
      </div>
    </div>

    <hr class="border border-solid border-grayscale-10 my-1" />

    <div class="flex justify-between">
      <span class="font-semibold text-sm">Total</span>

      <div class="flex flex-col items-end">
        <span class="text-sm font-semibold">Rp 100.000</span>
      </div>
    </div>

    <div class="mt-5 flex flex-col gap-2">
      <div class="flex justify-between">
        <span class="text-sm font-semibold">Payment Method</span>
        <span class="text-sm font-semibold">QRIS</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm">Payment Date</span>
        <span class="text-sm">01/08/2024 18:33</span>
      </div>
    </div>

    <div class="mt-5 p-2 flex items-center justify-between border border-primary-border rounded-lg">
      <div class="flex gap-2 items-center">
        <AppBaseSvg name="order-primary" class="!w-6 !h-6" />
        <span class="text-sm">Your queue number is</span>
      </div>
      <span class="text-sm font-semibold">59</span>
    </div>
  </section>
</template>
