// Interfaces
import type { IOutletProfile } from '@/modules/outlet/interfaces';
import type { Validation } from '@vuelidate/core';
import type { FileUploadSelectEvent } from 'primevue';

export interface IAccountEditProfileFormData {
  fullname: string | null;
  email: string | null;
  phone: string | null;
  phoneCode: string | null;
  image: FileUploadSelectEvent | null;
}

export interface IAccountEditProfileProvided {
  accountEditProfile_formData: globalThis.Ref<IAccountEditProfileFormData>;
  accountEditProfile_formValidations: globalThis.Ref<Validation>;
  accountEditProfile_isLoading: globalThis.Ref<boolean>;
  accountEditProfile_onSubmit: () => Promise<void>;
  accountEditProfile_onUploadPhoto: (event: FileUploadSelectEvent) => void;
  accountEditProfile_profile: globalThis.Ref<IOutletProfile | null>;
}
