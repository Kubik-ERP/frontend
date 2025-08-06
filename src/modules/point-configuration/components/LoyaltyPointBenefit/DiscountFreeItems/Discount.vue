<script setup lang="ts">
import { IDiscount } from '@/modules/point-configuration/interfaces/loyalty-point-benefit.interface';
defineProps({
  data: {
    type: Object as PropType<IDiscount>,
    required: true,
  },
});
</script>
<template>
  <span v-if="data.isPercent"> {{ data.value }}% </span><span v-else> Rp {{ data.value }}</span>
</template>
