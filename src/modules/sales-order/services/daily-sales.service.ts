// Constants
import {
  LIST_COLUMNS_OF_DAILY_SALES,
  LIST_TYPES_OF_ORDER_STATUS,
  LIST_TYPES_OF_ORDER_TYPE,
  LIST_TYPES_OF_PAYMENT_STATUS,
  LIST_VALUES_OF_DAILY_SALES,
} from '../constants/sales-order.constant';

// Interfaces
import type { IDailySalesProvided } from '../interfaces/daily-sales.interface';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useDailySalesService = (): IDailySalesProvided => {
  /**
   * @description Handle business logic to render dynamic class of order status
   */
  const dailySales_getClassOfOrderStatus = (orderStatus: string): string => {
    switch (orderStatus.toUpperCase()) {
      case 'IN PROGRESS':
        return 'bg-primary-background text-primary';
      case 'WAITING':
        return 'bg-warning-background text-warning-main';
      case 'SERVED':
        return 'bg-secondary-background text-green-primary';
      case 'CANCELLED':
        return 'bg-error-background text-error-main';
      default:
        return '';
    }
  };

  /**
   * @description Handle business logic to render dynamic class of order type
   */
  const dailySales_getClassOfOrderType = (orderType: string): string => {
    switch (orderType.toUpperCase()) {
      case 'DINE IN':
        return 'bg-primary-background text-primary';
      case 'TAKEAWAY':
        return 'bg-secondary-background text-green-primary';
      case 'SELF ORDER':
        return 'bg-complementary-background text-complementary-main';
      default:
        return '';
    }
  };

  /**
   * @description Handle business logic to render dynamic class of payment status
   */
  const dailySales_getClassOfPaymentStatus = (paymentStatus: string): string => {
    switch (paymentStatus.toUpperCase()) {
      case 'PAID':
        return 'bg-primary-background text-primary';
      case 'UNPAID':
        return 'bg-warning-background text-warning-main';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-error-background text-error-main';
      default:
        return '';
    }
  };

  return {
    dailySales_getClassOfOrderStatus,
    dailySales_getClassOfOrderType,
    dailySales_getClassOfPaymentStatus,
    dailySales_listColumns: LIST_COLUMNS_OF_DAILY_SALES,
    dailySales_listTypesOfOrderStatus: LIST_TYPES_OF_ORDER_STATUS,
    dailySales_listTypesOfOrderType: LIST_TYPES_OF_ORDER_TYPE,
    dailySales_listTypesOfPaymentStatus: LIST_TYPES_OF_PAYMENT_STATUS,
    dailySales_listValues: LIST_VALUES_OF_DAILY_SALES as never[],
  };
};
