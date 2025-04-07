// Interfaces
import type { Validation } from '@vuelidate/core';

export enum EOutletBusinessType {
  RestaurantFnB = 'Restaurant (Food & Beverage)',
  Retail = 'Retail',
}

export interface IOutletOperational {
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
  photo: string;
  city: string;
  postalCode: string;
  building: string;
  operationals: IOutletOperational[];
}

export interface IOutletCreateEditProvided {
  outletCreateEdit_formData: IOutletCreateEditFormData;
  outletCreateEdit_formValidations: globalThis.Ref<Validation>;
}
