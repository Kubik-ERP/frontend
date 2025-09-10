// Key Http Request
export const ACCOUNT_STORE_EDIT_CREATE_NEW_OUTLET_REQUEST = 'ACCOUNT_STORE_EDIT_CREATE_NEW_OUTLET_REQUEST';
export const ACCOUNT_STORE_EDIT_DELETE_OUTLET_REQUEST = 'ACCOUNT_STORE_EDIT_DELETE_OUTLET_REQUEST';
export const ACCOUNT_STORE_EDIT_DETAIL_OUTLET_REQUEST = 'ACCOUNT_STORE_EDIT_DETAIL_OUTLET_REQUEST';
export const ACCOUNT_STORE_EDIT_UPDATE_OUTLET_REQUEST = 'ACCOUNT_STORE_EDIT_UPDATE_OUTLET_REQUEST';

export const ACCOUNT_STORE_EDIT_BUSINESS_TYPES: IDropdownItem[] = [
  {
    label: 'Restaurant (FnB)',
    translationKey: 'account.business-types.restaurant',
    value: 'Restaurant',
  },
  {
    label: 'Retail',
    translationKey: 'account.business-types.retail',
    value: 'Retail',
  },
];

export const ACCOUNT_STORE_EDIT_INITIAL_VALUES_OF_BUSINESS_HOURS: IStoreOperationalHour[] = [
  {
    timeSlots: [
      {
        openTime: null,
        closeTime: null,
      },
    ],
    day: 'Sunday',
    dayTranslationKey: 'account.sunday',
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
    dayTranslationKey: 'account.monday',
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
    dayTranslationKey: 'account.tuesday',
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
    dayTranslationKey: 'account.wednesday',
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
    dayTranslationKey: 'account.thursday',
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
    dayTranslationKey: 'account.friday',
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
    dayTranslationKey: 'account.saturday',
    isOpen: false,
  },
];
