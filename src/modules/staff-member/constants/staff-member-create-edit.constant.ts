// Key Http Requests
export const STAFF_MEMBER_CREATE_REQUEST = 'STAFF_MEMBER_CREATE_REQUEST';
export const STAFF_MEMBER_DETAIL_REQUEST = 'STAFF_MEMBER_DETAIL_REQUEST';
export const STAFF_MEMBER_EDIT_REQUEST = 'STAFF_MEMBER_EDIT_REQUEST';
export const STAFF_MEMBER_DELETE_REQUEST = 'STAFF_MEMBER_DELETE_REQUEST';

export const STAFF_MEMBER_COLUMNS_COMISSIONS: IColumnDataTable[] = [
  {
    sortable: false,
    label: 'Item',
    value: 'item',
  },
  {
    sortable: false,
    label: 'Price',
    value: 'price',
  },
  {
    sortable: false,
    label: 'Commission',
    value: 'commission',
  },
];

export const STAFF_MEMBER_TYPES_OF_SOCIAL_MEDIA: IDropdownItem[] = [
  {
    iconName: 'instagram',
    label: 'Instagram',
    value: 'INSTAGRAM',
  },
  {
    iconName: 'facebook',
    label: 'Facebook',
    value: 'FACEBOOK',
  },
  {
    iconName: 'x-twitter',
    label: 'X/Twitter',
    value: 'X/TWITTER',
  },
];

export const STAFF_MEMBER_TYPES_OF_USER_PERMISSIONS: IDropdownItem[] = [
  {
    label: 'No Access',
    value: 'NO_ACCESS',
  },
  {
    label: 'Basic',
    value: 'BASIC',
  },
  {
    label: 'Junior',
    value: 'JUNIOR',
  },
  {
    label: 'Senior',
    value: 'SENIOR',
  },
  {
    label: 'Supervisor',
    value: 'SUPERVISOR',
  },
  {
    label: 'Manager',
    value: 'MANAGER',
  },
  {
    label: 'Owner',
    value: 'OWNER',
  },
];
