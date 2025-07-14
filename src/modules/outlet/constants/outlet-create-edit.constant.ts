import { IOutletBusinessHour } from '../interfaces/outlet-create-edit.interface';

// Key Http Request
export const OUTLET_CREATE_EDIT_CREATE_NEW_OUTLET_REQUEST = 'OUTLET_CREATE_EDIT_CREATE_NEW_OUTLET_REQUEST';
export const OUTLET_CREATE_EDIT_DELETE_OUTLET_REQUEST = 'OUTLET_CREATE_EDIT_DELETE_OUTLET_REQUEST';
export const OUTLET_CREATE_EDIT_DETAIL_OUTLET_REQUEST = 'OUTLET_CREATE_EDIT_DETAIL_OUTLET_REQUEST';
export const OUTLET_CREATE_EDIT_UPDATE_OUTLET_REQUEST = 'OUTLET_CREATE_EDIT_UPDATE_OUTLET_REQUEST';

export const OUTLET_CREATE_EDIT_BUSINESS_TYPES: IDropdownItem[] = [
  {
    label: 'Restaurant (FnB)',
    value: 'Restaurant',
  },
  {
    label: 'Retail',
    value: 'Retail',
  },
];
export const OUTLET_CREATE_EDIT_BUSINESS_HOURS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const OUTLET_CREATE_EDIT_INITIAL_VALUES_OF_BUSINESS_HOURS: IOutletBusinessHour[] = [
  {
    day: 'Sunday',
    openTime: '',
    closeTime: '',
    isOpen: false,
  },
  {
    day: 'Monday',
    openTime: '',
    closeTime: '',
    isOpen: false,
  },
  {
    day: 'Tuesday',
    openTime: '',
    closeTime: '',
    isOpen: false,
  },
  {
    day: 'Wednesday',
    openTime: '',
    closeTime: '',
    isOpen: false,
  },
  {
    day: 'Thursday',
    openTime: '',
    closeTime: '',
    isOpen: false,
  },
  {
    day: 'Friday',
    openTime: '',
    closeTime: '',
    isOpen: false,
  },
  {
    day: 'Saturday',
    openTime: '',
    closeTime: '',
    isOpen: false,
  },
];
