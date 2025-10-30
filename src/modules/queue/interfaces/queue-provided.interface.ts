import type { ComputedRef } from 'vue';
import type { IDailySalesListResponse, IDailySalesListRequestQuery } from './index';
import type { DataTableSortEvent } from 'primevue';

export interface IQueueProvided {
  // Loading states
  queue_isLoading: ComputedRef<boolean>;
  
  // Data
  queue_values: ComputedRef<IDailySalesListResponse>;
  queue_queueStatusCounts: ComputedRef<{ inProgress: number; placed: number }>;
  queue_totalQueueCount: ComputedRef<number>;
  
  // Columns and configurations
  queue_columns: IColumnDataTable[];
  queue_orderStatusList: Array<{ label: string; value: string }>;
  queue_orderTypeList: Array<{ label: string; value: string }>;
  
  // Query parameters
  queue_queryParams: IDailySalesListRequestQuery;
  
  // Methods
  queue_fetchListInvoices: () => Promise<void>;
  queue_onChangePage: (page: number) => void;
  queue_handleOnSortChange: (event: DataTableSortEvent) => void;
  queue_changeOrderStatus: (id: string, orderStatus: string) => Promise<unknown>;
  
  // Style methods
  queue_getClassOfOrderStatus: (orderStatus: string) => string;
  queue_getClassOfOrderType: (orderType: string) => string;
  queue_getClassOfPaymentStatus: (paymentStatus: string) => string;
  
  // Utility methods
  queue_calculateDeltaHHMMSS: (createdAt: string, updatedAt: string) => string;
}