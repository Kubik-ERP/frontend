<script setup lang="ts">
import { IFreeItems } from '@/modules/point-configuration/interfaces/loyalty-point-benefit.interface';
defineProps({
  data: {
    type: Object as PropType<IFreeItems[]>,
    required: true,
  },
});
</script>
<template>
  <section class="flex flex-wrap gap-1">
    <PrimeVueChip
      v-for="(item) in data.slice(0, 2)"
      :key="item.id"
      class="bg-primary-background text-primary text-xs px-1.5 py-1"
    >
      <template #default>
        <span> ({{ item.quantity }}) {{ item.name }} </span>
      </template>
    </PrimeVueChip>
    <PrimeVueChip v-if="data.length > 2" class="bg-grayscale-10 text-primary text-xs px-1.5 py-1">
      +{{ data.length - 2 }}
    </PrimeVueChip>
  </section>
</template>
