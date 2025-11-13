// Interfaces
import type { ITransferStockShippingDocumentProvided } from '../interfaces';

// Stores
import { useTransferStockStore } from '../store';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useTransferStockShippingDocumentService = (): ITransferStockShippingDocumentProvided => {
  /**
   * @description Injected variables
   */
  const route = useRoute();
  const store = useTransferStockStore(); // Instance of the store
  const { transferStock_data, transferStock_isLoading } = storeToRefs(store);

  /**
   * @description Computed properties for business logic
   */
  const transferStockShippingDocument_routeParamsId = computed(() =>
    route.params.id.length > 0 ? String(route.params.id) : '',
  );

  /**
   * @description Handle fetch api transfer stock - details for shipping document
   */
  const transferStockShippingDocument_fetchDetails = async (): Promise<unknown> => {
    try {
      await store.transferStock_detail(transferStockShippingDocument_routeParamsId.value);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    transferStockShippingDocument_data: transferStock_data,
    transferStockShippingDocument_fetchDetails,
    transferStockShippingDocument_isLoading: transferStock_isLoading,
  };
};
