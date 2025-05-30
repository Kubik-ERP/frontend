<script setup lang="ts">
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

/**
 * @description Handle two-way data binding with v-model using toRefs
 */
const { value } = toRefs(props);
const localValue = ref(value.value);

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
        tabList: 'bg-secondary-background border-none rounded-lg p-2',
      }"
    >
      <PrimeVueTab
        v-for="(tab, tabIndex) in props.items"
        :key="`tab-${tabIndex}`"
        :value="tab.value"
        :pt="{
          root: `border-none text-sm rounded-lg max-h-10 py-2 ${
            localValue === tab.value
              ? 'bg-green-primary text-white font-semibold'
              : 'bg-transparent font-normal text-secondary-hover'
          }
          ${props.size === 'small' ? 'px-3' : ''}    
          `,
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
