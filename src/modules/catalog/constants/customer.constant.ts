// Key Http Requests
export const CUSTOMER_CREATE_REQUEST = 'CUSTOMER_CREATE_REQUEST';
export const CUSTOMER_DELETE_REQUEST = 'CUSTOMER_DELETE_REQUEST';
export const CUSTOMER_LIST_REQUEST = 'CUSTOMER_LIST_REQUEST';
export const CUSTOMER_UPDATE_REQUEST = 'CUSTOMER_UPDATE_REQUEST';

export const CUSTOMER_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Customer Name',
    sortable: true,
    value: 'name',
  },
  {
    label: 'Email',
    sortable: true,
    value: 'email',
  },
  {
    label: 'Phone Number',
    sortable: true,
    value: 'number',
  },
  {
    label: 'Loaylty Point',
    sortable: true,
    value: 'loyaltyPoint',
  },
  {
    label: 'Latest Visit',
    sortable: true,
    value: 'latestVisit',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const CUSTOMER_LIST_ITEMS_OF_SPLIT_BUTTON: ISplitButton[] = [
  {
    iconName: 'eye-visible',
    label: 'Preview',
  },
  {
    iconName: 'edit',
    label: 'Edit',
  },
  {
    iconName: 'delete',
    label: 'Delete',
  },
];

export const CUSTOMER_LIST_VALUES = [
  {
    name: 'Bessie Cooper',
    email: 'bcopper@gmail.com',
    number: '0876-5432-1098',
    loyaltyPoint: 120,
    latestVisit: '01/08/2024',
  },
  {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    number: '0876-5432-1099',
    loyaltyPoint: 150,
    latestVisit: '01/09/2024',
  },
  {
    name: 'Jane Smith',
    email: 'janesmith@gmail.com',
    number: '0876-5432-1100',
    loyaltyPoint: 200,
    latestVisit: '01/10/2024',
  },
];
