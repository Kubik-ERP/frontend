import type { Ref } from 'vue';

export type TransferStockStatus =
  | 'draft'
  | 'approved'
  | 'shipped'
  | 'received'
  | 'received_with_issue'
  | 'closed';

export interface ITransferStockItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  uom: string;
  qtyRequested: number;
  qtyApproved: number;
  qtyShipped: number;
  qtyReceived: number;
  unitPrice: number | null;
  shortfallQty: number;
  issueNotes: string | null;
}

export interface ITransferStockLogEntry {
  id: string;
  transferId: string;
  action: string;
  status: TransferStockStatus;
  actor: string;
  message: string;
  createdAt: string;
  meta?: Record<string, unknown>;
}

export interface ITransferStockSummary {
  id: string;
  referenceNumber: string;
  status: TransferStockStatus;
  storeFromId: string;
  storeFromName: string;
  storeToId: string;
  storeToName: string;
  requestedBy: string;
  approvalRequired: boolean;
  totalItems: number;
  totalQty: number;
  totalValue: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string | null;
  approvedBy?: string | null;
  shippedAt?: string | null;
  shippedBy?: string | null;
  receivedAt?: string | null;
  receivedBy?: string | null;
  logisticProvider?: string | null;
  trackingNumber?: string | null;
  deliveryNote?: string | null;
  estimatedArrivalDate?: string | null;
}

export interface ITransferStock extends ITransferStockSummary {
  items: ITransferStockItem[];
  logs: ITransferStockLogEntry[];
  attachments: string[];
}

export interface ITransferStockStoreInventory {
  id: string;
  code: string;
  name: string;
  address: string;
  phone?: string;
  contactPerson?: string;
  inventory: Record<
    string,
    {
      productId: string;
      productCode: string;
      productName: string;
      uom: string;
      availableQty: number;
      reservedQty: number;
      inTransitQty: number;
    }
  >;
}

export interface ITransferStockCreateFormPayload {
  storeFromId: string;
  storeToId: string;
  requestedBy: string;
  approvalRequired: boolean;
  notes: string | null;
  items: Array<
    Pick<ITransferStockItem, 'productId' | 'productCode' | 'productName' | 'uom' | 'qtyRequested' | 'unitPrice'>
  >;
}

export interface ITransferStockApprovePayload {
  transferId: string;
  approvedBy: string;
}

export interface ITransferStockShipmentPayload {
  transferId: string;
  shippedBy: string;
  shippedAt: string;
  logisticProvider?: string | null;
  trackingNumber?: string | null;
  deliveryNote?: string | null;
  qtyShipped: Array<{ itemId: string; qtyShipped: number }>;
}

export interface ITransferStockReceivePayload {
  transferId: string;
  receivedBy: string;
  receivedAt: string;
  items: Array<{ itemId: string; qtyReceived: number; issueNotes: string | null }>;
}

export interface ITransferStockClosePayload {
  transferId: string;
  closedBy: string;
  notes?: string | null;
}

export interface ITransferStockStoreProvided {
  transferStock_isLoading: Ref<boolean>;
  transferStock_list: Ref<ITransferStockSummary[]>;
  transferStock_selected: Ref<ITransferStock | null>;
  transferStock_stores: Ref<ITransferStockStoreInventory[]>;
  transferStock_createTransfer: (payload: ITransferStockCreateFormPayload) => Promise<ITransferStock>;
  transferStock_approveTransfer: (payload: ITransferStockApprovePayload) => Promise<ITransferStock>;
  transferStock_cancelApproval: (transferId: string, actor: string) => Promise<ITransferStock>;
  transferStock_shipTransfer: (payload: ITransferStockShipmentPayload) => Promise<ITransferStock>;
  transferStock_receiveTransfer: (payload: ITransferStockReceivePayload) => Promise<ITransferStock>;
  transferStock_closeTransfer: (payload: ITransferStockClosePayload) => Promise<ITransferStock>;
  transferStock_selectTransfer: (transferId: string | null) => void;
  transferStock_initialize: () => Promise<void>;
}
