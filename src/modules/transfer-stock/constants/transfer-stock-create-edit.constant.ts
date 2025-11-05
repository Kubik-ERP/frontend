export const TRANSFER_STOCK_CREATE_EDIT_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'SKU',
    sortable: false,
    value: 'sku',
  },
  {
    label: 'Item Name',
    sortable: false,
    value: 'name',
  },
  {
    label: 'Brand',
    sortable: false,
    value: 'brandName',
  },
  {
    label: 'Quantity',
    sortable: false,
    value: 'quantity',
  },
  {
    label: 'Unit',
    sortable: false,
    value: 'unit',
  },
  {
    label: 'Unit Price',
    sortable: false,
    value: 'unitPrice',
  },
  {
    label: 'Total Price',
    sortable: false,
    value: 'totalPrice',
  },
  {
    label: 'Stock Available',
    sortable: false,
    value: 'stockQuantity',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

// Mock data for product items (will be replaced with actual API call)
export const TRANSFER_STOCK_CREATE_EDIT_PRODUCT_ITEMS: IDropdownItem[] = [
  {
    label: 'FNB-001 | Beras Premium 5kg - Sumo',
    value: {
      id: 'FNB-001',
      sku: 'FNB-001',
      name: 'Beras Premium 5kg - Sumo',
      brandName: 'Sumo',
      quantity: 1,
      unit: 'kg',
      unitPrice: 100000,
      totalPrice: 100000,
      stockQuantity: 50,
      category: 'Food & Beverage',
      reorderLevel: 10,
      minimumStockQuantity: 5,
    },
  },
  {
    label: 'FNB-002 | Minyak Goreng 1L - Barco',
    value: {
      id: 'FNB-002',
      sku: 'FNB-002',
      name: 'Minyak Goreng 1L - Barco',
      brandName: 'Barco',
      quantity: 1,
      unit: 'L',
      unitPrice: 15000,
      totalPrice: 15000,
      stockQuantity: 30,
      category: 'Food & Beverage',
      reorderLevel: 5,
      minimumStockQuantity: 3,
    },
  },
  {
    label: 'FNB-003 | Gula Pasir 1kg - Gulaku',
    value: {
      id: 'FNB-003',
      sku: 'FNB-003',
      name: 'Gula Pasir 1kg - Gulaku',
      brandName: 'Gulaku',
      quantity: 1,
      unit: 'kg',
      unitPrice: 12000,
      totalPrice: 12000,
      stockQuantity: 25,
      category: 'Food & Beverage',
      reorderLevel: 8,
      minimumStockQuantity: 4,
    },
  },
  {
    label: 'FNB-004 | Tepung Terigu Segitiga Biru 1kg - Bogasari',
    value: {
      id: 'FNB-004',
      sku: 'FNB-004',
      name: 'Tepung Terigu 1kg - Segitiga Biru',
      brandName: 'Segitiga Biru',
      quantity: 1,
      unit: 'kg',
      unitPrice: 8000,
      totalPrice: 8000,
      stockQuantity: 40,
      category: 'Food & Beverage',
      reorderLevel: 12,
      minimumStockQuantity: 6,
    },
  },
  {
    label: 'FNB-005 | Susu UHT Full Cream - Ultra Milk',
    value: {
      id: 'FNB-005',
      sku: 'FNB-005',
      name: 'Susu UHT Full Cream - Ultra Milk',
      brandName: 'Ultra Milk',
      quantity: 1,
      unit: 'L',
      unitPrice: 20000,
      totalPrice: 20000,
      stockQuantity: 20,
      category: 'Food & Beverage',
      reorderLevel: 6,
      minimumStockQuantity: 3,
    },
  },
];

// Mock data for outlets/stores (will be replaced with actual API call)
export const TRANSFER_STOCK_CREATE_EDIT_OUTLETS: IDropdownItem[] = [
  {
    label: 'Store Jakarta Pusat',
    value: 'store-jakarta-pusat',
  },
  {
    label: 'Store Jakarta Selatan',
    value: 'store-jakarta-selatan',
  },
  {
    label: 'Store Jakarta Utara',
    value: 'store-jakarta-utara',
  },
  {
    label: 'Store Jakarta Barat',
    value: 'store-jakarta-barat',
  },
  {
    label: 'Store Jakarta Timur',
    value: 'store-jakarta-timur',
  },
  {
    label: 'Store Bekasi',
    value: 'store-bekasi',
  },
  {
    label: 'Store Depok',
    value: 'store-depok',
  },
  {
    label: 'Store Tangerang',
    value: 'store-tangerang',
  },
];

// Transfer stock status constants
export const TRANSFER_STOCK_STATUS = {
  DRAFT: 'draft',
  APPROVED: 'approved',
  SHIPPED: 'shipped',
  RECEIVED: 'received',
  RECEIVED_WITH_ISSUE: 'received_with_issue',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const;

// Transfer stock status labels
export const TRANSFER_STOCK_STATUS_LABELS = {
  [TRANSFER_STOCK_STATUS.DRAFT]: 'Draft',
  [TRANSFER_STOCK_STATUS.APPROVED]: 'Approved',
  [TRANSFER_STOCK_STATUS.SHIPPED]: 'Shipped',
  [TRANSFER_STOCK_STATUS.RECEIVED]: 'Received',
  [TRANSFER_STOCK_STATUS.RECEIVED_WITH_ISSUE]: 'Received with Issue',
  [TRANSFER_STOCK_STATUS.CLOSED]: 'Closed',
  [TRANSFER_STOCK_STATUS.CANCELLED]: 'Cancelled',
} as const;
