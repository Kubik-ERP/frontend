// Components
import AccountAssignedStaff from '../components/store-detail/AccountAssignedStaff.vue';
import AccountStoreFacility from '../components/store-detail/AccountStoreFacility.vue';
import AccountStoreTableConfiguration from '../components/store-detail/AccountStoreTableConfiguration.vue';

// Interfaces
import type { IOperationalDay } from '../interfaces';

export const ACCOUNT_STORE_DETAIL_ASSIGNED_STAFF_COLUMNS: IColumnDataTable[] = [
  {
    sortable: false,
    label: 'Name',
    translationKey: 'app.name',
    value: 'name',
    width: '31.6%',
  },
  {
    sortable: false,
    label: 'Title',
    translationKey: 'account.staff-title',
    value: 'title',
    width: '31.6%',
  },
  {
    sortable: false,
    label: 'Phone Number',
    translationKey: 'app.phone-number',
    value: 'phone',
    width: '31.6%',
  },
  {
    sortable: false,
    label: '',
    value: 'action',
    width: '5%',
  },
];

export const ACCOUNT_STORE_DETAIL_ASSIGNED_STAFF_VALUES = [
  {
    name: 'John Doe',
    title: 'Manager',
    phone: '0876 5432 1098',
  },
  {
    name: 'Jane Smith',
    title: 'Barista',
    phone: '0856 7890 4321',
  },
  {
    name: 'Alice Johnson',
    title: 'Cashier',
    phone: '0812 3456 7890',
  },
];

export const ACCOUNT_STORE_DETAIL_FACILITY_COLUMNS: IColumnDataTable[] = [
  {
    sortable: false,
    label: 'Facility',
    translationKey: 'account.facility',
    value: 'facility',
    width: '47%',
  },
  {
    sortable: false,
    label: 'Description',
    translationKey: 'app.description',
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

export const ACCOUNT_STORE_DETAIL_TABS: IDropdownItem[] = [
  {
    value: 'basic_info',
    label: 'Basic Information',
    translationKey: 'account.basicInformation',
  },
  {
    value: 'assigned_staff',
    label: 'Assigned Staff',
    translationKey: 'account.assignedStaff',
  },
  {
    value: 'operational_hour',
    label: 'Operational Hours',
    translationKey: 'account.operationalHours',
  },
  {
    value: 'subscription_plan',
    label: 'Subscription Plan',
    translationKey: 'account.subscriptionPlan',
  },
  {
    value: 'facility',
    label: 'Facility',
    translationKey: 'account.facility',
  },
];

export const ACCOUNT_STORE_DETAIL_LIST_TABS: ITabs[] = [
  {
    component: AccountStoreFacility,
    label: 'Store Facilities',
    translationKey: 'account.facilities',
    value: 'store-facilities',
  },
  {
    component: AccountStoreTableConfiguration,
    label: 'Table Configuration',
    translationKey: 'account.table-configuration',
    value: 'table-configuration',
  },
  {
    component: AccountAssignedStaff,
    label: 'Assigned Staffs',
    translationKey: 'account.assigned-staffs',
    value: 'assigned-staffs',
  },
];

export const ACCOUNT_STORE_DETAIL_OPERATIONAL_HOUR_COLUMNS: IColumnDataTable[] = [
  {
    sortable: false,
    label: 'Day',
    translationKey: 'account.day',
    value: 'day',
    width: '20%',
  },
  {
    sortable: false,
    label: 'Open',
    translationKey: 'account.open',
    value: 'open',
    width: '20%',
  },
  {
    sortable: false,
    label: 'Close',
    translationKey: 'account.close',
    value: 'close',
    width: '20%',
  },
  {
    sortable: false,
    label: 'Status',
    translationKey: 'account.status',
    value: 'status',
    width: '20%',
  },
  {
    sortable: false,
    label: '',
    value: 'action',
    width: '20%',
  },
];

// Alias for backward compatibility with service file
export const ACCOUNT_STORE_DETAIL_OPERATIONAL_HOURS_COLUMNS = ACCOUNT_STORE_DETAIL_OPERATIONAL_HOUR_COLUMNS;

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
