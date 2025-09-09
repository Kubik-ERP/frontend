import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { IRoleFormData } from '../interfaces/index.interface';
import { IRoleActionProvided } from '../interfaces/role-action.interface';
import { useRoleStore } from '../store';
import eventBus from '@/plugins/mitt';

export const useRoleActionService = (): IRoleActionProvided => {
  const store = useRoleStore();
  const { roleList_editingItem } = storeToRefs(store);
  const role_formMode = ref<'update' | 'create'>('create');

  const role_formOnLoading = ref<boolean>(false);

  const role_formData = ref<IRoleFormData>({
    id: '',
    name: '',
  });

  watch(roleList_editingItem, value => {
    if (value) {
      role_formMode.value = 'update';
      role_formData.value = {
        id: value.id,
        name: value.name,
      };
    } else {
      role_formMode.value = 'create';
      role_formData.value = {
        id: '',
        name: '',
      };
    }
  });

  const role_formValidationRules = computed(() => ({
    name: { required },
  }));

  const role_validModel = computed(() => ({
    name: role_formData.value.name,
  }));

  const role_formValidationInstance = useVuelidate(role_formValidationRules, role_validModel, {
    $autoDirty: true,
    $lazy: true,
  });

  const role_formValid = computed(() => !role_formValidationInstance.value.$invalid);

  const role_onSubmit = async (payload: IRoleFormData, id?: string) => {
    const isFormCorrect = await role_formValidationInstance.value.$validate();
    if (!isFormCorrect) {
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.DANGER,
        message: 'Please fill all required fields',
        position: EToastPosition.TOP_RIGHT,
      };
      eventBus.emit('AppBaseToast', argsEventEmitter);
      return;
    }

    role_formOnLoading.value = true;
    try {
      let result;
      if (id) {
        result = await store.role_onUpdateData(payload, id);
      } else {
        result = await store.role_onCreateData(payload);
      }

      eventBus.emit('AppBaseDialog', {
        id: 'role-modal-form',
        isUsingClosableButton: false,
        isUsingBackdrop: true,
        isOpen: false,
        width: '600px',
      });

      if (result) {
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: result.statusCode === 201 || result.statusCode === 200 ? EToastType.SUCCESS : EToastType.DANGER,
          message: result.message || 'Role Action successfully!',
          position: EToastPosition.TOP_RIGHT,
        };
        eventBus.emit('AppBaseToast', argsEventEmitter);
      }
    } catch (error) {
      console.log(error);
    } finally {
      role_formOnLoading.value = false;
    }
  };

  const role_onCancel = () => {
    role_formData.value = {
      id: '',
      name: '',
    };
    eventBus.emit('AppBaseDialog', {
      id: 'role-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  return {
    role_onSubmit,
    role_formOnLoading,
    role_formData,
    role_onCancel,
    role_formValidation: role_formValidationInstance,
    role_formMode,
    role_formValid,
  };
};

