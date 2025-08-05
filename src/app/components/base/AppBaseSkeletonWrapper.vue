<script setup lang="ts">
// Components
import AppBaseSkeleton from '@/app/components/base/AppBaseSkeleton.vue';

// Store
import { useGlobalLoading } from '@/app/composables/useGlobalLoading';

interface IProps {
  /**
   * @description Skeleton variant to show when loading
   */
  variant?: 'card' | 'list' | 'table' | 'form' | 'custom';
  /**
   * @description Number of skeleton rows to display
   */
  rows?: number;
  /**
   * @description Show avatar in skeleton
   */
  showAvatar?: boolean;
  /**
   * @description Show header in skeleton
   */
  showHeader?: boolean;
  /**
   * @description Custom height for skeleton container
   */
  height?: string;
  /**
   * @description Additional CSS classes
   */
  className?: string;
  /**
   * @description Minimum loading time to prevent flickering
   */
  minLoadingTime?: number;
  /**
   * @description Force show content even when loading (for partial loading states)
   */
  forceShowContent?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  variant: 'card',
  rows: 3,
  showAvatar: false,
  showHeader: true,
  height: 'auto',
  className: '',
  minLoadingTime: 300,
  forceShowContent: false,
});

const { isLoading } = useGlobalLoading({ minLoadingTime: props.minLoadingTime });

const shouldShowSkeleton = computed(() => {
  return isLoading.value && !props.forceShowContent;
});
</script>

<template>
  <div class="relative">
    <!-- Skeleton Loading State -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="shouldShowSkeleton" class="absolute inset-0 z-10 bg-white bg-opacity-75 backdrop-blur-sm">
        <AppBaseSkeleton
          :variant="variant"
          :rows="rows"
          :show-avatar="showAvatar"
          :show-header="showHeader"
          :height="height"
          :class-name="`${className} h-full`"
        />
      </div>
    </Transition>

    <!-- Actual Content -->
    <div
      :class="{
        'opacity-50 pointer-events-none': shouldShowSkeleton,
        'transition-opacity duration-300': true,
      }"
    >
      <slot />
    </div>
  </div>
</template>
