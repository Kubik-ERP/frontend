// Interfaces
import type { ITransferStock } from './transfer-stock-store.interface';

export interface ITransferStockShippingDocumentProvided {
  transferStockShippingDocument_data: globalThis.Ref<ITransferStock | null>;
  transferStockShippingDocument_fetchDetails: () => Promise<unknown>;
  transferStockShippingDocument_isLoading: globalThis.Ref<boolean>;
}

export interface TransferStockShippingDocumentPdfData {
  transactionCode: string;
  storeFrom: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
  storeTo: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
  shippedAt: string | null;
  trackingNumber: string | null;
  logisticProvider: string | null;
  deliveryNote: string | null;
  transferStockItems: {
    id: string;
    masterInventoryItems: {
      sku: string;
      name: string;
      unit: string;
    };
    qtyReserved: number;
    unitPrice: unknown;
    subtotal: unknown;
  }[];
  note: string;
}
