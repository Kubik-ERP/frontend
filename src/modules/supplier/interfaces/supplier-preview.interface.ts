import { ISupplierDetailResponse } from ".";

export interface ISupplierPreviewProvided {
  supplierPreview_isLoading: globalThis.Ref<boolean>;
  supplierPreview_supplier: globalThis.Ref<ISupplierDetailResponse | null>;
  supplierPreview_fetchSupplierById: () => Promise<void>;
  supplierPreview_onEditSupplier: () => void;
}
