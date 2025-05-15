<script setup lang="ts"></script>
<template>
  <section id="invoice-mobile-button-action">
    <section
      id="invoice-footer"
      class="lg:hidden absolute bottom-0 w-full flex flex-col gap-2 p-4 bg-white border-t border-grayscale-10"
    >
      <PrimeVueButton v-slot="slotProps" as-child outlined class="w-full">
        <RouterLink :to="{ name: 'invoice' }" v-bind="slotProps" class="p-3 w-full border border-primary">
          <section class="flex gap-2 justify-center w-full items-center">
            <AppBaseSvg name="download" class="!h-5 !w-5" />
            <span class="font-semibold text-primary truncate">Download</span>
          </section>
        </RouterLink>
      </PrimeVueButton>

      <PrimeVueButton class="py-2.5 px-14" type="button">
        <section class="flex gap-2 justify-center w-full items-center">
          <AppBaseSvg name="printer" class="!h-5 !w-5" />
          <span class="font-semibold truncate">Print Invoice</span>
        </section>
      </PrimeVueButton>
    </section>
  </section>
</template>
