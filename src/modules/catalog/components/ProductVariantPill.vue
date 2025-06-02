<script setup>
const props = defineProps({
  variants: {
    type: Array,
  },
});
// console.log(props.variants);
</script>

<template>
  <div>
    <div v-if="props.variants.length > 0 && props.variants.length < 4" class="flex gap-2 flex-wrap">
      <div
        v-for="variant in props.variants"
        :key="variant"
        class="text-primary bg-blue-secondary-background rounded-full px-2 py-1 w-fit whitespace-nowrap text-center text-xs"
      >
        {{ variant }}
      </div>
    </div>
    <div v-else-if="props.variants.length > 3" class="flex gap-2 flex-wrap">
      <div
        v-for="variant in props.variants.slice(0, 3)"
        :key="variant"
        class="text-primary bg-blue-secondary-background rounded-full px-2 py-1 w-fit whitespace-nowrap text-center text-xs"
      >
        {{ variant }}
      </div>

      <div class="text-primary bg-grayscale-10 rounded-full px-2 py-1 w-fit whitespace-nowrap text-center text-xs">
        +{{ props.variants.length - 3 }}
      </div>
    </div>
    <div v-else>-</div>
  </div>
</template>

<style lang="scss" scoped>
</style>
