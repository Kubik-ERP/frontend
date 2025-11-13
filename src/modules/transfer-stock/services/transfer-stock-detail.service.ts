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
import { useOutletStore } from '@/modules/outlet/store';

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

  // Get current store ID from outlet store
  const outletStore = useOutletStore();
  const { outlet_currentOutlet } = storeToRefs(outletStore);

  /**
   * @description Computed properties for business logic
   */
  const transferStockDetail_routeParamsId = computed(() =>
    route.params.id.length > 0 ? String(route.params.id) : '',
  );

  /**
   * @description Check if current store is the "from" store (sender)
   */
  const transferStockDetail_isFromStore = computed(() => {
    return transferStock_data.value?.storeFromId === outlet_currentOutlet.value?.id;
  });

  /**
   * @description Check if current store is the "to" store (receiver)
   */
  const transferStockDetail_isToStore = computed(() => {
    return transferStock_data.value?.storeToId === outlet_currentOutlet.value?.id;
  });

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
    status: 'received',
    items: [],
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
    items: { required },
  }));

  const transferStockDetail_formRulesOfShip = computed(() => ({
    status: { required },
    logistic_provider: { required },
    tracking_number: { required },
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
   * Store A (from): Can do Draft → Approved → Shipped
   * Store B (to): Can only Receive when status is Shipped
   */
  const transferStockDetail_dynamicButtonAction = (status: string): void => {
    const statusLower = status.toLowerCase();

    // Store A (From Store) actions
    if (transferStockDetail_isFromStore.value) {
      switch (statusLower) {
        case 'draft':
        case 'drafted':
          transferStockDetail_onShowDialogApprove();
          break;
        case 'approved':
          transferStockDetail_onShowDialogShip();
          break;
        default:
          // After shipped, Store A cannot do any action
          break;
      }
    }

    // Store B (To Store) actions
    if (transferStockDetail_isToStore.value) {
      if (statusLower === 'shipped') {
        transferStockDetail_onShowDialogReceive();
      }
    }
  };

  /**
   * @description Handle business logic to return dynamic label button
   * Store A (from): Draft → Approve, Approved → Ship
   * Store B (to): Shipped → Receive
   */
  const transferStockDetail_dynamicButtonLabel = (status: string): string => {
    const statusLower = status.toLowerCase();

    // Store A (From Store) labels
    if (transferStockDetail_isFromStore.value) {
      switch (statusLower) {
        case 'draft':
        case 'drafted':
          return 'Approve Transfer';
        case 'approved':
          return 'Ship Transfer';
        default:
          return '';
      }
    }

    // Store B (To Store) labels
    if (transferStockDetail_isToStore.value) {
      if (statusLower === 'shipped') {
        return 'Receive Transfer';
      }
    }

    return '';
  };

  /**
   * @description Handle fetch api transfer stock - approve
   */
  const transferStockDetail_fetchApprove = async (): Promise<unknown> => {
    try {
      return await store.transferStock_approve(
        transferStockDetail_routeParamsId.value,
        transferStockDetail_formDataOfApprove.value,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api transfer stock - cancel
   */
  const transferStockDetail_fetchCancel = async (): Promise<unknown> => {
    try {
      return await store.transferStock_cancel(
        transferStockDetail_routeParamsId.value,
        transferStockDetail_formDataOfCancel.value,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api transfer stock - check product destination
   */
  const transferStockDetail_fetchCheckProductDestination = async (id: string): Promise<unknown> => {
    try {
      return await store.transferStock_checkProductDestination(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
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
   * @description Handle fetch api transfer stock - receive
   */
  const transferStockDetail_fetchReceive = async (): Promise<unknown> => {
    try {
      return await store.transferStock_receive(
        transferStockDetail_routeParamsId.value,
        transferStockDetail_formDataOfReceive.value,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api transfer stock - ship
   */
  const transferStockDetail_fetchShip = async (): Promise<unknown> => {
    try {
      return await store.transferStock_ship(
        transferStockDetail_routeParamsId.value,
        transferStockDetail_formDataOfShip.value,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic to render dynamic class of status
   */
  const transferStockDetail_getStatusClass = (status: string): string => {
    const statusClasses = {
      draft: 'text-gray-600 bg-gray-100',
      drafted: 'text-gray-600 bg-gray-100',
      pending: 'text-yellow-600 bg-yellow-100',
      approved: 'text-blue-600 bg-blue-100',
      shipped: 'text-orange-600 bg-orange-100',
      received: 'text-green-600 bg-green-100',
      received_with_issue: 'text-yellow-700 bg-yellow-200',
      closed: 'text-purple-600 bg-purple-100',
      canceled: 'text-red-600 bg-red-100',
      cancelled: 'text-red-600 bg-red-100',
    };

    return statusClasses[status.toLowerCase() as keyof typeof statusClasses] || 'text-gray-600 bg-gray-100';
  };

  /**
   * @description Format status text (convert underscore to space and capitalize)
   */
  const transferStockDetail_formatStatusText = (status: string): string => {
    if (!status) return '';

    // Replace underscores with spaces and capitalize each word
    return status
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  /**
   * @description Handle business logic for approve transfer stock
   */
  const transferStockDetail_onApprove = async (): Promise<void> => {
    try {
      await transferStockDetail_fetchApprove();

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
    transferStockDetail_formDataOfReceive.value = {
      status: 'received',
      items: [],
    };
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

      // If current store is the destination store (Store B), check product destination
      if (transferStockDetail_isToStore.value) {
        await transferStockDetail_fetchCheckProductDestination(id);
      }
    } catch (error) {
      console.error('Error loading transfer stock details:', error);
    }
  };

  /**
   * @description Handle business logic for receive transfer stock
   */
  const transferStockDetail_onReceive = async (): Promise<void> => {
    try {
      await transferStockDetail_fetchReceive();

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
      await transferStockDetail_fetchShip();

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
    // Populate items from transfer stock items
    const items =
      transferStock_data.value?.transferStockItems.map(item => ({
        itemId: item.masterInventoryItemId,
        qty_shipped: item.qtyReserved,
        qty_received: item.qtyReserved, // Default to same as shipped
        notes: '',
      })) || [];

    transferStockDetail_formDataOfReceive.value = {
      status: 'received',
      items,
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
      await transferStockDetail_fetchCancel();

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
   * @description Check if action button should be shown
   * Store A (from): Show for Draft/Drafted/Approved statuses only
   * Store B (to): Show only when Shipped
   * Hide for Received/Cancelled/Closed statuses
   */
  const transferStockDetail_shouldShowActionButton = computed(() => {
    const status = transferStock_data.value?.status?.toLowerCase() || '';

    // Hide for final statuses
    if (['received', 'cancelled', 'canceled', 'closed'].includes(status)) {
      return false;
    }

    // Store A (From Store): can act on Draft, Drafted, Approved
    if (transferStockDetail_isFromStore.value) {
      return ['draft', 'drafted', 'approved'].includes(status);
    }

    // Store B (To Store): can only act on Shipped
    if (transferStockDetail_isToStore.value) {
      return status === 'shipped';
    }

    return false;
  });

  /**
   * @description Check if cancel button should be shown
   * Only Store A (from) can cancel, and only before shipped
   */
  const transferStockDetail_shouldShowCancelButton = computed(() => {
    const status = transferStock_data.value?.status?.toLowerCase() || '';

    // Only from store can cancel
    if (!transferStockDetail_isFromStore.value) {
      return false;
    }

    // Can cancel at: Draft/Drafted/Approved (before shipped)
    return ['draft', 'drafted', 'approved'].includes(status);
  });

  return {
    transferStockDetail_data: transferStock_data,
    transferStockDetail_dynamicButtonAction,
    transferStockDetail_dynamicButtonLabel,
    transferStockDetail_fetchApprove,
    transferStockDetail_fetchCancel,
    transferStockDetail_fetchCheckProductDestination,
    transferStockDetail_fetchDetails,
    transferStockDetail_fetchReceive,
    transferStockDetail_fetchShip,
    transferStockDetail_formDataOfApprove,
    transferStockDetail_formDataOfCancel,
    transferStockDetail_formDataOfReceive,
    transferStockDetail_formDataOfShip,
    transferStockDetail_formValidationsOfApprove,
    transferStockDetail_formValidationsOfCancel,
    transferStockDetail_formValidationsOfReceive,
    transferStockDetail_formValidationsOfShip,
    transferStockDetail_formatStatusText,
    transferStockDetail_getStatusClass,
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
    transferStockDetail_shouldShowActionButton,
    transferStockDetail_shouldShowCancelButton,
    // PDF export functionality data
    shippingDocumentData,
  };
};
