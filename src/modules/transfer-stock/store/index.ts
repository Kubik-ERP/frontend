import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { TRANSFER_STOCK_MOCK_STORES, TRANSFER_STOCK_MOCK_TRANSFERS, TRANSFER_STOCK_STATUS_LABEL } from '../constants';
import type {
  ITransferStock,
  ITransferStockApprovePayload,
  ITransferStockClosePayload,
  ITransferStockCreateFormPayload,
  ITransferStockItem,
  ITransferStockLogEntry,
  ITransferStockReceivePayload,
  ITransferStockShipmentPayload,
  ITransferStockStoreInventory,
  ITransferStockSummary,
  TransferStockStatus,
} from '../interfaces';

interface IShortfallDetail {
  productId: string;
  productName: string;
  requestedQty: number;
  availableQty: number;
}

interface ITransferStockError extends Error {
  code?: string;
  details?: unknown;
}

const nowIso = () => new Date().toISOString();

const clone = <T>(value: T): T => structuredClone(value);

const recalcSummary = (transfer: ITransferStock): ITransferStockSummary => {
  const totalItems = transfer.items.length;
  const totalQty = transfer.items.reduce((acc, item) => acc + item.qtyRequested, 0);
  const totalValue = transfer.items.reduce((acc, item) => acc + (item.unitPrice ?? 0) * item.qtyRequested, 0);
  return {
    ...transfer,
    totalItems,
    totalQty,
    totalValue,
  };
};

const createLog = (
  transferId: string,
  status: TransferStockStatus,
  action: string,
  actor: string,
  message: string,
  meta?: Record<string, unknown>,
): ITransferStockLogEntry => ({
  id: crypto.randomUUID(),
  transferId,
  action,
  status,
  actor,
  message,
  createdAt: nowIso(),
  meta,
});

const getStoreById = (stores: ITransferStockStoreInventory[], storeId: string): ITransferStockStoreInventory => {
  const store = stores.find(item => item.id === storeId);
  if (!store) {
    const error: ITransferStockError = new Error(`Store with id ${storeId} not found`);
    error.code = 'STORE_NOT_FOUND';
    throw error;
  }
  return store;
};

const ensureInventoryRecord = (
  store: ITransferStockStoreInventory,
  item: Pick<ITransferStockItem, 'productId' | 'productCode' | 'productName' | 'uom'>,
) => {
  if (!store.inventory[item.productId]) {
    store.inventory[item.productId] = {
      productId: item.productId,
      productCode: item.productCode,
      productName: item.productName,
      uom: item.uom,
      availableQty: 0,
      reservedQty: 0,
      inTransitQty: 0,
    };
  }
};

