// Constants
import {
  ACCOUNT_STORE_EDIT_DELETE_OUTLET_REQUEST,
  ACCOUNT_STORE_EDIT_DETAIL_OUTLET_REQUEST,
  ACCOUNT_STORE_EDIT_INITIAL_VALUES_OF_BUSINESS_HOURS,
  ACCOUNT_STORE_EDIT_UPDATE_OUTLET_REQUEST,
} from '../constants';

// Interfaces
import type { FileUploadSelectEvent } from 'primevue';
import {
  EAccountStoreBusinessType,
  IAccountStoreEditBusinessHour,
  IAccountStoreEditFormData,
  IAccountStoreEditProvided,
} from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useOutletStore } from '@/modules/outlet/store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAccountStoreEditService = (): IAccountStoreEditProvided => {
  /**
   * @description Injected variables
   */
  const route = useRoute(); // Instance of the router
  const router = useRouter(); // Instance of the router
  const store = useOutletStore(); // Instance of the store
  const { outlet_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive variables
   */
  const accountStoreEdit_formData = reactive<IAccountStoreEditFormData>({
    storeName: '',
    email: '',
    phoneCode: '+62',
    phoneNumber: '',
    businessType: EAccountStoreBusinessType.RestaurantFnB,
    streetAddress: '',
    photo: null,
    city: '',
    postalCode: '',
    building: '',
    businessHours: ACCOUNT_STORE_EDIT_INITIAL_VALUES_OF_BUSINESS_HOURS,
  });
  const accountStoreEdit_formDataOfVerifyPin = reactive<IAuthenticationVerifyPinFormData>({
    pinConfirmation: '',
  });
  const accountStoreEdit_isPinInvalid = ref<boolean>(false);
  const accountStoreEdit_routeParamsId = ref<string | undefined>(route.params.id as string);

  /**
   * @description Computed property that checks if the outlet is editable or not.
   * If the route parameter 'id' exists, it means we are editing an existing outlet.
   */
  const accountStoreEdit_isEditable = computed(() => {
    return Boolean(accountStoreEdit_routeParamsId.value);
  });

  /**
   * @description Form validations
   */
  const accountStoreEdit_formRules = computed(() => ({
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

  const accountStoreEdit_formValidations = useVuelidate(accountStoreEdit_formRules, accountStoreEdit_formData, {
    $autoDirty: true,
  });

  /**
   * @description Handle business logic for mapping formdata
   */
  // const accountStoreEdit_onMappingFormData = (): FormData => {
  //   const formData = new FormData();

  //   for (const key in accountStoreEdit_formData) {
  //     const typedKey = key as keyof IOutletCreateEditFormData;
  //     const value = accountStoreEdit_formData[typedKey];

  //     if (typedKey === 'businessHours') {
  //       const businessHours = value as IOutletBusinessHour[];
  //       const filteredBusinessHours = businessHours.filter(businessHour => businessHour.isOpen);

  //       filteredBusinessHours.forEach((businessHour: IOutletBusinessHour, index: number) => {
  //         for (const keyOfBusinessHour in businessHour) {
  //           const typedBusinessHourKey = keyOfBusinessHour as keyof IOutletBusinessHour;
  //           const businessHourValue = businessHour[typedBusinessHourKey];

  //           // Convert boolean to string if necessary
  //           const formValue =
  //             typeof businessHourValue === 'boolean'
  //               ? businessHourValue.toString() // Converts true -> "true", false -> "false"
  //               : businessHourValue;

  //           if (typedBusinessHourKey === 'openTime' || typedBusinessHourKey === 'closeTime') {
  //             // We need to add more zero value on it. So from HH:mm to HH:mm:ss
  //             let hour = new Date(formValue).getHours().toString();
  //             let minute = new Date(formValue).getMinutes().toString();

  //             // Check if hour or minute is less than 10, then add a leading zero
  //             hour = +hour < 10 ? `0${hour}` : hour;
  //             minute = +minute < 10 ? `0${minute}` : minute;

  //             formData.append(`${typedKey}[${index}][${typedBusinessHourKey}]`, `${hour}:${minute}:00`);
  //           } else {
  //             formData.append(`${typedKey}[${index}][${typedBusinessHourKey}]`, formValue);
  //           }
  //         }
  //       });
  //     } else {
  //       if (typedKey === 'photo' && value instanceof Blob) {
  //         formData.append('file', value); // Handle Blob/File for photo
  //       }

  //       if (typeof value === 'string') {
  //         formData.append(typedKey, value); // Handle string fields
  //       }
  //     }
  //   }

  //   return formData;
  // };

  /**
   * @description Handle business logic for mapping data of outlet detail to the form
   */
  // const accountStoreEdit_onMappingResponseDetail = () => {
  //   const outletKeys = Object.keys(outlet_detail.value!) as (keyof IOutlet)[];
  //   const formDataKeys = Object.keys(accountStoreEdit_formData) as (keyof IOutletCreateEditFormData)[];

  //   for (const key of formDataKeys) {
  //     for (const keyResponse of outletKeys) {
  //       if (key === 'photo') {
  //         return;
  //       }

  //       if (keyResponse === key) {
  //         accountStoreEdit_formData[key] = outlet_detail.value![keyResponse];
  //       }
  //     }
  //   }
  // };

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_deleteOutlet function from the store to handle the request.
   */
  const accountStoreEdit_fetchDeleteOutlet = async (id: string): Promise<void> => {
    try {
      await store.fetchOutlet_deleteOutlet(accountStoreEdit_formDataOfVerifyPin.pinConfirmation, id, {
        ...httpAbort_registerAbort(ACCOUNT_STORE_EDIT_DELETE_OUTLET_REQUEST),
      });
    } catch (error: unknown) {
      accountStoreEdit_isPinInvalid.value = true;

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
  const accountStoreEdit_fetchDetailOutlet = async (id: string): Promise<void> => {
    try {
      await store.fetchOutlet_detail(id, {
        ...httpAbort_registerAbort(ACCOUNT_STORE_EDIT_DETAIL_OUTLET_REQUEST),
      });

      // accountStoreEdit_onMappingResponseDetail();
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
  const accountStoreEdit_fetchUpdateOutlet = async (id: string, formData: FormData): Promise<void> => {
    try {
      await store.fetchOutlet_updateOutlet(accountStoreEdit_formDataOfVerifyPin.pinConfirmation, id, formData, {
        ...httpAbort_registerAbort(ACCOUNT_STORE_EDIT_UPDATE_OUTLET_REQUEST),
      });
    } catch (error: unknown) {
      accountStoreEdit_isPinInvalid.value = true;

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
  const accountStoreEdit_onCancel = (): void => {
    router.push({ name: 'outlet-list' });
  };

  /**
   * @description Handle action on cancel button on dialog verify pin
   */
  const accountStoreEdit_onCloseDialogVerifyPIN = (): void => {
    accountStoreEdit_isPinInvalid.value = false;
    const argsEventEmitter: IPropsDialogPinVerification = {
      isOpen: false,
    };

    eventBus.emit('AppBaseDialogPinVerification', argsEventEmitter);
  };

  /**
   * @description Handle action on delete outlet
   */
  const accountStoreEdit_onDeleteOutlet = async (): Promise<void> => {
    try {
      await accountStoreEdit_fetchDeleteOutlet(accountStoreEdit_routeParamsId.value!);

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
  const accountStoreEdit_onRemovePhoto = (): void => {
    accountStoreEdit_formData.photo = null;
  };

  /**
   * @description Handle business logic for showing dialog confirmation delete outlet
   */
  const accountStoreEdit_onShowDialogDeleteOutlet = async (): Promise<void> => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'account-store-edit-dialog-confirmation',
      description:
        'Deleting this store will permanently remove all related data, including transactions and inventory. This action cannot be undone.',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'account-store-edit-dialog-confirmation',
          isOpen: false,
        };

        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      },
      onClickButtonSecondary: () => {
        const argsEventEmitter: IPropsDialogPinVerification = {
          isOpen: true,
          isInvalid: accountStoreEdit_isPinInvalid.value,
          pinConfirmation: accountStoreEdit_formDataOfVerifyPin.pinConfirmation,
          onClickPrimaryButton: accountStoreEdit_onDeleteOutlet,
          onClickSecondaryButton: accountStoreEdit_onCloseDialogVerifyPIN,
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
  const accountStoreEdit_onSubmit = async (): Promise<void> => {
    try {
      accountStoreEdit_formValidations.value.$touch();

      if (accountStoreEdit_formValidations.value.$invalid) return;

      const argsEventEmitter: IPropsDialogPinVerification = {
        isOpen: true,
        isInvalid: accountStoreEdit_isPinInvalid.value,
        pinConfirmation: accountStoreEdit_formDataOfVerifyPin.pinConfirmation,
        onClickPrimaryButton: accountStoreEdit_onSubmitDialogVerifyPIN,
        onClickSecondaryButton: accountStoreEdit_onCloseDialogVerifyPIN,
        primaryButtonLabel: accountStoreEdit_isEditable.value ? 'Update Store Data' : 'Create Store',
      };

      eventBus.emit('AppBaseDialogPinVerification', argsEventEmitter);
    } catch (error) {
      console.error(error);
    }
  };

  const accountStoreEdit_onMappingFormData = (): FormData => {
    const formData = new FormData();

    for (const key in accountStoreEdit_formData) {
      const typedKey = key as keyof IAccountStoreEditFormData;
      const value = accountStoreEdit_formData[typedKey];

      if (typedKey === 'businessHours') {
        const businessHours = value as IAccountStoreEditBusinessHour[];
        const filteredBusinessHours = businessHours.filter(businessHour => businessHour.isOpen);

        filteredBusinessHours.forEach((businessHour: IAccountStoreEditBusinessHour) => {
          if (businessHour.isOpen === false) {
            return; // Skip if the business hour is not open
          }

          businessHour.timeSlots.forEach((timeSlot, timeSlotIndex) => {
            formData.append(`${typedKey}[${timeSlotIndex}][isOpen]`, businessHour.isOpen.toString());
            formData.append(`${typedKey}[${timeSlotIndex}][day]`, businessHour.day);
            if (timeSlot.openTime !== undefined && timeSlot.openTime !== null) {
              // Make a value like this: HH:mm:ss
              let value;

              if (typeof timeSlot.openTime === 'string') {
                value = timeSlot.openTime;
              } else if (timeSlot.openTime instanceof Date) {
                value = timeSlot.openTime.toISOString();
                value = value.slice(11, 19); // Extract HH:mm:ss from the ISO
              } else {
                value = String(timeSlot.openTime);
              }

              formData.append(`${typedKey}[${timeSlotIndex}][openTime]`, value);
            }
            if (timeSlot.closeTime !== undefined && timeSlot.closeTime !== null) {
              let value;

              if (typeof timeSlot.closeTime === 'string') {
                value = timeSlot.closeTime;
              } else if (timeSlot.closeTime instanceof Date) {
                value = timeSlot.closeTime.toISOString();
                value = value.slice(11, 19); // Extract HH:mm:ss from the ISO
              } else {
                value = String(timeSlot.closeTime);
              }

              formData.append(`${typedKey}[${timeSlotIndex}][closeTime]`, value);
            }
          });
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
   * @description Handle action on submit form on dialog verify pin
   */
  const accountStoreEdit_onSubmitDialogVerifyPIN = async () => {
    try {
      const formData = accountStoreEdit_onMappingFormData();

      await accountStoreEdit_fetchUpdateOutlet(accountStoreEdit_routeParamsId.value!, formData);

      accountStoreEdit_onCloseDialogVerifyPIN();
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
  const accountStoreEdit_onUploadPhoto = (event: FileUploadSelectEvent) => {
    if (event.files && event.files.length > 0) {
      accountStoreEdit_formData.photo = event.files[0]; // Assign the first file
    }
  };

  return {
    accountStoreEdit_fetchDetailOutlet,
    accountStoreEdit_formData,
    accountStoreEdit_formDataOfVerifyPin,
    accountStoreEdit_formValidations,
    accountStoreEdit_isEditable,
    accountStoreEdit_isLoading: outlet_isLoading,
    accountStoreEdit_onCancel,
    accountStoreEdit_onCloseDialogVerifyPIN,
    accountStoreEdit_onDeleteOutlet,
    accountStoreEdit_onRemovePhoto,
    accountStoreEdit_onShowDialogDeleteOutlet,
    accountStoreEdit_onSubmit,
    accountStoreEdit_onSubmitDialogVerifyPIN,
    accountStoreEdit_onUploadPhoto,
    accountStoreEdit_routeParamsId,
  };
};
