export const PURCHASE_ORDER_CREATE_EDIT_LIST_COLUMNS: IColumnDataTable[] = [
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
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const PURCHASE_ORDER_CREATE_EDIT_PRODUCT_ITEMS: IDropdownItem[] = [
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
    },
  },
];

export const PURCHASE_ORDER_CREATE_EDIT_SUPPLIERS: IDropdownItem[] = [
  {
    label: 'PT Tiga Sedulur Djaja',
    value: 'PT Tiga Sedulur Djaja',
  },
  {
    label: 'CV Tiga Dara Sentosa',
    value: 'CV Tiga Dara Sentosa',
  },
  {
    label: 'CV Empat Tiga Bersaudara',
    value: 'CV Empat Tiga Bersaudara',
  },
];
