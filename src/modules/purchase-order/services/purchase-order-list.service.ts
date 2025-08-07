// Constants
import { PURCHASE_ORDER_LIST_COLUMNS, PURCHASE_ORDER_LIST_VALUES } from '../constants';

// Interfaces
import type { IPurchaseOrderListProvided } from '../interfaces';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const usePurchaseOrderListService = (): IPurchaseOrderListProvided => {
  /**
   * @description Handle business logic to render dynamic class of status
   */
  const purchaseOrderList_getClassOfStatus = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'CANCELED':
        return 'bg-error-background text-error-main';
      case 'CONFIRMED':
        return 'bg-secondary-background text-green-primary';
      case 'PAID':
        return 'bg-complementary-background text-complementary-main';
      case 'PENDING':
        return 'bg-warning-background text-warning-main';
      case 'RECEIVED':
        return 'bg-success-background text-success';
      case 'SHIPPED':
        return 'bg-primary-background text-primary';
      default:
        return '';
    }
  };

  /**
   * @description Handle business logic to show button cancel PO
   */
  const purchaseOrderList_onShowButtonCancelPO = (status: string): boolean => {
    const listAcceptedStatuses = ['CONFIRMED', 'PENDING', 'SHIPPED', 'PAID'];

    if (listAcceptedStatuses.includes(status.toUpperCase())) {
      return true;
    }

    return false;
  };

  /**
   * @description Handle business logic to show button Delivery Order Document
   */
  const purchaseOrderList_onShowButtonDeliveryOrderDocument = (status: string): boolean => {
    const listAcceptedStatuses = ['SHIPPED'];

    if (listAcceptedStatuses.includes(status.toUpperCase())) {
      return true;
    }

    return false;
  };

  return {
    purchaseOrderList_columns: PURCHASE_ORDER_LIST_COLUMNS,
    purchaseOrderList_getClassOfStatus,
    purchaseOrderList_onShowButtonCancelPO,
    purchaseOrderList_onShowButtonDeliveryOrderDocument,
    purchaseOrderList_values: PURCHASE_ORDER_LIST_VALUES,
  } as IPurchaseOrderListProvided;
};
