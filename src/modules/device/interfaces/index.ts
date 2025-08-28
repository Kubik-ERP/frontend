import { Validation } from '@vuelidate/core';
import { DataTableSortEvent } from 'primevue';

/**
 * @description Device interface for list device
 */
export interface IDevice {
  id: string;
  name: string;
  code: string;
  status: string;
  lastConnectedAt: string;
}

export interface IDeviceListRequestQuery {
  page: number;
  pageSize: number;
  orderBy: string | null;
  orderDirection: string | null;
}

export interface IDeviceListResponse {
  statusCode: number;
  message: string;
  data: {
    items: IDevice[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface IDeviceListProvided {
  device_columns: IColumnDataTable[];
  device_fetchData: () => Promise<void>;
  device_isLoading: globalThis.Ref<boolean>;
  device_listData: globalThis.Ref<IDevice[]>;
  device_queryParams: IDeviceListRequestQuery;
  device_onChangePage: (page: number) => void;
  device_values: globalThis.Ref<IDeviceListResponse>;
  device_onCreate: () => void;
  device_onView: (data: IDevice) => void;
  device_handleOnSortChange: (event: DataTableSortEvent) => void;
}

/**
 * @description Device interface for action device
 */
export interface IDeviceFormData{
  name: string;
}

export interface IDevicePayload {
  name: string;
}

export interface IDeviceActionResponse {
  statusCode: number;
  message: string;
  data: IDevice;
}

export interface IDeviceActionProvided {
  device_actionLoading: globalThis.Ref<boolean>;
  device_actionFormData: globalThis.Ref<IDeviceFormData>;
  device_actionValidations: globalThis.Ref<Validation>;
  device_actionSubmit: (id?: string, payload?: IDeviceFormData) => Promise<void>;
  device_actionResponse: globalThis.Ref<IDeviceActionResponse>;
  device_actionDisconnect: (id: string) => Promise<void>;
  device_actionOnDelete: (id: string) => Promise<void>;
  device_actionOnCancel: () => void;
  device_formMode: globalThis.Ref<string>;
  device_editingItem: globalThis.Ref<IDevice | null>;
  formIsValid: globalThis.ComputedRef<boolean>;
}
