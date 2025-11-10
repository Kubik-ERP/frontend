// Interfaces
import type { Validation } from '@vuelidate/core';
import type { DataTableSortEvent } from 'primevue';
import type {
  ITransferStockApprovePayload,
  ITransferStockCancelPayload,
  ITransferStockItem,
  ITransferStockListRequestQuery,
  ITransferStockMeta,
  ITransferStockReceivePayload,
  ITransferStockShipPayload,
} from './transfer-stock-store.interface';

export interface ITransferStockListProvided {
  transferStockList_columns: IColumnDataTable[];
  transferStockList_fetchList: () => Promise<unknown>;
  transferStockList_formDataOfApprove: globalThis.Ref<ITransferStockApprovePayload>;
  transferStockList_formDataOfCancel: globalThis.Ref<ITransferStockCancelPayload>;
  transferStockList_formDataOfReceive: globalThis.Ref<ITransferStockReceivePayload>;
  transferStockList_formDataOfShip: globalThis.Ref<ITransferStockShipPayload>;
  transferStockList_formValidationsOfApprove: globalThis.Ref<Validation>;
  transferStockList_formValidationsOfCancel: globalThis.Ref<Validation>;
  transferStockList_formValidationsOfReceive: globalThis.Ref<Validation>;
  transferStockList_formValidationsOfShip: globalThis.Ref<Validation>;
  transferStockList_getClassOfStatus: (status: string) => string;
  transferStockList_handleOnSortChange: (event: DataTableSortEvent) => void;
  transferStockList_isLoading: globalThis.Ref<boolean>;
  transferStockList_onChangePage: (page: number) => void;
  transferStockList_onCloseDialogApprove: () => void;
  transferStockList_onCloseDialogCancel: () => void;
  transferStockList_onCloseDialogReceive: () => void;
  transferStockList_onCloseDialogShip: () => void;
  transferStockList_onShowButtonApprove: (status: string) => boolean;
  transferStockList_onShowButtonCancel: (status: string) => boolean;
  transferStockList_onShowButtonReceive: (status: string) => boolean;
  transferStockList_onShowButtonShip: (status: string) => boolean;
  transferStockList_onShowButtonCancelTransfer: (status: string) => boolean;
  transferStockList_onShowButtonShippingDocument: (status: string) => boolean;
  transferStockList_onShowDialogApprove: (id: string) => void;
  transferStockList_onShowDialogCancel: (id: string) => void;
  transferStockList_onShowDialogReceive: (id: string) => void;
  transferStockList_onShowDialogShip: (id: string) => void;
  transferStockList_onSubmitApprove: () => Promise<void>;
  transferStockList_onSubmitCancel: () => Promise<void>;
  transferStockList_onSubmitReceive: () => Promise<void>;
  transferStockList_onSubmitShip: () => Promise<void>;
  transferStockList_queryParams: ITransferStockListRequestQuery;
  transferStockList_values: globalThis.Ref<{
    items: ITransferStockItem[];
    meta: ITransferStockMeta;
  } | null>;
}