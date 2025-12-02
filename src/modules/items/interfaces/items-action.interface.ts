import { Validation } from "@vuelidate/core";
import { IInventoryItems, IInventoryItemsPayload } from ".";
import { IInventoryCategory } from "@/modules/inventory-category/interfaces";
import { IBrand } from "@/modules/brand/interfaces";
import { IStorageLocation } from "@/modules/storage-location/interfaces";
import { ISupplierItem } from "@/modules/supplier/interfaces";

export interface IInventoryItemsActionResponse{
  statusCode: number;
  message: string;
  data: IInventoryItems;
}


export interface IInventoryItemsActionProvided{
    inventoryItemsAction_isLoading: globalThis.Ref<boolean>;
    inventoryItemsAction_formData: globalThis.Ref<IInventoryItemsPayload>;
    inventoryItemsAction_onSubmit: (mode: 'create' | 'edit', id?: string) => Promise<void>;
    inventoryItemsAction_onCancel: () => void;
    inventoryItemsAction_values: globalThis.Ref<IInventoryItemsPayload>;
    inventoryItemsAction_Validation: globalThis.Ref<Validation>;
    inventoryItemsAction_isValid: globalThis.Ref<boolean>;
    inventoryItemsAction_categoryList: globalThis.Ref<IInventoryCategory[]>;
    inventoryItemsAction_brandList: globalThis.Ref<IBrand[]>;
    inventoryItemsAction_locationStorage: globalThis.Ref<IStorageLocation[]>;
    inventoryItemAction_supplierList: globalThis.Ref<ISupplierItem[]>;
    inventoryItemsAction_formOnMode: globalThis.Ref<'create' | 'edit'>
    inventoryItems_editingItem: globalThis.Ref<IInventoryItems | null>
}
