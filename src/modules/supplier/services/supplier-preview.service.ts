import { ISupplierDetailResponse } from "../interfaces";
import { ISupplierPreviewProvided } from "../interfaces/supplier-preview.interface";
import { useSupplierStore } from "../store";

export const useSupplierPreviewService = (): ISupplierPreviewProvided => {
  const store = useSupplierStore();
  const route = useRoute();
  const router = useRouter();
  const supplierPreview_isLoading = ref(false);
  const supplierPreview_supplier = ref<ISupplierDetailResponse | null>(null);


  const supplierPreview_fetchSupplier = async (): Promise<void> => {
    if (!route.params.id) return;
    try {
      supplierPreview_isLoading.value = true;
      const response = await store.supplier_getById(route.params.id as string, {
        ...useHttpAbort().httpAbort_registerAbort(`SUPPLIER_GET_${route.params.id}`),
      });

      supplierPreview_supplier.value = await response;
    } catch (error) {
      console.error('Error fetching supplier:', error);
      throw error;
    } finally {
      supplierPreview_isLoading.value = false;
    }
  };

  const supplierPreview_onEditSupplier = () => {
    if (!route.params.id) return;
    router.push({ name: 'supplier.edit', params: { id: route.params.id }
    });
  };

  return {
    supplierPreview_isLoading,
    supplierPreview_supplier,
    supplierPreview_fetchSupplierById: supplierPreview_fetchSupplier,
    supplierPreview_onEditSupplier,
  }
}
