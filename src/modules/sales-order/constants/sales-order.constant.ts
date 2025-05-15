// Components
import SalesOrderCashDrawer from '../components/SalesOrderCashDrawer.vue';
import SalesOrderCashInOut from '../components/SalesOrderCashInOut.vue';
import SalesOrderDailySales from '../components/SalesOrderDailySales.vue';
import SalesOrderVoucher from '../components/SalesOrderVoucher.vue';

export const LIST_COLUMNS_OF_CASH_IN_OUT = [
  {
    label: 'Date',
    sortable: true,
    value: 'createdAt',
  },
  {
    label: 'Type',
    sortable: true,
    value: 'type',
  },
  {
    label: 'Title',
    sortable: true,
    value: 'title',
  },
  {
    label: 'Notes',
    sortable: true,
    value: 'notes',
  },
  {
    label: 'Amount',
    sortable: true,
    value: 'amount',
  },
  {
    label: '',
    sortable: false,
    value: 'createdBy',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const LIST_ITEMS_OF_SPLIT_BUTTON: ISplitButton[] = [
  {
    iconName: 'edit',
    label: 'Edit',
  },
  {
    iconName: 'delete',
    label: 'Delete',
  },
];

export const LIST_TABS_SALES_ORDER: ITabs[] = [
  {
    component: SalesOrderDailySales,
    label: 'Daily Sales',
    value: 'daily-sales',
  },
  {
    component: SalesOrderVoucher,
    label: 'Voucher',
    value: 'voucher',
  },
  {
    component: SalesOrderCashDrawer,
    label: 'Cash Drawer',
    value: 'cash-drawer',
  },
  {
    component: SalesOrderCashInOut,
    label: 'Cash In/Out',
    value: 'cash-in-out',
  },
];

export const LIST_TYPES_OF_CASH_IN_OUT: IDropdownItem[] = [
  {
    label: 'Cash In',
    value: 'Cash In',
  },
  {
    label: 'Cash Out',
    value: 'Cash Out',
  },
];

export const LIST_VALUES_OF_CASH_IN_OUT = [
  {
    type: 'Cash Out',
    title: 'Electricity Bill',
    notes: 'Electricity bill for the month of January',
    amount: 100000,
    createdAt: '01/08/2024 10:00 AM',
    createdBy: 'John Doe',
  },
  {
    type: 'Cash In',
    title: 'Added small change',
    notes: 'Added small change to the cash register',
    amount: 50000,
    createdAt: '01/08/2024 10:00 AM',
    createdBy: 'John Doe',
  },
];
