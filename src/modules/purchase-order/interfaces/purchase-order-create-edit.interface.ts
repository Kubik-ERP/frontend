// Interfaces
import type { Validation } from '@vuelidate/core';

export interface IPurchaseOrderCreateEditProductItem {
  id: string;
  name: string;
  brandName: string;
  quantity: number;
  sku: string;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface IPurchaseOrderCreateEditFormData {
  supplierId: string;
  orderDate: Date | Date[] | (Date | null)[] | null | undefined;
  productItems: IPurchaseOrderCreateEditProductItem[];
}

export interface IPurchaseOrderCreateEditProvided {
  purchaseOrderCreateEdit_formData: globalThis.Ref<IPurchaseOrderCreateEditFormData>;
  purchaseOrderCreateEdit_formDataOfEditQuantity: globalThis.Ref<IPurchaseOrderCreateEditProductItem>;
  purchaseOrderCreateEdit_formValidations: globalThis.Ref<Validation>;
  purchaseOrderCreateEdit_formValidationsOfEditQuantity: globalThis.Ref<Validation>;
  purchaseOrderCreateEdit_listColumns: IColumnDataTable[];
  purchaseOrderCreateEdit_listProductItems: IDropdownItem[];
  purchaseOrderCreateEdit_listSuppliers: IDropdownItem[];
  purchaseOrderCreateEdit_onAddProductItem: (productItem: IPurchaseOrderCreateEditProductItem) => void;
  purchaseOrderCreateEdit_onCloseDialogAddProductItem: () => void;
  purchaseOrderCreateEdit_onCloseDialogEditQuantity: () => void;
  purchaseOrderCreateEdit_onDecrementQuantity: () => void;
  purchaseOrderCreateEdit_onDeleteProductItem: (productItem: IPurchaseOrderCreateEditProductItem | string) => void;
  purchaseOrderCreateEdit_onIncrementQuantity: () => void;
  purchaseOrderCreateEdit_onShowDialogAddProductItem: () => void;
  purchaseOrderCreateEdit_onShowDialogEditQuantity: (productItem: IPurchaseOrderCreateEditProductItem) => void;
  purchaseOrderCreateEdit_onSubmitAddProductItem: () => void;
  purchaseOrderCreateEdit_onSubmitEditQuantity: () => void;
  purchaseOrderCreateEdit_selectedProductItem: globalThis.Ref<IPurchaseOrderCreateEditProductItem | null>;
  purchaseOrderCreateEdit_selectedProductItems: globalThis.Ref<IPurchaseOrderCreateEditProductItem[]>;
  purchaseOrderCreateEdit_totalPrice: globalThis.Ref<number>;
}
