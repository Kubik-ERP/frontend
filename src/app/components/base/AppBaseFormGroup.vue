<script setup lang="ts">
// Constants
import { BaseValidation, ErrorObject } from '@vuelidate/core';

/**
 * @description Define the props interface
 */
interface IProps {
  classLabel?: string;
  isHideErrorMessage?: boolean;
  isNameAsLabel?: boolean;
  isNameAsPlaceholder?: boolean;
  isNotHaveSpacing?: boolean;
  isRequired?: boolean; // Add explicit required prop for array validations
  labelFor?: string;
  name: string;
  spacingBottom?: string;
  validators: BaseValidation | IValidationResult;
}

/**
 * @description Define props with default values and interfaces
 */
const props = withDefaults(defineProps<IProps>(), {
  classLabel: '',
  isHideErrorMessage: false,
  isNameAsLabel: false,
  isNameAsPlaceholder: false,
  isNotHaveSpacing: false,
  isRequired: false,
  name: '',
  spacingBottom: 'mb-4',
  validators: undefined,
});

/**
 * @description Check if the form is invalid
 */
const isInvalid = computed(() => {
  if (!props.validators) return false;

  // Handle IValidationResult from useFormValidateEach
  if ('$errors' in props.validators && Array.isArray(props.validators.$errors)) {
    return props.validators.$dirty && props.validators.$invalid;
  }

  // Handle BaseValidation from Vuelidate
  return (props.validators as BaseValidation).$dirty && (props.validators as BaseValidation).$invalid;
});

/**
 * @description Check the error message and retrieve the first error
 */
const error: ComputedRef<ErrorObject | null> = computed(() => {
  if (!props.validators) return null;

  // Handle IValidationResult from useFormValidateEach
  if ('$errors' in props.validators && Array.isArray(props.validators.$errors)) {
    const validationResult = props.validators as IValidationResult;
    return validationResult.$errors.length > 0 ? (validationResult.$errors[0] as ErrorObject) : null;
  }

  // Handle BaseValidation from Vuelidate
  const baseValidation = props.validators as BaseValidation;
  return baseValidation.$errors.length === 0 ? null : baseValidation.$errors[0];
});

/**
 * @description Check if field is required
 */
const isRequired = computed(() => {
  // Use explicit isRequired prop if provided (for array validations)
  if (props.isRequired) return true;

  // Check if validators has required property (for regular validations)
  if (props.validators && 'required' in props.validators) {
    return !!props.validators.required;
  }

  return false;
});

/**
 * @description Handle format error message should same as on the consants, Then don't forget to replace special character {attribute} with the value from the form
 */
const message: ComputedRef<string> = computed(() => {
  const errorValidator = error ? error?.value?.$validator : null;

  if (!errorValidator) return '';

  return replaceParams(VALIDATION_MESSAGE[errorValidator] ?? `Error : ${errorValidator}`, {
    attribute: props.name,
    ...error?.value?.$params,
  });
});
</script>

<template>
  <div id="form-group" :class="{ [spacingBottom]: !isNotHaveSpacing }">
    <label v-if="isNameAsLabel" :class="classLabel" :for="labelFor">
      {{ name
      }}<template v-if="validators">
        <span v-if="isRequired" class="text-error-main">*</span>
      </template>
    </label>
    <slot
      :is-error="!!error"
      :is-valid="isInvalid"
      :classes="{ 'border border-solid border-red-600': !!error, 'p-success': !isInvalid }"
    />
    <small class="text-red-600">{{ message }}</small>
  </div>
</template>
