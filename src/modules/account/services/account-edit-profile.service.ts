// Interfaces
import type { IAccountEditProfileFormData, IAccountEditProfileProvided } from '../interfaces';
import type { FileUploadSelectEvent } from 'primevue';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAccountEditProfileService = (): IAccountEditProfileProvided => {
  /**
   * @description Reactive data binding
   */
  const accountEditProfile_formData = reactive<IAccountEditProfileFormData>({
    name: null,
    email: null,
    phone: null,
    phoneCode: '+62',
    profilePhoto: null,
  });
  const accountEditProfile_isLoading = ref<boolean>(false);

  /**
   * @description Form validations
   */
  const accountEditProfile_formRules = computed(() => ({
    name: { required },
    email: { required },
    phone: { required },
  }));
  const accountEditProfile_formValidations = useVuelidate(
    accountEditProfile_formRules,
    accountEditProfile_formData,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle business logic for uploading photo company logo
   */
  const accountEditProfile_onUploadPhoto = (event: FileUploadSelectEvent): void => {
    if (event.files && event.files.length > 0) {
      accountEditProfile_formData.profilePhoto = event.files[0];
    } else {
      accountEditProfile_formData.profilePhoto = null;
    }
  };

  return {
    accountEditProfile_formData,
    accountEditProfile_formValidations,
    accountEditProfile_isLoading,
    accountEditProfile_onUploadPhoto,
  };
};
