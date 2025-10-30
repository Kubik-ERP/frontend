import { useQueueService } from '@/modules/queue/services/queue.service';
import type { IQueueProvided } from '@/modules/queue/interfaces';

/**
 * @description Queue service specifically for cashier usage
 * This provides backward compatibility while using the queue module data
 */
export const useCashierQueueService = (): IQueueProvided & Record<string, unknown> => {
  const queueService = useQueueService();

  return {
    // Queue-specific methods and data for cashier (new interface)
    queue_isLoading: queueService.queue_isLoading,
    queue_values: queueService.queue_values,
    queue_queueStatusCounts: queueService.queue_queueStatusCounts,
    queue_totalQueueCount: queueService.queue_totalQueueCount,
    queue_columns: queueService.queue_columns,
    queue_orderStatusList: queueService.queue_orderStatusList,
    queue_orderTypeList: queueService.queue_orderTypeList,
    queue_queryParams: queueService.queue_queryParams,
    queue_fetchListInvoices: queueService.queue_fetchListInvoices,
    queue_onChangePage: queueService.queue_onChangePage,
    queue_handleOnSortChange: queueService.queue_handleOnSortChange,
    queue_changeOrderStatus: queueService.queue_changeOrderStatus,
    queue_getClassOfOrderStatus: queueService.queue_getClassOfOrderStatus,
    queue_getClassOfOrderType: queueService.queue_getClassOfOrderType,
    queue_getClassOfPaymentStatus: queueService.queue_getClassOfPaymentStatus,
    queue_calculateDeltaHHMMSS: queueService.queue_calculateDeltaHHMMSS,

    // Backward compatibility aliases for existing cashier code
    dailySalesList_columns: queueService.queue_columns,
    dailySalesList_fetchListInvoices: queueService.queue_fetchListInvoices,
    dailySalesList_getClassOfOrderStatus: queueService.queue_getClassOfOrderStatus,
    dailySalesList_getClassOfOrderType: queueService.queue_getClassOfOrderType,
    dailySalesList_getClassOfPaymentStatus: queueService.queue_getClassOfPaymentStatus,
    dailySalesList_isLoading: queueService.queue_isLoading,
    dailySalesList_onChangePage: queueService.queue_onChangePage,
    dailySales_handleOnSortChange: queueService.queue_handleOnSortChange,
    dailySalesList_queryParams: queueService.queue_queryParams,
    dailySalesList_typesOfOrderStatus: queueService.queue_orderStatusList,
    dailySalesList_typesOfOrderType: queueService.queue_orderTypeList,
    dailySalesList_typesOfPaymentStatus: queueService.queue_orderStatusList, // Use same as order status
    dailySalesList_values: queueService.queue_values,

    // New queue-specific data for cashier
    queueStatusCounts: queueService.queue_queueStatusCounts,
    totalQueueCount: queueService.queue_totalQueueCount,
  };
};
