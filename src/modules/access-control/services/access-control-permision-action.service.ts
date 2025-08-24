// services/access-control-permision-action.service.ts
import eventBus from '@/plugins/mitt';
import {
  IAccesscControlPermissionProvided,
  IAccessControlPermissionPayload,
  IPayloadPermission,
} from '../interfaces/access-control-action.interface';
import { useAccessControlStore } from '../store';

export const useAccessControlPermissionsActionService = (): IAccesscControlPermissionProvided => {
  const store = useAccessControlStore();

  const accessControlPermission_formData = reactive<IAccessControlPermissionPayload>({
    permissions: [],
  });

  const accessControlPermission_isLoading = ref(false);

  // sekarang onSubmit terima payload dari component
  const accessControlPermission_onSubmit = async (payload: IAccessControlPermissionPayload) => {
    try {
      accessControlPermission_isLoading.value = true;

      // set formData ke payload terbaru
      accessControlPermission_formData.permissions = payload.permissions;

      // simpan data ke API
      const res = await store.assignAccessControlPermission_roles(payload);
      console.log('res:', res);
      if (res) {
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: res.statusCode === 200 ? EToastType.SUCCESS : EToastType.DANGER,
          message: res.message || 'Set Permission Action successfully!',
          position: EToastPosition.TOP_RIGHT,
        };
        eventBus.emit('AppBaseToast', argsEventEmitter);
      }
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      accessControlPermission_isLoading.value = false;
    }
  };

  const accessControlPermission_onCancel = () => {
    // reset form data
    accessControlPermission_formData.permissions = [];
  };

  // helper buat set data hasil fetch API
  const accessControlPermission_setData = (data: IPayloadPermission[]) => {
    accessControlPermission_formData.permissions = data;
  };

  return {
    accessControlPermission_formData,
    accessControlPermission_isLoading,
    accessControlPermission_onSubmit,
    accessControlPermission_onCancel,
    accessControlPermission_setData,
  };
};
