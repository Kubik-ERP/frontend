<script setup lang="ts">
// Interfaces
interface IProps {
  visible: boolean;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  iconName?: string;
}

interface IEmits {
  confirm: [];
  cancel: [];
  'update:visible': [value: boolean];
}

// Props with defaults
const props = withDefaults(defineProps<IProps>(), {
  title: () => useLocalization('productDetail.leavePageModal.title'),
  description: () => useLocalization('productDetail.leavePageModal.description'),
  confirmButtonText: () => useLocalization('productDetail.leavePageModal.discardButton'),
  cancelButtonText: () => useLocalization('productDetail.leavePageModal.cancelButton'),
  iconName: 'exclude',
});

// Emits
const emit = defineEmits<IEmits>();

/**
 * @description Handle confirm action
 */
const handleConfirm = (): void => {
  emit('confirm');
  emit('update:visible', false);
};

/**
 * @description Handle cancel action
 */
const handleCancel = (): void => {
  emit('cancel');
  emit('update:visible', false);
};
</script>

<template>
  <PrimeVueDialog :visible="visible" modal header="" @update:visible="emit('update:visible', $event)">
    <template #container>
      <div class="w-[512px] p-8">
        <div class="flex flex-col items-center gap-4 text-center">
          <AppBaseSvg :name="props.iconName" class="mx-auto !w-14 !h-14" />
          <h1 class="text-xl font-semibold text-black">{{ props.title }}</h1>
          <p class="font-normal text-grayscale-70 text-sm">{{ props.description }}</p>

          <div class="flex items-center gap-4 w-full">
            <PrimeVueButton
              class="bg-transparent border-none font-semibold text-base text-primary w-full basic-smooth-animation hover:bg-primary hover:text-white py-[10px]"
              :label="props.confirmButtonText"
              severity="secondary"
              variant="outlined"
              @click="handleConfirm"
            />

            <PrimeVueButton
              class="border border-solid border-blue-primary bg-transparent text-base py-[10px] w-full text-primary basic-smooth-animation rounded-lg hover:bg-primary hover:text-white"
              :label="props.cancelButtonText"
              type="button"
              @click="handleCancel"
            />
          </div>
        </div>
      </div>
    </template>
  </PrimeVueDialog>
</template>
