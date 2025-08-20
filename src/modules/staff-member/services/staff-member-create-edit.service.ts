// Constants
import {
  STAFF_MEMBER_COLUMNS_COMISSIONS,
  STAFF_MEMBER_CREATE_REQUEST,
  STAFF_MEMBER_DELETE_REQUEST,
  STAFF_MEMBER_DETAIL_REQUEST,
  STAFF_MEMBER_PERMISSION_ENDPOINT,
  STAFF_MEMBER_TYPES_OF_SOCIAL_MEDIA,
} from '../constants';

// Interfaces
import type { FileUploadSelectEvent } from 'primevue';
import type {
  IStaffMemberCreateEditFormData,
  IStaffMemberCreateEditProvided,
  IstaffHour,
  IStaffMemberSocialMedia,
  IStafPermission,
  IstaffWorkingHour,
  IStaffMemberComissions,
} from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useStaffMemberStore } from '../store';

// Vuelidate
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { IProduct } from '@/modules/catalog-product/interfaces';
import { IVoucher } from '@/modules/voucher/interfaces';
import { useProductService } from '@/modules/catalog-product/services/catalog-product.service';
import { useVoucherStore } from '@/modules/voucher/store';
import { VOUCHER_LIST_REQUEST } from '@/modules/voucher/constants';
import httpClient from '@/plugins/axios';

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
    defaultCommissionProduct: null,
    defaultCommissionProductType: null,
    defaultCommissionVoucher: null,
    defaultCommissionVoucherType: null,
    commissions: {
      productCommission: {
        isAllItemsHaveDefaultCommission: null,
        productItems: [

        ],
      },
      voucherCommission: {
        isAllVouchersHaveDefaultComission: null,
        voucherItems: [],
      },
    },
  });

  /**
   * @description Watchers for data columns comission
   */
  const productService = useProductService();
  const staffMemberCreateEdit_products = ref<IProduct[]>([]);
  const staffMemberCreateEdit_vouchers = ref<IVoucher[]>([]);
  const staffMemberCreateEdit_commissionsSearch = ref<string>('');
  const staffMemberCreateEdit_permissionData = ref<IStafPermission[]>([]);

  const fetchProductList = async (): Promise<void> => {
    console.log('fetchProductList');
    try {
      const response = await productService.getAllProducts(1, 100, staffMemberCreateEdit_commissionsSearch.value);
      staffMemberCreateEdit_products.value = response.products;
    } catch (error) {
      console.error('❌ Error fetching voucher product list:', error);
    }
  };
  const storeVoucher = useVoucherStore();

  const fetchVoucherList = async (): Promise<void> => {
    console.log('fetchVoucherList');
    try {
      const response = await storeVoucher.voucherList_fetchListVouchers(
        {
          startDate: null,
          endDate: null,
          page: 1,
          pageSize: 100,
          orderBy: null,
          orderDirection: null,
        },
        {
          ...httpAbort_registerAbort(VOUCHER_LIST_REQUEST),
          paramsSerializer: useParamsSerializer,
        },
      );

      if (staffMemberCreateEdit_commissionsSearch.value !== '') {
        response.data.items = response.data.items.filter(voucher =>
          voucher.name.toLowerCase().includes(staffMemberCreateEdit_commissionsSearch.value.toLowerCase()),
        );
      }

      staffMemberCreateEdit_vouchers.value = response.data.items;
    } catch (error: unknown) {
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
  };

  watch(
    [staffMemberCreateEdit_commisionType, staffMemberCreateEdit_commissionsSearch],
    async ([newType]) => {
      if (newType === 'PRODUCT') {
        await fetchProductList();
      } else if (newType === 'VOUCHER') {
        await fetchVoucherList();
      }
      // kalau perlu gunakan newSearch juga
      // console.log("search:", newSearch);
    },
    { immediate: true },
  );

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
      console.log('staffMemberCreateEdit_fetchUpdateStaffMember formData', formData);
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

  const staffMemberCreateEdit_onSubmitDialogCommission = (formData: FormData): void => {
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    if (staffMemberCreateEdit_commisionType.value === 'PRODUCT') {
      // Set default comission
      staffMemberCreateEdit_formData.defaultCommissionProduct = Number(data.defaultCommission);
      staffMemberCreateEdit_formData.defaultCommissionProductType = data.defaultCommissionType;
      staffMemberCreateEdit_formData.commissions.productCommission.isAllItemsHaveDefaultCommission =
        data.isAllItemsHaveDefaultComission === 'true';

      // Extract product items
      const productItems: {
        productId: string | null;
        commission: number | null;
        commissionType: string | null;
      }[] = [];

      // Misal field di form punya key seperti: productItems[0].productId, productItems[0].comission, ...
      Object.keys(data).forEach(key => {
        const match = key.match(/^productItems\[(\d+)\]\.(.+)$/);
        if (match) {
          const index = Number(match[1]);
          const field = match[2];

          if (!productItems[index]) {
            productItems[index] = {
              productId: null,
              commission: null,
              commissionType: null,
            };
          }

          if (field === 'productId') productItems[index].productId = data[key];
          if (field === 'commission') productItems[index].commission = Number(data[key]);
          if (field === 'commissionType') productItems[index].commissionType = data[key];
        }
      });
      // Assign ke formData utama
      staffMemberCreateEdit_formData.commissions.productCommission.productItems = productItems;
    } else {
      // Set default comission
      staffMemberCreateEdit_formData.defaultCommissionVoucher = Number(data.defaultCommission);
      staffMemberCreateEdit_formData.defaultCommissionVoucherType = data.defaultCommissionType;
      staffMemberCreateEdit_formData.commissions.voucherCommission.isAllVouchersHaveDefaultComission =
        data.isAllItemsHaveDefaultComission === 'true';

      // Extract voucher items
      const voucherItems: {
        voucherId: string | null;
        comission: number | null;
        comissionType: string | null;
      }[] = [];

      // Misal field di form punya key seperti: voucherItems[0].voucherId, voucherItems[0].comission, ...
      Object.keys(data).forEach(key => {
        const match = key.match(/^voucherItems\[(\d+)\]\.(.+)$/);
        if (match) {
          const index = Number(match[1]);
          const field = match[2];

          if (!voucherItems[index]) {
            voucherItems[index] = {
              voucherId: null,
              comission: null,
              comissionType: null,
            };
          }

          if (field === 'voucherId') voucherItems[index].voucherId = data[key];
          if (field === 'comission') voucherItems[index].comission = Number(data[key]);
          if (field === 'comissionType') voucherItems[index].comissionType = data[key];
        }
      });
      // Assign ke formData utama
      staffMemberCreateEdit_formData.commissions.voucherCommission.voucherItems = voucherItems;
    }

    console.log(staffMemberCreateEdit_formData);
    staffMemberCreateEdit_onCloseDialogCommission();
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

    const formData = new FormData();
    const keysToIgnore = ['imagePreview'];

    for (const key in staffMemberCreateEdit_formData) {
      if (Object.prototype.hasOwnProperty.call(staffMemberCreateEdit_formData, key)) {
        if (keysToIgnore.includes(key)) continue;

        const value = staffMemberCreateEdit_formData[key as keyof IStaffMemberCreateEditFormData];

        if (value !== null && value !== undefined) {
          // === SHIFT ===
          if (key === 'shift' && Array.isArray(value)) {
            let shiftIndex = 0;

            (value as IstaffWorkingHour[]).forEach(dayItem => {
              if (dayItem.isActive && dayItem.timeSlots && dayItem.timeSlots.length > 0) {
                dayItem.timeSlots.forEach(slot => {
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

                  shiftIndex += 1;
                });
              } else {
                formData.append(`shift[${shiftIndex}][day]`, String(dayItem.day));
                formData.append(`shift[${shiftIndex}][isActive]`, 'false');
                formData.append(`shift[${shiftIndex}][start_time]`, '');
                formData.append(`shift[${shiftIndex}][end_time]`, '');
                shiftIndex += 1;
              }
            });
          }

          // === COMMISSIONS ===
          else if (key === 'comissions' && value && typeof value === 'object') {
            if ('productComission' in value && 'voucherCommission' in value) {
              const commissionValue = value as IStaffMemberComissions;

              // Product Commission
              formData.append(
                'comissions[productComission][isAllItemsHaveDefaultComission]',
                String(commissionValue.productCommission?.isAllItemsHaveDefaultCommission ?? false),
              );

              commissionValue.productCommission.productItems.forEach((item, index) => {
                formData.append(`comissions[productComission][productItems][${index}]`, JSON.stringify(item));
              });
              formData.append(
                'comissions[voucherCommission][isAllVouchersHaveDefaultComission]',
                String(commissionValue.voucherCommission?.isAllVouchersHaveDefaultComission ?? false),
              );

              commissionValue.voucherCommission.voucherItems.forEach((item, index) => {
                formData.append(`comissions[voucherCommission][voucherItems][${index}]`, JSON.stringify(item));
              });
            }
          }

          // === Date
          else if (value instanceof Date) {
            formData.append(key, value.toISOString());
          }

          // === File
          else if (value instanceof File) {
            formData.append(key, value);
          }

          // === Social Media Array
          else if (key === 'socialMedia' && Array.isArray(value)) {
            value.forEach((socialMediaItem, index) => {
              if ('name' in socialMediaItem && 'account' in socialMediaItem) {
                formData.append(`socialMedia[${index}][name]`, socialMediaItem.name ?? '');
                formData.append(`socialMedia[${index}][account]`, socialMediaItem.account ?? '');
              }
            });
          }

          // === Fallback Object/Array
          else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          }

          // === Primitive
          else {
            formData.append(key, String(value));
          }
        }
      }
    }

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

  /**
   * Get roles permission
   */
  onMounted(async () => {
    await httpClient
      .get(STAFF_MEMBER_PERMISSION_ENDPOINT)
      .then(response => {
        staffMemberCreateEdit_permissionData.value = response.data.data;
      })
      .catch(error => {
        console.log(error);
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      });
  });

  return {
    staffMemberCreateEdit_columnsOfCommissions: STAFF_MEMBER_COLUMNS_COMISSIONS,
    staffMemberCreateEdit_dataColumnsOfProduct: staffMemberCreateEdit_products,
    staffMemberCreateEdit_dataColumnsOfVoucher: staffMemberCreateEdit_vouchers,
    staffMemberCreateEdit_commissionsSearch,
    staffMemberCreateEdit_commisionType,
    staffMemberCreateEdit_formData,
    staffMemberCreateEdit_formValidations,
    staffMemberCreateEdit_isEditable,
    staffMemberCreateEdit_isLoading: staffMember_isLoading,
    staffMemberCreateEdit_fetchDetailStaffMember,
    staffMemberCreateEdit_onCancel,
    staffMemberCreateEdit_onCloseDialogCommission,
    staffMemberCreateEdit_onSubmitDialogCommission,
    staffMemberCreateEdit_onDelete,
    staffMemberCreateEdit_onOpenDialogCommission,
    staffMemberCreateEdit_onSubmit,
    staffMemberCreateEdit_onUploadPhotoProfile,
    staffMemberCreateEdit_routeParamsId,
    staffMemberCreateEdit_typesOfSocialMedia: STAFF_MEMBER_TYPES_OF_SOCIAL_MEDIA,
    staffMemberCreateEdit_typesOfUserPermissions: staffMemberCreateEdit_permissionData,
  };
};
