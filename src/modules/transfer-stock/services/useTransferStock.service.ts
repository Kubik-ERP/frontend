import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import type {
  ITransferStockApprovePayload,
  ITransferStockClosePayload,
  ITransferStockCreateFormPayload,
  ITransferStockReceivePayload,
  ITransferStockShipmentPayload,
} from '../interfaces';
import { useTransferStockStore } from '../store';

export const useTransferStockService = () => {
  const store = useTransferStockStore();
  const { transferStock_isLoading, transferStock_list, transferStock_selected, transferStock_stores } =
    storeToRefs(store);

  const isCreateDialogOpen = ref(false);
  const isShipmentDialogOpen = ref(false);
  const isReceiveDialogOpen = ref(false);
  const isCloseDialogOpen = ref(false);

  const pendingActionTransferId = ref<string | null>(null);

  onMounted(async () => {
    if (!transferStock_list.value.length) {
      await store.transferStock_initialize();
    }
  });

  const openCreateDialog = () => {
    isCreateDialogOpen.value = true;
  };

  const closeCreateDialog = () => {
    isCreateDialogOpen.value = false;
  };

  const openShipmentDialog = (transferId: string) => {
    isShipmentDialogOpen.value = true;
    pendingActionTransferId.value = transferId;
  };

  const closeShipmentDialog = () => {
    isShipmentDialogOpen.value = false;
    pendingActionTransferId.value = null;
  };

  const openReceiveDialog = (transferId: string) => {
    isReceiveDialogOpen.value = true;
    pendingActionTransferId.value = transferId;
  };

  const closeReceiveDialog = () => {
    isReceiveDialogOpen.value = false;
    pendingActionTransferId.value = null;
  };

  const openCloseDialog = (transferId: string) => {
    isCloseDialogOpen.value = true;
    pendingActionTransferId.value = transferId;
  };

  const closeCloseDialog = () => {
    isCloseDialogOpen.value = false;
    pendingActionTransferId.value = null;
  };

  const createTransfer = async (payload: ITransferStockCreateFormPayload) => {
    await store.transferStock_createTransfer(payload);
    closeCreateDialog();
  };

  const approveTransfer = async (payload: ITransferStockApprovePayload) => {
    await store.transferStock_approveTransfer(payload);
  };

  const cancelApproval = async (transferId: string, actor: string) => {
    await store.transferStock_cancelApproval(transferId, actor);
  };

  const shipTransfer = async (payload: ITransferStockShipmentPayload) => {
    await store.transferStock_shipTransfer(payload);
    closeShipmentDialog();
  };

  const receiveTransfer = async (payload: ITransferStockReceivePayload) => {
    await store.transferStock_receiveTransfer(payload);
    closeReceiveDialog();
  };

  const closeTransfer = async (payload: ITransferStockClosePayload) => {
    await store.transferStock_closeTransfer(payload);
    closeCloseDialog();
  };

  return {
    transferStock_isLoading,
    transferStock_list,
    transferStock_selected,
    transferStock_stores,
    transferStock_selectTransfer: store.transferStock_selectTransfer,
    openCreateDialog,
    closeCreateDialog,
    isCreateDialogOpen,
    createTransfer,
    approveTransfer,
    cancelApproval,
    openShipmentDialog,
    closeShipmentDialog,
    isShipmentDialogOpen,
    shipTransfer,
    openReceiveDialog,
    closeReceiveDialog,
    isReceiveDialogOpen,
    receiveTransfer,
    openCloseDialog,
    closeCloseDialog,
    isCloseDialogOpen,
    closeTransfer,
    pendingActionTransferId,
  };
};
