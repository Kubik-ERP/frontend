import { ref, computed } from 'vue';
import { IInventoryCategoryCreateUpdatePayload } from '../interfaces';
import { IInventoryCategoryCreateProvided } from '../interfaces/inventory-category-create.interface';
import { useInventoryCategoryStore } from '../store';
import useVuelidate from '@vuelidate/core';
import eventBus from '@/plugins/mitt';
import { useInventoryCategoryService } from './inventory-category.service';

export const inventoryCategoryCreateService = (): IInventoryCategoryCreateProvided => {
  const store = useInventoryCategoryStore();
  const {
    inventoryCategoryList_fetchData,
    inventoryCategoryList_editingItem,
    inventoryCategoryFormMode,
  } = useInventoryCategoryService();

  const inventoryCategoryCreate_isLoading = ref<boolean>(false);

  const inventoryCategoryCreate_formData = ref<IInventoryCategoryCreateUpdatePayload>({
    name: '',
    code: '',
    notes: '',
  });

  // Auto-isi form kalau mode edit
  if (inventoryCategoryFormMode.value === 'edit' && inventoryCategoryList_editingItem.value) {
    inventoryCategoryCreate_formData.value = {
      name: inventoryCategoryList_editingItem.value.name,
      code: inventoryCategoryList_editingItem.value.code,
      notes: inventoryCategoryList_editingItem.value.notes,
    };
  }

  const inventoryCategoryCreate_formValidations = computed(() => ({
    name: { required: true },
    notes: { required: false },
  }));

  const inventoryCategoryValid = computed(() => ({
    name: inventoryCategoryCreate_formData.value.name,
    notes: inventoryCategoryCreate_formData.value.notes,
  }));

  const inventoryCategoryCreate_Validation = useVuelidate(
    inventoryCategoryCreate_formValidations,
    inventoryCategoryValid,
    {
      $autoDirty: true,
      $lazy: true,
    },
  );

  const inventoryCategoryCreate_isValid = computed<boolean>(() => {
    return inventoryCategoryCreate_formData.value.name.trim().length > 0;
  });

  const inventoryCategoryCreate_onSubmit = async (
    payload: IInventoryCategoryCreateUpdatePayload,
    mode: 'create' | 'edit' = 'create',
    id?: string,
  ): Promise<void> => {
    inventoryCategoryCreate_isLoading.value = true;
    const data = {
      name: payload.name?.trim(),
      code: payload.code,
      notes: payload.notes?.trim(),
    }
    try {
      let result;
      if (mode === 'create') {
        result = await store.inventoryCategoryList_createCategory(data);
      } else if (mode === 'edit' && id) {
        result = await store.inventoryCategoryList_editCategory(id, data);
      } else {
        throw new Error('Edit mode requires a valid category ID');
      }

      // Tutup modal
      eventBus.emit('AppBaseDialog', {
        id: 'inventory-category-modal-form',
        isUsingClosableButton: false,
        isUsingBackdrop: true,
        isOpen: false,
        width: '600px',
      } as IPropsDialog);

      // Tampilkan toast
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: result?.message || (mode === 'create'
          ? 'Category created successfully!'
          : 'Category updated successfully!'),
        position: EToastPosition.TOP_RIGHT,
      };
      eventBus.emit('AppBaseToast', argsEventEmitter);

      // Refresh list
      inventoryCategoryList_fetchData();

      // Reset form
      inventoryCategoryCreate_onCancel();
    } catch (error) {
      console.error('Error creating/updating category:', error);
      inventoryCategoryCreate_onCancel();
      throw error;
    } finally {
      inventoryCategoryCreate_isLoading.value = false;
    }
  };

  const inventoryCategoryCreate_onCancel = (): void => {
    inventoryCategoryCreate_formData.value = {
      name: '',
      code: '',
      notes: '',
    };
    inventoryCategoryList_editingItem.value = null;

    eventBus.emit('AppBaseDialog', {
      id: 'inventory-category-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    } as IPropsDialog);
  };

  return {
    inventoryCategoryCreate_isLoading,
    inventoryCategoryCreate_formData,
    inventoryCategoryCreate_onSubmit,
    inventoryCategoryCreate_onCancel,
    inventoryCategoryCreate_values: inventoryCategoryCreate_formData,
    inverntoryCategoryCreate_Validation: inventoryCategoryCreate_Validation,
    inventoryCategoryCreate_isValid,
  };
};
