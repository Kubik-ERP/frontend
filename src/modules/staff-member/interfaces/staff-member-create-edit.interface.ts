// Interfaces
import type { Validation } from '@vuelidate/core';
import type { FileUploadSelectEvent } from 'primevue';
import type { IStaffMember } from './index';
import { IVoucher } from '@/modules/voucher/interfaces';
import { IProduct } from '@/modules/catalog-product/interfaces';

export interface IStaffMemberShift {
  day: string | null;
  start_time: Date | null;
  end_time: Date | null;
  isActive: boolean;
}

export interface IStaffMemberProductItemComission {
  product_id: string | null;
  amount: number | null;
  is_percent: boolean | null;
}

export interface IStaffMemberProductComission {
  isAllItemsHaveDefaultCommission: boolean | null;
  productItems: IStaffMemberProductItemComission[];
}

export interface IStaffMemberVoucherItemComission {
  voucher_id: string | null;
  amount: number | null;
  is_percent: boolean | null;
}

export interface IStaffMemberVoucherCommission {
  isAllVouchersHaveDefaultComission: boolean | null;
  voucherItems: IStaffMemberVoucherItemComission[];
}

export interface IStaffMemberComissions {
  productCommission: IStaffMemberProductComission;
  voucherCommission: IStaffMemberVoucherCommission;
}

export interface IStaffMemberSocialMedia {
  name: string | null;
  account: string | null;
}

export interface IStaffMemberCreateEditFormData {
  name: string | null;
  email: string | null;
  phoneCode: string;
  phoneNumber: string | null;
  image: File | null;
  imagePreview: string | null;
  startDate: Date | null;
  endDate: Date | null;
  gender: string | null;
  title: string | null;
  permission: string | null;
  socialMedia: IStaffMemberSocialMedia[];
  shift: IstaffWorkingHour[];
  defaultCommissionProductType: string | null;
  defaultCommissionVoucherType: string | null;
  defaultCommissionVoucher: number | null;
  defaultCommissionProduct: number | null;
  commissions: IStaffMemberComissions;
}

export interface IstaffHour {
  startTime: Date | Date[] | (Date | null)[] | null | undefined;
  endTime: Date | Date[] | (Date | null)[] | null | undefined;
}

export interface IstaffWorkingHour {
  timeSlots: IstaffHour[];
  day: string;
  isActive: boolean;
}

export interface IStaffMemberDetailsResponse {
  data: IStaffMember;
}

export interface ICommissionTableData {
  id: string;
  name: string;
  commissionType: string;
  commissionValue: number;
  // normalized field
  price?: number;
  discountPrice?: number;
  amount?: number;
  isPercent?: boolean;
}

export interface IStafPermission {
  id?: string | null;
  name?: string | null;
  label?: string | null;
  value?: string | null;
}

export interface IStaffMemberCreateEditProvided {
  staffMemberCreateEdit_columnsOfCommissions: IColumnDataTable[];
  staffMemberCreateEdit_dataColumnsOfVoucher: globalThis.Ref<IVoucher[]>;
  staffMemberCreateEdit_dataColumnsOfProduct: globalThis.Ref<IProduct[]>;
  staffMemberCreateEdit_commissionsSearch: globalThis.Ref<string>;
  staffMemberCreateEdit_commisionType: globalThis.Ref<'PRODUCT' | 'VOUCHER'>;
  staffMemberCreateEdit_fetchDetailStaffMember: () => Promise<unknown>;
  staffMemberCreateEdit_formData: IStaffMemberCreateEditFormData;
  staffMemberCreateEdit_formValidations: globalThis.Ref<Validation>;
  staffMemberCreateEdit_isEditable: globalThis.Ref<boolean>;
  staffMemberCreateEdit_isLoading: globalThis.Ref<boolean>;
  staffMemberCreateEdit_onCancel: () => void;
  staffMemberCreateEdit_onCloseDialogCommission: () => void;
  staffMemberCreateEdit_onSubmitDialogCommission: (formData: FormData) => void;
  staffMemberCreateEdit_onDelete: () => void;
  staffMemberCreateEdit_onOpenDialogCommission: (type: 'PRODUCT' | 'VOUCHER') => void;
  staffMemberCreateEdit_onSubmit: () => Promise<unknown>;
  staffMemberCreateEdit_onUploadPhotoProfile: (event: FileUploadSelectEvent) => void;
  staffMemberCreateEdit_routeParamsId: globalThis.Ref<string | undefined>;
  staffMemberCreateEdit_typesOfSocialMedia: IDropdownItem[];
  staffMemberCreateEdit_typesOfUserPermissions: globalThis.Ref<IStafPermission[]>;
}
