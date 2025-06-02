<script setup lang="ts">
// Plugins
import eventBus from '@/plugins/mitt';

// Interfaces
interface IProps {
  id: string; // Unique identifier for this dialog instance
  isDraggable?: boolean;
  isUsingBackdrop?: boolean;
  isUsingClosableButton?: boolean;
  isOpen?: boolean;
  width?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  isDraggable: false,
  isUsingBackdrop: true,
  isUsingClosableButton: true,
  isOpen: false,
  width: '50vw',
});

// Reactive dialog state
const dialogProps = ref<IProps>({
  id: props.id,
  isDraggable: props.isDraggable,
  isUsingBackdrop: props.isUsingBackdrop,
  isUsingClosableButton: props.isUsingClosableButton,
  isOpen: props.isOpen,
  width: props.width,
});

// Listen for events, but only update if the event's id matches this dialog's id
eventBus.on('AppBaseDialog', (params: unknown) => {
  const eventParams = params as IPropsDialog;
  if (eventParams.id === props.id) {
    dialogProps.value = {
      ...dialogProps.value,
      ...eventParams,
    };
  }
});
</script>

<template>
  <PrimeVueDialog class="p-6" :closable="dialogProps.isUsingClosableButton" :draggable="dialogProps.isDraggable"
    :dismissable-mask="false" :modal="dialogProps.isUsingBackdrop" :visible="dialogProps.isOpen"
    :style="`width: ${dialogProps.width}`" :pt="{
      content: 'px-0',
      header: 'px-0 pt-0',
      footer: 'p-0',
    }">
    <template #header>
      <slot name="header" />
    </template>

    <template #default>
      <slot name="content" />
    </template>

    <template #footer>
      <slot name="footer" />
    </template>
  </PrimeVueDialog>
</template>