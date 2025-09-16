<script setup lang="ts">
// Plugins
import eventBus from '@/plugins/mitt';

// Interfaces
interface IProps {
  customBodyClass?: string;
  customHeaderClass?: string;
  customFooterClass?: string;
  id: string; // Unique identifier for this dialog instance
  isDraggable?: boolean;
  isUsingBackdrop?: boolean;
  isUsingClosableButton?: boolean;
  isOpen?: boolean;
  width?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  customBodyClass: 'px-6',
  customFooterClass: 'px-6 pb-6',
  customHeaderClass: 'px-6 pt-6',
  isDraggable: false,
  isUsingBackdrop: true,
  isUsingClosableButton: true,
  isOpen: false,
  width: '50vw',
});

// Reactive dialog state
const dialogProps = ref<IProps>({
  customBodyClass: props.customBodyClass,
  customHeaderClass: props.customHeaderClass,
  customFooterClass: props.customFooterClass,
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
  <PrimeVueDialog
    :closable="dialogProps.isUsingClosableButton"
    :draggable="dialogProps.isDraggable"
    :dismissable-mask="false"
    :modal="dialogProps.isUsingBackdrop"
    :visible="dialogProps.isOpen"
    :style="`width: ${dialogProps.width}; max-width: 90vw;`"
    :pt="{
      content: dialogProps.customBodyClass,
      header: dialogProps.customHeaderClass,
      footer: dialogProps.customFooterClass,
    }"
  >
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
