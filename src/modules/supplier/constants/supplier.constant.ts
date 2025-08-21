// Key Http Requests
export const SUPPLIER_LIST_REQUEST = 'SUPPLIER_LIST_REQUEST';

export const SUPPLIER_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Supplier ID',
    sortable: true,
    value: 'id',
  },
  {
    label: 'Supplier Name',
    sortable: true,
    value: 'supplierName',
  },
  {
    label: 'Contact Person',
    sortable: false,
    value: 'contactPerson',
  },
  {
    label: 'Phone Number',
    sortable: false,
    value: 'phoneNumber',
  },
  {
    label: 'Email',
    sortable: false,
    value: 'email',
  },
  {
    label: 'Address',
    sortable: false,
    value: 'address',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];
