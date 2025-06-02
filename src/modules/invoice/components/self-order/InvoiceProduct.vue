<script setup lang="ts"></script>

<template>
  <section id="invoice-product">
    <div class="flex flex-col w-full gap-4 py-4">
      <div class="flex justify-between">
        <div class="flex gap-2 font-semibold text-xs">
          <span>1x</span>
          <span>Blueberry Pancake</span>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-xs">Rp 100.000</span>
          <span class="text-text-disabled text-[8px] line-through">Rp 200.000</span>
        </div>
      </div>

      <div class="flex flex-col gap-1 mb-4">
        <div class="flex flex-col">
          <span class="text-text-disabled font-semibold text-[10px]">Variant</span>
          <span class="text-xs">Normal Sugar</span>
        </div>

        <div class="flex flex-col">
          <span class="text-text-disabled font-semibold text-[10px]">Notes</span>
          <span class="text-xs text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. </span>
        </div>
      </div>

      <div class="border border-dashed border-disabled border-spacing-2"></div>
    </div>
  </section>
</template>
