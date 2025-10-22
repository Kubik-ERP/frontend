import type { TransferStockStatus } from '../interfaces';

export const TRANSFER_STOCK_MODULE_NAME = 'transfer-stock';

export const TRANSFER_STOCK_TRANSFER_ENDPOINT = '/transfer-stock/transfer';
export const TRANSFER_STOCK_REQUEST_ENDPOINT = '/transfer-stock/request';
export const TRANSFER_STOCK_ITEM_LIST_ENDPOINT = `${TRANSFER_STOCK_TRANSFER_ENDPOINT}/item-list`;

export const TRANSFER_STOCK_DEFAULT_PAGE_META: IPageMeta = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
};

export const TRANSFER_STOCK_STATUS_FLOW: TransferStockStatus[] = [
  'requested',
  'approved',
  'shipped',
  'received',
  'received_with_issue',
  'rejected',
  'canceled',
];

export const TRANSFER_STOCK_STATUS_LABEL: Record<TransferStockStatus, string> = {
  requested: 'Requested',
  approved: 'Approved',
  shipped: 'Shipped',
  received: 'Received',
  received_with_issue: 'Received With Issue',
  rejected: 'Rejected',
  canceled: 'Canceled',
};

export const TRANSFER_STOCK_STATUS_BADGE: Record<
  TransferStockStatus,
  { text: string; tone: 'info' | 'success' | 'warning' | 'danger' | 'neutral' }
> = {
  requested: { text: TRANSFER_STOCK_STATUS_LABEL.requested, tone: 'neutral' },
  approved: { text: TRANSFER_STOCK_STATUS_LABEL.approved, tone: 'info' },
  shipped: { text: TRANSFER_STOCK_STATUS_LABEL.shipped, tone: 'info' },
  received: { text: TRANSFER_STOCK_STATUS_LABEL.received, tone: 'success' },
  received_with_issue: { text: TRANSFER_STOCK_STATUS_LABEL.received_with_issue, tone: 'warning' },
  rejected: { text: TRANSFER_STOCK_STATUS_LABEL.rejected, tone: 'danger' },
  canceled: { text: TRANSFER_STOCK_STATUS_LABEL.canceled, tone: 'danger' },
};
