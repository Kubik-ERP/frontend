// Constants
// import {
//   TRANSFER_STOCK_DETAIL_REQUEST,
//   TRANSFER_STOCK_DETAIL_APPROVE_REQUEST,
//   TRANSFER_STOCK_DETAIL_CANCEL_REQUEST,
//   TRANSFER_STOCK_DETAIL_SHIP_REQUEST,
//   TRANSFER_STOCK_DETAIL_RECEIVE_REQUEST,
// } from '../constants';

// Interfaces
import type {
  ITransferStockDetailProvided,
  ITransferStockApprovePayload,
  ITransferStockCancelPayload,
  ITransferStockShipPayload,
  ITransferStockReceivePayload,
} from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useTransferStockStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useTransferStockDetailService = (): ITransferStockDetailProvided => {
  /**
   * @description Injected variables
   */
  const route = useRoute();
  const store = useTransferStockStore(); // Instance of the store
  const { transferStock_data, transferStock_isLoading } = storeToRefs(store);
  // const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Computed properties for business logic
   */
  const transferStockDetail_routeParamsId = computed(() =>
    route.params.id.length > 0 ? String(route.params.id) : '',
  );

  /**
   * @description Reactive data binding
   */
  const transferStockDetail_formDataOfApprove = ref<ITransferStockApprovePayload>({
    status: 'approve',
  });

  const transferStockDetail_formDataOfCancel = ref<ITransferStockCancelPayload>({
    status: 'cancel',
    note: '',
  });

  const transferStockDetail_formDataOfReceive = ref<ITransferStockReceivePayload>({
    status: 'receive',
  });

  const transferStockDetail_formDataOfShip = ref<ITransferStockShipPayload>({
    status: 'ship',
    logistic_provider: '',
    tracking_number: '',
    delivery_note: '',
  });

  /**
   * @description Form validations
   */
  const transferStockDetail_formRulesOfApprove = computed(() => ({
    status: { required },
  }));

  const transferStockDetail_formRulesOfCancel = computed(() => ({
    status: { required },
    note: { required },
  }));

  const transferStockDetail_formRulesOfReceive = computed(() => ({
    status: { required },
  }));

  const transferStockDetail_formRulesOfShip = computed(() => ({
    status: { required },
  }));

  const transferStockDetail_formValidationsOfApprove = useVuelidate(
    transferStockDetail_formRulesOfApprove,
    transferStockDetail_formDataOfApprove,
    {
      $autoDirty: true,
    },
  );

  const transferStockDetail_formValidationsOfCancel = useVuelidate(
    transferStockDetail_formRulesOfCancel,
    transferStockDetail_formDataOfCancel,
    {
      $autoDirty: true,
    },
  );

  const transferStockDetail_formValidationsOfReceive = useVuelidate(
    transferStockDetail_formRulesOfReceive,
    transferStockDetail_formDataOfReceive,
    {
      $autoDirty: true,
    },
  );

  const transferStockDetail_formValidationsOfShip = useVuelidate(
    transferStockDetail_formRulesOfShip,
    transferStockDetail_formDataOfShip,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle business logic to return dynamic action button
   */
  const transferStockDetail_dynamicButtonAction = (status: string): void => {
    switch (status.toLowerCase()) {
      case 'draft':
      case 'drafted':
        transferStockDetail_onShowDialogApprove();
        break;
      case 'approved':
        transferStockDetail_onShowDialogShip();
        break;
      case 'shipped':
        transferStockDetail_onShowDialogReceive();
        break;
      default:
        break;
    }
  };

  /**
   * @description Handle business logic to return dynamic label button
   */
  const transferStockDetail_dynamicButtonLabel = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'draft':
      case 'drafted':
        return 'Approve Transfer';
      case 'approved':
        return 'Ship Transfer';
      case 'shipped':
        return 'Receive Transfer';
      default:
        return 'Unknown Action';
    }
  };

  /**
   * @description Handle fetch api transfer stock - details
   */
  const transferStockDetail_fetchDetails = async (id: string): Promise<unknown> => {
    try {
      await store.transferStock_detail(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for approve transfer stock
   */
  const transferStockDetail_onApprove = async (): Promise<void> => {
    try {
      await store.transferStock_approve(
        transferStockDetail_routeParamsId.value,
        transferStockDetail_formDataOfApprove.value,
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Transfer stock approved successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      transferStockDetail_onCloseDialogApprove();
      await transferStockDetail_fetchDetails(transferStockDetail_routeParamsId.value);
    } catch (error) {
      console.error('Error approving transfer stock:', error);
    }
  };

  /**
   * @description Handle business logic for cancel transfer stock
   */
  const transferStockDetail_onCancel = (): void => {
    transferStockDetail_formDataOfCancel.value = {
      status: 'cancel',
      note: '',
    };

    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-detail-cancel',
      isOpen: true,
      isUsingClosableButton: true,
      width: '500px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle close dialog approve
   */
  const transferStockDetail_onCloseDialogApprove = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-detail-approve',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
    transferStockDetail_formDataOfApprove.value = { status: 'approve' };
  };

  /**
   * @description Handle close dialog cancel
   */
  const transferStockDetail_onCloseDialogCancel = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-detail-cancel',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
    transferStockDetail_formDataOfCancel.value = {
      status: 'cancel',
      note: '',
    };
  };

  /**
   * @description Handle close dialog receive
   */
  const transferStockDetail_onCloseDialogReceive = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-detail-receive',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
    transferStockDetail_formDataOfReceive.value = { status: 'receive' };
  };

  /**
   * @description Handle close dialog ship
   */
  const transferStockDetail_onCloseDialogShip = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-detail-ship',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
    transferStockDetail_formDataOfShip.value = {
      status: 'ship',
      logistic_provider: '',
      tracking_number: '',
      delivery_note: '',
    };
  };

  /**
   * @description Handle business logic for loading initial data
   */
  const transferStockDetail_onLoadInitialData = async (id: string): Promise<void> => {
    try {
      await transferStockDetail_fetchDetails(id);
    } catch (error) {
      console.error('Error loading transfer stock details:', error);
    }
  };

  /**
   * @description Handle business logic for receive transfer stock
   */
  const transferStockDetail_onReceive = async (): Promise<void> => {
    try {
      await store.transferStock_receive(transferStockDetail_routeParamsId.value);

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Transfer stock received successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      transferStockDetail_onCloseDialogReceive();
      await transferStockDetail_fetchDetails(transferStockDetail_routeParamsId.value);
    } catch (error) {
      console.error('Error receiving transfer stock:', error);
    }
  };

  /**
   * @description Handle business logic for ship transfer stock
   */
  const transferStockDetail_onShip = async (): Promise<void> => {
    try {
      await store.transferStock_ship(
        transferStockDetail_routeParamsId.value,
        transferStockDetail_formDataOfShip.value,
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Transfer stock shipped successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      transferStockDetail_onCloseDialogShip();
      await transferStockDetail_fetchDetails(transferStockDetail_routeParamsId.value);
    } catch (error) {
      console.error('Error shipping transfer stock:', error);
    }
  };

  /**
   * @description Handle show dialog approve
   */
  const transferStockDetail_onShowDialogApprove = (): void => {
    transferStockDetail_formDataOfApprove.value = {
      status: 'approve',
    };

    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-detail-approve',
      isOpen: true,
      isUsingClosableButton: true,
      width: '500px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle show dialog cancel
   */
  const transferStockDetail_onShowDialogCancel = (): void => {
    transferStockDetail_formDataOfCancel.value = {
      status: 'cancel',
      note: '',
    };

    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-detail-cancel',
      isOpen: true,
      isUsingClosableButton: true,
      width: '500px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle show dialog receive
   */
  const transferStockDetail_onShowDialogReceive = (): void => {
    transferStockDetail_formDataOfReceive.value = {
      status: 'receive',
    };

    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-detail-receive',
      isOpen: true,
      isUsingClosableButton: true,
      width: '700px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle show dialog ship
   */
  const transferStockDetail_onShowDialogShip = (): void => {
    transferStockDetail_formDataOfShip.value = {
      status: 'ship',
      logistic_provider: '',
      tracking_number: '',
      delivery_note: '',
    };

    const argsEventEmitter: IPropsDialog = {
      id: 'transfer-stock-detail-ship',
      isOpen: true,
      isUsingClosableButton: true,
      width: '700px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle submit approve
   */
  const transferStockDetail_onSubmitApprove = async (): Promise<void> => {
    if (transferStockDetail_formValidationsOfApprove.value.$invalid) {
      return;
    }

    await transferStockDetail_onApprove();
  };

  /**
   * @description Handle submit cancel
   */
  const transferStockDetail_onSubmitCancel = async (): Promise<void> => {
    if (transferStockDetail_formValidationsOfCancel.value.$invalid) {
      return;
    }

    try {
      await store.transferStock_cancel(
        transferStockDetail_routeParamsId.value,
        transferStockDetail_formDataOfCancel.value,
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Transfer stock canceled successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      transferStockDetail_onCloseDialogCancel();
      await transferStockDetail_fetchDetails(transferStockDetail_routeParamsId.value);
    } catch (error) {
      console.error('Error canceling transfer stock:', error);
    }
  };

  /**
   * @description Handle submit receive
   */
  const transferStockDetail_onSubmitReceive = async (): Promise<void> => {
    if (transferStockDetail_formValidationsOfReceive.value.$invalid) {
      return;
    }

    await transferStockDetail_onReceive();
  };

  /**
   * @description Handle submit ship
   */
  const transferStockDetail_onSubmitShip = async (): Promise<void> => {
    if (transferStockDetail_formValidationsOfShip.value.$invalid) {
      return;
    }

    await transferStockDetail_onShip();
  };

  /**
   * @description Computed property for shipping document data formatted for PDF
   */
  const shippingDocumentData = computed(() => {
    const detail = transferStock_data.value;
    if (!detail) return null;

    return {
      transactionCode: detail.transactionCode || '',
      storeFrom: {
        name: detail.storeFrom?.name || '',
        address: detail.storeFrom?.address || '',
        city: detail.storeFrom?.city || '',
        postalCode: detail.storeFrom?.postalCode || '',
      },
      storeTo: {
        name: detail.storeTo?.name || '',
        address: detail.storeTo?.address || '',
        city: detail.storeTo?.city || '',
        postalCode: detail.storeTo?.postalCode || '',
      },
      shippedAt: detail.shippedAt || null,
      trackingNumber: detail.trackingNumber || null,
      logisticProvider: detail.logisticProvider || null,
      deliveryNote: detail.deliveryNote || null,
      transferStockItems: detail.transferStockItems || [],
      note: detail.note || '',
    };
  });

  /**
   * @description Handle export shipping document to PDF
   * Note: This function is placeholder and will be implemented at component level
   */
  const handleExportShippingDocumentToPdf = (): void => {
    // This function will be properly implemented in the component where html2pdf is available
    console.warn('PDF export should be handled at component level with html2pdf library');
  };

  return {
    transferStockDetail_data: transferStock_data,
    transferStockDetail_dynamicButtonAction,
    transferStockDetail_dynamicButtonLabel,
    transferStockDetail_fetchDetails,
    transferStockDetail_formDataOfApprove,
    transferStockDetail_formDataOfCancel,
    transferStockDetail_formDataOfReceive,
    transferStockDetail_formDataOfShip,
    transferStockDetail_formValidationsOfApprove,
    transferStockDetail_formValidationsOfCancel,
    transferStockDetail_formValidationsOfReceive,
    transferStockDetail_formValidationsOfShip,
    transferStockDetail_isLoading: transferStock_isLoading,
    transferStockDetail_onApprove,
    transferStockDetail_onCancel,
    transferStockDetail_onCloseDialogApprove,
    transferStockDetail_onCloseDialogCancel,
    transferStockDetail_onCloseDialogReceive,
    transferStockDetail_onCloseDialogShip,
    transferStockDetail_onLoadInitialData,
    transferStockDetail_onReceive,
    transferStockDetail_onShip,
    transferStockDetail_onShowDialogApprove,
    transferStockDetail_onShowDialogCancel,
    transferStockDetail_onShowDialogReceive,
    transferStockDetail_onShowDialogShip,
    transferStockDetail_onSubmitApprove,
    transferStockDetail_onSubmitCancel,
    transferStockDetail_onSubmitReceive,
    transferStockDetail_onSubmitShip,
    // PDF export functionality
    handleExportShippingDocumentToPdf,
    shippingDocumentData,
  };
};
