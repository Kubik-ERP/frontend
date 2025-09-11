// Interfaces
import type { Validation } from '@vuelidate/core';

export interface IAccountStoreTable {
  createdAt: Date | string;
  floorId: string;
  floorName: string;
  height: number;
  id: string;
  isEnableQrCode: boolean;
  name: string;
  positionX: number;
  positionY: number;
  seats: number;
  shape: 'SQUARE' | 'RECTANGLE' | 'ROUND';
  storeId: string;
  uid: number;
  statusTable: 'available' | 'occupied' | 'reserved';
  updatedAt: Date | string;
  width: number;
}

export type IAccountStoreTableConfigurationFormDataOfAddTable = Omit<
  IAccountStoreTable,
  'id' | 'createdAt' | 'updatedAt' | 'storeId' | 'floorId' | 'uid'
>;

export interface IAccountStoreTableConfigurationFormDataOfAddFloor {
  floorName: string;
  tables?: IAccountStoreTableConfigurationFormDataOfAddTable[];
}

export interface IAccountStoreTableConfigurationFormData {
  configurations: IAccountStoreTableConfigurationFormDataOfAddFloor[];
}

export interface IAccountStoreTableConfigurationSelectedData {
  floorIndex: number | null;
  tableIndex: number | null;
}

export interface IAccountStoreTableConfigurationProvided {
  accountStoreTableConfiguration_addFloor: () => void;
  accountStoreTableConfiguration_checkIfAlreadyHaveTable: () => boolean;
  accountStoreTableConfiguration_editableData: globalThis.Ref<Omit<IAccountStoreTable, 'id'> | null>;
  accountStoreTableConfiguration_fetchDeleteStoreTable: (tableId: string) => Promise<void>;
  accountStoreTableConfiguration_fetchOutletStoreTable: () => Promise<void>;
  accountStoreTableConfiguration_formData: IAccountStoreTableConfigurationFormData;
  accountStoreTableConfiguration_formDataOfAddFloor: IAccountStoreTableConfigurationFormDataOfAddFloor;
  accountStoreTableConfiguration_formDataOfAddTable: IAccountStoreTableConfigurationFormDataOfAddTable;
  accountStoreTableConfiguration_formValidations: globalThis.Ref<Validation>;
  accountStoreTableConfiguration_formValidationsOfAddFloor: globalThis.Ref<Validation>;
  accountStoreTableConfiguration_formValidationsOfAddTable: globalThis.Ref<Validation>;
  accountStoreTableConfiguration_isAlreadyHaveTable: globalThis.Ref<boolean>;
  accountStoreTableConfiguration_isEditableMode: globalThis.Ref<boolean>;
  accountStoreTableConfiguration_isOperationSuccessful: globalThis.Ref<boolean>;
  accountStoreTableConfiguration_isShowDialogExitConfirmation: globalThis.Ref<boolean>;
  accountStoreTableConfiguration_lists: globalThis.Ref<IAccountStoreTable[]>;
  accountStoreTableConfiguration_listShapes: IDropdownItem[];
  accountStoreTableConfiguration_onCloseDialogAddFloor: () => void;
  accountStoreTableConfiguration_onCloseDialogAddTable: () => void;
  accountStoreTableConfiguration_onShowDialogAddFloor: () => void;
  accountStoreTableConfiguration_onShowDialogAddTable: (
    configuration: IAccountStoreTableConfigurationFormDataOfAddFloor,
  ) => void;
  accountStoreTableConfiguration_onShowDialogDeleteTable: (floorName: string, tableName: string) => void;
  accountStoreTableConfiguration_onShowDialogEditFloor: (floorName: string) => void;
  accountStoreTableConfiguration_onShowDialogEditTable: (
    table: IAccountStoreTableConfigurationFormDataOfAddTable,
  ) => void;
  accountStoreTableConfiguration_onShowDialogEnableQrCode: () => void;
  accountStoreTableConfiguration_onSubmitFormAddFloor: () => void;
  accountStoreTableConfiguration_onSubmitFormAddTable: () => void;
  accountStoreTableConfiguration_onSubmit: () => Promise<void>;
}
