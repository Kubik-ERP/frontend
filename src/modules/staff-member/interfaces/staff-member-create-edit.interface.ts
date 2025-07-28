// Interfaces
import type { Validation } from '@vuelidate/core';
import type { FileUploadSelectEvent } from 'primevue';

export interface IStaffMemberShift {
  day: string | null;
  start_time: string | null;
  end_time: string | null;
  isActive: boolean;
}

export interface IStaffMemberProductItemComission {
  productId: string | null;
  comission: number | null;
  comissionType: string | null;
}

export interface IStaffMemberProductComission {
  defaultComission: number | null;
  defaultComissionType: string | null;
  isAllItemsHaveDefaultComission: boolean | null;
  productItems: IStaffMemberProductItemComission[];
}

export interface IStaffMemberVoucherItemComission {
  voucherId: string | null;
  comission: number | null;
  comissionType: string | null;
}

export interface IStaffMemberVoucherCommission {
  defaultComission: number | null;
  defaultComissionType: string | null;
  isAllVouchersHaveDefaultComission: boolean | null;
  voucherItems: IStaffMemberVoucherItemComission[];
}

export interface IStaffMemberComissions {
  productComission: IStaffMemberProductComission;
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
  imagePreview: string | null; // This will hold the preview URL of the image
  startDate: Date | null;
  endDate: Date | null;
  gender: string | null;
  title: string | null;
  permission: string | null;
  socialMedia: IStaffMemberSocialMedia[];
  shift: IStaffMemberShift[];
  comissions: IStaffMemberComissions;
}

export interface IStaffMemberCreateEditProvided {
  staffMemberCreateEdit_columnsOfCommissions: IColumnDataTable[];
  staffMemberCreateEdit_commisionType: globalThis.Ref<'PRODUCT' | 'VOUCHER'>;
  staffMemberCreateEdit_fetchDetailStaffMember: () => Promise<unknown>;
  staffMemberCreateEdit_formData: IStaffMemberCreateEditFormData;
  staffMemberCreateEdit_formValidations: globalThis.Ref<Validation>;
  staffMemberCreateEdit_isEditable: globalThis.Ref<boolean>;
  staffMemberCreateEdit_isLoading: globalThis.Ref<boolean>;
  staffMemberCreateEdit_onCancel: () => void;
  staffMemberCreateEdit_onCloseDialogCommission: () => void;
  staffMemberCreateEdit_onDelete: () => void;
  staffMemberCreateEdit_onOpenDialogCommission: (type: 'PRODUCT' | 'VOUCHER') => void;
  staffMemberCreateEdit_onSubmit: () => Promise<unknown>;
  staffMemberCreateEdit_onUploadPhotoProfile: (event: FileUploadSelectEvent) => void;
  staffMemberCreateEdit_routeParamsId: globalThis.Ref<string | undefined>;
  staffMemberCreateEdit_typesOfSocialMedia: IDropdownItem[];
  staffMemberCreateEdit_typesOfUserPermissions: IDropdownItem[];
}
