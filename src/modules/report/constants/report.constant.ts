export const FINANCIALREPORT_PROFITANDLOST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Description',
    sortable: false,
    value: 'description',
  },
  {
    label: 'Nominal',
    sortable: true,
    value: 'nominal',
  },
];

export const FINANCIALREPORT_CASHINOUT_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Date',
    sortable: true,
    value: 'date',
  },
  {
    label: 'Type',
    sortable: false,
    value: 'type',
  },
  {
    label: 'Notes',
    sortable: false,
    value: 'notes',
  },
  {
    label: 'Nominal',
    sortable: true,
    value: 'nominal',
  },
];

export const FINANCIALREPORT_PAYMENTMETHOD_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Payment Method',
    sortable: false,
    value: 'payment_method',
  },
  {
    label: 'Transaction',
    sortable: false,
    value: 'transaction',
  },
  {
    label: 'Nominal',
    sortable: false,
    value: 'nominal',
  },
];

export const FINANCIALREPORT_TAXANDSERVICECHARGE_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Type',
    sortable: false,
    value: 'type',
  },
  {
    label: 'Rate (%)',
    sortable: false,
    value: 'rate',
  },
  {
    label: 'Subtotal Applied',
    sortable: false,
    value: 'subtotal_applied',
  },
  {
    label: 'Nominal',
    sortable: false,
    value: 'nominal',
  },
];

export const LOSSREPORT_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Date',
    sortable: true,
    value: 'date',
  },
  {
    label: 'SKU',
    sortable: false,
    value: 'SKU',
  },
  {
    label: 'Item Name',
    sortable: false,
    value: 'item_name',
  },
  {
    label: 'Notes',
    sortable: false,
    value: 'notes',
  },
  {
    label: 'Qty Loss',
    sortable: true,
    value: 'qty_loss',
  },
  {
    label: 'Unit Cost',
    sortable: true,
    value: 'unit_cost',
  },
  {
    label: 'Total Loss',
    sortable: true,
    value: 'total_loss',
  },
  {
    label: 'Reported By',
    sortable: false,
    value: 'reported_by',
  },
];

export const SALESREPORT_SALESBYITEM_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Product ID',
    sortable: true,
    value: 'product_id',
  },
  {
    label: 'Item Name',
    sortable: false,
    value: 'item_name',
  },
  {
    label: 'Category',
    sortable: false,
    value: 'category',
  },
  {
    label: 'Qty Sold',
    sortable: true,
    value: 'qty_sold',
  },
  {
    label: 'Unit Price',
    sortable: false,
    value: 'unit_price',
  },
  {
    label: 'Gross Sales',
    sortable: true,
    value: 'gross_sales',
  },
  {
    label: 'Discount',
    sortable: true,
    value: 'discount',
  },
  {
    label: 'Net Sales',
    sortable: true,
    value: 'net_sales',
  },
  {
    label: 'Tax',
    sortable: true,
    value: 'tax',
  },
  {
    label: 'Total Sales',
    sortable: true,
    value: 'total_sales',
  },
];

export const SALESREPORT_SALESBYORDERTYPE_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Invoice ID',
    sortable: true,
    value: 'invoice_id',
  },
  {
    label: 'Order Type',
    sortable: false,
    value: 'order_type',
  },
  {
    label: 'Gross Sales',
    sortable: true,
    value: 'gross_sales',
  },
  {
    label: 'Tax',
    sortable: true,
    value: 'tax',
  },
  {
    label: 'Discount',
    sortable: true,
    value: 'discount',
  },
  {
    label: 'Net Sales',
    sortable: true,
    value: 'net_sales',
  },
];

export const INVENTORYREPORT_STOCK_COLUMNS: IColumnDataTable[] = [
  {
    label: 'SKU',
    sortable: true,
    value: 'sku',
  },
  {
    label: 'Item Name',
    sortable: false,
    value: 'item_name',
  },
  {
    label: 'Category',
    sortable: false,
    value: 'category',
  },
  {
    label: 'Stock on Hand',
    sortable: true,
    value: 'stock_on_hand',
  },
  {
    label: 'Reorder Level',
    sortable: true,
    value: 'reorder_level',
  },
  {
    label: 'Minimum Stock',
    sortable: true,
    value: 'minimum_stock',
  },
  {
    label: 'Unit',
    sortable: false,
    value: 'unit',
  },
  {
    label: 'Storage Location',
    sortable: false,
    value: 'storage_location',
  },
];
export const INVENTORYREPORT_STOCKMOVEMENT_COLUMNS: IColumnDataTable[] = [
  {
    label: 'SKU',
    sortable: true,
    value: 'sku',
  },
  {
    label: 'Item Name',
    sortable: false,
    value: 'item_name',
  },
  {
    label: 'Movement Type',
    sortable: false,
    value: 'movement_type',
  },
  {
    label: 'Qty',
    sortable: true,
    value: 'qty',
  },
  {
    label: 'Stock Before',
    sortable: true,
    value: 'stock_before',
  },
  {
    label: 'Stock After',
    sortable: true,
    value: 'stock_after',
  },
  {
    label: 'Notes',
    sortable: true,
    value: 'notes',
  },
  {
    label: 'Storage Location',
    sortable: false,
    value: 'storage_location',
  },
];

export const MARKETINGREPORT_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Voucher Name',
    sortable: false,
    value: 'voucher_name',
  },
  {
    label: 'Validity Period',
    sortable: true,
    value: 'validity_period',
  },
  {
    label: 'Usage',
    sortable: false,
    value: 'usage',
  },
  {
    label: 'Quota',
    sortable: false,
    value: 'quota',
  },
];
