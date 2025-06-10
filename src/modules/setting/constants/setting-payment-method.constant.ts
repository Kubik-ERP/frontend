// Key Http Requests
export const SETTING_PAYMENT_METHOD_CREATE_REQUEST = 'SETTING_PAYMENT_CREATE_REQUEST';
export const SETTING_PAYMENT_METHOD_LIST_REQUEST = 'SETTING_PAYMENT_LIST_REQUEST';
export const SETTING_PAYMENT_METHOD_UPDATE_REQUEST = 'SETTING_PAYMENT_UPDATE_REQUEST';

export const SETTING_PAYMENT_METHOD_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: '#',
    sortable: false,
    value: 'index',
    width: '50px',
  },
  {
    label: 'Payment Method',
    sortable: false,
    value: 'name',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
    width: '50px',
  },
];

export const SETTING_PAYMENT_METHOD_LIST_VALUES = [
  {
    name: 'Cash',
    value: 'cash',
  },
  {
    name: 'Credit Card',
    value: 'credit_card',
  },
  {
    name: 'Debit Card',
    value: 'debit_card',
  },
  {
    name: 'Mobile Payment',
    value: 'mobile_payment',
  },
  {
    name: 'Bank Transfer',
    value: 'bank_transfer',
  },
  {
    name: 'Gift Card',
    value: 'gift_card',
  },
];
