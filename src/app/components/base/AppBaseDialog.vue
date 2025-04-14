<script setup lang="ts">
// Plugins
import eventBus from '@/plugins/mitt';

// Interfaces
interface IProps {
  isDraggable: boolean;
  isUsingBackdrop: boolean;
  isUsingClosableButton: boolean;
  isOpen: boolean;
  width: string;
}

const props = ref<IProps>({
  isDraggable: false,
  isUsingBackdrop: true,
  isUsingClosableButton: true,
  isOpen: false,
  width: '',
});

eventBus.on('AppBaseDialog', (params: unknown) => {
  props.value = params as IProps;
});
</script>

<template>
  <PrimeVueDialog
    class="p-6"
    :closable="props.isUsingClosableButton"
    :draggable="props.isDraggable"
    :dismissable-mask="false"
    :modal="props.isUsingBackdrop"
    :visible="props.isOpen"
    :pt="{
      content: 'px-0',
      header: 'px-0 pt-0',
      footer: 'p-0',
    }"
  >
    <template #header>
      <slot name="header" />
    </template>

    <template #default>
      <slot name="content" />
    </template>

    <!-- Check if user using slot footer or not -->
    <template #footer>
      <slot name="footer" />
    </template>
  </PrimeVueDialog>
</template>
