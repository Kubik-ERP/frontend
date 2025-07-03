// Interfaces
import type { Validation } from '@vuelidate/core';
import type { FileUploadSelectEvent } from 'primevue';

export interface IAccountEditProfileFormData {
  name: string | null;
  email: string | null;
  phone: string | null;
  phoneCode: string;
  profilePhoto: File | null;
}

export interface IAccountEditProfileProvided {
  accountEditProfile_formData: IAccountEditProfileFormData;
  accountEditProfile_formValidations: globalThis.Ref<Validation>;
  accountEditProfile_isLoading: globalThis.Ref<boolean>;
  accountEditProfile_onUploadPhoto: (event: FileUploadSelectEvent) => void;
}
