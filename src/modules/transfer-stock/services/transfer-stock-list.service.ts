// Constants
import {
  TRANSFER_STOCK_LIST_COLUMNS,
  // TRANSFER_STOCK_LIST_REQUEST,
  // TRANSFER_STOCK_CANCEL_REQUEST,
  // TRANSFER_STOCK_APPROVE_REQUEST,
  // TRANSFER_STOCK_SHIP_REQUEST,
  // TRANSFER_STOCK_RECEIVE_REQUEST,
  // TRANSFER_STOCK_CLOSE_REQUEST,
  TRANSFER_STOCK_STATUS_CLASSES,
} from '../constants';

// Interfaces
import type {
  ITransferStockListProvided,
  ITransferStockListRequestQuery,
  ITransferStockApprovePayload,
  ITransferStockCancelPayload,
  ITransferStockReceivePayload,
  ITransferStockShipPayload,
} from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useTransferStockStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

// PrimeVue
import { DataTableSortEvent } from 'primevue';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useTransferStockListService = (): ITransferStockListProvided => {
  /**
   * @description Injected variables
   */
  const store = useTransferStockStore(); // Instance of the store
  const { transferStock_isLoading, transferStock_lists } = storeToRefs(store);
  // const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const transferStockList_queryParams = reactive<ITransferStockListRequestQuery>({
    page: 1,
    pageSize: 10,
    search: '',
    // orderBy: 'transferDate',
    // orderDirection: 'desc',
  });

  const transferStockList_formDataOfApprove = ref<ITransferStockApprovePayload>({
    status: 'approve',
  });

  const transferStockList_formDataOfCancel = ref<ITransferStockCancelPayload>({
    status: 'cancel',
    note: '',
  });

  const transferStockList_formDataOfReceive = ref<ITransferStockReceivePayload>({
    status: 'receive',
  });

  const transferStockList_formDataOfShip = ref<ITransferStockShipPayload>({
    status: 'ship',
  });

  const transferStockList_selectedTransferStockId = ref<string>('');

  /**
   * @description Form validations
   */
  const transferStockList_formRulesOfApprove = computed(() => ({
    // Status is required, but it's fixed value
    status: { required },
  }));

  const transferStockList_formRulesOfCancel = computed(() => ({
    status: { required },
    note: { required },
  }));

  const transferStockList_formRulesOfReceive = computed(() => ({
    status: { required },
  }));

  const transferStockList_formRulesOfShip = computed(() => ({
    status: { required },
  }));

  const transferStockList_formValidationsOfApprove = useVuelidate(
    transferStockList_formRulesOfApprove,
    transferStockList_formDataOfApprove,
    {
      $autoDirty: true,
    },
  );

  const transferStockList_formValidationsOfCancel = useVuelidate(
    transferStockList_formRulesOfCancel,
    transferStockList_formDataOfCancel,
    {
      $autoDirty: true,
    },
  );

  const transferStockList_formValidationsOfReceive = useVuelidate(
    transferStockList_formRulesOfReceive,
    transferStockList_formDataOfReceive,
    {
      $autoDirty: true,
    },
  );

  const transferStockList_formValidationsOfShip = useVuelidate(
    transferStockList_formRulesOfShip,
    transferStockList_formDataOfShip,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Computed properties
   */
  const transferStockList_columns = computed(() => TRANSFER_STOCK_LIST_COLUMNS);
  const transferStockList_isLoading = computed(() => transferStock_isLoading.value);
  const transferStockList_values = computed(() => transferStock_lists.value);

  /**
   * @description Handle fetch api transfer stock - list
   */
  const transferStockList_fetchList = async (): Promise<unknown> => {
    try {
      await store.transferStock_list(transferStockList_queryParams);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for pagination
   */
  const transferStockList_onChangePage = (page: number): void => {
    transferStockList_queryParams.page = page;
    transferStockList_fetchList();
  };

  /**
   * @description Handle business logic for sorting
   */
  const transferStockList_handleOnSortChange = (event: DataTableSortEvent): void => {
    transferStockList_queryParams.orderBy = event.sortField as string;
    transferStockList_queryParams.orderDirection = event.sortOrder === 1 ? 'asc' : 'desc';
    transferStockList_fetchList();
  };

  /**
   * @description Get status class for styling
   */
  const transferStockList_getClassOfStatus = (status: string): string => {
    return (
      TRANSFER_STOCK_STATUS_CLASSES[status as keyof typeof TRANSFER_STOCK_STATUS_CLASSES] ||
      'text-gray-600 bg-gray-100'
    );
  };

  /**
   * @description Check if approve button should be shown
   */
  const transferStockList_onShowButtonApprove = (status: string): boolean => {
    return status === 'draft';
  };

  /**
   * @description Check if cancel button should be shown
   */
  const transferStockList_onShowButtonCancel = (status: string): boolean => {
    return ['draft', 'approved'].includes(status);
  };

  /**
   * @description Check if ship button should be shown
   */
  const transferStockList_onShowButtonShip = (status: string): boolean => {
    return status === 'approved';
  };

  /**
   * @description Check if receive button should be shown
   */
  const transferStockList_onShowButtonReceive = (status: string): boolean => {
    return status === 'shipped';
  };

  /**
   * @description Handle show dialog approve
   */
  const transferStockList_onShowDialogApprove = (id: string): void => {
    transferStockList_selectedTransferStockId.value = id;
    transferStockList_formDataOfApprove.value = {
      status: 'approve',
    };

    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-list-approve',
      isOpen: true,
      isUsingClosableButton: true,
      width: '500px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle show dialog cancel
   */
  const transferStockList_onShowDialogCancel = (id: string): void => {
    transferStockList_selectedTransferStockId.value = id;
    transferStockList_formDataOfCancel.value = {
      status: 'cancel',
      note: '',
    };

    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-list-cancel',
      isOpen: true,
      isUsingClosableButton: true,
      width: '500px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle show dialog ship
   */
  const transferStockList_onShowDialogShip = (id: string): void => {
    transferStockList_selectedTransferStockId.value = id;
    transferStockList_formDataOfShip.value = {
      status: 'ship',
    };

    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-list-ship',
      isOpen: true,
      isUsingClosableButton: true,
      width: '700px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle show dialog receive
   */
  const transferStockList_onShowDialogReceive = (id: string): void => {
    transferStockList_selectedTransferStockId.value = id;
    transferStockList_formDataOfReceive.value = {
      status: 'receive',
    };

    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-list-receive',
      isOpen: true,
      isUsingClosableButton: true,
      width: '700px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle close dialog approve
   */
  const transferStockList_onCloseDialogApprove = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-list-approve',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
    transferStockList_selectedTransferStockId.value = '';
    transferStockList_formDataOfApprove.value = { status: 'approve' };
  };

  /**
   * @description Handle close dialog cancel
   */
  const transferStockList_onCloseDialogCancel = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-list-cancel',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
    transferStockList_selectedTransferStockId.value = '';
    transferStockList_formDataOfCancel.value = { status: 'cancel', note: '' };
  };

  /**
   * @description Handle close dialog ship
   */
  const transferStockList_onCloseDialogShip = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-list-ship',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
    transferStockList_selectedTransferStockId.value = '';
    transferStockList_formDataOfShip.value = { status: 'ship' };
  };

  /**
   * @description Handle close dialog receive
   */
  const transferStockList_onCloseDialogReceive = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-list-receive',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
    transferStockList_selectedTransferStockId.value = '';
    transferStockList_formDataOfReceive.value = { status: 'receive' };
  };

  /**
   * @description Handle submit approve
   */
  const transferStockList_onSubmitApprove = async (): Promise<void> => {
    transferStockList_formValidationsOfApprove.value.$touch();

    if (transferStockList_formValidationsOfApprove.value.$invalid) {
      return;
    }

    try {
      await store.transferStock_approve(
        transferStockList_selectedTransferStockId.value,
        transferStockList_formDataOfApprove.value,
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Transfer stock approved successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      transferStockList_onCloseDialogApprove();
      await transferStockList_fetchList();
    } catch (error) {
      console.error('Error approving transfer stock:', error);
    }
  };

  /**
   * @description Handle submit cancel
   */
  const transferStockList_onSubmitCancel = async (): Promise<void> => {
    transferStockList_formValidationsOfCancel.value.$touch();

    if (transferStockList_formValidationsOfCancel.value.$invalid) {
      return;
    }

    try {
      await store.transferStock_cancel(
        transferStockList_selectedTransferStockId.value,
        transferStockList_formDataOfCancel.value,
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Transfer stock cancelled successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      transferStockList_onCloseDialogCancel();
      await transferStockList_fetchList();
    } catch (error) {
      console.error('Error cancelling transfer stock:', error);
    }
  };

  /**
   * @description Handle submit ship
   */
  const transferStockList_onSubmitShip = async (): Promise<void> => {
    transferStockList_formValidationsOfShip.value.$touch();

    if (transferStockList_formValidationsOfShip.value.$invalid) {
      return;
    }

    try {
      await store.transferStock_ship(
        transferStockList_selectedTransferStockId.value,
        transferStockList_formDataOfShip.value,
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Transfer stock shipped successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      transferStockList_onCloseDialogShip();
      await transferStockList_fetchList();
    } catch (error) {
      console.error('Error shipping transfer stock:', error);
    }
  };

  /**
   * @description Handle submit receive
   */
  const transferStockList_onSubmitReceive = async (): Promise<void> => {
    transferStockList_formValidationsOfReceive.value.$touch();

    if (transferStockList_formValidationsOfReceive.value.$invalid) {
      return;
    }

    try {
      await store.transferStock_receive(transferStockList_selectedTransferStockId.value);

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Transfer stock received successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      transferStockList_onCloseDialogReceive();
      await transferStockList_fetchList();
    } catch (error) {
      console.error('Error receiving transfer stock:', error);
    }
  };

  /**
   * @description Check if cancel transfer button should be shown
   */
  const transferStockList_onShowButtonCancelTransfer = (status: string): boolean => {
    return ['draft', 'approved'].includes(status);
  };

  /**
   * @description Check if shipping document button should be shown
   */
  const transferStockList_onShowButtonShippingDocument = (status: string): boolean => {
    return ['shipped', 'received', 'closed'].includes(status);
  };

  return {
    transferStockList_columns: transferStockList_columns.value,
    transferStockList_fetchList,
    transferStockList_formDataOfApprove,
    transferStockList_formDataOfCancel,
    transferStockList_formDataOfReceive,
    transferStockList_formDataOfShip,
    transferStockList_formValidationsOfApprove,
    transferStockList_formValidationsOfCancel,
    transferStockList_formValidationsOfReceive,
    transferStockList_formValidationsOfShip,
    transferStockList_getClassOfStatus,
    transferStockList_handleOnSortChange,
    transferStockList_isLoading,
    transferStockList_onChangePage,
    transferStockList_onCloseDialogApprove,
    transferStockList_onCloseDialogCancel,
    transferStockList_onCloseDialogReceive,
    transferStockList_onCloseDialogShip,
    transferStockList_onShowButtonApprove,
    transferStockList_onShowButtonCancel,
    transferStockList_onShowButtonCancelTransfer,
    transferStockList_onShowButtonReceive,
    transferStockList_onShowButtonShip,
    transferStockList_onShowButtonShippingDocument,
    transferStockList_onShowDialogApprove,
    transferStockList_onShowDialogCancel,
    transferStockList_onShowDialogReceive,
    transferStockList_onShowDialogShip,
    transferStockList_onSubmitApprove,
    transferStockList_onSubmitCancel,
    transferStockList_onSubmitReceive,
    transferStockList_onSubmitShip,
    transferStockList_queryParams,
    transferStockList_values,
  };
};
