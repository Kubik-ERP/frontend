// Interfaces
import type { IAccountEditProfileFormData, IAccountEditProfileProvided } from '../interfaces';
import type { FileUploadSelectEvent } from 'primevue';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useOutletStore } from '@/modules/outlet/store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAccountEditProfileService = (): IAccountEditProfileProvided => {
  /**
   * @description Injected variables
   */
  const outletStore = useOutletStore();
  const router = useRouter();
  const { outlet_profile } = storeToRefs(outletStore);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const accountEditProfile_formData = ref<IAccountEditProfileFormData>({
    fullname: outlet_profile.value?.user.name || null,
    email: outlet_profile.value?.user.email || null,
    phone: outlet_profile.value?.user.phone || null,
    phoneCode: '+62',
    image: null,
  });
  const accountEditProfile_isLoading = ref<boolean>(false);

  /**
   * @description Form validations
   */
  const accountEditProfile_formRules = computed(() => ({
    fullname: { required },
    email: { required },
    phone: { required },
    phoneCode: { required },
  }));
  const accountEditProfile_formValidations = useVuelidate(
    accountEditProfile_formRules,
    accountEditProfile_formData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_updateOutlet function from the store to handle the request.
   */
  const accountEditProfile_fetchUpdateProfile = async (): Promise<void> => {
    accountEditProfile_isLoading.value = true;

    try {
      const formData = new FormData();

      for (const key in accountEditProfile_formData.value) {
        if (key === 'image') {
          if (accountEditProfile_formData.value.image && accountEditProfile_formData.value.image instanceof File) {
            formData.append('image', accountEditProfile_formData.value.image);
          }

          continue;
        }

        if (accountEditProfile_formData.value[key as keyof IAccountEditProfileFormData] !== null) {
          formData.append(
            key,
            accountEditProfile_formData.value[key as keyof IAccountEditProfileFormData] as string | Blob,
          );
        }
      }

      await outletStore.fetchOutlet_updateProfile(formData, {
        ...httpAbort_registerAbort('ACCOUNT_EDIT_PROFILE_UPDATE_REQUEST'),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'You have successfully updated your profile.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      setTimeout(() => {
        router.push({
          name: 'account.index',
        });
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for resetting the form data
   */
  // const accountEditProfile_onResetForm = (): void => {
  //   accountEditProfile_formData.value = {
  //     fullname: null,
  //     email: null,
  //     phone: null,
  //     phoneCode: null,
  //     image: null,
  //   };
  //   accountEditProfile_formValidations.value.$reset();
  // };

  /**
   * @description Handle business logic for submitting the form to update outlet profile
   */
  const accountEditProfile_onSubmit = async (): Promise<void> => {
    accountEditProfile_formValidations.value.$touch();

    if (accountEditProfile_formValidations.value.$invalid) {
      return;
    }

    try {
      await accountEditProfile_fetchUpdateProfile();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for uploading photo company logo
   */
  const accountEditProfile_onUploadPhoto = (event: FileUploadSelectEvent): void => {
    if (event.files && event.files.length > 0) {
      // Ensure we assign the actual File object, not the event
      accountEditProfile_formData.value.image = event.files[0];
    } else {
      accountEditProfile_formData.value.image = null;
    }
  };

  return {
    accountEditProfile_formData,
    accountEditProfile_formValidations,
    accountEditProfile_isLoading,
    accountEditProfile_onSubmit,
    accountEditProfile_onUploadPhoto,
    accountEditProfile_profile: outlet_profile,
  };
};
