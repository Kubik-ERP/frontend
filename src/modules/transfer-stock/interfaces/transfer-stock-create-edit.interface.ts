// Interfaces
import type { Validation } from '@vuelidate/core';

// Interface for display in UI (with full item information)
export interface ITransferStockCreateEditProductItem {
  id: string;
  masterItemId: string; // The actual inventory item ID from backend
  name: string;
  brandName: string;
  quantity: number;
  sku: string;
  unit: string;
  unitPrice?: number;
  totalPrice?: number;
  // Additional fields from backend inventory item
  category?: string;
  stockQuantity?: number;
  reorderLevel?: number;
  minimumStockQuantity?: number;
  expiryDate?: string;
  supplier?: string;
  storageLocation?: string;
}

// Interface for API payload (minimal structure)
export interface ITransferStockCreateEditProductItemPayload {
  id: string;
  masterItemId: string;
  quantity: number;
  unitPrice?: number;
}

export interface ITransferStockCreateEditFormData {
  fromStoreId: string;
  toStoreId: string;
  transferDate: Date | Date[] | (Date | null)[] | null | undefined;
  notes?: string;
  productItems: ITransferStockCreateEditProductItem[];
}

export interface ITransferStockCreateEditProvided {
  transferStockCreateEdit_fetchCreate: () => Promise<unknown>;
  transferStockCreateEdit_fetchDetails: (id: string) => Promise<unknown>;
  transferStockCreateEdit_fetchOutletList: () => Promise<unknown>;
  transferStockCreateEdit_fetchUpdate: (id: string) => Promise<unknown>;
  transferStockCreateEdit_formData: globalThis.Ref<ITransferStockCreateEditFormData>;
  transferStockCreateEdit_formDataOfEditQuantity: globalThis.Ref<ITransferStockCreateEditProductItem>;
  transferStockCreateEdit_formValidations: globalThis.Ref<Validation>;
  transferStockCreateEdit_formValidationsOfEditQuantity: globalThis.Ref<Validation>;
  transferStockCreateEdit_isDecrementDisabled: ComputedRef<boolean>;
  transferStockCreateEdit_isEditMode: globalThis.ComputedRef<boolean>;
  transferStockCreateEdit_isIncrementDisabled: ComputedRef<boolean>;
  transferStockCreateEdit_listColumns: IColumnDataTable[];
  transferStockCreateEdit_listProductItems: ComputedRef<IDropdownItem[]>;
  transferStockCreateEdit_listFromStores: ComputedRef<IDropdownItem[]>;
  transferStockCreateEdit_listToStores: ComputedRef<IDropdownItem[]>;
  transferStockCreateEdit_onAddProductItem: (productItem: ITransferStockCreateEditProductItem) => void;
  transferStockCreateEdit_onCloseDialogAddProductItem: () => void;
  transferStockCreateEdit_onCloseDialogEditQuantity: () => void;
  transferStockCreateEdit_onDecrementQuantity: () => void;
  transferStockCreateEdit_onDeleteProductItem: (productItem: ITransferStockCreateEditProductItem | string) => void;
  transferStockCreateEdit_onIncrementQuantity: () => void;
  transferStockCreateEdit_onLoadInitialData: () => Promise<void>;
  transferStockCreateEdit_onResetForm: () => void;
  transferStockCreateEdit_onShowDialogAddProductItem: () => void;
  transferStockCreateEdit_onShowDialogEditQuantity: (productItem: ITransferStockCreateEditProductItem) => void;
  transferStockCreateEdit_onSubmitAddProductItem: () => void;
  transferStockCreateEdit_onSubmitEditQuantity: () => void;
  transferStockCreateEdit_onSubmitForm: () => Promise<void>;
  transferStockCreateEdit_onValidateStockAvailability: () => Promise<boolean>;
  transferStockCreateEdit_selectedProductItem: globalThis.Ref<ITransferStockCreateEditProductItem | null>;
  transferStockCreateEdit_selectedProductItems: globalThis.Ref<ITransferStockCreateEditProductItem[]>;
  transferStockCreateEdit_stockShortfalls: globalThis.Ref<ITransferStockStockShortfall[]>;
  transferStockCreateEdit_totalItems: globalThis.Ref<number>;
  transferStockCreateEdit_totalQuantity: globalThis.Ref<number>;
  transferStockCreateEdit_totalValue: globalThis.Ref<number>;
}

// Interface for stock shortfall validation
export interface ITransferStockStockShortfall {
  itemName: string;
  sku: string;
  requestedQuantity: number;
  availableStock: number;
  shortfall: number;
}