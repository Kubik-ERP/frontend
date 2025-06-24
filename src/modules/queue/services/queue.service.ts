import { QUEUE_LIST_COLUMNS, QUEUE_LIST_VALUES, ORDER_STATUS_LIST, ORDER_TYPE_LIST } from '../constants';

export const useQueueService = () => {
  return {
    queueColumns: QUEUE_LIST_COLUMNS,
    queueValues: QUEUE_LIST_VALUES,
    OrderStatusList: ORDER_STATUS_LIST,
    OrderTypeList: ORDER_TYPE_LIST,
  };
};
