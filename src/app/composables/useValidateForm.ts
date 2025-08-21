import { BaseValidation } from '@vuelidate/core';

// Type for nested validation structure
interface NestedValidation {
  configurations?: {
    $each?: {
      $response?: {
        $data?: Array<{
          tables?: {
            $each?: {
              $response?: {
                $data?: Array<{
                  [key: string]: {
                    $touch?: () => void;
                  };
                }>;
              };
            };
          };
        }>;
      };
    };
  };
}

/**
 * @description Handle binding state form
 */
export const useBindStateForm = (placeholder: string): IBindStateForm => {
  return {
    solo: true,
    flat: true,
    placeholder,
    class: 'custom-textfield font-weight-bold font-inter',
    hideDetails: 'auto',
    autocomplete: 'new-password',
  };
};

/**
 * @description Handle listener form
 */
export const useListenerForm = (validations: BaseValidation, formName: string): IResponseListenerForm => {
  return {
    input: validations[formName].$touch,
    blur: validations[formName].$touch,
  };
};

/**
 * @description Handle listener form for nested validations (e.g., customRecurrence.interval)
 */
export const useListenerFormNestedField = (
  validations: BaseValidation,
  parentField: string,
  childField: string,
): IResponseListenerForm => {
  try {
    const parentValidation = validations[parentField];
    const childValidation = parentValidation?.[childField];

    if (childValidation && childValidation.$touch) {
      return {
        input: childValidation.$touch,
        blur: childValidation.$touch,
      };
    }
  } catch (error) {
    console.error(`Error accessing nested validation for field "${parentField}.${childField}":`, error);
  }

  // Return safe defaults if validation access fails
  return {
    input: () => {},
    blur: () => {},
  };
};

/**
 * @description Safe version of useListenerForm for nested validations
 */
export const useListenerFormNested = (
  validation: NestedValidation,
  floorIndex: number,
  tableIndex: number,
  fieldName: string,
): IResponseListenerForm => {
  try {
    const fieldValidation =
      validation?.configurations?.$each?.$response?.$data?.[floorIndex]?.tables?.$each?.$response?.$data?.[
        tableIndex
      ]?.[fieldName];

    if (fieldValidation && fieldValidation.$touch) {
      return {
        input: fieldValidation.$touch,
        blur: fieldValidation.$touch,
      };
    }
  } catch (error) {
    console.error(`Error accessing nested validation for field "${fieldName}":`, error);
  }

  // Return safe defaults if validation access fails
  return {
    input: () => {},
    blur: () => {},
  };
};

/**
 * @description Handle listener form for array fields using useFormValidateEach pattern
 */
export const useListenerFormEach = (
  validation: BaseValidation,
  fieldIndex: number,
  fieldName: string,
): IResponseListenerForm => {
  try {
    const fieldValidation = validation.$each?.$response?.$data?.[fieldIndex]?.[fieldName];

    if (fieldValidation && fieldValidation.$touch) {
      return {
        input: fieldValidation.$touch,
        blur: fieldValidation.$touch,
      };
    }
  } catch (error) {
    console.error(`Error accessing array validation for field "${fieldName}" at index ${fieldIndex}:`, error);
  }

  // Return safe defaults if validation access fails
  return {
    input: () => {},
    blur: () => {},
  };
};

/**
 * @description A simpler composable to access validation states for deeply nested fields.
 * Specifically designed for the configurations[index].tables[index].field structure.
 */
export const useFormValidateEach = ({
  validation,
  field,
  fieldIndex,
  nesting = null,
  subNesting,
}: IVuelidateValidationEachConfig): IValidationResult => {
  // Suppress unused parameter warning
  void subNesting;

  // Guard clause for required validation parameter
  if (!validation) {
    throw new Error('Parameter "validation" is required in useFormValidateEach');
  }

  try {
    // For your specific case: configurations[floorIndex].tables[tableIndex].field
    if (nesting && fieldIndex !== null && fieldIndex !== undefined) {
      const floorIndex = nesting.index;
      const tableIndex = fieldIndex;

      // Direct access to the nested validation structure
      const fieldValidation =
        validation.configurations?.$each?.$response?.$data?.[floorIndex]?.tables?.$each?.$response?.$data?.[
          tableIndex
        ]?.[field];

      if (fieldValidation) {
        return {
          $invalid: fieldValidation.$invalid ?? false,
          $dirty: fieldValidation.$dirty ?? false,
          $errors: fieldValidation.$errors ?? [],
        };
      }
    }

    // Simple array case: validation.$each.$response.$data[fieldIndex][field]
    if (!nesting && fieldIndex !== null && fieldIndex !== undefined) {
      const fieldValidation = validation.$each?.$response?.$data?.[fieldIndex]?.[field];

      if (fieldValidation) {
        return {
          $invalid: fieldValidation.$invalid ?? false,
          $dirty: fieldValidation.$dirty ?? false,
          $errors: fieldValidation.$errors ?? [],
        };
      }
    }

    // Fallback: try to access the field validation directly
    const directValidation = validation[field];
    if (directValidation) {
      return {
        $invalid: directValidation.$invalid ?? false,
        $dirty: directValidation.$dirty ?? false,
        $errors: directValidation.$errors ?? [],
      };
    }
  } catch (error) {
    console.error(`Error accessing validation for field "${field}":`, error);
  }

  // Return safe defaults if validation access fails
  return {
    $invalid: false,
    $dirty: false,
    $errors: [],
  };
};
