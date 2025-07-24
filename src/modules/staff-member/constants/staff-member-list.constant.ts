// Key Http Requests
export const STAFF_MEMBER_LIST_REQUEST = 'STAFF_MEMBER_LIST_REQUEST';

export const STAFF_MEMBER_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Name',
    sortable: false,
    value: 'name',
  },
  {
    label: 'Email',
    sortable: false,
    value: 'email',
  },
  {
    label: 'Phone Number',
    sortable: false,
    value: 'phoneNumber',
  },
  {
    label: 'Title',
    sortable: false,
    value: 'title',
  },
  {
    label: 'User Permission',
    sortable: false,
    value: 'permission',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const STAFF_MEMBER_LIST_VALUES = [
  {
    name: 'Bessie Cooper',
    email: 'bcopper@gmail.com',
    phoneNumber: '0876-5432-1098',
    title: 'Owner',
    userPermission: 'Owner',
  },
  {
    name: 'Jane Doe',
    email: 'jdoe@gmail.com',
    phoneNumber: '0123-4567-8901',
    title: 'Manager',
    userPermission: 'Manager',
  },
  {
    name: 'John Smith',
    email: 'john@gmail.com',
    phoneNumber: '0987-6543-2109',
    title: 'Sales Associate',
    userPermission: 'Sales Associate',
  },
];
