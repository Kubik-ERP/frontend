// Interfaces
import type { IPurchaseOrderDetail } from './purchase-order-store.interface';

export interface IPurchaseOrderDeliveryOrderDocumentProvided {
  purchaseOrderDeliveryOrderDocument_data: globalThis.Ref<IPurchaseOrderDetail | null>;
  purchaseOrderDeliveryOrderDocument_fetchDetails: () => Promise<unknown>;
  purchaseOrderDeliveryOrderDocument_isLoading: globalThis.Ref<boolean>;
  purchaseOrderDeliveryOrderDocument_listColumns: IColumnDataTable[];
}
