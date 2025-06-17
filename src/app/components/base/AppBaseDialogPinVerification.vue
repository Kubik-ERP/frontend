<script setup lang="ts">
// Plugins
import eventBus from '@/plugins/mitt';

/**
 * @description Define the props interface
 */
interface IProps {
  isInvalid?: boolean;
  isOpen: boolean;
  onClickPrimaryButton?: () => void;
  onClickSecondaryButton?: () => void;
  pinConfirmation?: string;
  primaryButtonClass?: string;
  primaryButtonLabel?: string;
  secondaryButtonClass?: string;
  secondaryButtonLabel?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  isInvalid: false,
  isOpen: false,
  onClickPrimaryButton: () => {},
  onClickSecondaryButton: () => {},
  pinConfirmation: '',
  primaryButtonClass: 'bg-blue-primary border-none text-base w-fit px-4 py-[10px]',
  primaryButtonLabel: 'Update',
  secondaryButtonClass:
    'font-semibold text-base text-primary w-fit px-4 border-2 border-solid border-primary basic-smooth-animation hover:bg-grayscale-10',
  secondaryButtonLabel: 'Cancel',
});

/**
 * @description Reactive data binding
 */
const dialog = ref<IPropsDialog>({
  id: 'app-base-dialog-pin-verification',
  isDraggable: false,
  isUsingBackdrop: true,
  isUsingClosableButton: false,
  isOpen: false,
  width: '534px',
});
const dialogPinVerification = ref<IProps>({
  isInvalid: props.isInvalid,
  isOpen: props.isOpen,
  onClickPrimaryButton: () => {},
  onClickSecondaryButton: () => {},
  pinConfirmation: props.pinConfirmation,
  primaryButtonClass: props.primaryButtonClass,
  primaryButtonLabel: props.primaryButtonLabel,
  secondaryButtonClass: props.secondaryButtonClass,
  secondaryButtonLabel: props.secondaryButtonLabel,
});

/**
 * @description Handle two-way data binding with v-model using toRefs
 */
const emits = defineEmits(['update:pin-confirmation']);
const pinConfirmation = computed({
  get: function () {
    return props.pinConfirmation;
  },
  set: function (value) {
    emits('update:pin-confirmation', value);
  },
});

// Listen for events
eventBus.on('AppBaseDialogPinVerification', (params: unknown) => {
  const eventParams = params as IPropsDialogPinVerification;
  const argsEventEmitter: IPropsDialog = {
    id: dialog.value.id,
    isOpen: eventParams.isOpen ?? true,
  };

  dialogPinVerification.value = {
    ...dialogPinVerification.value,
    ...eventParams,
  };
  eventBus.emit('AppBaseDialog', argsEventEmitter);
});
</script>

<template>
  <AppBaseDialog v-bind="dialog">
    <template #header>
      <header class="flex flex-col gap-2">
        <h1 class="font-bold text-2xl leading-8">Enter Your PIN</h1>

        <p id="subtitle" class="font-normal text-base">For security, please enter your PIN to proceed</p>
      </header>
    </template>

    <template #content>
      <section id="content" class="flex justify-center w-full">
        <div class="flex flex-col items-center gap-4">
          <PrimeVueInputOtp
            v-model="pinConfirmation"
            class="[&>input]:bg-white [&>input]:border-grayscale-30 [&>input]:font-bold [&>input]:text-2xl [&>input]:w-16 [&>input]:h-16!"
            :class="[dialogPinVerification.isInvalid ? '[&>input]:!border-border-error' : '']"
            :length="6"
            mask
          />

          <span
            v-if="dialogPinVerification.isInvalid"
            class="inline-block font-normal text-error-main text-sm text-center w-full mt-3"
          >
            Incorrect PIN. Please try again
          </span>
        </div>
      </section>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          :class="dialogPinVerification.secondaryButtonClass"
          :label="dialogPinVerification.secondaryButtonLabel"
          severity="secondary"
          variant="outlined"
          @click="dialogPinVerification.onClickSecondaryButton"
        />

        <PrimeVueButton
          :class="dialogPinVerification.primaryButtonClass"
          :disabled="!pinConfirmation || pinConfirmation.length < 6"
          :label="dialogPinVerification.primaryButtonLabel"
          type="button"
          @click="dialogPinVerification.onClickPrimaryButton"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
