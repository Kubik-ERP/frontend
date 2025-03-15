// Interfaces
import type { Validation } from '@vuelidate/core';

export enum EOutletBusinessType {
  RestaurantFnB = 'Restaurant (Food & Beverage)',
  Retail = 'Retail',
}

export interface IOutletOperational {
  name: string;
  startTime: string;
  endTime: string;
  isOpen: boolean;
}

export interface IOutletCreateEditFormData {
  name: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  businessType: EOutletBusinessType;
  address: string;
  photo: string;
  location: string;
  city: string;
  postalCode: string;
  building: string;
  operationals: IOutletOperational[];
}

export interface IOutletCreateEditProvided {
  outletCreateEdit_formData: IOutletCreateEditFormData;
  outletCreateEdit_formValidations: globalThis.Ref<Validation>;
}
