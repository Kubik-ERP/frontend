<script setup lang="ts">
// Plugins
import eventBus from '@/plugins/mitt';

// Interfaces
interface IProps {
  description?: string;
  iconName?: string;
  isLoading?: boolean;
  isOpen?: boolean;
  isUsingIcon?: boolean;
  isUsingButtonActions?: boolean;
  isUsingButtonSecondary?: boolean;
  onClickButtonPrimary?: () => void;
  onClickButtonSecondary?: () => void;
  textButtonPrimary?: string;
  textButtonSecondary?: string;
  title?: string;
  type?: 'error' | 'info';
  width?: string;
}

const props = ref<IProps>({
  description: '',
  iconName: 'info',
  isLoading: false,
  isOpen: false,
  isUsingIcon: true,
  isUsingButtonActions: true,
  isUsingButtonSecondary: false,
  onClickButtonPrimary: () => {},
  onClickButtonSecondary: () => {},
  textButtonPrimary: 'OK',
  textButtonSecondary: 'Cancel',
  title: '',
  type: 'info',
  width: '',
});

eventBus.on('AppBaseDialogConfirmation', (params: unknown) => {
  props.value = {
    ...props.value,
    ...params as IProps
  };
});
</script>

<template>
  <AppBaseDialog
    :is-draggable="false"
    :is-open="props.isOpen"
    :is-using-closable-button="false"
    :is-using-backdrop="true"
  >
    <template #header>
      <AppBaseSvg :name="props.iconName" />
    </template>

    <template #content>
      <section id="content" class="flex flex-col gap-3">
        <h6 class="font-semibold text-black text-lg">
          {{ props.title }}
        </h6>

        <p class="font-normal text-black-secondary text-center text-sm">
          {{ props.description }}
        </p>
      </section>
    </template>

    <template #footer>
      <footer v-if="props.isUsingButtonActions" class="flex items-center gap-4 w-full">
        <section v-if="props.isUsingButtonSecondary" id="button-secondary">
          <template v-if="props.type === 'error'">
            <PrimeVueButton
              class="w-full border-none bg-transparent basic-smooth-animation hover:bg-grayscale-10"
              severity="secondary"
              :loading="props.isLoading"
              @click="props.onClickButtonSecondary"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2">
                  <AppBaseSvg name="delete" />
                  <span class="font-semibol text-base text-error-main">
                    {{ props.textButtonSecondary }}
                  </span>
                </section>
              </template>
            </PrimeVueButton>
          </template>

          <template v-else>
            <PrimeVueButton
              class="border-blue-primary bg-transparent font-semibold text-base text-blue-primary w-full basic-smooth-animation hover:bg-grayscale-10"
              :label="props.textButtonSecondary"
              :loading="props.isLoading"
              severity="secondary"
              variant="outlined"
              @click="props.onClickButtonSecondary"
            />
          </template>
        </section>

        <PrimeVueButton
          class="bg-blue-primary border-none text-sm py-[10px] w-full"
          :label="props.textButtonPrimary"
          type="button"
          :loading="props.isLoading"
          @click="props.onClickButtonPrimary"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
