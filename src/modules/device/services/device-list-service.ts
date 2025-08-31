import { DataTableSortEvent } from 'primevue';
import { DEVICE_LIST_COLUMS, DEVICE_LIST_REQUEST } from '../constans/index.constant';
import { IDevice, IDeviceListProvided, IDeviceListRequestQuery } from '../interfaces';
import { useDeviceStore } from '../store';
import eventBus from '@/plugins/mitt';

export const useDeviceListService = (): IDeviceListProvided => {
  const store = useDeviceStore();
  const { deviceList_loading, deviceList_values } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Fetch device list and list query
   */
  const device_queryParams = reactive<IDeviceListRequestQuery>({
    page: 1,
    pageSize: 10,
    orderBy: null,
    orderDirection: null,
  });

  const device_fetchData = async (): Promise<void> => {
    deviceList_loading.value = true;
    try {
      await store.deviceList_fetchData(device_queryParams, {
        ...httpAbort_registerAbort(DEVICE_LIST_REQUEST),
      });
    } catch (error) {
      console.log(error);
    } finally {
      deviceList_loading.value = false;
    }
  };

  watch(
    () => device_queryParams,
    () => {
      device_fetchData();
    },
    { deep: true, immediate: true },
  );

  /**
   *
   * @param page for hancdle action
   */
  const device_onChangePage = (page: number): void => {
    device_queryParams.page = page;
  };

  const device_handleOnSortChange = (event: DataTableSortEvent) => {
    const sortField = event.sortField as string;
    const sortOrder = event.sortOrder as number;
    device_queryParams.orderBy = sortField === 'id' ? 'created_at' : 'id';

    if (sortOrder === 1) device_queryParams.orderDirection = 'asc';
    else if (sortOrder === -1) device_queryParams.orderDirection = 'desc';
    else device_queryParams.orderDirection = null;
  };
  const device_onCreate = () => {
    store.setFormMode('create', undefined);
    eventBus.emit('AppBaseDialog', {
      id: 'device-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    });
  };

  const device_onView = (data: IDevice) => {
    console.log('device_onView', data);

    store.setFormMode('edit', data);
    eventBus.emit('AppBaseDialog', {
      id: 'device-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    });
  };

  return {
    device_columns: DEVICE_LIST_COLUMS,
    device_values: deviceList_values,
    device_fetchData,
    device_isLoading: deviceList_loading,
    device_queryParams,
    device_onChangePage,
    device_onCreate,
    device_listData: computed(() => deviceList_values.value.data.items),
    device_onView,
    device_handleOnSortChange,
  };
};
