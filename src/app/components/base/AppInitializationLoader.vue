<script setup lang="ts">
interface Props {
  isInitializing: boolean;
  progress?: number;
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
});

const loadingText = ref('Initializing Application');

// Cycle through different loading messages
const loadingMessages = [
  'Initializing Application',
  'Loading Components',
  'Setting up Router',
  'Preparing Interface',
  'Almost Ready',
];

let messageIndex = 0;
let messageInterval: NodeJS.Timeout | null = null;

const startMessageCycle = () => {
  messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % loadingMessages.length;
    loadingText.value = loadingMessages[messageIndex];
  }, 1000);
};

const stopMessageCycle = () => {
  if (messageInterval) {
    clearInterval(messageInterval);
    messageInterval = null;
  }
};

const handleImageError = () => {
  // Fallback if logo image fails to load
  console.warn('App logo failed to load');
};

// Start message cycling when component mounts and is initializing
watch(
  () => props.isInitializing,
  newValue => {
    if (newValue) {
      startMessageCycle();
    } else {
      stopMessageCycle();
      loadingText.value = 'Initialization Complete';
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  stopMessageCycle();
});
</script>

<template>
  <div
    v-if="isInitializing"
    class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-opacity duration-300"
    :class="{ 'opacity-0 pointer-events-none': !isInitializing }"
  >
    <!-- Logo or Brand -->
    <div class="mb-8">
      <img src="/app-logo.png" alt="App Logo" class="h-16 w-auto" @error="handleImageError" />
    </div>

    <!-- Loading Spinner -->
    <div class="mb-6">
      <PrimeVueProgressSpinner
        style="width: 50px; height: 50px"
        stroke-width="4"
        fill="transparent"
        animation-duration="1s"
        aria-label="Application Loading"
        class="text-blue-600 dark:text-blue-400"
      />
    </div>

    <!-- Loading Text -->
    <div class="text-center">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        {{ loadingText }}
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">Please wait while we prepare everything for you...</p>
    </div>

    <!-- Progress Indicator (Optional) -->
    <div class="mt-6 w-64">
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">{{ Math.round(progress) }}% Complete</p>
    </div>
  </div>
</template>

<style scoped>
/* Smooth fade transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
