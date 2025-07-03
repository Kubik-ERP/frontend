<script setup lang="ts">
const value = ref([{ label: 'Space used', value: 15, color: 'var(--p-primary-hover-color)' }]);
</script>
<template>
  <section
    id="kitchen-queue-nav-control"
    class="flex w-full p-2 items-center justify-center border-t border-t-grayscale-10 border-b border-b-grayscale-10 gap-6"
  >
    <PrimeVueButton>
      <AppBaseSvg name="chevron-left-white" />
    </PrimeVueButton>
    <PrimeVueMeterGroup :value="value" label-position="start">
      <template #label>
        <div class="pr-72">
          <div class="flex text-xs gap-2.5">
            <AppBaseSvg name="order-primary" />

            <span>1-5 <span class="text-text-disabled">of 11</span></span>
          </div>
        </div>
      </template>
    </PrimeVueMeterGroup>
    <PrimeVueButton>
      <AppBaseSvg name="chevron-right-white" />
    </PrimeVueButton>
  </section>
</template>
