// Interfaces
import type { Validation } from '@vuelidate/core';

// Interface for display in UI (with full item information)
export interface IPurchaseOrderCreateEditProductItem {
  id: string;
  masterItemId: string; // The actual inventory item ID from backend
  name: string;
  brandName: string;
  quantity: number;
  sku: string;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  // Additional fields from backend inventory item
  category?: string;
  stockQuantity?: number;
  reorderLevel?: number;
  minimumStockQuantity?: number;
  expiryDate?: string;
  supplier?: string;
  storageLocation?: string;
  receiver?: UserRelations;
  confirmed?: UserRelations;
  created?: UserRelations;
  cancelled?: UserRelations;
  received?: UserRelations;
  shipped?: UserRelations;
  paid?: UserRelations;
}

interface UserRelations {
  id: string;
  name: string;
}

// Interface for API payload (minimal structure)
export interface IPurchaseOrderCreateEditProductItemPayload {
  id: string;
  masterItemId: string;
  quantity: number;
}

export interface IPurchaseOrderCreateEditFormData {
  supplierId: string;
  orderDate: Date | Date[] | (Date | null)[] | null | undefined;
  productItems: IPurchaseOrderCreateEditProductItem[];
}

export interface IPurchaseOrderCreateEditProvided {
  purchaseOrderCreateEdit_fetchCreate: () => Promise<unknown>;
  purchaseOrderCreateEdit_fetchDetails: (id: string) => Promise<unknown>;
  purchaseOrderCreateEdit_fetchSupplierList: () => Promise<unknown>;
  purchaseOrderCreateEdit_fetchUpdate: (id: string) => Promise<unknown>;
  purchaseOrderCreateEdit_formData: globalThis.Ref<IPurchaseOrderCreateEditFormData>;
  purchaseOrderCreateEdit_formDataOfEditQuantity: globalThis.Ref<IPurchaseOrderCreateEditProductItem>;
  purchaseOrderCreateEdit_formValidations: globalThis.Ref<Validation>;
  purchaseOrderCreateEdit_formValidationsOfEditQuantity: globalThis.Ref<Validation>;
  purchaseOrderCreateEdit_isEditMode: globalThis.ComputedRef<boolean>;
  purchaseOrderCreateEdit_listColumns: IColumnDataTable[];
  purchaseOrderCreateEdit_listProductItems: ComputedRef<IDropdownItem[]>;
  purchaseOrderCreateEdit_listSuppliers: ComputedRef<IDropdownItem[]>;
  purchaseOrderCreateEdit_onAddProductItem: (productItem: IPurchaseOrderCreateEditProductItem) => void;
  purchaseOrderCreateEdit_onCloseDialogAddProductItem: () => void;
  purchaseOrderCreateEdit_onCloseDialogEditQuantity: () => void;
  purchaseOrderCreateEdit_onDecrementQuantity: () => void;
  purchaseOrderCreateEdit_onDeleteProductItem: (productItem: IPurchaseOrderCreateEditProductItem | string) => void;
  purchaseOrderCreateEdit_onIncrementQuantity: () => void;
  purchaseOrderCreateEdit_onResetForm: () => void;
  purchaseOrderCreateEdit_onShowDialogAddProductItem: () => void;
  purchaseOrderCreateEdit_onShowDialogEditQuantity: (productItem: IPurchaseOrderCreateEditProductItem) => void;
  purchaseOrderCreateEdit_onSubmitAddProductItem: () => void;
  purchaseOrderCreateEdit_onSubmitEditQuantity: () => void;
  purchaseOrderCreateEdit_onSubmitForm: () => Promise<void>;
  purchaseOrderCreateEdit_selectedProductItem: globalThis.Ref<IPurchaseOrderCreateEditProductItem | null>;
  purchaseOrderCreateEdit_selectedProductItems: globalThis.Ref<IPurchaseOrderCreateEditProductItem[]>;
  purchaseOrderCreateEdit_totalPrice: globalThis.Ref<number>;
}
