// useStorageLocationActionService.ts
import useVuelidate from '@vuelidate/core';
import {
  IStorageLocationActionProvided,
  IStorageLocationFormData,
} from '../interfaces/storage-location-action.interface';
import eventBus from '@/plugins/mitt';
import { ref, computed, watch } from 'vue';
import { useStorageLocationStore } from '../store';
import { IStorageLocationPayload } from '../interfaces';

export const useStorageLocationActionService = (): IStorageLocationActionProvided => {
  const store = useStorageLocationStore();
  const storageLocation_formOnLoading = ref<boolean>(false);

  const storageLocation_formData = ref<IStorageLocationFormData>({
    name: '',
    code: '',
    notes: '',
  });

  const storageLocation_createUpdatePayload = ref<IStorageLocationPayload>({
    name: '',
    code: '',
    notes: '',
  });

  // Rules simple
  const storageLocation_formValidationRules = computed(() => ({
    name: { required: true },
    notes: { required: false },
  }));

  const storageLocation_validModel = computed(() => ({
    name: storageLocation_formData.value.name,
    notes: storageLocation_formData.value.notes,
  }));

  // useVuelidate instance
  const storageLocation_formValidationInstance = useVuelidate(
    storageLocation_formValidationRules,
    storageLocation_validModel,
    {
      $autoDirty: true,
      $lazy: true,
    },
  );

  const storageLocation_onSubmit = async (
    payload: IStorageLocationFormData,
    mode: 'create' | 'edit',
    id?: string,
  ) => {
    storageLocation_formOnLoading.value = true;
    try {
      // Mapping payload ke data API
      storageLocation_createUpdatePayload.value = {
        code: payload.code,
        name: payload.name?.trim(),
        notes: payload.notes?.trim(),
      };

      console.log('storageLocation_createUpdatePayload.value', storageLocation_createUpdatePayload.value);

      let result;
      if (mode === 'create') {
        result = await store.storageLocation_createStorageLocation(storageLocation_createUpdatePayload.value);
      } else if (mode === 'edit' && id) {
        result = await store.storageLocation_editStorageLocation(id, storageLocation_createUpdatePayload.value);
      } else {
        throw new Error('Edit mode requires a valid storage location ID');
      }

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: result.message || 'Storage Location Action successfully!',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      // Refresh list setelah create/update
      await store.storageLocation_fetchListData(
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
      console.error('storageLocation_onSubmit error', error);
      throw error;
    } finally {
      storageLocation_formOnLoading.value = false;
    }
  };

  const storageLocation_onCancel = () => {
    const argsEventEmitter: IPropsDialog = {
      id: 'storage-location-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);

    storageLocation_formData.value.name = '';
    storageLocation_formData.value.notes = '';
  };

  const storageLocation_formValid = computed(() => {
    return storageLocation_formData.value.name.trim().length > 0;
  });

  // Sinkron payload setiap kali formData berubah
  watch(
    storageLocation_formData,
    newValue => {
      storageLocation_createUpdatePayload.value.name = newValue.name;
      storageLocation_createUpdatePayload.value.notes = newValue.notes;
    },
    { deep: true },
  );

  return {
    storageLocation_formOnLoading,
    storageLocation_formData,
    storageLocation_createUpdatePayload,
    storageLocation_formValid,
    storageLocation_formValidation: storageLocation_formValidationInstance,
    storageLocation_onSubmit,
    storageLocation_onCancel,
  };
};
