import { Validation } from '@vuelidate/core';
import { IPurchaseOrderDetail } from './purchase-order-store.interface';

export interface IPurchaseOrderReceivedProvided {
  purchaseOrderReceived_data: globalThis.Ref<IPurchaseOrderDetail | null>;
  purchaseOrderReceived_formData: globalThis.Ref<IPurchaseOrderReceivedFormData>;
  purchaseOrderReceived_fetchDetails: () => Promise<void>;
  purchaseOrderReceived_validations: globalThis.Ref<Validation<IPurchaseOrderReceivedFormData>>;
  purchaseOrderReceived_listColumns: IColumnDataTable[];
  purchaseOrderReceived_isLoading: globalThis.Ref<boolean>;
  purchaseOrderReceived_onBack: () => void;
  purchaseOrderReceived_listStaff: globalThis.Ref<IDropdownItem[]>;
  purchaseOrderReceived_onSubmit: () => void;
  purchaseOrderReceived_isOwner: globalThis.ComputedRef<boolean>;
  purchaseOrderReceived_onShowNotesDialog: (item: IPurchaseOrderReceivedProductItem) => void;
  notesBuffer: globalThis.Ref<string>;
  onCloseNotesDialog: () => void;
  onSubmitNotesDialog: () => void;
}

export interface IPurchaseOrderReceivedFormData {
  userId: number |null;
  productItems: IPurchaseOrderReceivedProductItem[];
}

export interface IPurchaseOrderReceivedProductItem {
  id: string;
  purchaseOrderItemId?: string;
  sku?: string;
  name?: string;
  brandName?: string;
  orderedQuantity?: number;
  actualQuantity: number;
  notes?: string;
}

export interface IPurchaseOrderReceivedPaylaod {
  userId?: number | null;
  productItems: {
    id: string;
    actualQuantity: number;
    notes?: string;
  }[];
}


