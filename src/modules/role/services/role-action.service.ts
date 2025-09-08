import useVuelidate from '@vuelidate/core';
import { IRoleFormData } from '../interfaces/index.interface';
import { IRoleActionProvided } from '../interfaces/role-action.interface';
import { useRoleStore } from '../store';
import eventBus from '@/plugins/mitt';

export const useRoleActionService = (): IRoleActionProvided => {
  const store = useRoleStore();
  const { roleList_editingItem } = storeToRefs(store);
  const role_formMode = ref<'update' | 'create'>('create');

  const role_formOnLoading = ref<boolean>(false);

  // const role_formValid = ref<boolean>(false);

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
    name: { required: true },
  }));

  const role_formValidationInstance = useVuelidate(role_formValidationRules, role_formData, {
    $autoDirty: true,
    $lazy: true,
  });

  const role_onSubmit = async (payload: IRoleFormData, id?: string) => {
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
        // await store.roleList_fetchListData(
        //   {
        //     page: 1,
        //     pageSize: 10,
        //     orderBy: null,
        //     orderDirection: null,
        //   },
        //   {},
        // );
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: result.statusCode === 201 ? EToastType.SUCCESS : EToastType.DANGER,
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
  };
};
