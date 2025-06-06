// Components
import AppBaseInvoicePaper from '@/app/components/base/AppBaseInvoicePaper.vue';
import SettingInvoiceCashierPreview from '../components/setting-invoice/SettingInvoiceCashierPreview.vue';

export const LIST_GENERAL_SETTINGS_INVOICE: IDefaultContent[] = [
  {
    id: 'automatically-print-receipt',
    key: 'isAutomaticallyPrintReceipt',
    label: 'Automatically print receipt when after transaction completed',
  },
  {
    id: 'automatically-print-kitchen',
    key: 'isAutomaticallyPrintKitchen',
    label: 'Automatically print kitchen ticket',
  },
  {
    id: 'automatically-print-table',
    key: 'isAutomaticallyPrintTable',
    label: 'Automatically print table ticket',
  },
];

export const LIST_CONTENT_SETTINGS_INVOICE: IDefaultContent[] = [
  {
    id: 'show-company-logo',
    key: 'isShowCompanyLogo',
    label: 'Display company logo',
  },
  {
    id: 'show-store-location',
    key: 'isShowStoreLocation',
    label: 'Show store location',
  },
  {
    id: 'hide-cashier-name',
    key: 'isHideCashierName',
    label: 'Hide cashier name',
  },
  {
    id: 'hide-order-type',
    key: 'isHideOrderType',
    label: 'Hide order type',
  },
  {
    id: 'hide-queue-number',
    key: 'isHideQueueNumber',
    label: 'Hide queue number',
  },
  {
    id: 'show-table-number',
    key: 'isShowTableNumber',
    label: 'Show table number',
  },
  {
    id: 'hide-item-prices',
    key: 'isHideItemPrices',
    label: 'Hide item prices',
  },
  {
    id: 'show-footer',
    key: 'isShowFooter',
    label: 'Show footer',
  },
];

export const LIST_INVOICE_NUMBER_CONTENTS: IDefaultContent[] = [
  {
    id: 'invoice-preview',
    key: 'invoicePreview',
    label: 'Invoice Preview',
  },
  {
    id: 'starting-number',
    key: 'startingNumber',
    label: 'Starting Number',
  },
  {
    id: 'increment-by',
    key: 'incrementBy',
    label: 'Increment By',
  },
  {
    id: 'reset-sequence',
    key: 'resetSequence',
    label: 'Reset Sequence',
  },
];

export const LIST_TABS_INVOICE_PREVIEW: ITabs[] = [
  {
    component: SettingInvoiceCashierPreview,
    label: 'Cashier Invoice',
    value: 'cashier-invoice',
  },
  {
    component: AppBaseInvoicePaper,
    label: 'Kitchen Ticket',
    value: 'kitchen-ticket',
  },
  {
    component: AppBaseInvoicePaper,
    label: 'Table Ticket',
    value: 'table-ticket',
  },
];

export const LIST_TYPES_OF_RESET_SEQUENCE: IDropdownItem[] = [
  {
    label: 'Never',
    value: 'Never',
  },
  {
    label: 'Daily',
    value: 'Daily',
  },
  {
    label: 'Weekly',
    value: 'Weekly',
  },
  {
    label: 'Monthly',
    value: 'Monthly',
  },
  {
    label: 'Quarterly',
    value: 'Quarterly',
  },
  {
    label: 'Yearly',
    value: 'Yearly',
  },
];
