<script setup lang="ts">
// Stores
import { useMobileStore } from '@/app/store/mobile.store';

/**
 * @description Define the props interface
 */
interface IProps {
  items?: ITabs[];
  size?: 'small' | 'medium' | 'large';
  value?: string;
}

/**
 * @description Define props with default values and interfaces
 */
const props = withDefaults(defineProps<IProps>(), {
  items: () => [],
  value: '',
});

// Mobile store
const mobileStore = useMobileStore();
const { isCurrentlyMobile } = storeToRefs(mobileStore);

/**
 * @description Handle two-way data binding with v-model using toRefs
 */
const emits = defineEmits(['update:value']);
const localValue = computed({
  get: function () {
    return props.value;
  },
  set: function (value) {
    emits('update:value', value);
  },
});

// Calculate dynamic width based on length of items
const dynamicWidth = computed(() => {
  if (props.items.length === 0) return 'w-full';

  return `w-1/${props.items.length} flex-1`;
});

// Responsive tab classes
const tabClasses = computed(() => {
  const baseClasses = 'border-none rounded-lg max-h-10 py-2';
  let sizeClasses = 'px-4';

  if (props.size === 'small') {
    sizeClasses = 'px-3';
  } else if (isCurrentlyMobile.value) {
    sizeClasses = 'px-2';
  }

  const textClasses = isCurrentlyMobile.value ? 'text-xs' : 'text-sm';

  return `${baseClasses} ${dynamicWidth.value} ${sizeClasses} ${textClasses}`;
});

// Tab list responsive classes
const tabListClasses = computed(() => {
  const baseClasses = 'bg-secondary-background border-none rounded-lg';
  const paddingClasses = isCurrentlyMobile.value ? 'p-1' : 'p-2';

  return `${baseClasses} ${paddingClasses}`;
});

/**
 * @description Watch for changes in the value prop and update localValue accordingly
 */
const onChange = (value: string | number) => {
  localValue.value = typeof value === 'string' ? value : value.toString();
};
</script>

<template>
  <PrimeVueTabs :value="localValue" @update:value="(value: string | number) => onChange(value)">
    <PrimeVueTabList
      :pt="{
        activeBar: 'hidden',
        tabList: tabListClasses,
      }"
    >
      <PrimeVueTab
        v-for="(tab, tabIndex) in props.items"
        :key="`tab-${tabIndex}`"
        :value="tab.value"
        :pt="{
          root: `${tabClasses} ${
            localValue === tab.value
              ? 'bg-green-primary text-white font-semibold'
              : 'bg-transparent font-normal text-secondary-hover'
          }`,
        }"
      >
        {{ tab.label }}
      </PrimeVueTab>
    </PrimeVueTabList>

    <PrimeVueTabPanels
      v-for="(tabPanel, tabPanelIndex) in props.items"
      :key="`tab-panel-${tabPanelIndex}`"
      class="px-0"
      :class="[localValue === tabPanel.value ? 'block' : 'hidden', 'w-full']"
    >
      <PrimeVueTabPanel :value="tabPanel.value">
        <component :is="tabPanel.component" />
      </PrimeVueTabPanel>
    </PrimeVueTabPanels>
  </PrimeVueTabs>
</template>
