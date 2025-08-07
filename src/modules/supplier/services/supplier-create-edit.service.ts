// Composables
import { useHttpAbort } from '@/app/composables';

// Interfaces
import type { ISupplierCreatePayload, ISupplierUpdatePayload } from '../interfaces';

// Store
import { useSupplierStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useSupplierCreateEditService = () => {
  const store = useSupplierStore();
  const router = useRouter();
  const route = useRoute();
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding for form
   */
  const supplierForm_formData = reactive<ISupplierCreatePayload>({
    supplierName: '',
    contactPerson: '',
    phoneNumber: '',
    email: '',
    address: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: '',
    taxIdentificationNumber: '',
  });

  /**
   * @description Form validations
   */
  const supplierForm_formRules = computed(() => ({
    supplierName: { required },
    contactPerson: { required },
    phoneNumber: { required },
    email: { required, email },
    address: { required },
  }));

  const supplierForm_formValidations = useVuelidate(supplierForm_formRules, supplierForm_formData, {
    $autoDirty: true,
  });

  /**
   * @description Check if we are in edit mode
   */
  const supplierForm_isEditMode = computed(() => !!route.params.id);

  /**
   * @description Loading state
   */
  const supplierForm_isLoading = computed(() => store.supplier_isLoading);

  /**
   * @description Handle fetch supplier data for edit mode
   */
  const supplierForm_fetchSupplierData = async (): Promise<void> => {
    if (!route.params.id) return;

    try {
      const response = await store.supplier_getById(route.params.id as string, {
        ...httpAbort_registerAbort(`SUPPLIER_GET_${route.params.id}`),
      });

      // Populate form with fetched data
      const supplierData = response.data;
      supplierForm_formData.supplierName = supplierData.supplierName;
      supplierForm_formData.contactPerson = supplierData.contactPerson;
      supplierForm_formData.phoneNumber = supplierData.phoneNumber;
      supplierForm_formData.email = supplierData.email;
      supplierForm_formData.address = supplierData.address;
      supplierForm_formData.bankName = supplierData.bankName || '';
      supplierForm_formData.bankAccountNumber = supplierData.bankAccountNumber || '';
      supplierForm_formData.bankAccountName = supplierData.bankAccountName || '';
      supplierForm_formData.taxIdentificationNumber = supplierData.taxIdentificationNumber || '';
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle form submission
   */
  const supplierForm_onSubmit = async (): Promise<void> => {
    supplierForm_formValidations.value.$touch();

    if (supplierForm_formValidations.value.$invalid) {
      return;
    }

    try {
      if (supplierForm_isEditMode.value) {
        // Update existing supplier
        await store.supplier_update(route.params.id as string, supplierForm_formData as ISupplierUpdatePayload, {
          ...httpAbort_registerAbort(`SUPPLIER_UPDATE_${route.params.id}`),
        });
      } else {
        // Create new supplier
        await store.supplier_create(supplierForm_formData, {
          ...httpAbort_registerAbort('SUPPLIER_CREATE'),
        });
      }

      // Navigate back to supplier list
      router.push({ name: 'supplier-list' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle cancel action
   */
  const supplierForm_onCancel = (): void => {
    router.push({ name: 'supplier-list' });
  };

  // Initialize form data if in edit mode
  onMounted(() => {
    if (supplierForm_isEditMode.value) {
      supplierForm_fetchSupplierData();
    }
  });

  return {
    supplierForm_formData,
    supplierForm_formValidations,
    supplierForm_isEditMode,
    supplierForm_isLoading,
    supplierForm_onSubmit,
    supplierForm_onCancel,
  };
};
