// Constants
import {
  STAFF_MEMBER_COLUMNS_COMISSIONS,
  STAFF_MEMBER_CREATE_REQUEST,
  STAFF_MEMBER_DELETE_REQUEST,
  STAFF_MEMBER_DETAIL_REQUEST,
  STAFF_MEMBER_TYPES_OF_SOCIAL_MEDIA,
  STAFF_MEMBER_TYPES_OF_USER_PERMISSIONS,
} from '../constants';

// Interfaces
import type { FileUploadSelectEvent } from 'primevue';
import type { IStaffMemberCreateEditFormData, IStaffMemberCreateEditProvided } from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useStaffMembetStore } from '../store';

// Vuelidate
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useStaffMemberCreateEditService = (): IStaffMemberCreateEditProvided => {
  /**
   * @description Injected variables
   */
  const route = useRoute(); // Instance of the router
  const router = useRouter(); // Instance of the router
  const store = useStaffMembetStore(); // Instance of the store
  const { staffMember_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const staffMemberCreateEdit_commisionType = ref<'PRODUCT' | 'VOUCHER'>('PRODUCT');
  const staffMemberCreateEdit_formData = reactive<IStaffMemberCreateEditFormData>({
    name: null,
    email: null,
    phoneCode: '+62',
    phoneNumber: null,
    photoProfile: null,
    startDate: null,
    endDate: null,
    gender: null,
    role: null,
    permission: null,
    socialMedia: {
      facebook: null,
      instagram: null,
      twitter: null,
    },
    workingHours: [],
    comissions: {
      productComission: {
        defaultComission: null,
        defaultComissionType: null,
        isAllItemsHaveDefaultComission: null,
        productItems: [],
      },
      voucherCommission: {
        defaultComission: null,
        defaultComissionType: null,
        isAllVouchersHaveDefaultComission: null,
        voucherItems: [],
      },
    },
  });
  const staffMemberCreateEdit_routeParamsId = ref<string | undefined>(route.params.id as string | undefined);

  /**
   * @description Computed property that checks if the outlet is editable or not.
   * If the route parameter 'id' exists, it means we are editing an existing outlet.
   */
  const staffMemberCreateEdit_isEditable = computed(() => {
    return Boolean(staffMemberCreateEdit_routeParamsId.value);
  });

  /**
   * @description Form validations
   */
  const staffMemberCreateEdit_formRules = computed(() => ({
    name: { required },
    email: { required, email },
    phoneNumber: { required },
    startDate: { required },
    gender: { required },
    role: { required },
    permission: { required },
  }));
  const staffMemberCreateEdit_formValidations = useVuelidate(
    staffMemberCreateEdit_formRules,
    staffMemberCreateEdit_formData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle fetch api create staff member. We call the staffMember_createNewStaffMember function from the store to handle the request.
   */
  const staffMemberCreateEdit_fetchCreateStaffMember = async (formData: FormData) => {
    try {
      await store.staffMember_createNewStaffMember(formData, {
        ...httpAbort_registerAbort(STAFF_MEMBER_CREATE_REQUEST),
      });
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api delete outlet. We call the staffMember_deleteStaffMember function from the store to handle the request.
   */
  const staffMemberCreateEdit_fetchDeleteStaffMember = async (staffMemberId: string) => {
    try {
      await store.staffMember_deleteStaffMember(staffMemberId, {
        ...httpAbort_registerAbort(STAFF_MEMBER_DELETE_REQUEST),
      });
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api staff member detail. We call the staffMember_fetchDetailStaffMember function from the store to handle the request.
   */
  const staffMemberCreateEdit_fetchDetailStaffMember = async (staffMemberId: string) => {
    try {
      await store.staffMember_fetchDetailStaffMember(staffMemberId, {
        ...httpAbort_registerAbort(STAFF_MEMBER_DETAIL_REQUEST),
      });
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api update staff member. We call the staffMember_updateStaffMember function from the store to handle the request.
   */
  const staffMemberCreateEdit_fetchUpdateStaffMember = async (staffMemberId: string, formData: FormData) => {
    try {
      await store.staffMember_updateStaffMember(staffMemberId, formData, {
        ...httpAbort_registerAbort(STAFF_MEMBER_CREATE_REQUEST),
      });
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle action on cancel button
   */
  const staffMemberCreateEdit_onCancel = () => {
    router.push({ name: 'staff-member.index' });
  };

  /**
   * @description Handle business logic for closing dialog commission
   */
  const staffMemberCreateEdit_onCloseDialogCommission = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'staff-member-comission-item-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle action on delete staff member
   */
  const staffMemberCreateEdit_onDelete = (): void => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'staff-member-create-edit-dialog-confirmation',
      description: 'This action cannot be undone, and the member you remove will lose access to the system',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'staff-member-create-edit-dialog-confirmation',
          isOpen: false,
        };

        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      },
      onClickButtonSecondary: async () => {
        const staffMemberId = route.params.id as string;

        await staffMemberCreateEdit_fetchDeleteStaffMember(staffMemberId);
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete Store',
      title: 'Are you sure want to delete this store?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for open dialog commission
   */
  const staffMemberCreateEdit_onOpenDialogCommission = (type: 'PRODUCT' | 'VOUCHER'): void => {
    staffMemberCreateEdit_commisionType.value = type;

    const argsEventEmitter: IPropsDialog = {
      id: 'staff-member-comission-item-dialog',
      isOpen: true,
      isUsingBackdrop: true,
      isUsingClosableButton: false,
      isDraggable: false,
      width: '742px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle action on submit form.
   */
  const staffMemberCreateEdit_onSubmit = async () => {
    staffMemberCreateEdit_formValidations.value.$touch();

    if (staffMemberCreateEdit_formValidations.value.$invalid) {
      return;
    }

    const formData = new FormData();

    for (const key in staffMemberCreateEdit_formData) {
      if (Object.prototype.hasOwnProperty.call(staffMemberCreateEdit_formData, key)) {
        const value = staffMemberCreateEdit_formData[key as keyof IStaffMemberCreateEditFormData];
        if (value !== null && value !== undefined) {
          // Handle special cases for complex types
          if (key === 'photoProfile' && value instanceof File) {
            formData.append(key, value);
          } else if (key === 'socialMedia' && typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else if (key === 'workingHours' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      }
    }

    try {
      if (route.name === 'staff-member.create') {
        await staffMemberCreateEdit_fetchCreateStaffMember(formData);
      } else if (route.name === 'staff-member.edit') {
        const staffMemberId = route.params.id as string;
        await staffMemberCreateEdit_fetchUpdateStaffMember(staffMemberId, formData);
      }
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for uploading photo
   */
  const staffMemberCreateEdit_onUploadPhotoProfile = (event: FileUploadSelectEvent) => {
    if (event.files && event.files.length > 0) {
      staffMemberCreateEdit_formData.photoProfile = event.files[0];
    }
  };

  return {
    staffMemberCreateEdit_columnsOfCommissions: STAFF_MEMBER_COLUMNS_COMISSIONS,
    staffMemberCreateEdit_commisionType,
    staffMemberCreateEdit_formData,
    staffMemberCreateEdit_formValidations,
    staffMemberCreateEdit_isEditable,
    staffMemberCreateEdit_isLoading: staffMember_isLoading,
    staffMemberCreateEdit_fetchDetailStaffMember,
    staffMemberCreateEdit_onCancel,
    staffMemberCreateEdit_onCloseDialogCommission,
    staffMemberCreateEdit_onDelete,
    staffMemberCreateEdit_onOpenDialogCommission,
    staffMemberCreateEdit_onSubmit,
    staffMemberCreateEdit_onUploadPhotoProfile,
    staffMemberCreateEdit_routeParamsId,
    staffMemberCreateEdit_typesOfSocialMedia: STAFF_MEMBER_TYPES_OF_SOCIAL_MEDIA,
    staffMemberCreateEdit_typesOfUserPermissions: STAFF_MEMBER_TYPES_OF_USER_PERMISSIONS,
  };
};
