// Constants
import {
  OUTLET_CREATE_EDIT_CREATE_NEW_OUTLET_REQUEST,
  OUTLET_CREATE_EDIT_DELETE_OUTLET_REQUEST,
  OUTLET_CREATE_EDIT_DETAIL_OUTLET_REQUEST,
  OUTLET_CREATE_EDIT_UPDATE_OUTLET_REQUEST,
} from '../constants/outlet-create-edit.constant';
import { STORE_INITIAL_VALUES_OF_OPERATIONAL_HOURS } from '@/app/constants';

// Interfaces
import type { FileUploadSelectEvent } from 'primevue';
import { EOutletBusinessType, IOutlet, IOutletCreateEditFormData, IOutletCreateEditProvided } from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

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
        // const businessHours = value as IStoreOperationalHour[];
        // const filteredBusinessHours = businessHours.filter(businessHour => businessHour.isOpen);
        // filteredBusinessHours.forEach((businessHour: IStoreOperationalHour, index: number) => {
        //   for (const keyOfBusinessHour in businessHour) {
        //     const typedBusinessHourKey = keyOfBusinessHour as keyof IStoreOperationalHour;
        //     const businessHourValue = businessHour[typedBusinessHourKey];
        //     // Convert boolean to string if necessary
        //     const formValue =
        //       typeof businessHourValue === 'boolean'
        //         ? businessHourValue.toString() // Converts true -> "true", false -> "false"
        //         : businessHourValue;
        //     if (typedBusinessHourKey === 'openTime' || typedBusinessHourKey === 'closeTime') {
        //       // We need to add more zero value on it. So from HH:mm to HH:mm:ss
        //       let hour = new Date(formValue).getHours().toString();
        //       let minute = new Date(formValue).getMinutes().toString();
        //       // Check if hour or minute is less than 10, then add a leading zero
        //       hour = +hour < 10 ? `0${hour}` : hour;
        //       minute = +minute < 10 ? `0${minute}` : minute;
        //       formData.append(`${typedKey}[${index}][${typedBusinessHourKey}]`, `${hour}:${minute}:00`);
        //     } else {
        //       formData.append(`${typedKey}[${index}][${typedBusinessHourKey}]`, formValue);
        //     }
        //   }
        // });
      } else {
        if (typedKey === 'photo' && value instanceof Blob) {
          formData.append('file', value); // Handle Blob/File for photo
        }

        if (typeof value === 'string') {
          formData.append(typedKey, value); // Handle string fields
        }
      }
    }

    return formData;
  };

  /**
   * @description Handle business logic for mapping data of outlet detail to the form
   */
  const outletCreateEdit_onMappingResponseDetail = () => {
    const outletKeys = Object.keys(outlet_detail.value!) as (keyof IOutlet)[];
    const formDataKeys = Object.keys(outletCreateEdit_formData) as (keyof IOutletCreateEditFormData)[];

    for (const key of formDataKeys) {
      for (const keyResponse of outletKeys) {
        if (key === 'photo') {
          return;
        }

        if (keyResponse === key) {
          if (key === 'businessType') {
            outletCreateEdit_formData[key] = outlet_detail.value![keyResponse] as EOutletBusinessType;
          } else {
            outletCreateEdit_formData[key] = outlet_detail.value![keyResponse];
          }
        }
      }
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
   * @description Handle action on cancel button
   */
  const outletCreateEdit_onCancel = (): void => {
    router.push({ name: 'outlet-list' });
  };

  /**
   * @description Handle action on cancel button on dialog verify pin
   */
  const outletCreateEdit_onCloseDialogVerifyPIN = (): void => {
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

      const argsEventEmitter: IPropsDialogPinVerification = {
        isOpen: true,
        isInvalid: outletCreateEdit_isPinInvalid.value,
        pinConfirmation: outletCreateEdit_formDataOfVerifyPin.pinConfirmation,
        onClickPrimaryButton: outletCreateEdit_onSubmitDialogVerifyPIN,
        onClickSecondaryButton: outletCreateEdit_onCloseDialogVerifyPIN,
        primaryButtonLabel: outletCreateEdit_isEditable.value ? 'Update Store Data' : 'Create Store',
      };

      eventBus.emit('AppBaseDialogPinVerification', argsEventEmitter);
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

      outletCreateEdit_onCloseDialogVerifyPIN();
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
      outletCreateEdit_formData.photo = event.files[0]; // Assign the first file
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
    outletCreateEdit_onShowDialogDeleteOutlet,
    outletCreateEdit_onSubmit,
    outletCreateEdit_onSubmitDialogVerifyPIN,
    outletCreateEdit_onUploadPhoto,
    outletCreateEdit_routeParamsId,
  };
};
