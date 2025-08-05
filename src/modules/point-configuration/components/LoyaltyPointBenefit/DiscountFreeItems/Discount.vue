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
  <span v-if="data.isPercent"> {{ data.discount }}% </span><span v-else> Rp {{ data.discount }}</span>
</template>
