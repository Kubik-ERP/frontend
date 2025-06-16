export * from './outlet-create-edit.interface';
export * from './outlet-list.interface';

export interface IOutlet {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  business_type: string;
  photo: string;
  address: string;
  city: string;
  postal_code: string;
  building: string;
  created_at: Date;
  updated_at: Date;
}

export interface IOutletDetailResponse {
  data: IOutlet;
}

export interface IOutletStateStore {
  outlet_detail: IOutlet | null;
  outlet_isLoading: boolean;
  outlet_lists: IOutlet[];
  outlet_currentOutlet: IOutlet | null;
}
