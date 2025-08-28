<script setup lang="ts">
// Plugins
import eventBus from '@/plugins/mitt';

/**
 * @description Define the props interface
 */
interface IProps {
  id: string;
  description?: string;
  iconName?: string;
  isLoading?: boolean;
  isOpen?: boolean;
  isUsingIcon?: boolean;
  isUsingButtonActions?: boolean;
  isUsingButtonSecondary?: boolean;
  isUsingHtmlTagOnDescription?: boolean;
  onClickButtonPrimary?: () => void;
  onClickButtonSecondary?: () => void;
  textButtonPrimary?: string;
  textButtonSecondary?: string;
  title?: string;
  type?: 'error' | 'info';
  width?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  id: 'app-base-dialog-confirmation',
  description: '',
  iconName: 'info',
  isLoading: false,
  isOpen: false,
  isUsingIcon: true,
  isUsingButtonActions: true,
  isUsingButtonSecondary: false,
  isUsingHtmlTagOnDescription: false,
  onClickButtonPrimary: () => {},
  onClickButtonSecondary: () => {},
  textButtonPrimary: 'OK',
  textButtonSecondary: 'Cancel',
  title: '',
  type: 'info',
  width: '',
  secondaryIcon: 'delete',
});

/**
 * @description Reactive data binding
 */
const dialogConfirmation = ref<IProps>({
  id: props.id,
  description: '',
  iconName: 'info',
  isLoading: false,
  isOpen: false,
  isUsingIcon: true,
  isUsingButtonActions: true,
  isUsingButtonSecondary: false,
  isUsingHtmlTagOnDescription: false,
  onClickButtonPrimary: () => {},
  onClickButtonSecondary: () => {},
  textButtonPrimary: 'OK',
  textButtonSecondary: 'Cancel',
  title: '',
  type: 'info',
  width: '',
});
const dialog = ref<IPropsDialog>({
  id: dialogConfirmation.value.id,
  isDraggable: false,
  isUsingBackdrop: true,
  isUsingClosableButton: false,
  isOpen: false,
  width: dialogConfirmation.value.width || '534px',
});

eventBus.on('AppBaseDialogConfirmation', (params: unknown) => {
  const eventParams = params as IProps;

  if (eventParams.id === dialogConfirmation.value.id) {
    const argsEventEmitter: IPropsDialog = {
      id: dialogConfirmation.value.id,
      isOpen: eventParams.isOpen ?? true,
      width: eventParams.width || '534px',
    };

    dialogConfirmation.value = {
      ...dialogConfirmation.value,
      ...eventParams,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  }
});
</script>

<template>
  <AppBaseDialog v-bind="dialog">
    <template #header>
      <header class="flex flex-col items-center gap-2 w-full">
        <AppBaseSvg :name="dialogConfirmation.iconName" class="!w-14 !h-14" />
      </header>
    </template>

    <template #content>
      <section id="content" class="flex flex-col items-center gap-3">
        <h6 class="font-semibold text-black text-center text-lg">
          {{ dialogConfirmation.title }}
        </h6>

        <template v-if="dialogConfirmation.isUsingHtmlTagOnDescription">
          <div v-html="dialogConfirmation.description"></div>
        </template>

        <template v-else>
          <p class="font-normal text-black-secondary text-center text-sm">
            {{ dialogConfirmation.description }}
          </p>
        </template>
      </section>
    </template>

    <template #footer>
      <footer v-if="dialogConfirmation.isUsingButtonActions" class="flex items-center gap-4 w-full">
        <section v-if="dialogConfirmation.isUsingButtonSecondary" id="button-secondary" class="w-full">
          <template v-if="dialogConfirmation.type === 'error'">
            <PrimeVueButton
              class="w-full border-none bg-transparent basic-smooth-animation hover:bg-grayscale-10"
              severity="secondary"
              :loading="dialogConfirmation.isLoading"
              @click="dialogConfirmation.onClickButtonSecondary"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2">
                  <AppBaseSvg :name="dialogConfirmation.iconName === 'exclude' ? 'exclude' : 'delete'" />
                  <span class="font-semibold text-base text-error-main">
                    {{ dialogConfirmation.textButtonSecondary }}
                  </span>
                </section>
              </template>
            </PrimeVueButton>
          </template>

          <template v-else>
            <PrimeVueButton
              class="border-blue-primary bg-transparent font-semibold text-base text-blue-primary w-full basic-smooth-animation hover:bg-grayscale-10"
              :label="dialogConfirmation.textButtonSecondary"
              :loading="dialogConfirmation.isLoading"
              severity="secondary"
              variant="outlined"
              @click="dialogConfirmation.onClickButtonSecondary"
            />
          </template>
        </section>

        <PrimeVueButton
          class="bg-blue-primary border-none text-sm py-[10px] w-full"
          :label="dialogConfirmation.textButtonPrimary"
          type="button"
          :loading="dialogConfirmation.isLoading"
          @click="dialogConfirmation.onClickButtonPrimary"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
