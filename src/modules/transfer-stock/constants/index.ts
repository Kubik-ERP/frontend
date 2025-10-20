import type {
  ITransferStock,
  ITransferStockItem,
  ITransferStockLogEntry,
  ITransferStockStoreInventory,
  ITransferStockSummary,
} from '../interfaces';

export const TRANSFER_STOCK_MODULE_NAME = 'transfer-stock';

export const TRANSFER_STOCK_STATUS_FLOW = [
  'draft',
  'approved',
  'shipped',
  'received',
  'received_with_issue',
  'closed',
] as const;

export const TRANSFER_STOCK_STATUS_LABEL: Record<ITransferStockSummary['status'], string> = {
  draft: 'Draft',
  approved: 'Approved',
  shipped: 'Shipped',
  received: 'Received',
  received_with_issue: 'Received With Issue',
  closed: 'Closed',
};

export const TRANSFER_STOCK_STATUS_BADGE: Record<ITransferStockSummary['status'], { text: string; tone: 'info' | 'success' | 'warning' | 'danger' | 'neutral' }> =
  {
    draft: { text: TRANSFER_STOCK_STATUS_LABEL.draft, tone: 'neutral' },
    approved: { text: TRANSFER_STOCK_STATUS_LABEL.approved, tone: 'info' },
    shipped: { text: TRANSFER_STOCK_STATUS_LABEL.shipped, tone: 'info' },
    received: { text: TRANSFER_STOCK_STATUS_LABEL.received, tone: 'success' },
    received_with_issue: { text: TRANSFER_STOCK_STATUS_LABEL.received_with_issue, tone: 'warning' },
    closed: { text: TRANSFER_STOCK_STATUS_LABEL.closed, tone: 'success' },
  };

export const TRANSFER_STOCK_ITEM_COLUMNS = [
  { field: 'productCode', header: 'Product Code' },
  { field: 'productName', header: 'Product Name' },
  { field: 'uom', header: 'UoM' },
  { field: 'qtyRequested', header: 'Qty Requested' },
  { field: 'qtyApproved', header: 'Qty Approved' },
  { field: 'qtyShipped', header: 'Qty Shipped' },
  { field: 'qtyReceived', header: 'Qty Received' },
  { field: 'unitPrice', header: 'Unit Price' },
  { field: 'totalValue', header: 'Total Value' },
] as const;

export const TRANSFER_STOCK_FORM_DEFAULT_ITEMS: ITransferStockItem[] = [];

export const TRANSFER_STOCK_INITIAL_LOGS = (): ITransferStockLogEntry[] => [];

export const TRANSFER_STOCK_EMPTY_SUMMARY = (): ITransferStockSummary => ({
  id: '',
  referenceNumber: '',
  status: 'draft',
  storeFromId: '',
  storeFromName: '',
  storeToId: '',
  storeToName: '',
  totalItems: 0,
  totalQty: 0,
  totalValue: 0,
  createdAt: '',
  updatedAt: '',
  requestedBy: '',
  notes: null,
  approvalRequired: true,
});

