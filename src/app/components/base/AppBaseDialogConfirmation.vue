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
  // Enhanced form support
  isUsingForm?: boolean;
  formData?: Record<string, unknown>;
  formFields?: IDialogFormField[];
  formValidations?: Record<string, unknown>;
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
  isUsingForm: false,
  formData: () => ({}),
  formFields: () => [],
  formValidations: () => ({}),
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
  isUsingForm: false,
  formData: {},
  formFields: [],
  formValidations: {},
});
const dialog = ref<IPropsDialog>({
  id: dialogConfirmation.value.id,
  isDraggable: false,
  isUsingBackdrop: true,
  isUsingClosableButton: false,
  isOpen: false,
  width: dialogConfirmation.value.width || '534px',
});

/**
 * @description Get field validation errors
 */
const getFieldValidation = (fieldKey: string) => {
  const validations = dialogConfirmation.value.formValidations as Record<string, unknown>;
  return validations?.[fieldKey];
};

/**
 * @description Check if form is valid
 */
const isFormValid = computed(() => {
  if (!dialogConfirmation.value.isUsingForm) return true;

  const validations = dialogConfirmation.value.formValidations as Record<string, { $invalid: boolean }>;
  if (!validations) return true;

  return Object.values(validations).every(validation => !validation.$invalid);
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
          <div class="text-center" v-html="dialogConfirmation.description"></div>
        </template>

        <template v-else>
          <p class="font-normal text-black-secondary text-center text-sm">
            {{ dialogConfirmation.description }}
          </p>
        </template>

        <!-- Enhanced Form Section -->
        <section
          v-if="dialogConfirmation.isUsingForm && dialogConfirmation.formFields"
          id="form-section"
          class="w-full mt-4"
        >
          <form class="flex flex-col gap-4" @submit.prevent>
            <template v-for="field in dialogConfirmation.formFields" :key="field.key">
              <AppBaseFormGroup
                v-slot="{ classes }"
                :class-label="'block text-sm font-medium leading-6 text-gray-900 w-full'"
                :is-name-as-label="true"
                :label-for="field.key"
                :name="field.label"
                spacing-bottom="mb-0"
                :validators="getFieldValidation(field.key)"
              >
                <!-- Text Input -->
                <PrimeVueInputText
                  v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'"
                  :id="field.key"
                  v-model="(dialogConfirmation.formData as Record<string, string>)[field.key]"
                  :type="field.type"
                  :placeholder="field.placeholder"
                  :disabled="field.disabled"
                  class="text-base text-text-primary w-full"
                  :class="{ ...classes }"
                />

                <!-- Textarea -->
                <PrimeVueTextarea
                  v-else-if="field.type === 'textarea'"
                  :id="field.key"
                  v-model="(dialogConfirmation.formData as Record<string, string>)[field.key]"
                  :placeholder="field.placeholder"
                  :disabled="field.disabled"
                  :rows="field.rows || 3"
                  class="text-base text-text-primary w-full resize-none"
                  :class="{ ...classes }"
                />

                <!-- Number Input -->
                <PrimeVueInputNumber
                  v-else-if="field.type === 'number'"
                  :id="field.key"
                  v-model="(dialogConfirmation.formData as Record<string, number>)[field.key]"
                  :placeholder="field.placeholder"
                  :disabled="field.disabled"
                  class="text-base text-text-primary w-full"
                  :class="{ ...classes }"
                />

                <!-- Select/Dropdown -->
                <PrimeVueSelect
                  v-else-if="field.type === 'select'"
                  :id="field.key"
                  v-model="(dialogConfirmation.formData as Record<string, string>)[field.key]"
                  :options="field.options"
                  option-label="label"
                  option-value="value"
                  :placeholder="field.placeholder"
                  :disabled="field.disabled"
                  class="text-base text-text-primary w-full"
                  :class="{ ...classes }"
                />

                <!-- Date Input -->
                <PrimeVueDatePicker
                  v-else-if="field.type === 'date'"
                  :id="field.key"
                  v-model="(dialogConfirmation.formData as Record<string, Date>)[field.key]"
                  :placeholder="field.placeholder"
                  :disabled="field.disabled"
                  class="text-base text-text-primary w-full"
                  :class="{ ...classes }"
                  show-icon
                  date-format="dd/mm/yy"
                />
              </AppBaseFormGroup>
            </template>
          </form>
        </section>
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
                  <span class="font-semibold text-base text-error-main">
                    {{ dialogConfirmation.textButtonSecondary }}
                  </span>
                </section>
              </template>
            </PrimeVueButton>
          </template>

          <template v-else>
            <PrimeVueButton
              class="border-primary bg-transparent font-semibold text-base text-primary w-full basic-smooth-animation hover:bg-grayscale-10"
              :label="dialogConfirmation.textButtonSecondary"
              :loading="dialogConfirmation.isLoading"
              severity="secondary"
              variant="outlined"
              @click="dialogConfirmation.onClickButtonSecondary"
            />
          </template>
        </section>

        <PrimeVueButton
          class="bg-primary border-none text-sm py-[10px] w-full"
          :class="{ 'opacity-50 cursor-not-allowed': dialogConfirmation.isUsingForm && !isFormValid }"
          :label="dialogConfirmation.textButtonPrimary"
          type="button"
          :loading="dialogConfirmation.isLoading"
          :disabled="dialogConfirmation.isUsingForm && !isFormValid"
          @click="dialogConfirmation.onClickButtonPrimary"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
