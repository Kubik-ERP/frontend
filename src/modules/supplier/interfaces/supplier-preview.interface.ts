import { IInventoryItems } from '@/modules/items/interfaces';
import { ISupplierDetailResponse, ISupplierItemListResponse } from '.';
import { ISupplierItemListRequestQuery } from './supplier-list.interface';
import { DataTableSortEvent } from 'primevue';

export interface ISupplierDetailItemResponse {
  items: IInventoryItems[];
}

export interface ISupplierPreviewProvided {
  supplierPreview_isLoading: globalThis.Ref<boolean>;
  supplierPreview_supplier: globalThis.Ref<ISupplierDetailResponse | null>;
  supplierPreview_fetchSupplierById: () => Promise<void>;
  supplierPreview_onEditSupplier: () => void;
}
export interface ISupplierPreviewItemsProvided {
  supplierPreview_isLoading: globalThis.Ref<boolean>;
  supplierPreview_columnItems: IColumnDataTable[];
  supplierPreview_queryItemSupplier: globalThis.Ref<ISupplierItemListRequestQuery>;
  supllierPreview_itemSupplier: globalThis.Ref<ISupplierItemListResponse>;
  supplierPreview_onChangePage: (page: number) => void;
  supplierPreview_onSort: (event: DataTableSortEvent) => void;
  supplierPreview_itemsLoading: globalThis.Ref<boolean>;
  // supplierPreview_itemValue: Item
}
