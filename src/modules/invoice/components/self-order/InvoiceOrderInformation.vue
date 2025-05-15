<template>
  <section id="invoice-order-information" class="flex flex-col gap-2 p-4 bg-white">
    <span class="font-semibold">Customer Details</span>

    <div class="grid grid-cols-2 gap-2 w-full">
      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Customer Name</span>
        <span class="text-xs">John Doe</span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Table No.</span>
        <span class="text-xs">A1</span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Order Type</span>
        <span class="text-xs">Dine In</span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Order Date</span>
        <span class="text-xs">01/08/2024 18:33</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
