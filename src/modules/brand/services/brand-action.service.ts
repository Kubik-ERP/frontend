// useBrandActionService.ts
import useVuelidate from '@vuelidate/core';
import { IBrandCreateUpdatePayload } from '../interfaces';
import { IBrandActionProvided, IBrandFormData } from '../interfaces/brand-action.interface';
import eventBus from '@/plugins/mitt';
import { ref, computed, watch } from 'vue';
import { useBrandStore } from '../store';

export const useBrandActionService = (): IBrandActionProvided => {
  const store = useBrandStore();
  const brand_formOnLoading = ref<boolean>(false);
  const brand_formData = ref<IBrandFormData>({
    brandName: '',
    notes: '',
  });

  const brand_createUpdatePayload = ref<IBrandCreateUpdatePayload>({
    brandName: '',
    notes: '',
  });

  // rules simple (ganti/expand sesuai kebutuhan)
  const brand_formValidationRules = computed(() => ({
    brandName: { required: true },
    notes: { required: false },
  }));

  const brand_validModel = computed(() => ({
    brandName: brand_formData.value.brandName,
    notes: brand_formData.value.notes,
  }));

  // useVuelidate instance
  const brand_formValidationInstance = useVuelidate(brand_formValidationRules, brand_validModel, {
    $autoDirty: true,
    $lazy: true,
  });

  const brand_onSubmit = async (payload: IBrandFormData, mode: 'create' | 'edit', id?: string) => {
    brand_formOnLoading.value = true;
    try {
      // Mapping payload ke data yang dikirim ke API
      brand_createUpdatePayload.value = {
        brandName: payload.brandName?.trim(),
        notes: payload.notes?.trim(),
      };

      let result;
      if (mode === 'create') {
        result = await store.brandList_createBrand(brand_createUpdatePayload.value);
      } else if (mode === 'edit' && id) {
        result = await store.brandList_editBrand(id, brand_createUpdatePayload.value);
      } else {
        throw new Error('Edit mode requires a valid brand ID');
      }
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: result.message || 'Brand Action successfully!',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      // Refresh list setelah create/update
      await store.brandList_fetchList(
        {
          page: 1,
          pageSize: 10,
          search: null,
          orderBy: null,
          orderDirection: null,
        },
        {},
      );
    } catch (error) {
      console.error('brand_onSubmit error', error);
      throw error;
    } finally {
      brand_formOnLoading.value = false;
    }
  };

  const brand_onCancel = () => {
    const argsEventEmitter: IPropsDialog = {
      id: 'brand-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  const brand_formValid = computed(() => {
    // simple computed: brandName must not be empty
    return brand_formData.value.brandName.trim().length > 0;
  });

  // sinkron payload setiap kali formData berubah
  watch(
    brand_formData,
    newValue => {
      brand_createUpdatePayload.value.brandName = newValue.brandName;
      brand_createUpdatePayload.value.notes = newValue.notes;
    },
    { deep: true },
  );

  return {
    brand_formOnLoading,
    brand_formData,
    brand_createUpdatePayload,
    brand_formValid,
    brand_formValidation: brand_formValidationInstance,
    brand_onSubmit,
    brand_onCancel,
  };
};
