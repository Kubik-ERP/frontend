import { QUEUE_LIST_COLUMNS, ORDER_STATUS_LIST } from '../constants';

import eventBus from '@/plugins/mitt';

import { useQueueStore } from '../store';

export const useQueueService = () => {
  const store = useQueueStore();
  const { httpAbort_registerAbort } = useHttpAbort();

  //   const orderTypeClass = (orderType: string) => {
  //   switch (orderType) {
  //     case 'Dine In':
  //       return 'bg-primary-background text-primary';
  //     case 'Take Away':
  //       return 'bg-secondary-background text-green-primary';
  //     case 'Self Order':
  //       return 'bg-error-background text-error-main';
  //     default:
  //       return '';
  //   }
  // };

  const changeOrderStatus = async (id: string, orderStatus: string) => {
    try {
      const response = await store.fetchQueue_updateOrderStatus(
        id,
        {
          orderStatus,
        },
        {
          ...httpAbort_registerAbort('QUEUE_UPDATE_ORDER_SALES'),
        },
      );

      console.log(response.data.message);

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: response.data.message,
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const orderStatusClass = (orderStatus: string) => {
    switch (orderStatus) {
      case 'placed':
        return 'bg-complementary-background text-complementary-main';
      case 'in_progress':
        return 'bg-primary-background text-primary';
      case 'served':
        return 'bg-secondary-background text-green-primary';
      case 'completed':
        return 'bg-secondary-background text-secondary';
      case 'cancelled':
        return 'bg-error-background text-error-main';
      default:
        return '';
    }
  };

  const calculateDeltaMMSS = (createdAt: string, updateAt: string): string => {
    // Changed to const arrow function
    // 1. Convert strings to Date objects
    const createdDate = new Date(createdAt);
    const updatedDate = new Date(updateAt);

    // Check for invalid dates
    if (isNaN(createdDate.getTime()) || isNaN(updatedDate.getTime())) {
      return 'Invalid Dates';
    }

    // 2. Calculate the difference in milliseconds
    // Use Math.abs to ensure a positive difference, regardless of order
    const deltaMilliseconds = Math.abs(updatedDate.getTime() - createdDate.getTime());

    // 3. Convert milliseconds to minutes and seconds
    const totalSeconds = Math.floor(deltaMilliseconds / 1000); // Total seconds
    const minutes = Math.floor(totalSeconds / 60); // Calculate minutes
    const seconds = totalSeconds % 60; // Remaining seconds after extracting minutes

    // 4. Format minutes and seconds to always have two digits (e.g., 5 -> "05")
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return {
    queueColumns: QUEUE_LIST_COLUMNS,
    orderStatusList: ORDER_STATUS_LIST,
    changeOrderStatus,
    orderStatusClass,
    calculateDeltaMMSS,
  };
};
