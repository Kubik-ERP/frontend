<script setup>
import { usePointConfigurationService } from '../services/point-configuration.service';

const { pointConfiguration_activeTab, pointConfiguration_listTabs } = usePointConfigurationService();

watch(
  pointConfiguration_activeTab,
  async newTab => {
    switch (newTab.toUpperCase()) {
      case 'LOYALTY-POINT-BENEFIT': {
        // Handle logic for loyalty point benefit tab
        break;
      }
      case 'LOYALTY-POINT-SETTING': {
        // Handle logic for loyalty point setting tab
        break;
      }
      default: {
        console.warn(`Unknown tab: ${newTab}`);
      }
    }
  },
  { immediate: true },
);
</script>
<template>
  <section id="point-configuration" class="flex flex-col relative inset-0 z-0">
    <AppBaseTabs v-model:value="pointConfiguration_activeTab" :items="pointConfiguration_listTabs" />
  </section>
</template>
