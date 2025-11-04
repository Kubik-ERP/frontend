// Components
import CashierInvoice from '../components/paper/InvoicePaperCashierInvoice.vue';
import KitchenTicket from '../components/paper/InvoicePaperKitchenTicket.vue';
import TableTicket from '../components/paper/InvoicePaperTableTicket.vue';

export const INVOICE_LIST_TAB = [
  {
    id: 1,
    name: 'Cashier Invoice',
  },
  {
    id: 2,
    name: 'Kitchen Ticket',
  },
  {
    id: 3,
    name: 'Table Ticket',
  },
];

// AppBaseTabs compatible format
export const INVOICE_TABS_CONFIG: ITabs[] = [
  {
    label: 'Cashier Invoice',
    value: 'cashier-invoice',
    component: CashierInvoice,
  },
  {
    label: 'Kitchen Ticket',
    value: 'kitchen-ticket',
    component: KitchenTicket,
  },
  {
    label: 'Table Ticket',
    value: 'table-ticket',
    component: TableTicket,
  },
];

export const INVOICE_PAYMENT_STATUS = [
  {
    id: 'paid',
    name: 'Paid',
  },
  {
    id: 'unpaid',
    name: 'Unpaid',
  },
  {
    id: 'refund',
    name: 'Refund',
  },
];
