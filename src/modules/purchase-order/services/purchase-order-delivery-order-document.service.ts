// Constants
import { PURCHASE_ORDER_DETAIL_LIST_COLUMNS, PURCHASE_ORDER_DETAIL_REQUEST } from '../constants';

// Interfaces
import type { IPurchaseOrderDeliveryOrderDocumentProvided } from '../interfaces';

// Stores
import { usePurchaseOrderStore } from '../store';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const usePurchaseOrderDeliveryOrderDocumentService = (): IPurchaseOrderDeliveryOrderDocumentProvided => {
  /**
   * @description Injected variables
   */
  const route = useRoute();
  const store = usePurchaseOrderStore(); // Instance of the store
  const { purchaseOrder_detail, purchaseOrder_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Computed properties for business logic
   */
  const purchaseOrderDeliveryOrderDocument_routeParamsId = computed(() =>
    route.params.id.length > 0 ? String(route.params.id) : '',
  );

  /**
   * @description Handle fetch api purchase order - details
   */
  const purchaseOrderDeliveryOrderDocument_fetchDetails = async (): Promise<unknown> => {
    try {
      await store.purchaseOrder_details(purchaseOrderDeliveryOrderDocument_routeParamsId.value, {
        ...httpAbort_registerAbort(PURCHASE_ORDER_DETAIL_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    purchaseOrderDeliveryOrderDocument_data: purchaseOrder_detail,
    purchaseOrderDeliveryOrderDocument_fetchDetails,
    purchaseOrderDeliveryOrderDocument_isLoading: purchaseOrder_isLoading,
    purchaseOrderDeliveryOrderDocument_listColumns: PURCHASE_ORDER_DETAIL_LIST_COLUMNS,
  };
};
