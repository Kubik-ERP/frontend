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
import type {
  IStaffMemberCreateEditFormData,
  IStaffMemberCreateEditProvided,
  IstaffHour,
  IStaffMemberSocialMedia,
} from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useStaffMemberStore } from '../store';

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
  const store = useStaffMemberStore(); // Instance of the store
  const { staffMember_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const staffMemberCreateEdit_commisionType = ref<'PRODUCT' | 'VOUCHER'>('PRODUCT');

  const staffMemberCreateEdit_formData = reactive<IStaffMemberCreateEditFormData>({
    name: '',
    email: '',
    phoneCode: '+62',
    phoneNumber: '',
    image: null,
    imagePreview: null, // This will hold the preview URL of the image
    startDate: null,
    endDate: null,
    gender: '',
    title: '',
    permission: '',
    socialMedia: [],
    shift: [
      {
        timeSlots: [
          {
            startTime: null,
            endTime: null,
          },
        ],
        day: 'Sunday',
        isActive: false,
      },
      {
        timeSlots: [
          {
            startTime: null,
            endTime: null,
          },
        ],
        day: 'Monday',
        isActive: false,
      },
      {
        timeSlots: [
          {
            startTime: null,
            endTime: null,
          },
        ],
        day: 'Tuesday',
        isActive: false,
      },
      {
        timeSlots: [
          {
            startTime: null,
            endTime: null,
          },
        ],
        day: 'Wednesday',
        isActive: false,
      },
      {
        timeSlots: [
          {
            startTime: null,
            endTime: null,
          },
        ],
        day: 'Thursday',
        isActive: false,
      },
      {
        timeSlots: [
          {
            startTime: null,
            endTime: null,
          },
        ],
        day: 'Friday',
        isActive: false,
      },
      {
        timeSlots: [
          {
            startTime: null,
            endTime: null,
          },
        ],
        day: 'Saturday',
        isActive: false,
      },
    ],

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
    if (route.name === 'staff-member.edit') {
      return true;
    }
    return false;
  });

  /**
   * @description customer validation helper for after date validation
   */

  const isAfter = (value: Date | null, target: Date | null) => {
    if (!value || !target) return true; // If either value or target is null, validation passes
    return value > target; // Check if value is after target
  };

  /**
   * @description Form validations
   */
  const staffMemberCreateEdit_formRules = computed(() => ({
    name: { required },
    email: { required, email },
    phoneNumber: { required },
    // phoneCode: { required },
    startDate: { required },
    // end date must be after start date
    endDate: {
      'End date must be after start date': (value: Date | null) =>
        isAfter(value, staffMemberCreateEdit_formData.startDate),
    },
    gender: { required },
    // title: { required },
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
      // back to the staff member index page
      router.push({ name: 'staff-member.index' });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Staff member has been created successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
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
      // back to the staff member index page
      router.push({ name: 'staff-member.index' });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Staff member has been deleted successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
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
  const staffMemberCreateEdit_fetchDetailStaffMember = async () => {
    try {
      const response = await store.staffMember_fetchDetailStaffMember(
        staffMemberCreateEdit_routeParamsId.value as string,
        {
          ...httpAbort_registerAbort(STAFF_MEMBER_DETAIL_REQUEST),
        },
      );
      if (response) {
        // populate form data with the fetched staff member social media
        staffMemberCreateEdit_formData.socialMedia = response.data.employeesHasSocialMedia.map(
          (socialMedia: IStaffMemberSocialMedia) => {
            return {
              name: socialMedia.mediaName,
              account: socialMedia.accountName,
            };
          },
        );

        // Populate form data with the fetched staff member details
        Object.assign(staffMemberCreateEdit_formData, response.data);

        const shiftsByDay = new Map();

        for (const shift of response.data.employeesShift) {
          if (shift.days) {
            const dayKey = String(shift.days).toUpperCase();
            if (!shiftsByDay.has(dayKey)) {
              shiftsByDay.set(dayKey, []);
            }
            shiftsByDay.get(dayKey)!.push(shift);
          }
        }

        staffMemberCreateEdit_formData.shift = LIST_OF_DAYS.map(dayInfo => {
          const dayKey = String(dayInfo.value).toUpperCase();
          const existingShifts = shiftsByDay.get(dayKey);

          if (existingShifts && existingShifts.length > 0) {
            // Check if any shift for this day has both openTime and endTime
            const hasActiveShift = existingShifts.some((shift: IstaffHour) => {
              return !!shift.startTime && !!shift.endTime;
            });

            return {
              day: String(dayInfo.value),
              isActive: hasActiveShift,
              timeSlots: existingShifts.map((shift: IstaffHour) => {
                const startTime = Array.isArray(shift.startTime) ? shift.startTime[0] : shift.startTime;
                const endTime = Array.isArray(shift.endTime) ? shift.endTime[0] : shift.endTime;

                return {
                  startTime: startTime
                    ? new Date(new Date().toISOString().split('T')[0] + 'T' + startTime + ':00.000Z')
                    : null,
                  endTime: endTime
                    ? new Date(new Date().toISOString().split('T')[0] + 'T' + endTime + ':00.000Z')
                    : null,
                };
              }),
            };
          } else {
            return {
              day: String(dayInfo.value),
              isActive: false,
              timeSlots: [],
            };
          }
        });

        // handle the image preview
        if (response.data.profileUrl) {
          staffMemberCreateEdit_formData.imagePreview = `${import.meta.env.VITE_APP_BASE_BUCKET_URL}${response.data.profileUrl}`;
        }
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
   * @description Handle fetch api update staff member. We call the staffMember_updateStaffMember function from the store to handle the request.
   */
  const staffMemberCreateEdit_fetchUpdateStaffMember = async (staffMemberId: string, formData: FormData) => {
    try {
      await store.staffMember_updateStaffMember(staffMemberId, formData, {
        ...httpAbort_registerAbort(STAFF_MEMBER_CREATE_REQUEST),
      });
      // back to the staff member index page
      router.push({ name: 'staff-member.index' });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Staff member has been updated successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
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
      textButtonSecondary: 'Delete Staff Member',
      title: 'Are you sure want to delete this staff member?',
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
   * @description Handle action on update form.
   */

  const staffMemberCreateEdit_onUpdateForm = async (formData: FormData) => {
    // const staffMemberId = route.params.id as string;
    // await staffMemberCreateEdit_fetchUpdateStaffMember(staffMemberId, staffMemberCreateEdit_formData);
    // dialog
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'staff-member-edit-dialog-confirmation',
      iconName: 'confirmation',
      isOpen: true,
      isUsingButtonSecondary: true,
      width: '400px',
      onClickButtonPrimary: async () => {
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'staff-member-edit-dialog-confirmation',
          isOpen: false,
        };

        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);

        const staffMemberId = route.params.id as string;
        await staffMemberCreateEdit_fetchUpdateStaffMember(staffMemberId, formData);
      },
      onClickButtonSecondary: () => {
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'staff-member-edit-dialog-confirmation',
          isOpen: false,
        };

        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      },
      textButtonPrimary: "Yes, I'm Sure",
      textButtonSecondary: 'Cancel',
      title: 'Are you sure want to update this staff member data?',
      type: 'info',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle action on submit form.
   */
  const staffMemberCreateEdit_onSubmit = async () => {
    staffMemberCreateEdit_formValidations.value.$touch();

    if (staffMemberCreateEdit_formValidations.value.$invalid) {
      return;
    }

    // remove objects from shift when shift.isActive is false
    // staffMemberCreateEdit_formData.shift = staffMemberCreateEdit_formData.shift.map(shift => {
    //   if (!shift.isActive) {
    //     return {
    //       ...shift,
    //       start_time: null,
    //       end_time: null,
    //     };
    //   }
    //   return shift;
    // });

    const formData = new FormData();
    const keysToIgnore = ['comissions', 'imagePreview'];

    for (const key in staffMemberCreateEdit_formData) {
      if (Object.prototype.hasOwnProperty.call(staffMemberCreateEdit_formData, key)) {
        if (keysToIgnore.includes(key)) continue;

        const value = staffMemberCreateEdit_formData[key as keyof IStaffMemberCreateEditFormData];

        if (value !== null && value !== undefined) {
          // ✅ START of corrected 'shift' logic
          // ✅ START of corrected 'shift' logic
          if (key === 'shift' && Array.isArray(value)) {
            let shiftIndex = 0; // Initialize a counter for the flattened list

            // Loop through each day object (e.g., { day: 'Sunday', timeSlots: [...] })
            (value as { day: string; timeSlots: IstaffHour[]; isActive: boolean }[]).forEach(dayItem => {
              if (dayItem.isActive && dayItem.timeSlots && dayItem.timeSlots.length > 0) {
                // If the day is active, loop through its time slots
                dayItem.timeSlots.forEach(slot => {
                  // For EACH time slot, create a full shift entry in FormData
                  formData.append(`shift[${shiftIndex}][day]`, String(dayItem.day));
                  formData.append(`shift[${shiftIndex}][isActive]`, 'true');

                  const startTime = slot.startTime
                    ? new Date(slot.startTime as Date).toISOString().substring(11, 16)
                    : '';
                  const endTime = slot.endTime
                    ? new Date(slot.endTime as Date).toISOString().substring(11, 16)
                    : '';

                  formData.append(`shift[${shiftIndex}][start_time]`, startTime);
                  formData.append(`shift[${shiftIndex}][end_time]`, endTime);

                  shiftIndex = shiftIndex + 1; // Increment the main counter for the next time slot
                });
              } else {
                // For inactive days, create one entry with empty times
                formData.append(`shift[${shiftIndex}][day]`, String(dayItem.day));
                formData.append(`shift[${shiftIndex}][isActive]`, 'false');
                formData.append(`shift[${shiftIndex}][start_time]`, '');
                formData.append(`shift[${shiftIndex}][end_time]`, '');
                shiftIndex = shiftIndex + 1; // Increment the main counter
              }
            });
            // ✅ END of corrected 'shift' logic
          } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else if (value instanceof File) {
            formData.append(key, value);
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (Array.isArray(value)) {
            if (key === 'socialMedia' && Array.isArray(value) && value.every(item => 'name' in item)) {
              value.forEach((socialMediaItem, index) => {
                formData.append(`socialMedia[${index}][name]`, socialMediaItem.name ?? '');
                formData.append(`socialMedia[${index}][account]`, socialMediaItem.account ?? '');
              });
            } else {
              formData.append(key, JSON.stringify(value));
            }
          } else {
            formData.append(key, String(value));
          }
        }
      }
    }

    // (Optional) Log the result to verify
    // const payload: Record<string, unknown> = {};
    // for (const [key, value] of formData.entries()) {
    //   payload[key] = value;
    // }
    // console.log('FormData payload:', JSON.stringify(payload, null, 2));

    try {
      if (route.name === 'staff-member.create') {
        await staffMemberCreateEdit_fetchCreateStaffMember(formData);
      } else if (route.name === 'staff-member.edit') {
        await staffMemberCreateEdit_onUpdateForm(formData);
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
      staffMemberCreateEdit_formData.image = event.files[0];
    }

    staffMemberCreateEdit_formData.imagePreview = staffMemberCreateEdit_formData.image
      ? URL.createObjectURL(staffMemberCreateEdit_formData.image)
      : null;
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
