// Interfaces
import type { Validation } from '@vuelidate/core';
import type { DataTableSortEvent } from 'primevue';
import type {
  IPurchaseOrderCancelPayload,
  IPurchaseOrderConfirmPayload,
  IPurchaseOrderItem,
  IPurchaseOrderListRequestQuery,
  IPurchaseOrderMeta,
} from './purchase-order-store.interface';

export interface IPurchaseOrderListProvided {
  purchaseOrderList_columns: IColumnDataTable[];
  purchaseOrderList_fetchList: () => Promise<unknown>;
  purchaseOrderList_formDataOfCancel: globalThis.Ref<IPurchaseOrderCancelPayload>;
  purchaseOrderList_formDataOfConfirm: globalThis.Ref<IPurchaseOrderConfirmPayload>;
  purchaseOrderList_formValidationsOfConfirm: globalThis.Ref<Validation>;
  purchaseOrderList_getClassOfStatus: (status: string) => string;
  purchaseOrderList_handleOnSortChange: (event: DataTableSortEvent) => void;
  purchaseOrderList_isLoading: globalThis.Ref<boolean>;
  purchaseOrderList_onChangePage: (page: number) => void;
  purchaseOrderList_onCloseDialogCancel: () => void;
  purchaseOrderList_onCloseDialogConfirm: () => void;
  purchaseOrderList_onPay: (id: string) => Promise<void>;
  purchaseOrderList_onReceive: (id: string) => Promise<void>;
  purchaseOrderList_onShip: (id: string) => Promise<void>;
  purchaseOrderList_onShowButtonCancelPO: (status: string) => boolean;
  purchaseOrderList_onShowButtonDeliveryOrderDocument: (status: string) => boolean;
  purchaseOrderList_onShowDialogCancel: (id: string) => void;
  purchaseOrderList_onShowDialogConfirm: (id: string) => void;
  purchaseOrderList_onSubmitCancel: () => Promise<void>;
  purchaseOrderList_onSubmitConfirm: () => Promise<void>;
  purchaseOrderList_queryParams: IPurchaseOrderListRequestQuery;
  purchaseOrderList_values: globalThis.Ref<{
    items: IPurchaseOrderItem[];
    meta: IPurchaseOrderMeta;
  } | null>;
}
