// Interfaces
import type { Validation } from '@vuelidate/core';
import type { FileUploadSelectEvent } from 'primevue';

export interface IStaffMemberWorkingHour {
  day: string | null;
  startTime: string | null;
  endTime: string | null;
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

export interface IStaffMemberCreateEditFormData {
  name: string | null;
  email: string | null;
  phoneCode: string;
  phone_number: string | null;
  photoProfile: string | null;
  startDate: Date | null;
  endDate: Date | null;
  gender: string | null;
  title: string | null;
  permission: string | null;
  socialMedia: {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
  };
  workingHours: IStaffMemberWorkingHour[];
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
