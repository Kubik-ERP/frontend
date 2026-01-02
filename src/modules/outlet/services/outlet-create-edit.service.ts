// Constants
import {
  OUTLET_CREATE_EDIT_CREATE_NEW_OUTLET_REQUEST,
  OUTLET_CREATE_EDIT_DELETE_OUTLET_REQUEST,
  OUTLET_CREATE_EDIT_DETAIL_OUTLET_REQUEST,
  OUTLET_CREATE_EDIT_UPDATE_OUTLET_REQUEST,
} from '../constants/outlet-create-edit.constant';
import {
  FILE_UPLOAD_LIMITS,
  FILE_UPLOAD_LIMITS_DISPLAY,
  formatFileSize,
  validateFileSize,
} from '@/app/constants/file-upload.constant';
import { STORE_INITIAL_VALUES_OF_OPERATIONAL_HOURS, EToastPosition, EToastType } from '@/app/constants';

// Interfaces
import type { FileUploadSelectEvent } from 'primevue';
import { EOutletBusinessType, IOutletCreateEditFormData, IOutletCreateEditProvided } from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Services
import { useAuthenticationSignInService } from '@/modules/authentication/services/authentication-sign-in.service';

// Stores
import { useOutletStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useOutletCreateEditService = (): IOutletCreateEditProvided => {
  /**
   * @description Injected variables
   */
  const route = useRoute(); // Instance of the router
  const router = useRouter(); // Instance of the router
  const store = useOutletStore(); // Instance of the store
  const { authenticationSignIn_fetchAuthenticationPermissions } = useAuthenticationSignInService();
  const { outlet_detail, outlet_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const outletCreateEdit_formData = reactive<IOutletCreateEditFormData>({
    storeName: '',
    email: '',
    phoneCode: '+62',
    phoneNumber: '',
    businessType: EOutletBusinessType.RestaurantFnB,
    streetAddress: '',
    photo: null,
    city: '',
    postalCode: '',
    building: '',
    businessHours: STORE_INITIAL_VALUES_OF_OPERATIONAL_HOURS,
  });
  const outletCreateEdit_formDataOfVerifyPin = reactive<IAuthenticationVerifyPinFormData>({
    pinConfirmation: '',
  });
  const outletCreateEdit_isPinInvalid = ref<boolean>(false);
  const outletCreateEdit_routeParamsId = ref<string | undefined>(route.params.id as string | undefined);

  /**
   * @description Computed property that checks if the outlet is editable or not.
   * If the route parameter 'id' exists, it means we are editing an existing outlet.
   */
  const outletCreateEdit_isEditable = computed(() => {
    return Boolean(outletCreateEdit_routeParamsId.value);
  });

  /**
   * @description Form validations
   */
  const outletCreateEdit_formRules = computed(() => ({
    storeName: { required },
    email: { email, required },
    phoneCode: { required },
    phoneNumber: { required },
    businessType: { required },
    streetAddress: { required },
    // photo: { required },
    city: { required },
    postalCode: { required },
    building: { required },
    businessHours: { required },
  }));

  const outletCreateEdit_formValidations = useVuelidate(outletCreateEdit_formRules, outletCreateEdit_formData, {
    $autoDirty: true,
  });

  /**
   * @description Handle business logic for mapping formdata
   */
  const outletCreateEdit_onMappingFormData = (): FormData => {
    const formData = new FormData();

    for (const key in outletCreateEdit_formData) {
      const typedKey = key as keyof IOutletCreateEditFormData;
      const value = outletCreateEdit_formData[typedKey];

      if (typedKey === 'businessHours') {
        const businessHours = value as IStoreOperationalHour[];
        const filteredBusinessHours = businessHours.filter(businessHour => businessHour.isOpen);
        let globalIndex = 0;

        filteredBusinessHours.forEach((businessHour: IStoreOperationalHour) => {
          if (businessHour.isOpen && businessHour.timeSlots) {
            businessHour.timeSlots.forEach(timeSlot => {
              if (timeSlot.openTime && timeSlot.closeTime) {
                formData.append(`${typedKey}[${globalIndex}][day]`, businessHour.day);

                // Handle openTime
                let openTimeValue: string;
                if (typeof timeSlot.openTime === 'string') {
                  openTimeValue = timeSlot.openTime;
                } else if (timeSlot.openTime instanceof Date) {
                  const hour = timeSlot.openTime.getHours().toString().padStart(2, '0');
                  const minute = timeSlot.openTime.getMinutes().toString().padStart(2, '0');
                  openTimeValue = `${hour}:${minute}:00`;
                } else {
                  openTimeValue = String(timeSlot.openTime);
                }
                formData.append(`${typedKey}[${globalIndex}][openTime]`, openTimeValue);

                // Handle closeTime
                let closeTimeValue: string;
                if (typeof timeSlot.closeTime === 'string') {
                  closeTimeValue = timeSlot.closeTime;
                } else if (timeSlot.closeTime instanceof Date) {
                  const hour = timeSlot.closeTime.getHours().toString().padStart(2, '0');
                  const minute = timeSlot.closeTime.getMinutes().toString().padStart(2, '0');
                  closeTimeValue = `${hour}:${minute}:00`;
                } else {
                  closeTimeValue = String(timeSlot.closeTime);
                }
                formData.append(`${typedKey}[${globalIndex}][closeTime]`, closeTimeValue);

                globalIndex += 1;
              }
            });
          }
        });
      } else if (typedKey === 'photo' && value instanceof Blob) {
        formData.append('file', value); // Handle Blob/File for photo
      } else if (typeof value === 'string') {
        formData.append(typedKey, value); // Handle string fields
      }
    }

    return formData;
  };

  /**
   * @description Handle business logic for mapping data of outlet detail to the form
   */
  const outletCreateEdit_onMappingResponseDetail = () => {
    if (!outlet_detail.value) return;

    const detail = outlet_detail.value;

    // Map the API response fields to form data fields
    outletCreateEdit_formData.storeName = detail.name || '';
    outletCreateEdit_formData.email = detail.email || '';
    outletCreateEdit_formData.phoneNumber = detail.phoneNumber || '';
    outletCreateEdit_formData.businessType =
      (detail.businessType as EOutletBusinessType) || EOutletBusinessType.RestaurantFnB;
    outletCreateEdit_formData.streetAddress = detail.address || '';
    outletCreateEdit_formData.city = detail.city || '';
    outletCreateEdit_formData.postalCode = detail.postalCode || '';
    outletCreateEdit_formData.building = detail.building || '';

    // Note: photo field is kept as null since we don't want to populate file uploads from API
    // operationalHours mapping would need to be handled separately based on your IStoreOperationalHour structure
    if (detail.operationalHours && detail.operationalHours.length > 0) {
      // Map operational hours if they exist in the response
      // This would need to be implemented based on your IStoreOperationalHour interface
      // outletCreateEdit_formData.businessHours = mappedOperationalHours;
    }
  };

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_createNewOutlet function from the store to handle the request.
   */
  const outletCreateEdit_fetchCreateNewOutlet = async (formData: FormData) => {
    try {
      await store.fetchOutlet_createNewOutlet(outletCreateEdit_formDataOfVerifyPin.pinConfirmation, formData, {
        ...httpAbort_registerAbort(OUTLET_CREATE_EDIT_CREATE_NEW_OUTLET_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'You have successfully created a new store.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      outletCreateEdit_isPinInvalid.value = true;

      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_deleteOutlet function from the store to handle the request.
   */
  const outletCreateEdit_fetchDeleteOutlet = async (id: string): Promise<void> => {
    try {
      await store.fetchOutlet_deleteOutlet(outletCreateEdit_formDataOfVerifyPin.pinConfirmation, id, {
        ...httpAbort_registerAbort(OUTLET_CREATE_EDIT_DELETE_OUTLET_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'You have successfully deleted the store.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      outletCreateEdit_isPinInvalid.value = true;

      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_detail function from the store to handle the request.
   */
  const outletCreateEdit_fetchDetailOutlet = async (id: string): Promise<void> => {
    try {
      await store.fetchOutlet_detail(id, {
        ...httpAbort_registerAbort(OUTLET_CREATE_EDIT_DETAIL_OUTLET_REQUEST),
      });

      outletCreateEdit_onMappingResponseDetail();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_updateOutlet function from the store to handle the request.
   */
  const outletCreateEdit_fetchUpdateOutlet = async (id: string, formData: FormData): Promise<void> => {
    try {
      await store.fetchOutlet_updateOutlet(outletCreateEdit_formDataOfVerifyPin.pinConfirmation, id, formData, {
        ...httpAbort_registerAbort(OUTLET_CREATE_EDIT_UPDATE_OUTLET_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'You have successfully updated the store data.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      outletCreateEdit_isPinInvalid.value = true;

      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for resetting form data and validations
   */
  const outletCreateEdit_onResetForm = (): void => {
    // Reset main form data
    Object.assign(outletCreateEdit_formData, {
      storeName: '',
      email: '',
      phoneCode: '+62',
      phoneNumber: '',
      businessType: EOutletBusinessType.RestaurantFnB,
      streetAddress: '',
      photo: null,
      city: '',
      postalCode: '',
      building: '',
      businessHours: STORE_INITIAL_VALUES_OF_OPERATIONAL_HOURS,
    });

    // Reset PIN form data
    outletCreateEdit_formDataOfVerifyPin.pinConfirmation = '';

    // Reset validation states
    outletCreateEdit_formValidations.value.$reset();
    outletCreateEdit_isPinInvalid.value = false;
  };

  /**
   * @description Handle action on cancel button
   */
  const outletCreateEdit_onCancel = (): void => {
    router.push({ name: 'outlet-list' });
  };

  /**
   * @description Handle action on cancel button on dialog verify pin
   */
  const outletCreateEdit_onCloseDialogVerifyPIN = (): void => {
    // Reset PIN form data and validation state
    outletCreateEdit_formDataOfVerifyPin.pinConfirmation = '';
    outletCreateEdit_isPinInvalid.value = false;

    const argsEventEmitter: IPropsDialogPinVerification = {
      isOpen: false,
    };

    eventBus.emit('AppBaseDialogPinVerification', argsEventEmitter);
  };

  /**
   * @description Handle action on delete outlet
   */
  const outletCreateEdit_onDeleteOutlet = async (): Promise<void> => {
    try {
      await outletCreateEdit_fetchDeleteOutlet(outletCreateEdit_routeParamsId.value!);

      // Reset PIN form data after successful deletion
      outletCreateEdit_formDataOfVerifyPin.pinConfirmation = '';
      outletCreateEdit_isPinInvalid.value = false;

      router.push({ name: 'outlet.list' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for removeing the photo
   */
  const outletCreateEdit_onRemovePhoto = (): void => {
    outletCreateEdit_formData.photo = null;
  };

  /**
   * @description Handle business logic for showing dialog confirmation delete outlet
   */
  const outletCreateEdit_onShowDialogDeleteOutlet = async (): Promise<void> => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'outlet-create-edit-dialog-confirmation',
      description:
        'Deleting this store will permanently remove all related data, including transactions and inventory. This action cannot be undone.',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'outlet-create-edit-dialog-confirmation',
          isOpen: false,
        };

        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      },
      onClickButtonSecondary: () => {
        // Reset PIN data before showing PIN verification dialog
        outletCreateEdit_formDataOfVerifyPin.pinConfirmation = '';
        outletCreateEdit_isPinInvalid.value = false;

        const argsEventEmitter: IPropsDialogPinVerification = {
          isOpen: true,
          isInvalid: outletCreateEdit_isPinInvalid.value,
          pinConfirmation: outletCreateEdit_formDataOfVerifyPin.pinConfirmation,
          onClickPrimaryButton: outletCreateEdit_onDeleteOutlet,
          onClickSecondaryButton: outletCreateEdit_onCloseDialogVerifyPIN,
          primaryButtonClass:
            'bg-error-main border-none font-semibold text-base text-white py-[10px] w-full max-w-40',
          primaryButtonLabel: 'Delete Store Data',
        };

        eventBus.emit('AppBaseDialogPinVerification', argsEventEmitter);
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete Store',
      title: 'Are you sure want to delete this store?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle action on submit form.
   */
  const outletCreateEdit_onSubmit = async (): Promise<void> => {
    try {
      outletCreateEdit_formValidations.value.$touch();

      if (outletCreateEdit_formValidations.value.$invalid) return;

      // Map form data
      const formData: FormData = outletCreateEdit_onMappingFormData();

      if (outletCreateEdit_isEditable.value) {
        await outletCreateEdit_fetchUpdateOutlet(outletCreateEdit_routeParamsId.value!, formData);
      } else {
        await outletCreateEdit_fetchCreateNewOutlet(formData);
      }
      outletCreateEdit_onResetForm();

      router.push({ name: 'outlet.list' });

      // Reset form and validations after successful submission

      // Reset PIN data before showing dialog
      // outletCreateEdit_formDataOfVerifyPin.pinConfirmation = '';
      // outletCreateEdit_isPinInvalid.value = false;

      // const argsEventEmitter: IPropsDialogPinVerification = {
      //   isOpen: true,
      //   isInvalid: outletCreateEdit_isPinInvalid.value,
      //   pinConfirmation: outletCreateEdit_formDataOfVerifyPin.pinConfirmation,
      //   onClickPrimaryButton: outletCreateEdit_onSubmitDialogVerifyPIN,
      //   onClickSecondaryButton: outletCreateEdit_onCloseDialogVerifyPIN,
      //   primaryButtonLabel: outletCreateEdit_isEditable.value ? 'Update Store Data' : 'Create Store',
      // };

      // eventBus.emit('AppBaseDialogPinVerification', argsEventEmitter);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * @description Handle action on submit form on dialog verify pin
   */
  const outletCreateEdit_onSubmitDialogVerifyPIN = async () => {
    try {
      const formData: FormData = outletCreateEdit_onMappingFormData();

      if (outletCreateEdit_isEditable.value) {
        await outletCreateEdit_fetchUpdateOutlet(outletCreateEdit_routeParamsId.value!, formData);
      } else {
        await outletCreateEdit_fetchCreateNewOutlet(formData);
      }

      // Reset form and validations after successful submission
      outletCreateEdit_onResetForm();
      outletCreateEdit_onCloseDialogVerifyPIN();
      await authenticationSignIn_fetchAuthenticationPermissions();
      router.push({ name: 'outlet.list' });
    } catch (error: unknown) {
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
  const outletCreateEdit_onUploadPhoto = (event: FileUploadSelectEvent) => {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];

      // Validate file size
      if (!validateFileSize(file, FILE_UPLOAD_LIMITS.IMAGE_MAX_SIZE)) {
        // Show error toast
        eventBus.emit('AppBaseToast', {
          isOpen: true,
          message: `File size is too large. Maximum allowed size is ${FILE_UPLOAD_LIMITS_DISPLAY.IMAGE_MAX_SIZE_MB}. Your file size is ${formatFileSize(file.size)}.`,
          position: EToastPosition.TOP_RIGHT,
          type: EToastType.DANGER,
        });
        return;
      }

      // Validate file type (additional check)
      if (!file.type.startsWith('image/')) {
        eventBus.emit('AppBaseToast', {
          isOpen: true,
          message: 'Please select a valid image file (JPG, PNG, GIF, WebP).',
          position: EToastPosition.TOP_RIGHT,
          type: EToastType.DANGER,
        });
        return;
      }

      outletCreateEdit_formData.photo = file;
    }
  };

  return {
    outletCreateEdit_fetchDetailOutlet,
    outletCreateEdit_formData,
    outletCreateEdit_formDataOfVerifyPin,
    outletCreateEdit_formValidations,
    outletCreateEdit_isEditable,
    outletCreateEdit_isLoading: outlet_isLoading,
    outletCreateEdit_onCancel,
    outletCreateEdit_onCloseDialogVerifyPIN,
    outletCreateEdit_onDeleteOutlet,
    outletCreateEdit_onRemovePhoto,
    outletCreateEdit_onResetForm,
    outletCreateEdit_onShowDialogDeleteOutlet,
    outletCreateEdit_onSubmit,
    outletCreateEdit_onSubmitDialogVerifyPIN,
    outletCreateEdit_onUploadPhoto,
    outletCreateEdit_routeParamsId,
  };
};
