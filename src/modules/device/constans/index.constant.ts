import { IDevice } from "../interfaces";

export const DEVICE_API_BASE_ENDPOINT = '/device-codes';
export const DEVICE_LIST_REQUEST = 'DEVICE_LIST_REQUEST';
export const DEVICE_LIST_COLUMS = [
  {
    label: '#',
    sortable: false,
    value: 'iteration',
  },
  {
    label: 'Device Name',
    sortable: false,
    value: 'name',
  },
  {
    label: 'Device Code',
    sortable: false,
    value: 'code',
  },
  {
    label: 'Status',
    sortable: false,
    value: 'status',
  },
  {
    label: 'Connected On',
    sortable: true,
    value: 'lastConnectedAt',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  }
];

export const DEVICE_FAKE_DATA: IDevice[] = [
  {
    id: '1',
    name: 'TAB CASHIER',
    code: 'SKYAND1',
    status: 'connected',
    lastConnectedAt: '2025-09-01 00:00:00',
  },
  {
    id: '2',
    name: 'TAB MANAGER',
    code: 'YAHNE02',
    status: 'disconnected',
    lastConnectedAt: '2025-08-01 00:00:00',
  },
  {
    id: '3',
    name: 'TAB STAFF',
    code: 'KYANS103',
    status: 'pending',
    lastConnectedAt: '2025-08-01 00:00:00',
  }
];