export const useTransferStockStore = defineStore('transfer-stock', () => {
  const transferStock_isLoading = ref(false);
  const transferStock_records = ref<ITransferStock[]>([]);
  const transferStock_selected = ref<ITransferStock | null>(null);
  const transferStock_stores = ref<ITransferStockStoreInventory[]>([]);

  const transferStock_list = computed<ITransferStockSummary[]>(() =>
    transferStock_records.value.map(record => recalcSummary(record)),
  );

  const updateRecord = (updated: ITransferStock): ITransferStock => {
    const index = transferStock_records.value.findIndex(item => item.id === updated.id);
    if (index === -1) {
      transferStock_records.value.unshift(updated);
    } else {
      transferStock_records.value.splice(index, 1, updated);
    }
    if (transferStock_selected.value?.id === updated.id) {
      transferStock_selected.value = updated;
    }
    return updated;
  };

  const applyStockValidation = (
    store: ITransferStockStoreInventory,
    items: Array<{ productId: string; productName: string; qty: number }>,
  ): void => {
    const shortfalls: IShortfallDetail[] = [];

    for (const { productId, productName, qty } of items) {
      const inventory = store.inventory[productId];
      const available = inventory?.availableQty ?? 0;
      if (available < qty) {
        shortfalls.push({
          productId,
          productName,
          requestedQty: qty,
          availableQty: available,
        });
      }
    }

    if (shortfalls.length > 0) {
      const error: ITransferStockError = new Error('Insufficient stock in source store');
      error.code = 'STOCK_SHORTFALL';
      error.details = shortfalls;
      throw error;
    }
  };

  const registerLog = (transfer: ITransferStock, log: ITransferStockLogEntry): ITransferStock => {
    const next = clone(transfer);
    next.logs = [log, ...next.logs];
    next.updatedAt = log.createdAt;
    return next;
  };

  const transferStock_initialize = async () => {
    transferStock_isLoading.value = true;
    try {
      transferStock_stores.value = clone(TRANSFER_STOCK_MOCK_STORES);
      transferStock_records.value = clone(TRANSFER_STOCK_MOCK_TRANSFERS);
      transferStock_selected.value = transferStock_records.value.at(0) ?? null;
    } finally {
      transferStock_isLoading.value = false;
    }
  };

  const transferStock_selectTransfer = (transferId: string | null) => {
    if (!transferId) {
      transferStock_selected.value = null;
      return;
    }
    transferStock_selected.value =
      transferStock_records.value.find(item => item.id === transferId) ?? transferStock_selected.value;
  };

  const transferStock_createTransfer = async (
    payload: ITransferStockCreateFormPayload,
  ): Promise<ITransferStock> => {
    const storeFrom = getStoreById(transferStock_stores.value, payload.storeFromId);
    const storeTo = getStoreById(transferStock_stores.value, payload.storeToId);

    if (storeFrom.id === storeTo.id) {
      const error: ITransferStockError = new Error('Source and destination store cannot be the same');
      error.code = 'STORE_DUPLICATE';
      throw error;
    }

    applyStockValidation(
      storeFrom,
      payload.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        qty: item.qtyRequested,
      })),
    );

    const id = `tf-${Date.now()}`;

    const transfer: ITransferStock = {
      id,
      referenceNumber: `TF-${new Date().toISOString().substring(0, 10)}-${Math.random().toString(10).substring(2, 5)}`,
      status: 'draft',
      storeFromId: storeFrom.id,
      storeFromName: storeFrom.name,
      storeToId: storeTo.id,
      storeToName: storeTo.name,
      approvalRequired: payload.approvalRequired,
      requestedBy: payload.requestedBy,
      notes: payload.notes,
      totalItems: 0,
      totalQty: 0,
      totalValue: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      approvedAt: null,
      approvedBy: null,
      shippedAt: null,
      shippedBy: null,
      receivedAt: null,
      receivedBy: null,
      logisticProvider: null,
      trackingNumber: null,
      deliveryNote: null,
      estimatedArrivalDate: null,
      items: payload.items.map(item => ({
        id: crypto.randomUUID(),
        productId: item.productId,
        productCode: item.productCode,
        productName: item.productName,
        uom: item.uom,
        qtyRequested: item.qtyRequested,
        qtyApproved: payload.approvalRequired ? 0 : item.qtyRequested,
        qtyShipped: 0,
        qtyReceived: 0,
        unitPrice: item.unitPrice ?? null,
        shortfallQty: 0,
        issueNotes: null,
      })),
      logs: [],
      attachments: [],
    };

    const created = registerLog(
      transfer,
      createLog(
        transfer.id,
        'draft',
        'created',
        payload.requestedBy,
        `Draft transfer created from ${storeFrom.name} to ${storeTo.name}`,
      ),
    );

    updateRecord(created);
    return created;
  };

  const transferStock_approveTransfer = async ({
    transferId,
    approvedBy,
  }: ITransferStockApprovePayload): Promise<ITransferStock> => {
    const transfer = transferStock_records.value.find(item => item.id === transferId);
    if (!transfer) {
      const error: ITransferStockError = new Error('Transfer not found');
      error.code = 'TRANSFER_NOT_FOUND';
      throw error;
    }

    if (transfer.status !== 'draft') {
      const error: ITransferStockError = new Error('Only draft transfers can be approved');
      error.code = 'INVALID_STATUS';
      throw error;
    }

    const storeFrom = getStoreById(transferStock_stores.value, transfer.storeFromId);

    applyStockValidation(
      storeFrom,
      transfer.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        qty: item.qtyRequested,
      })),
    );

    const next = clone(transfer);
    next.status = 'approved';
    next.approvedAt = nowIso();
    next.approvedBy = approvedBy;
    next.items = next.items.map(item => ({
      ...item,
      qtyApproved: item.qtyRequested,
    }));

    for (const item of next.items) {
      const stock = storeFrom.inventory[item.productId];
      stock.availableQty -= item.qtyApproved;
      stock.reservedQty += item.qtyApproved;
    }

    const logged = registerLog(
      next,
      createLog(
        next.id,
        next.status,
        'approved',
        approvedBy,
        `Transfer approved by ${approvedBy}. Stock reserved at ${storeFrom.name}`,
      ),
    );

    return updateRecord(logged);
  };

  const transferStock_cancelApproval = async (transferId: string, actor: string): Promise<ITransferStock> => {
    const transfer = transferStock_records.value.find(item => item.id === transferId);
    if (!transfer) {
      const error: ITransferStockError = new Error('Transfer not found');
      error.code = 'TRANSFER_NOT_FOUND';
      throw error;
    }

    if (transfer.status !== 'approved') {
      const error: ITransferStockError = new Error('Only approved transfers can be cancelled');
      error.code = 'INVALID_STATUS';
      throw error;
    }

    const storeFrom = getStoreById(transferStock_stores.value, transfer.storeFromId);

    const next = clone(transfer);
    next.status = 'draft';
    next.approvedAt = null;
    next.approvedBy = null;
    next.items = next.items.map(item => ({
      ...item,
      qtyApproved: 0,
    }));

    for (const item of transfer.items) {
      const stock = storeFrom.inventory[item.productId];
      stock.availableQty += item.qtyApproved;
      stock.reservedQty -= item.qtyApproved;
    }

    const logged = registerLog(
      next,
      createLog(next.id, next.status, 'approval_cancelled', actor, `Approval cancelled by ${actor}`),
    );

    return updateRecord(logged);
  };

  const transferStock_shipTransfer = async ({
    transferId,
    shippedBy,
    shippedAt,
    logisticProvider,
    trackingNumber,
    deliveryNote,
    qtyShipped,
  }: ITransferStockShipmentPayload): Promise<ITransferStock> => {
    const transfer = transferStock_records.value.find(item => item.id === transferId);
    if (!transfer) {
      const error: ITransferStockError = new Error('Transfer not found');
      error.code = 'TRANSFER_NOT_FOUND';
      throw error;
    }

    if (!['draft', 'approved'].includes(transfer.status)) {
      const error: ITransferStockError = new Error('Only draft or approved transfers can be shipped');
      error.code = 'INVALID_STATUS';
      throw error;
    }

    const storeFrom = getStoreById(transferStock_stores.value, transfer.storeFromId);
    const storeTo = getStoreById(transferStock_stores.value, transfer.storeToId);

    const next = clone(transfer);
    next.status = 'shipped';
    next.shippedAt = shippedAt;
    next.shippedBy = shippedBy;
    next.logisticProvider = logisticProvider ?? null;
    next.trackingNumber = trackingNumber ?? null;
    next.deliveryNote = deliveryNote ?? null;

    for (const qty of qtyShipped) {
      const item = next.items.find(entry => entry.id === qty.itemId);
      if (!item) continue;
      const stockFrom = storeFrom.inventory[item.productId];

      const shipQty = Math.min(qty.qtyShipped, item.qtyApproved || item.qtyRequested);
      item.qtyShipped = shipQty;

      if (transfer.approvalRequired) {
        stockFrom.reservedQty -= shipQty;
      } else {
        // no approval flow, validate real time
        applyStockValidation(storeFrom, [
          { productId: item.productId, productName: item.productName, qty: shipQty },
        ]);
        stockFrom.availableQty -= shipQty;
      }

      stockFrom.inTransitQty += shipQty;

      ensureInventoryRecord(storeTo, item);
      storeTo.inventory[item.productId].inTransitQty += shipQty;
    }

    const logged = registerLog(
      next,
      createLog(
        next.id,
        next.status,
        'shipped',
        shippedBy,
        `Transfer shipped by ${shippedBy}. Logistic: ${logisticProvider ?? 'N/A'}`,
        {
          trackingNumber,
          deliveryNote,
        },
      ),
    );

    return updateRecord(logged);
  };

  const transferStock_receiveTransfer = async ({
    transferId,
    receivedBy,
    receivedAt,
    items,
  }: ITransferStockReceivePayload): Promise<ITransferStock> => {
    const transfer = transferStock_records.value.find(item => item.id === transferId);
    if (!transfer) {
      const error: ITransferStockError = new Error('Transfer not found');
      error.code = 'TRANSFER_NOT_FOUND';
      throw error;
    }

    if (transfer.status !== 'shipped') {
      const error: ITransferStockError = new Error('Only shipped transfers can be received');
      error.code = 'INVALID_STATUS';
      throw error;
    }

    const storeFrom = getStoreById(transferStock_stores.value, transfer.storeFromId);
    const storeTo = getStoreById(transferStock_stores.value, transfer.storeToId);

    const next = clone(transfer);
    next.receivedAt = receivedAt;
    next.receivedBy = receivedBy;

    let hasIssue = false;

    for (const incoming of items) {
      const item = next.items.find(entry => entry.id === incoming.itemId);
      if (!item) continue;

      const expected = item.qtyShipped;
      const receivedQty = Math.min(incoming.qtyReceived, expected);
      const shortfall = expected - receivedQty;

      item.qtyReceived = receivedQty;
      item.shortfallQty = shortfall;
      item.issueNotes = incoming.issueNotes;

      const storeFromInventory = storeFrom.inventory[item.productId];
      const storeToInventory = storeTo.inventory[item.productId];

      storeFromInventory.inTransitQty -= expected;
      storeToInventory.inTransitQty -= expected;
      storeToInventory.availableQty += receivedQty;

      if (shortfall > 0) {
        hasIssue = true;
        storeFromInventory.availableQty -= shortfall;
        const lossLog = createLog(
          next.id,
          'received_with_issue',
          'stock_loss',
          receivedBy,
          `${shortfall} ${item.uom} lost or damaged for ${item.productName}`,
          {
            productId: item.productId,
            shortfall,
          },
        );
        next.logs = [lossLog, ...next.logs];
      }
    }

    next.status = hasIssue ? 'received_with_issue' : 'received';

    const logged = registerLog(
      next,
      createLog(
        next.id,
        next.status,
        'received',
        receivedBy,
        `Transfer received by ${receivedBy} with status ${TRANSFER_STOCK_STATUS_LABEL[next.status]}`,
      ),
    );

    return updateRecord(logged);
  };

  const transferStock_closeTransfer = async ({
    transferId,
    closedBy,
    notes,
  }: ITransferStockClosePayload): Promise<ITransferStock> => {
    const transfer = transferStock_records.value.find(item => item.id === transferId);
    if (!transfer) {
      const error: ITransferStockError = new Error('Transfer not found');
      error.code = 'TRANSFER_NOT_FOUND';
      throw error;
    }

    if (!['received', 'received_with_issue'].includes(transfer.status)) {
      const error: ITransferStockError = new Error('Only received transfers can be closed');
      error.code = 'INVALID_STATUS';
      throw error;
    }

    const next = clone(transfer);
    next.status = 'closed';
    next.notes = notes ?? transfer.notes;

    const logged = registerLog(
      next,
      createLog(next.id, next.status, 'closed', closedBy, `Transfer closed by ${closedBy}`, { notes }),
    );

    return updateRecord(logged);
  };

  return {
    transferStock_isLoading,
    transferStock_list,
    transferStock_selected,
    transferStock_stores,
    transferStock_initialize,
    transferStock_selectTransfer,
    transferStock_createTransfer,
    transferStock_approveTransfer,
    transferStock_cancelApproval,
    transferStock_shipTransfer,
    transferStock_receiveTransfer,
    transferStock_closeTransfer,
  };
});
