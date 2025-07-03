// Components
import AccountAssignedStaff from '../components/store-detail/AccountAssignedStaff.vue';
import AccountStoreFacility from '../components/store-detail/AccountStoreFacility.vue';
import AccountStoreTableConfiguration from '../components/store-detail/AccountStoreTableConfiguration.vue';

// Interfaces
import type { IOperationalDay } from '../interfaces';

export const ACCOUNT_STORE_DETAIL_FACILITY_COLUMNS: IColumnDataTable[] = [
  {
    sortable: false,
    label: 'Facility',
    value: 'facility',
    width: '47%',
  },
  {
    sortable: false,
    label: 'Description',
    value: 'description',
    width: '47%',
  },
  {
    sortable: false,
    label: '',
    value: 'action',
    width: '5%',
  },
];

export const ACCOUNT_STORE_DETAIL_FACILITY_VALUES = [
  {
    facility: 'Parking',
    description: 'Parking for customers',
  },
  {
    facility: 'Restroom',
    description: 'Restroom for customers',
  },
  {
    facility: 'Wi-Fi',
    description: 'Free Wi-Fi for customers',
  },
];

export const ACCOUNT_STORE_DETAIL_LIST_TABS: ITabs[] = [
  {
    component: AccountStoreFacility,
    label: 'Store Facilities',
    value: 'store-facilities',
  },
  {
    component: AccountStoreTableConfiguration,
    label: 'Table Configuration',
    value: 'table-configuration',
  },
  {
    component: AccountAssignedStaff,
    label: 'Assigned Staffs',
    value: 'assigned-staffs',
  },
];

export const ACCOUNT_STORE_DETAIL_OPERATIONAL_HOURS_COLUMNS: IColumnDataTable[] = [
  {
    sortable: false,
    label: 'Day',
    value: 'day',
    width: '33.3%',
  },
  {
    sortable: false,
    label: 'Open',
    value: 'openTime',
    width: '66.6%',
  },
  {
    sortable: false,
    label: 'Close',
    value: 'closeTime',
    width: '66.6%',
  },
];

export const ACCOUNT_STORE_DETAIL_OPERATIONAL_HOURS_VALUES: IOperationalDay[] = [
  {
    day: 'Sunday',
    hours: [
      { open: '07:00', close: '10:00' },
      { open: '16:00', close: '24:00' },
    ],
  },
  {
    day: 'Monday',
    hours: [{ open: '07:00', close: '24:00' }],
  },
  {
    day: 'Tuesday',
    hours: [{ open: '07:00', close: '24:00' }],
  },
  {
    day: 'Wednesday',
    hours: [{ open: 'Closed', close: 'Closed' }], // Menandakan hari libur
  },
  {
    day: 'Thursday',
    hours: [{ open: '07:00', close: '24:00' }],
  },
  {
    day: 'Friday',
    hours: [
      { open: '07:00', close: '10:00' },
      { open: '16:00', close: '24:00' },
    ],
  },
  {
    day: 'Saturday',
    hours: [{ open: '07:00', close: '24:00' }],
  },
];