export const TRANSFER_STOCK_MOCK_STORES: ITransferStockStoreInventory[] = [
  {
    id: 'store-a',
    code: 'STA',
    name: 'Store A HQ',
    address: 'Jl. Kebon Jeruk No. 1, Jakarta',
    phone: '+62 21 5555 001',
    contactPerson: 'Raka',
    inventory: {
      'prod-espresso': {
        productId: 'prod-espresso',
        productCode: 'ESP-01',
        productName: 'Espresso Beans 1kg',
        uom: 'bag',
        availableQty: 120,
        reservedQty: 5,
        inTransitQty: 0,
      },
      'prod-milk': {
        productId: 'prod-milk',
        productCode: 'MLK-01',
        productName: 'Fresh Milk 1L',
        uom: 'bottle',
        availableQty: 80,
        reservedQty: 0,
        inTransitQty: 12,
      },
      'prod-syrup': {
        productId: 'prod-syrup',
        productCode: 'SRP-01',
        productName: 'Caramel Syrup',
        uom: 'bottle',
        availableQty: 45,
        reservedQty: 0,
        inTransitQty: 0,
      },
    },
  },
  {
    id: 'store-b',
    code: 'STB',
    name: 'Store B Senayan',
    address: 'Jl. Asia Afrika No. 5, Jakarta',
    phone: '+62 21 5555 002',
    contactPerson: 'Dina',
    inventory: {
      'prod-espresso': {
        productId: 'prod-espresso',
        productCode: 'ESP-01',
        productName: 'Espresso Beans 1kg',
        uom: 'bag',
        availableQty: 35,
        reservedQty: 0,
        inTransitQty: 0,
      },
      'prod-milk': {
        productId: 'prod-milk',
        productCode: 'MLK-01',
        productName: 'Fresh Milk 1L',
        uom: 'bottle',
        availableQty: 10,
        reservedQty: 0,
        inTransitQty: 12,
      },
    },
  },
  {
    id: 'store-c',
    code: 'STC',
    name: 'Store C Bandung',
    address: 'Jl. Asia Afrika No. 88, Bandung',
    phone: '+62 22 5555 010',
    contactPerson: 'Hani',
    inventory: {
      'prod-espresso': {
        productId: 'prod-espresso',
        productCode: 'ESP-01',
        productName: 'Espresso Beans 1kg',
        uom: 'bag',
        availableQty: 65,
        reservedQty: 0,
        inTransitQty: 0,
      },
      'prod-cup': {
        productId: 'prod-cup',
        productCode: 'CUP-16',
        productName: 'Cup 16oz',
        uom: 'pack',
        availableQty: 200,
        reservedQty: 0,
        inTransitQty: 0,
      },
    },
  },
];

export const TRANSFER_STOCK_MOCK_TRANSFERS: ITransferStock[] = [
  {
    id: 'tf-20240401-001',
    referenceNumber: 'TF-20240401-001',
    status: 'approved',
    storeFromId: 'store-a',
    storeFromName: 'Store A HQ',
    storeToId: 'store-b',
    storeToName: 'Store B Senayan',
    requestedBy: 'Farid',
    approvalRequired: true,
    totalItems: 2,
    totalQty: 25,
    totalValue: 2125000,
    notes: 'Restock weekly shipment',
    createdAt: '2024-04-01T08:20:00+07:00',
    updatedAt: '2024-04-01T09:00:00+07:00',
    approvedAt: '2024-04-01T08:45:00+07:00',
    approvedBy: 'Rahma',
    shippedAt: null,
    shippedBy: null,
    receivedAt: null,
    receivedBy: null,
    logisticProvider: null,
    trackingNumber: null,
    deliveryNote: null,
    estimatedArrivalDate: null,
    items: [
      {
        id: 'tf-20240401-001-item-1',
        productId: 'prod-espresso',
        productCode: 'ESP-01',
        productName: 'Espresso Beans 1kg',
        uom: 'bag',
        qtyRequested: 20,
        qtyApproved: 20,
        qtyShipped: 0,
        qtyReceived: 0,
        unitPrice: 95000,
        shortfallQty: 0,
        issueNotes: null,
      },
      {
        id: 'tf-20240401-001-item-2',
        productId: 'prod-milk',
        productCode: 'MLK-01',
        productName: 'Fresh Milk 1L',
        uom: 'bottle',
        qtyRequested: 5,
        qtyApproved: 5,
        qtyShipped: 0,
        qtyReceived: 0,
        unitPrice: 45000,
        shortfallQty: 0,
        issueNotes: null,
      },
    ],
    logs: [
      {
        id: 'log-1',
        transferId: 'tf-20240401-001',
        action: 'created',
        status: 'draft',
        actor: 'Farid',
        message: 'Draft transfer created by Farid from Store A HQ to Store B Senayan',
        createdAt: '2024-04-01T08:20:00+07:00',
      },
      {
        id: 'log-2',
        transferId: 'tf-20240401-001',
        action: 'approved',
        status: 'approved',
        actor: 'Rahma',
        message: 'Transfer approved by Rahma. Reserved stock for shipment.',
        createdAt: '2024-04-01T08:45:00+07:00',
      },
    ],
    attachments: [],
  },
];
