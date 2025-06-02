// Interfaces
import type { Validation } from '@vuelidate/core';
import type { FileUploadSelectEvent } from 'primevue';

export enum EOutletBusinessType {
  RestaurantFnB = 'Restaurant',
  Retail = 'Retail',
}

export interface IOutletBusinessHour {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export interface IOutletCreateEditFormData {
  storeName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  businessType: EOutletBusinessType;
  streetAddress: string;
  photo: FileUploadSelectEvent | null;
  city: string;
  postalCode: string;
  building: string;
  businessHours: IOutletBusinessHour[];
}

export interface IOutletCreateEditProvided {
  outletCreateEdit_fetchDetailOutlet: (outletId: string) => Promise<unknown>;
  outletCreateEdit_formData: IOutletCreateEditFormData;
  outletCreateEdit_formValidations: globalThis.Ref<Validation>;
  outletCreateEdit_isLoading: globalThis.Ref<boolean>;
  outletCreateEdit_onCancel: () => void;
  outletCreateEdit_onCloseDialogVerifyPIN: () => void;
  outletCreateEdit_onDeleteOutlet: (outletId: string) => Promise<unknown>;
  outletCreateEdit_onRemovePhoto: () => void;
  outletCreateEdit_onShowDialogDeleteOutlet: () => Promise<void>;
  outletCreateEdit_onSubmit: () => Promise<unknown>;
  outletCreateEdit_onSubmitDialogVerifyPIN: () => Promise<unknown>;
  outletCreateEdit_onUploadPhoto: (event: FileUploadSelectEvent) => void;
}
