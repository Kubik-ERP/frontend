// Interfaces
import type { IAccountStoreEditBusinessHour } from '../interfaces';

// Key Http Request
export const ACCOUNT_STORE_EDIT_CREATE_NEW_OUTLET_REQUEST = 'ACCOUNT_STORE_EDIT_CREATE_NEW_OUTLET_REQUEST';
export const ACCOUNT_STORE_EDIT_DELETE_OUTLET_REQUEST = 'ACCOUNT_STORE_EDIT_DELETE_OUTLET_REQUEST';
export const ACCOUNT_STORE_EDIT_DETAIL_OUTLET_REQUEST = 'ACCOUNT_STORE_EDIT_DETAIL_OUTLET_REQUEST';
export const ACCOUNT_STORE_EDIT_UPDATE_OUTLET_REQUEST = 'ACCOUNT_STORE_EDIT_UPDATE_OUTLET_REQUEST';

export const ACCOUNT_STORE_EDIT_BUSINESS_TYPES: IDropdownItem[] = [
  {
    label: 'Restaurant (FnB)',
    value: 'Restaurant',
  },
  {
    label: 'Retail',
    value: 'Retail',
  },
];

export const ACCOUNT_STORE_EDIT_INITIAL_VALUES_OF_BUSINESS_HOURS: IAccountStoreEditBusinessHour[] = [
  {
    timeSlots: [
      {
        openTime: null,
        closeTime: null,
      },
    ],
    day: 'Sunday',
    isOpen: false,
  },
  {
    timeSlots: [
      {
        openTime: null,
        closeTime: null,
      },
    ],
    day: 'Monday',
    isOpen: false,
  },
  {
    timeSlots: [
      {
        openTime: null,
        closeTime: null,
      },
    ],
    day: 'Tuesday',
    isOpen: false,
  },
  {
    timeSlots: [
      {
        openTime: null,
        closeTime: null,
      },
    ],
    day: 'Wednesday',
    isOpen: false,
  },
  {
    timeSlots: [
      {
        openTime: null,
        closeTime: null,
      },
    ],
    day: 'Thursday',
    isOpen: false,
  },
  {
    timeSlots: [
      {
        openTime: null,
        closeTime: null,
      },
    ],
    day: 'Friday',
    isOpen: false,
  },
  {
    timeSlots: [
      {
        openTime: null,
        closeTime: null,
      },
    ],
    day: 'Saturday',
    isOpen: false,
  },
];
