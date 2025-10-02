// Interfaces
import type { IPurchaseOrderDetail } from './purchase-order-store.interface';
import type { Validation } from '@vuelidate/core';

// Interface for purchase order detail data
export interface IPurchaseOrderDetailData {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  orderStatus: string;
  deliveryDate?: string;
  totalPrice: number;
  productItems: IPurchaseOrderDetailProductItem[];
  receiver: {
    id: string;
    name: string;
  }
  createdAt: string;
  updatedAt: string;
}

// Interface for product items in detail view
export interface IPurchaseOrderDetailProductItem {
  id: string;
  masterItemId: string;
  sku: string;
  name: string;
  brandName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  // Additional fields for display
  category?: string;
  stockQuantity?: number;
}

// Interface for confirmation dialogs
export interface IPurchaseOrderDetailConfirmFormData {
  deliveryDate: Date | null;
}

export interface IPurchaseOrderDetailCancelFormData {
  reason: string;
}

export interface IPurchaseOrderDetailProvided {
  purchaseOrderDetail_data: globalThis.Ref<IPurchaseOrderDetail | null>;
  purchaseOrderDetail_dynamicButtonAction: (status: string) => void;
  purchaseOrderDetail_dynamicButtonLabel: (status: string) => string;
  purchaseOrderDetail_formDataOfConfirm: globalThis.Ref<IPurchaseOrderDetailConfirmFormData>;
  purchaseOrderDetail_formDataOfCancel: globalThis.Ref<IPurchaseOrderDetailCancelFormData>;
  purchaseOrderDetail_formValidationsOfConfirm: globalThis.Ref<Validation>;
  purchaseOrderDetail_fetchDetails: () => Promise<unknown>;
  purchaseOrderDetail_getStatusClass: (status: string) => string;
  purchaseOrderDetail_isLoading: globalThis.Ref<boolean>;
  purchaseOrderDetail_listColumns: IColumnDataTable[];
  purchaseOrderDetail_onBack: () => void;
  purchaseOrderDetail_onCancel: (id: string) => void;
  purchaseOrderDetail_onConfirm: () => void;
  purchaseOrderDetail_onCloseDialogConfirm: () => void;
  purchaseOrderDetail_onEdit: (id: string) => void;
  purchaseOrderDetail_onPay: () => void;
  purchaseOrderDetail_onReceive: () => void;
  purchaseOrderDetail_onShip: () => void;
}
