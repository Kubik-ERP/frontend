import { IAccountStoreTable } from '@/modules/account/interfaces';

export * from './outlet-create-edit.interface';
export * from './outlet-list.interface';

export interface IOutletOperationalTime {
  closeTime: Date | string;
  openTime: Date | string;
}

export interface IOutletOperationalHour {
  day: string;
  hours: IOutletOperationalTime[];
}

export interface IOutletOperationalHourResult {
  days: 0;
  times: IOutletOperationalTime[];
}

export interface IOutlet {
  address: string;
  building: string;
  businessType: string;
  city: string;
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  operationalHours: IOutletOperationalHourResult[];
  phoneNumber: string;
  photo: string;
  postalCode: string;
  updatedAt: Date;
}

export interface IOutletUserBank {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

export interface IOutletProfile {
  stores: IOutlet[];
  userBanks: IOutletUserBank[];
}

export interface IOutletTable {
  createdAt: Date | string;
  floorName: string;
  id: string;
  storeId: string;
  storeTables: IAccountStoreTable[];
  uid: number;
  updatedAt: Date | string;
}

export interface IOutletDetailResponse extends IDefaultResponseFetch {
  data: IOutlet;
}

export interface IOutletOperationalHoursResponse extends IDefaultResponseFetch {
  data: IOutletOperationalHour[];
}

export interface IOutletProfileResponse extends IDefaultResponseFetch {
  data: IOutletProfile;
}

export interface IOutletTableResponse extends IDefaultResponseFetch {
  data: IOutletTable[];
}

export interface IOutletStateStore {
  outlet_currentOutlet: IOutlet | null;
  outlet_detail: IOutlet | null;
  outlet_isLoading: boolean;
  outlet_lists: IOutlet[];
  outlet_operationalHours: IOutletOperationalHour[];
  outlet_profile: IOutletProfile | null;
  outlet_tables: IOutletTable[];
}
