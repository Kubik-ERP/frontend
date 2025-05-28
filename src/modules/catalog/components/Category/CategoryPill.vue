<template>
  <div>
    <div v-if="props.categories.length > 0 && props.categories.length < 4" class="flex gap-2 flex-wrap">
      <div>
        <span v-for="(category, index) in props.categories" :key="index">
          {{ category }}<span v-if="index < props.categories.length - 1">, </span>
        </span>
      </div>
    </div>
    <div v-else>-</div>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
  },
});
// console.log(props.categories);
</script>

<style lang="scss" scoped></style>
