import { ISupplierPreviewProvided } from "../interfaces/supplier-preview.interface";
import { useSupplierStore } from "../store";

export const useSupplierPreviewService = (): ISupplierPreviewProvided => {
  const store = useSupplierStore();
  const {
    supplier_supplierDetail
  } = storeToRefs(store);
  const route = useRoute();
  const router = useRouter();
  const supplierPreview_isLoading = ref(false);


  const supplierPreview_fetchSupplier = async (): Promise<void> => {
    console.log("reload data")
    if (!route.params.id) return;
    try {
      supplierPreview_isLoading.value = true;
      const response = await store.supplier_getById(route.params.id as string, {
        ...useHttpAbort().httpAbort_registerAbort(`SUPPLIER_GET_${route.params.id}`),
      });

      supplier_supplierDetail.value = await response;
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

  watch(
    () => route.params.id,
    debounce(async () => {
      await supplierPreview_fetchSupplier();
    }, 500),
    { immediate: true },
  );

  return {
    supplierPreview_isLoading,
    supplierPreview_supplier: supplier_supplierDetail,
    supplierPreview_fetchSupplierById: supplierPreview_fetchSupplier,
    supplierPreview_onEditSupplier,
  }
}
