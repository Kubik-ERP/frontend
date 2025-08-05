<script setup lang="ts">
interface IProps {
  variant?: 'card' | 'list' | 'table' | 'form' | 'custom';
  rows?: number;
  showAvatar?: boolean;
  showHeader?: boolean;
  height?: string;
  className?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  variant: 'card',
  rows: 3,
  showAvatar: false,
  showHeader: true,
  height: 'auto',
  className: '',
});

const skeletonClass = computed(() => ['animate-pulse', props.className]);
</script>

<template>
  <div :class="skeletonClass" :style="{ height: props.height }">
    <!-- Card Variant -->
    <template v-if="variant === 'card'">
      <div class="bg-white rounded-lg shadow-sm border border-grayscale-10 p-6 space-y-4">
        <div v-if="showHeader" class="flex items-center space-x-4">
          <div v-if="showAvatar" class="w-12 h-12 bg-grayscale-10 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-grayscale-10 rounded w-1/4"></div>
            <div class="h-3 bg-grayscale-10 rounded w-1/2"></div>
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="i in rows" :key="i" class="space-y-2">
            <div class="h-4 bg-grayscale-10 rounded"></div>
            <div class="h-4 bg-grayscale-10 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- List Variant -->
    <template v-else-if="variant === 'list'">
      <div class="space-y-3">
        <div
          v-for="i in rows"
          :key="i"
          class="flex items-center space-x-4 p-4 bg-white rounded-lg border border-grayscale-10"
        >
          <div v-if="showAvatar" class="w-10 h-10 bg-grayscale-10 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-grayscale-10 rounded w-3/4"></div>
            <div class="h-3 bg-grayscale-10 rounded w-1/2"></div>
          </div>
          <div class="w-20 h-8 bg-grayscale-10 rounded"></div>
        </div>
      </div>
    </template>

    <!-- Table Variant -->
    <template v-else-if="variant === 'table'">
      <div class="bg-white rounded-lg border border-grayscale-10 overflow-hidden">
        <div v-if="showHeader" class="border-b border-grayscale-10 p-4">
          <div class="flex space-x-4">
            <div class="h-4 bg-grayscale-10 rounded w-1/6"></div>
            <div class="h-4 bg-grayscale-10 rounded w-1/4"></div>
            <div class="h-4 bg-grayscale-10 rounded w-1/5"></div>
            <div class="h-4 bg-grayscale-10 rounded w-1/6"></div>
            <div class="h-4 bg-grayscale-10 rounded w-1/8"></div>
          </div>
        </div>
        <div class="divide-y divide-grayscale-10">
          <div v-for="i in rows" :key="i" class="p-4">
            <div class="flex space-x-4">
              <div class="h-4 bg-grayscale-10 rounded w-1/6"></div>
              <div class="h-4 bg-grayscale-10 rounded w-1/4"></div>
              <div class="h-4 bg-grayscale-10 rounded w-1/5"></div>
              <div class="h-4 bg-grayscale-10 rounded w-1/6"></div>
              <div class="h-4 bg-grayscale-10 rounded w-1/8"></div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Form Variant -->
    <template v-else-if="variant === 'form'">
      <div class="bg-white rounded-lg border border-grayscale-10 p-6 space-y-6">
        <div v-if="showHeader" class="space-y-2">
          <div class="h-6 bg-grayscale-10 rounded w-1/3"></div>
          <div class="h-4 bg-grayscale-10 rounded w-2/3"></div>
        </div>
        <div class="space-y-4">
          <div v-for="i in rows" :key="i" class="space-y-2">
            <div class="h-4 bg-grayscale-10 rounded w-1/4"></div>
            <div class="h-10 bg-grayscale-10 rounded"></div>
          </div>
        </div>
        <div class="flex space-x-3 pt-4">
          <div class="h-10 bg-grayscale-10 rounded w-24"></div>
          <div class="h-10 bg-grayscale-10 rounded w-24"></div>
        </div>
      </div>
    </template>

    <!-- Custom Variant -->
    <template v-else-if="variant === 'custom'">
      <slot>
        <div class="space-y-3">
          <div v-for="i in rows" :key="i" class="h-4 bg-grayscale-10 rounded"></div>
        </div>
      </slot>
    </template>
  </div>
</template>
