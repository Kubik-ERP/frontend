// Constants
import {
  OUTLET_CREATE_EDIT_CREATE_NEW_OUTLET_REQUEST,
  OUTLET_CREATE_EDIT_DELETE_OUTLET_REQUEST,
  OUTLET_CREATE_EDIT_DETAIL_OUTLET_REQUEST,
  OUTLET_CREATE_EDIT_INITIAL_VALUES_OF_BUSINESS_HOURS,
  OUTLET_CREATE_EDIT_UPDATE_OUTLET_REQUEST,
} from '../constants/outlet-create-edit.constant';

// Interfaces
import type { FileUploadSelectEvent } from 'primevue';
import {
  EOutletBusinessType,
  IOutlet,
  IOutletBusinessHour,
  IOutletCreateEditFormData,
  IOutletCreateEditProvided,
} from '../interfaces';

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
    businessHours: OUTLET_CREATE_EDIT_INITIAL_VALUES_OF_BUSINESS_HOURS,
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
        const businessHours = value as IOutletBusinessHour[];
        const filteredBusinessHours = businessHours.filter(businessHour => businessHour.isOpen);

        filteredBusinessHours.forEach((businessHour: IOutletBusinessHour, index: number) => {
          for (const keyOfBusinessHour in businessHour) {
            const typedBusinessHourKey = keyOfBusinessHour as keyof IOutletBusinessHour;
            const businessHourValue = businessHour[typedBusinessHourKey];

            // Convert boolean to string if necessary
            const formValue =
              typeof businessHourValue === 'boolean'
                ? businessHourValue.toString() // Converts true -> "true", false -> "false"
                : businessHourValue;

            if (typedBusinessHourKey === 'openTime' || typedBusinessHourKey === 'closeTime') {
              // We need to add more zero value on it. So from HH:mm to HH:mm:ss
              const hour = new Date(formValue).getHours();
              const minute = new Date(formValue).getMinutes();

              formData.append(`${typedKey}[${index}][${typedBusinessHourKey}]`, `${hour}:${minute}:00`);
            } else {
              formData.append(`${typedKey}[${index}][${typedBusinessHourKey}]`, formValue);
            }
          }
        });
      } else {
        if (typedKey === 'photo' && value instanceof Blob) {
          const file = value as unknown as IObjectFileUpload;

          formData.append(typedKey, file.objectURL); // Handle Blob/File for photo
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
          outletCreateEdit_formData[key] = outlet_detail.value![keyResponse];
        }
      }
    }
  };

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_createNewOutlet function from the store to handle the request.
   */
  const outletCreateEdit_fetchCreateNewOutlet = async (formData: FormData) => {
    try {
      await store.fetchOutlet_createNewOutlet(formData, {
        ...httpAbort_registerAbort(OUTLET_CREATE_EDIT_CREATE_NEW_OUTLET_REQUEST),
      });
    } catch (error: unknown) {
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
      await store.fetchOutlet_deleteOutlet(id, {
        ...httpAbort_registerAbort(OUTLET_CREATE_EDIT_DELETE_OUTLET_REQUEST),
      });
    } catch (error: unknown) {
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
      await store.fetchOutlet_updateOutlet(id, formData, {
        ...httpAbort_registerAbort(OUTLET_CREATE_EDIT_UPDATE_OUTLET_REQUEST),
      });
    } catch (error: unknown) {
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
    const argsEventEmitter: IPropsDialog = {
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle action on delete outlet
   */
  const outletCreateEdit_onDeleteOutlet = async (id: string): Promise<void> => {
    try {
      await outletCreateEdit_fetchDeleteOutlet(id);
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
   * @description Handle action on submit form.
   */
  const outletCreateEdit_onSubmit = async (): Promise<void> => {
    try {
      outletCreateEdit_formValidations.value.$touch();
      if (outletCreateEdit_formValidations.value.$invalid) return;

      const argsEventEmitter: IPropsDialog = {
        isUsingClosableButton: false,
        isUsingBackdrop: true,
        isOpen: true,
      };

      eventBus.emit('AppBaseDialog', argsEventEmitter);
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

      if (route.params.id) {
        await outletCreateEdit_fetchUpdateOutlet(route.params.id as string, formData);
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
    outletCreateEdit_formValidations,
    outletCreateEdit_isLoading: outlet_isLoading,
    outletCreateEdit_onCancel,
    outletCreateEdit_onCloseDialogVerifyPIN,
    outletCreateEdit_onDeleteOutlet,
    outletCreateEdit_onRemovePhoto,
    outletCreateEdit_onSubmit,
    outletCreateEdit_onSubmitDialogVerifyPIN,
    outletCreateEdit_onUploadPhoto,
  };
};
