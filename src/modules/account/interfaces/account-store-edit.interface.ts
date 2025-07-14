// Interfaces
import type { Validation } from '@vuelidate/core';
import type { FileUploadSelectEvent } from 'primevue';

export enum EAccountStoreBusinessType {
  RestaurantFnB = 'Restaurant',
  Retail = 'Retail',
}

export interface IAccountStoreEditHours {
  openTime: Date | Date[] | (Date | null)[] | null | undefined;
  closeTime: Date | Date[] | (Date | null)[] | null | undefined;
}

export interface IAccountStoreEditBusinessHour {
  timeSlots: IAccountStoreEditHours[];
  day: string;
  isOpen: boolean;
}

export interface IAccountStoreEditFormData {
  storeName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  businessType: EAccountStoreBusinessType;
  streetAddress: string;
  photo: FileUploadSelectEvent | null;
  city: string;
  postalCode: string;
  building: string;
  businessHours: IAccountStoreEditBusinessHour[];
}

export interface IAccountStoreEditProvided {
  accountStoreEdit_fetchDetailOutlet: (outletId: string) => Promise<unknown>;
  accountStoreEdit_formData: IAccountStoreEditFormData;
  accountStoreEdit_formDataOfVerifyPin: IAuthenticationVerifyPinFormData;
  accountStoreEdit_formValidations: globalThis.Ref<Validation>;
  accountStoreEdit_isEditable: globalThis.Ref<boolean>;
  accountStoreEdit_isLoading: globalThis.Ref<boolean>;
  accountStoreEdit_onCancel: () => void;
  accountStoreEdit_onCloseDialogVerifyPIN: () => void;
  accountStoreEdit_onDeleteOutlet: (outletId: string) => Promise<unknown>;
  accountStoreEdit_onRemovePhoto: () => void;
  accountStoreEdit_onShowDialogDeleteOutlet: () => Promise<void>;
  accountStoreEdit_onSubmit: () => Promise<unknown>;
  accountStoreEdit_onSubmitDialogVerifyPIN: () => Promise<unknown>;
  accountStoreEdit_onUploadPhoto: (event: FileUploadSelectEvent) => void;
  accountStoreEdit_routeParamsId: globalThis.Ref<string | undefined>;
}
