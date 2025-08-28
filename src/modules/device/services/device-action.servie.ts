import useVuelidate from '@vuelidate/core';
import { IDeviceActionProvided, IDeviceFormData, IDevicePayload } from '../interfaces';
import { useDeviceStore } from '../store';
import { DEVICE_LIST_REQUEST } from '../constans/index.constant';
import eventBus from '@/plugins/mitt';
import { useDeviceListService } from './device-list-service';

export const useDeviceActionService = (): IDeviceActionProvided => {
  const store = useDeviceStore();
  const { deviceList_editingItem, deviceList_formMode, deviceList_loading, deviceList_actionResponse } =
    storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();
  const { device_fetchData } = useDeviceListService();

  const device_actionformData = ref<IDeviceFormData>({
    name: '',
  });

  const deviceAction_formValidationRules = computed(() => ({
    name: { required: true },
  }));

  const deviceAction_validModel = computed(() => ({
    name: device_actionformData.value.name,
  }));

  // useVuelidate instance
  const deviceAction_formValidation = useVuelidate(deviceAction_formValidationRules, deviceAction_validModel, {
    $autoDirty: true,
    $lazy: true,
  });

  watchEffect(() => {
    if (deviceList_formMode.value === 'create') {
      device_actionformData.value.name = '';
    } else if (deviceList_formMode.value === 'edit' && deviceList_editingItem.value) {
      device_actionformData.value = { ...deviceList_editingItem.value };
    }
  });

  const formValid = computed(() => {
    // simple computed: name must not be empty
    return device_actionformData.value.name.trim() !== '';
  });

  /**
   * @description : handle action in modal form
   * */
  const device_ActionOnSubmit = async (id?: string, payload?: IDevicePayload) => {
    if (deviceList_formMode.value === 'create') {
      deviceList_actionResponse.value = await store.deviceList_createData(payload as IDevicePayload, {
        ...httpAbort_registerAbort(DEVICE_LIST_REQUEST + '_CREATE'),
      });
    } else if (deviceList_formMode.value === 'edit') {
      console.log('edit', id, payload);
      deviceList_actionResponse.value = await store.deviceList_updateData(
        id as string,
        payload as IDevicePayload,
        {
          ...httpAbort_registerAbort(DEVICE_LIST_REQUEST + '_UPDATE'),
        },
      );
    }
  };

  const device_ActionOnCancel = () => {
    device_actionformData.value = { name: '' };
    deviceList_actionResponse.value = {
      statusCode: 200,
      message: '',
      data: { id: '', name: '', code: '', status: '', lastConnectedAt: '' },
    };

    eventBus.emit('AppBaseDialog', {
      id: 'device-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  const device_actionOnDisconnect = async (id: string) => {
    eventBus.emit('AppBaseDialog', {
      id: 'device-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'device-dialog-confirmation',
      description:
        'Once disconected, it will no longer have a access to the POS and cannot be used for transactions.',
      iconName: 'exclude',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingIcon: false,
      onClickButtonPrimary: () => {
        // Tutup dialog
        eventBus.emit('AppBaseDialogConfirmation', {
          id: 'device-dialog-confirmation',
          isOpen: false,
        } as IPropsDialogConfirmation);
      },
      onClickButtonSecondary: async () => {
        // Tutup dialog
        eventBus.emit('AppBaseDialogConfirmation', {
          id: 'device-dialog-confirmation',
          isOpen: false,
        } as IPropsDialogConfirmation);

        try {
          const res = await store.deviceList_deleteData(id, {
            ...httpAbort_registerAbort(DEVICE_LIST_REQUEST),
          });

          if (res.statusCode === 200) {
            const argsEventEmitter: IPropsToast = {
              isOpen: true,
              type: EToastType.SUCCESS,
              message: res.message || 'Device disconected!',
              position: EToastPosition.TOP_RIGHT,
            };
            eventBus.emit('AppBaseToast', argsEventEmitter);
          }
        } catch (error: unknown) {
          return Promise.reject(error instanceof Error ? error : new Error(String(error)));
        } finally {
          await device_fetchData();
        }
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Disconect device',
      title: 'Your about to disconect this device from the system?',
      type: 'error',
      secondaryIcon: 'exclude',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  const device_actionOnDelete = async (id: string) => {
    eventBus.emit('AppBaseDialog', {
      id: 'device-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'device-dialog-confirmation',
      description: 'This action cannot be undone, and the device you remove will be deleted permanently.',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        // Tutup dialog
        eventBus.emit('AppBaseDialogConfirmation', {
          id: 'device-dialog-confirmation',
          isOpen: false,
        } as IPropsDialogConfirmation);
      },
      onClickButtonSecondary: async () => {
        // Tutup dialog
        eventBus.emit('AppBaseDialogConfirmation', {
          id: 'device-dialog-confirmation',
          isOpen: false,
        } as IPropsDialogConfirmation);

        try {
          await store.deviceList_deleteData(id, {
            ...httpAbort_registerAbort(DEVICE_LIST_REQUEST),
          });
        } catch (error: unknown) {
          return Promise.reject(error instanceof Error ? error : new Error(String(error)));
        } finally {
          await device_fetchData();
        }
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete device',
      title: 'Are you sure you want to delete this device?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  return {
    device_actionFormData: device_actionformData,
    device_actionValidations: deviceAction_formValidation,
    device_formMode: deviceList_formMode,
    device_editingItem: deviceList_editingItem,
    device_actionSubmit: device_ActionOnSubmit,
    device_actionOnCancel: device_ActionOnCancel,
    device_actionDisconnect: device_actionOnDisconnect,
    device_actionOnDelete: device_actionOnDelete,
    device_actionLoading: deviceList_loading,
    device_actionResponse: deviceList_actionResponse,
    formIsValid: formValid,
  };
};
