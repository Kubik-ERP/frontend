// Key Http Requests
export const STAFF_MEMBER_LIST_REQUEST = 'STAFF_MEMBER_LIST_REQUEST';

export const STAFF_MEMBER_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Name',
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
    value: 'phoneNumber',
  },
  {
    label: 'Title',
    sortable: true,
    value: 'title',
  },
  {
    label: 'User Permission',
    sortable: true,
    value: 'userPermission',
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
