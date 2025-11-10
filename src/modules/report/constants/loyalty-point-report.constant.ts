export const LOYALTYPOINTREPORT_SPENDBASED_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Invoice ID',
    sortable: true,
    value: 'invoiceId',
  },
  {
    label: 'Purchase Date',
    sortable: true,
    value: 'purchaseDate',
  },
  {
    label: 'Customer',
    sortable: false,
    value: 'customer',
  },
  {
    label: 'Grand Total',
    sortable: true,
    value: 'grandTotal',
  },
  {
    label: 'Order Type',
    sortable: false,
    value: 'orderType',
  },
  {
    label: 'Total Points Earned',
    sortable: true,
    value: 'totalPointsEarned',
  },
  {
    label: 'Point Expiry Date',
    sortable: true,
    value: 'pointExpiryDate',
  },
];

export const LOYALTYPOINTREPORT_PRODUCTBASED_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Product Name',
    sortable: false,
    value: 'productName',
  },
  {
    label: 'Product Price',
    sortable: false,
    value: 'productPrice',
  },
  {
    label: 'Points to IDR',
    sortable: false,
    value: 'pointsToIDR',
  },
  {
    label: 'Sum of Points Given to Customer',
    sortable: false,
    value: 'sumOfPointsGivenToCust',
  },
  {
    label: 'Total Customer',
    sortable: false,
    value: 'totalCust',
  },
];

export const LOYALTYPOINTREPORT_BENEFITUTILIZATION_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Benefit Name',
    sortable: false,
    value: 'benefitName',
  },
  {
    label: 'Type',
    sortable: false,
    value: 'type',
  },
  {
    label: 'Count Used',
    sortable: false,
    value: 'countUsed',
  },
  {
    label: 'Total Point Used',
    sortable: false,
    value: 'totalPointUsed',
  },
  {
    label: 'Amount',
    sortable: false,
    value: 'amount',
  },
];
export const LOYALTYPOINTREPORT_EXPIRYWARNING_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Customer Name',
    sortable: false,
    value: 'custName',
  },
  {
    label: 'Invoice ID',
    sortable: false,
    value: 'invoice',
  },
  {
    label: 'Type',
    sortable: false,
    value: 'type',
  },
  {
    label: 'Points',
    sortable: false,
    value: 'points',
  },
  {
    label: 'Expiry Date',
    sortable: false,
    value: 'expiryDate',
  },
];

export const LOYALTYPOINTREPORT_TYPEACCUMULATION_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Type',
    sortable: false,
    value: 'type',
  },
  {
    label: 'Sum of Total Points',
    sortable: false,
    value: 'sumTotalPoints',
  },
  {
    label: 'Total Customers',
    sortable: false,
    value: 'totalCustomers',
  },
];
