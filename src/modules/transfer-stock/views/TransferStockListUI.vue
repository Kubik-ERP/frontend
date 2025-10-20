<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { useTransferStockService } from '../services/useTransferStock.service';
import { TRANSFER_STOCK_STATUS_BADGE } from '../constants';
import type { ITransferStockItem } from '../interfaces';
import eventBus from '@/plugins/mitt';
import { EToastPosition, EToastType } from '@/app/constants/toast.constant';
import { useAuthenticationStore } from '@/modules/authentication/store';

const authenticationStore = useAuthenticationStore();
const { authentication_userData } = storeToRefs(authenticationStore);

const currentActorName = computed(() => authentication_userData.value?.name ?? 'Current User');

const {
  transferStock_isLoading,
  transferStock_list,
  transferStock_selected,
  transferStock_stores,
  transferStock_selectTransfer,
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
} = useTransferStockService();

const statusClasses = {
  draft: 'bg-slate-100 text-slate-700 border border-slate-200',
  approved: 'bg-blue-100 text-blue-700 border border-blue-200',
  shipped: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  received: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  received_with_issue: 'bg-amber-100 text-amber-700 border border-amber-200',
  closed: 'bg-green-100 text-green-700 border border-green-200',
};

watch(
  transferStock_list,
  list => {
    if (list.length && !transferStock_selected.value) {
      transferStock_selectTransfer(list[0].id);
    }
  },
  { immediate: true },
);

const selectedTransfer = computed(() => transferStock_selected.value);
const selectedTransferSummary = computed(() =>
  transferStock_list.value.find(item => item.id === selectedTransfer.value?.id) ?? null,
);

// const selectedStoreFrom = computed(() => {
//   if (!selectedTransfer.value) return null;
//   return transferStock_stores.value.find(store => store.id === selectedTransfer.value?.storeFromId) ?? null;
// });

const selectedStoreTo = computed(() => {
  if (!selectedTransfer.value) return null;
  return transferStock_stores.value.find(store => store.id === selectedTransfer.value?.storeToId) ?? null;
});

const selectedAssortmentWarnings = computed(() => {
  if (!selectedTransfer.value || !selectedStoreTo.value) return [];
  return selectedTransfer.value.items
    .filter(item => !selectedStoreTo.value?.inventory[item.productId])
    .map(item => item.productName);
});

const showToast = (type: EToastType, message: string) => {
  eventBus.emit('AppBaseToast', {
    isOpen: true,
    type,
    message,
    position: EToastPosition.TOP_RIGHT,
  });
};

const createForm = reactive({
  storeFromId: '',
  storeToId: '',
  requestedBy: currentActorName.value,
  approvalRequired: true,
  notes: '' as string | null,
  items: [] as Array<{
    productId: string;
    productCode: string;
    productName: string;
    uom: string;
    qtyRequested: number;
    unitPrice: number | null;
  }>,
});

const createItemDraft = reactive({
  productId: '' as string,
  qtyRequested: 0,
  unitPrice: null as number | null,
});

const createFormError = ref<string | null>(null);
const createFormShortfalls = ref<Array<{ productName: string; requestedQty: number; availableQty: number }>>([]);
const createFormIsSubmitting = ref(false);

watch(
  () => currentActorName.value,
  value => {
    if (!createForm.requestedBy) {
      createForm.requestedBy = value;
    }
  },
);

watch(
  () => createForm.storeFromId,
  () => {
    createForm.items.splice(0, createForm.items.length);
    createItemDraft.productId = '';
    createItemDraft.qtyRequested = 0;
    createItemDraft.unitPrice = null;
  },
);

const storeFromOptions = computed(() =>
  transferStock_stores.value.map(store => ({
    label: `${store.name} (${store.code})`,
    value: store.id,
  })),
);

const storeToOptions = computed(() =>
  transferStock_stores.value
    .filter(store => store.id !== createForm.storeFromId)
    .map(store => ({
      label: `${store.name} (${store.code})`,
      value: store.id,
    })),
);

const productOptions = computed(() => {
  if (!createForm.storeFromId) return [];
  const store = transferStock_stores.value.find(item => item.id === createForm.storeFromId);
  if (!store) return [];
  return Object.values(store.inventory).map(record => ({
    label: `${record.productName} [${record.productCode}] - Available: ${record.availableQty}`,
    value: record.productId,
    productCode: record.productCode,
    productName: record.productName,
    uom: record.uom,
  }));
});

const selectedDraftProduct = computed(() =>
  productOptions.value.find(option => option.value === createItemDraft.productId) ?? null,
);

const addItemToCreateForm = () => {
  if (!selectedDraftProduct.value || createItemDraft.qtyRequested <= 0) {
    return;
  }

  const existingItem = createForm.items.find(item => item.productId === selectedDraftProduct.value?.value);

  if (existingItem) {
    existingItem.qtyRequested += createItemDraft.qtyRequested;
    existingItem.unitPrice = createItemDraft.unitPrice;
  } else {
    createForm.items.push({
      productId: selectedDraftProduct.value.value,
      productCode: selectedDraftProduct.value.productCode,
      productName: selectedDraftProduct.value.productName,
      uom: selectedDraftProduct.value.uom,
      qtyRequested: createItemDraft.qtyRequested,
      unitPrice: createItemDraft.unitPrice,
    });
  }

  createItemDraft.productId = '';
  createItemDraft.qtyRequested = 0;
  createItemDraft.unitPrice = null;
};

const removeItemFromCreateForm = (productId: string) => {
  const index = createForm.items.findIndex(item => item.productId === productId);
  if (index !== -1) {
    createForm.items.splice(index, 1);
  }
};

const resetCreateForm = () => {
  createForm.storeFromId = '';
  createForm.storeToId = '';
  createForm.requestedBy = currentActorName.value;
  createForm.approvalRequired = true;
  createForm.notes = '';
  createForm.items.splice(0, createForm.items.length);
  createItemDraft.productId = '';
  createItemDraft.qtyRequested = 0;
  createItemDraft.unitPrice = null;
  createFormError.value = null;
  createFormShortfalls.value = [];
};

const handleSubmitCreate = async () => {
  createFormError.value = null;
  createFormShortfalls.value = [];

  if (!createForm.storeFromId || !createForm.storeToId) {
    createFormError.value = 'Please select both source and destination stores.';
    return;
  }

  if (!createForm.requestedBy) {
    createFormError.value = 'Requested by is required.';
    return;
  }

  if (!createForm.items.length) {
    createFormError.value = 'Please add at least one item.';
    return;
  }

  createFormIsSubmitting.value = true;

  try {
    await createTransfer({
      storeFromId: createForm.storeFromId,
      storeToId: createForm.storeToId,
      requestedBy: createForm.requestedBy,
      approvalRequired: createForm.approvalRequired,
      notes: createForm.notes && createForm.notes.trim().length ? createForm.notes : null,
      items: createForm.items.map(item => ({
        productId: item.productId,
        productCode: item.productCode,
        productName: item.productName,
        uom: item.uom,
        qtyRequested: item.qtyRequested,
        unitPrice: item.unitPrice,
      })),
    });
    resetCreateForm();
    closeCreateDialog();
    showToast(EToastType.SUCCESS, 'Transfer draft created successfully.');
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string; details?: Array<{ productId: string; productName: string; requestedQty: number; availableQty: number }> };
    if (err?.code === 'STOCK_SHORTFALL' && Array.isArray(err.details)) {
      createFormError.value =
        'Insufficient stock in the source store. Please adjust quantities or remove the items below.';
      createFormShortfalls.value = err.details.map(detail => ({
        productName: detail.productName,
        requestedQty: detail.requestedQty,
        availableQty: detail.availableQty,
      }));
    } else {
      showToast(EToastType.DANGER, err?.message ?? 'Unable to create transfer. Please try again.');
    }
  } finally {
    createFormIsSubmitting.value = false;
  }
};

const handleApprove = async (transferId: string) => {
  try {
    await approveTransfer({
      transferId,
      approvedBy: currentActorName.value,
    });
    showToast(EToastType.SUCCESS, 'Transfer approved and stock reserved.');
  } catch (error: unknown) {
    const err = error as Error;
    showToast(EToastType.DANGER, err.message ?? 'Unable to approve transfer.');
  }
};

const handleCancelApproval = async (transferId: string) => {
  try {
    await cancelApproval(transferId, currentActorName.value);
    showToast(EToastType.SUCCESS, 'Approval cancelled and reservation released.');
  } catch (error: unknown) {
    const err = error as Error;
    showToast(EToastType.DANGER, err.message ?? 'Unable to cancel approval.');
  }
};

const shipmentForm = reactive({
  shippedBy: currentActorName.value,
  shippedAt: new Date(),
  logisticProvider: '',
  trackingNumber: '',
  deliveryNote: '',
  qtyShipped: [] as Array<{ itemId: string; qtyShipped: number }>,
});

const shipmentFormError = ref<string | null>(null);
const shipmentFormIsSubmitting = ref(false);

watch(
  [isShipmentDialogOpen, pendingActionTransferId],
  ([isOpen]) => {
    if (!isOpen) {
      shipmentForm.shippedBy = currentActorName.value;
      shipmentForm.shippedAt = new Date();
      shipmentForm.logisticProvider = '';
      shipmentForm.trackingNumber = '';
      shipmentForm.deliveryNote = '';
      shipmentForm.qtyShipped.splice(0, shipmentForm.qtyShipped.length);
      shipmentFormError.value = null;
      return;
    }

    const transfer = transferStock_list.value.find(item => item.id === pendingActionTransferId.value);
    if (!transfer) return;

    const record = transferStock_selected.value?.id === transfer.id ? transferStock_selected.value : transfer;
    shipmentForm.shippedBy = currentActorName.value;
    shipmentForm.shippedAt = new Date();
    shipmentForm.qtyShipped = (record?.items ?? []).map(item => ({
      itemId: item.id,
      qtyShipped: item.qtyApproved || item.qtyRequested,
    }));
  },
  { immediate: true },
);

const handleShipTransfer = async () => {
  if (!pendingActionTransferId.value) return;

  if (!shipmentForm.shippedBy) {
    shipmentFormError.value = 'Shipped by is required.';
    return;
  }

  shipmentFormIsSubmitting.value = true;
  shipmentFormError.value = null;

  try {
    await shipTransfer({
      transferId: pendingActionTransferId.value,
      shippedBy: shipmentForm.shippedBy,
      shippedAt: (shipmentForm.shippedAt instanceof Date ? shipmentForm.shippedAt : new Date(shipmentForm.shippedAt)).toISOString(),
      logisticProvider: shipmentForm.logisticProvider || null,
      trackingNumber: shipmentForm.trackingNumber || null,
      deliveryNote: shipmentForm.deliveryNote || null,
      qtyShipped: shipmentForm.qtyShipped,
    });
    showToast(EToastType.SUCCESS, 'Shipment created successfully.');
  } catch (error: unknown) {
    const err = error as Error & { code?: string };
    shipmentFormError.value = err.message ?? 'Unable to ship transfer.';
  } finally {
    shipmentFormIsSubmitting.value = false;
  }
};

const receiveForm = reactive({
  receivedBy: currentActorName.value,
  receivedAt: new Date(),
  items: [] as Array<{ itemId: string; qtyReceived: number; issueNotes: string | null }>,
});

const receiveFormError = ref<string | null>(null);
const receiveFormIsSubmitting = ref(false);

watch(
  [isReceiveDialogOpen, pendingActionTransferId],
  ([isOpen]) => {
    if (!isOpen) {
      receiveForm.receivedBy = currentActorName.value;
      receiveForm.receivedAt = new Date();
      receiveForm.items.splice(0, receiveForm.items.length);
      receiveFormError.value = null;
      return;
    }

    const transfer = transferStock_list.value.find(item => item.id === pendingActionTransferId.value);
    if (!transfer) return;

    const record = transferStock_selected.value?.id === transfer.id ? transferStock_selected.value : transfer;
    receiveForm.receivedBy = currentActorName.value;
    receiveForm.receivedAt = new Date();
    receiveForm.items = (record?.items ?? []).map(item => ({
      itemId: item.id,
      qtyReceived: item.qtyShipped,
      issueNotes: null,
    }));
  },
  { immediate: true },
);

const handleReceiveTransfer = async () => {
  if (!pendingActionTransferId.value) return;

  if (!receiveForm.receivedBy) {
    receiveFormError.value = 'Received by is required.';
    return;
  }

  receiveFormIsSubmitting.value = true;
  receiveFormError.value = null;

  try {
    await receiveTransfer({
      transferId: pendingActionTransferId.value,
      receivedBy: receiveForm.receivedBy,
      receivedAt: (receiveForm.receivedAt instanceof Date ? receiveForm.receivedAt : new Date(receiveForm.receivedAt)).toISOString(),
      items: receiveForm.items,
    });
    showToast(EToastType.SUCCESS, 'Transfer received successfully.');
  } catch (error: unknown) {
    const err = error as Error;
    receiveFormError.value = err.message ?? 'Unable to receive transfer.';
  } finally {
    receiveFormIsSubmitting.value = false;
  }
};

const closeForm = reactive({
  notes: '',
});

const handleCloseTransfer = async () => {
  if (!pendingActionTransferId.value) return;

  try {
    await closeTransfer({
      transferId: pendingActionTransferId.value,
      closedBy: currentActorName.value,
      notes: closeForm.notes || null,
    });
    showToast(EToastType.SUCCESS, 'Transfer closed.');
    closeForm.notes = '';
  } catch (error: unknown) {
    const err = error as Error;
    showToast(EToastType.DANGER, err.message ?? 'Unable to close transfer.');
  }
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  try {
    const date = new Date(value);
    return date.toLocaleString();
  } catch {
    return value;
  }
};

const formatCurrency = (value: number | null | undefined) => {
  if (!value) return useCurrencyFormat({ data: 0 });
  return useCurrencyFormat({ data: value });
};

const getItemShortfallClass = (item: ITransferStockItem) => {
  if (item.shortfallQty > 0 || (item.issueNotes && item.issueNotes.length)) {
    return 'bg-amber-50 border-amber-200';
  }
  return '';
};

const canApprove = computed(
  () => selectedTransfer.value?.status === 'draft' && selectedTransfer.value.approvalRequired,
);
const canCancelApproval = computed(() => selectedTransfer.value?.status === 'approved');
const canShip = computed(() => ['draft', 'approved'].includes(selectedTransfer.value?.status ?? ''));
const canReceive = computed(() => selectedTransfer.value?.status === 'shipped');
const canClose = computed(() =>
  ['received', 'received_with_issue'].includes(selectedTransfer.value?.status ?? ''),
);

const handleSelectTransfer = (payload: { id?: string } | null) => {
  transferStock_selectTransfer(payload?.id ?? null);
};
</script>

<template>
  <section id="transfer-stock-module" class="flex flex-col gap-6">
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-text-primary">{{ useLocalization('transferStock.title') }}</h1>
        <p class="text-sm text-text-secondary max-w-2xl">
          Manage inter-store stock transfers, approvals, shipments, and receiving based on the Stock Transfer SOP.
        </p>
      </div>
      <PrimeVueButton
        class="px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:bg-primary-600 transition"
        icon="pi pi-plus"
        label="Initiate Transfer"
        @click="
          resetCreateForm();
          openCreateDialog();
        "
      />
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl border border-grayscale-10 shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-grayscale-10 flex items-center justify-between">
          <h2 class="text-base font-semibold">Transfer Requests</h2>
          <PrimeVueButton
            icon="pi pi-refresh"
            size="small"
            variant="text"
            :loading="transferStock_isLoading"
            :disabled="transferStock_isLoading"
            @click="() => {}"
          />
        </div>

        <PrimeVueDataTable
          :value="transferStock_list"
          data-key="id"
          selection-mode="single"
          :selection="selectedTransferSummary"
          :loading="transferStock_isLoading"
          table-class="min-w-full"
          scrollable
          scroll-height="72vh"
          @update:selection="handleSelectTransfer($event as { id?: string } | null)"
        >
          <PrimeVueColumn field="referenceNumber" header="Reference">
            <template #body="{ data }">
              <div class="flex flex-col gap-1">
                <span class="font-semibold text-sm text-text-primary">{{ data.referenceNumber }}</span>
                <span class="text-xs text-text-secondary">Created {{ formatDateTime(data.createdAt) }}</span>
              </div>
            </template>
          </PrimeVueColumn>

          <PrimeVueColumn header="Stores">
            <template #body="{ data }">
              <div class="flex flex-col text-sm">
                <span class="font-medium text-text-primary">{{ data.storeFromName }}</span>
                <span class="pi pi-arrow-down text-xs text-text-disabled" />
                <span class="font-medium text-text-primary">{{ data.storeToName }}</span>
              </div>
            </template>
          </PrimeVueColumn>

          <PrimeVueColumn field="status" header="Status">
            <template #body="{ data }">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border"
                :class="statusClasses[data.status]"
              >
                {{ TRANSFER_STOCK_STATUS_BADGE[data.status].text }}
              </span>
            </template>
          </PrimeVueColumn>

          <PrimeVueColumn header="Summary">
            <template #body="{ data }">
              <div class="flex flex-col text-xs text-text-secondary">
                <span>Total Items: {{ data.totalItems }}</span>
                <span>Total Qty: {{ data.totalQty }}</span>
                <span>Total Value: {{ formatCurrency(data.totalValue) }}</span>
              </div>
            </template>
          </PrimeVueColumn>
        </PrimeVueDataTable>
      </div>

      <div class="xl:col-span-2 flex flex-col gap-4">
        <section v-if="selectedTransfer" class="bg-white rounded-xl border border-grayscale-10 shadow-sm">
          <header class="border-b border-grayscale-10 px-6 py-4 flex flex-wrap gap-3 justify-between items-start">
            <div>
              <h2 class="text-xl font-semibold text-text-primary">
                {{ selectedTransfer.referenceNumber }}
              </h2>
              <p class="text-sm text-text-secondary">
                Drafted by {{ selectedTransfer.requestedBy }} · {{ formatDateTime(selectedTransfer.createdAt) }}
              </p>
              <p v-if="selectedTransfer.notes" class="text-sm text-text-secondary mt-2">
                Notes: {{ selectedTransfer.notes }}
              </p>
              <div v-if="selectedAssortmentWarnings.length" class="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p class="text-xs text-amber-700 font-semibold mb-1">Assortment Warning</p>
                <p class="text-xs text-amber-700">
                  Destination store currently does not have:
                  {{ selectedAssortmentWarnings.join(', ') }}. Items will be created automatically during shipment.
                </p>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border self-start"
                :class="statusClasses[selectedTransfer.status]"
              >
                {{ TRANSFER_STOCK_STATUS_BADGE[selectedTransfer.status].text }}
              </span>
              <div class="flex flex-wrap gap-2">
                <PrimeVueButton
                  label="Approve"
                  size="small"
                  icon="pi pi-check-circle"
                  class="bg-emerald-600 border-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-200 disabled:border-emerald-200"
                  :disabled="!canApprove"
                  @click="handleApprove(selectedTransfer.id)"
                />
                <PrimeVueButton
                  label="Cancel Approval"
                  size="small"
                  icon="pi pi-undo"
                  variant="outlined"
                  :disabled="!canCancelApproval"
                  @click="handleCancelApproval(selectedTransfer.id)"
                />
                <PrimeVueButton
                  label="Ship"
                  size="small"
                  icon="pi pi-send"
                  class="bg-primary border-primary hover:bg-primary-600 disabled:bg-gray-200 disabled:border-gray-200"
                  :disabled="!canShip"
                  @click="openShipmentDialog(selectedTransfer.id)"
                />
                <PrimeVueButton
                  label="Receive"
                  size="small"
                  icon="pi pi-inbox"
                  class="bg-indigo-600 border-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 disabled:border-indigo-200"
                  :disabled="!canReceive"
                  @click="openReceiveDialog(selectedTransfer.id)"
                />
                <PrimeVueButton
                  label="Close"
                  size="small"
                  icon="pi pi-lock"
                  variant="outlined"
                  :disabled="!canClose"
                  @click="openCloseDialog(selectedTransfer.id)"
                />
              </div>
            </div>
          </header>

          <div class="px-6 py-4 grid grid-cols-1 lg:grid-cols-2 gap-6 border-b border-grayscale-10">
            <div>
              <h3 class="text-sm font-semibold text-text-secondary uppercase mb-3">Shipment Information</h3>
              <dl class="text-sm text-text-primary space-y-2">
                <div>
                  <dt class="font-medium">Logistic Provider</dt>
                  <dd class="text-text-secondary">{{ selectedTransfer.logisticProvider ?? '-' }}</dd>
                </div>
                <div>
                  <dt class="font-medium">Tracking Number</dt>
                  <dd class="text-text-secondary">{{ selectedTransfer.trackingNumber ?? '-' }}</dd>
                </div>
                <div>
                  <dt class="font-medium">Delivery Note</dt>
                  <dd class="text-text-secondary">{{ selectedTransfer.deliveryNote ?? '-' }}</dd>
                </div>
                <div>
                  <dt class="font-medium">Shipped By</dt>
                  <dd class="text-text-secondary">{{ selectedTransfer.shippedBy ?? '-' }}</dd>
                </div>
                <div>
                  <dt class="font-medium">Shipped At</dt>
                  <dd class="text-text-secondary">{{ formatDateTime(selectedTransfer.shippedAt) }}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-text-secondary uppercase mb-3">Receiving Information</h3>
              <dl class="text-sm text-text-primary space-y-2">
                <div>
                  <dt class="font-medium">Received By</dt>
                  <dd class="text-text-secondary">{{ selectedTransfer.receivedBy ?? '-' }}</dd>
                </div>
                <div>
                  <dt class="font-medium">Received At</dt>
                  <dd class="text-text-secondary">{{ formatDateTime(selectedTransfer.receivedAt) }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <section class="px-6 py-4">
            <h3 class="text-sm font-semibold text-text-secondary uppercase mb-3">Transfer Items</h3>
            <div class="overflow-x-auto border border-grayscale-10 rounded-xl">
              <table class="min-w-full divide-y divide-grayscale-10">
                <thead class="bg-grayscale-5">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Item</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Requested</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Approved</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Shipped</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Received</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Shortfall</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Unit Price</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Value</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-grayscale-10">
                  <tr
                    v-for="item in selectedTransfer.items"
                    :key="item.id"
                    :class="['bg-white', getItemShortfallClass(item)]"
                  >
                    <td class="px-4 py-3">
                      <div class="flex flex-col">
                        <span class="text-sm font-semibold text-text-primary">{{ item.productName }}</span>
                        <span class="text-xs text-text-secondary">{{ item.productCode }} · {{ item.uom }}</span>
                        <span v-if="item.issueNotes" class="text-xs text-amber-700 mt-1">
                          Issue: {{ item.issueNotes }}
                        </span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm text-text-secondary">{{ item.qtyRequested }}</td>
                    <td class="px-4 py-3 text-sm text-text-secondary">{{ item.qtyApproved || '-' }}</td>
                    <td class="px-4 py-3 text-sm text-text-secondary">{{ item.qtyShipped || '-' }}</td>
                    <td class="px-4 py-3 text-sm text-text-secondary">{{ item.qtyReceived || '-' }}</td>
                    <td class="px-4 py-3 text-sm text-text-secondary">
                      <span v-if="item.shortfallQty > 0" class="text-amber-700 font-semibold">
                        {{ item.shortfallQty }}
                      </span>
                      <span v-else>-</span>
                    </td>
                    <td class="px-4 py-3 text-sm text-text-secondary">
                      {{ item.unitPrice ? formatCurrency(item.unitPrice) : '-' }}
                    </td>
                    <td class="px-4 py-3 text-sm text-text-secondary">
                      {{ item.unitPrice ? formatCurrency((item.unitPrice ?? 0) * item.qtyRequested) : '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="px-6 py-4 border-t border-grayscale-10">
            <h3 class="text-sm font-semibold text-text-secondary uppercase mb-3">Audit Trail</h3>
            <div class="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2">
              <div
                v-for="log in selectedTransfer.logs"
                :key="log.id"
                class="border border-grayscale-10 rounded-lg px-4 py-3 bg-white shadow-sm"
              >
                <div class="flex justify-between items-center text-sm">
                  <span class="font-medium text-text-primary capitalize">{{ log.action.replace(/_/g, ' ') }}</span>
                  <span class="text-xs text-text-secondary">{{ formatDateTime(log.createdAt) }}</span>
                </div>
                <p class="text-sm text-text-secondary mt-1">{{ log.message }}</p>
                <p class="text-xs text-text-disabled mt-1">By {{ log.actor }}</p>
              </div>
            </div>
          </section>
        </section>

        <section v-else class="flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-grayscale-20 py-12 gap-3">
          <AppBaseSvg name="box" class="!w-10 !h-10 text-grayscale-30" />
          <p class="text-sm text-text-secondary text-center max-w-sm">
            No transfer selected. Choose a transfer from the left panel or create a new one to get started.
          </p>
          <PrimeVueButton label="Initiate Transfer" icon="pi pi-plus" @click="openCreateDialog" />
        </section>
      </div>
    </div>

    <PrimeVueDialog
      modal
      :visible="isCreateDialogOpen"
      header="Initiate Transfer Stock"
      class="max-w-3xl w-full"
      @update:visible="closeCreateDialog"
    >
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmitCreate">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Store From (A)</label>
            <PrimeVueDropdown
              v-model="createForm.storeFromId"
              :options="storeFromOptions"
              placeholder="Select source store"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Store To (B)</label>
            <PrimeVueDropdown
              v-model="createForm.storeToId"
              :options="storeToOptions"
              placeholder="Select destination store"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Requested By</label>
            <PrimeVueInputText v-model="createForm.requestedBy" placeholder="Requester name" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Approval Required?</label>
            <PrimeVueToggleButton
              v-model="createForm.approvalRequired"
              on-label="Yes"
              off-label="No"
              :on-icon="'pi pi-check'"
              :off-icon="'pi pi-times'"
            />
          </div>
          <div class="md:col-span-2 flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Notes</label>
            <PrimeVueTextarea v-model="createForm.notes" rows="2" auto-resize placeholder="Optional notes" />
          </div>
        </div>

        <section class="border border-dashed border-grayscale-20 rounded-lg p-4 flex flex-col gap-3">
          <h4 class="text-sm font-semibold text-text-primary uppercase">Items</h4>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <PrimeVueDropdown
              v-model="createItemDraft.productId"
              :options="productOptions"
              option-label="label"
              option-value="value"
              placeholder="Select product"
              class="md:col-span-2"
              :disabled="!createForm.storeFromId"
            />
            <PrimeVueInputNumber
              v-model="createItemDraft.qtyRequested"
              input-class="w-full"
              placeholder="Qty"
              :min="0"
            />
            <PrimeVueInputNumber
              v-model="createItemDraft.unitPrice"
              input-class="w-full"
              placeholder="Unit Price"
              mode="currency"
              currency="IDR"
            />
          </div>
          <div class="flex justify-end">
            <PrimeVueButton
              type="button"
              icon="pi pi-plus"
              label="Add Item"
              size="small"
              class="bg-primary border-primary hover:bg-primary-600"
              :disabled="!selectedDraftProduct || createItemDraft.qtyRequested <= 0"
              @click="addItemToCreateForm"
            />
          </div>

          <div v-if="createForm.items.length" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-grayscale-10">
              <thead class="bg-grayscale-5">
                <tr>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-text-secondary uppercase">Product</th>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-text-secondary uppercase">Qty</th>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-text-secondary uppercase">Unit Price</th>
                  <th class="px-3 py-2" />
                </tr>
              </thead>
              <tbody class="divide-y divide-grayscale-10 bg-white">
                <tr v-for="item in createForm.items" :key="item.productId">
                  <td class="px-3 py-2">
                    <div class="flex flex-col">
                      <span class="text-sm font-semibold text-text-primary">{{ item.productName }}</span>
                      <span class="text-xs text-text-secondary">{{ item.productCode }}</span>
                    </div>
                  </td>
                  <td class="px-3 py-2 text-sm text-text-secondary">{{ item.qtyRequested }}</td>
                  <td class="px-3 py-2 text-sm text-text-secondary">
                    {{ item.unitPrice ? formatCurrency(item.unitPrice) : '-' }}
                  </td>
                  <td class="px-3 py-2 text-right">
                    <PrimeVueButton
                      icon="pi pi-trash"
                      variant="text"
                      severity="danger"
                      @click="removeItemFromCreateForm(item.productId)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-xs text-text-secondary">
            Select a product above and add it to the transfer list.
          </p>
        </section>

        <PrimeVueMessage
          v-if="createFormError"
          severity="error"
          class="text-sm"
        >
          {{ createFormError }}
        </PrimeVueMessage>

        <div v-if="createFormShortfalls.length" class="border border-amber-200 bg-amber-50 rounded-lg p-3 text-sm">
          <p class="text-amber-700 font-semibold mb-2">Shortfall Details</p>
          <ul class="list-disc list-inside text-amber-700 space-y-1">
            <li v-for="shortfall in createFormShortfalls" :key="shortfall.productName">
              {{ shortfall.productName }} · Requested {{ shortfall.requestedQty }} · Available {{ shortfall.availableQty }}
            </li>
          </ul>
        </div>

        <footer class="flex justify-end gap-2 pt-2">
          <PrimeVueButton type="button" variant="outlined" label="Cancel" @click="closeCreateDialog" />
          <PrimeVueButton
            type="submit"
            label="Create Draft"
            class="bg-primary border-primary hover:bg-primary-600"
            :loading="createFormIsSubmitting"
          />
        </footer>
      </form>
    </PrimeVueDialog>

    <PrimeVueDialog
      modal
      :visible="isShipmentDialogOpen"
      header="Shipment Details"
      class="max-w-2xl w-full"
      @update:visible="closeShipmentDialog"
    >
      <form class="flex flex-col gap-4" @submit.prevent="handleShipTransfer">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Shipped By</label>
            <PrimeVueInputText v-model="shipmentForm.shippedBy" placeholder="Shipped by" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Shipped At</label>
            <PrimeVueCalendar
              v-model="shipmentForm.shippedAt"
              show-time
              hour-format="24"
              date-format="yy-mm-dd"
              show-icon
              icon-display="input"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Logistic Provider</label>
            <PrimeVueInputText v-model="shipmentForm.logisticProvider" placeholder="Logistic provider" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Tracking Number</label>
            <PrimeVueInputText v-model="shipmentForm.trackingNumber" placeholder="Tracking number" />
          </div>
          <div class="md:col-span-2 flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Delivery Note</label>
            <PrimeVueTextarea v-model="shipmentForm.deliveryNote" rows="2" auto-resize placeholder="Optional note" />
          </div>
        </div>

        <div class="border border-dashed border-grayscale-20 rounded-lg p-3 flex flex-col gap-3">
          <h4 class="text-sm font-semibold text-text-primary uppercase">Qty to Ship</h4>
          <div class="flex flex-col gap-2">
            <div
              v-for="item in shipmentForm.qtyShipped"
              :key="item.itemId"
              class="flex items-center justify-between gap-3 border border-grayscale-10 rounded-lg px-3 py-2 bg-white"
            >
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-text-primary">
                  {{
                    selectedTransfer?.items.find(transferItem => transferItem.id === item.itemId)?.productName ?? 'Item'
                  }}
                </span>
                <span class="text-xs text-text-secondary">
                  Requested {{ selectedTransfer?.items.find(transferItem => transferItem.id === item.itemId)?.qtyRequested }}
                  · Approved {{ selectedTransfer?.items.find(transferItem => transferItem.id === item.itemId)?.qtyApproved || '-' }}
                </span>
              </div>
              <PrimeVueInputNumber
                v-model="item.qtyShipped"
                :min="0"
                :max="
                  selectedTransfer?.items.find(transferItem => transferItem.id === item.itemId)?.qtyApproved ||
                  selectedTransfer?.items.find(transferItem => transferItem.id === item.itemId)?.qtyRequested ||
                  0
                "
              />
            </div>
          </div>
        </div>

        <PrimeVueMessage v-if="shipmentFormError" severity="error" class="text-sm">
          {{ shipmentFormError }}
        </PrimeVueMessage>

        <footer class="flex justify-end gap-2">
          <PrimeVueButton type="button" variant="outlined" label="Cancel" @click="closeShipmentDialog" />
          <PrimeVueButton
            type="submit"
            label="Confirm Shipment"
            class="bg-primary border-primary hover:bg-primary-600"
            :loading="shipmentFormIsSubmitting"
          />
        </footer>
      </form>
    </PrimeVueDialog>

    <PrimeVueDialog
      modal
      :visible="isReceiveDialogOpen"
      header="Receive Transfer"
      class="max-w-2xl w-full"
      @update:visible="closeReceiveDialog"
    >
      <form class="flex flex-col gap-4" @submit.prevent="handleReceiveTransfer">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Received By</label>
            <PrimeVueInputText v-model="receiveForm.receivedBy" placeholder="Receiver name" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Received At</label>
            <PrimeVueCalendar
              v-model="receiveForm.receivedAt"
              show-time
              hour-format="24"
              date-format="yy-mm-dd"
              show-icon
              icon-display="input"
            />
          </div>
        </div>

        <div class="border border-dashed border-grayscale-20 rounded-lg p-3 flex flex-col gap-3">
          <h4 class="text-sm font-semibold text-text-primary uppercase">Qty Received</h4>
          <div class="flex flex-col gap-2">
            <div
              v-for="item in receiveForm.items"
              :key="item.itemId"
              class="flex flex-col gap-2 border border-grayscale-10 rounded-lg px-3 py-2 bg-white"
            >
              <div class="flex justify-between items-start gap-3">
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-text-primary">
                    {{
                      selectedTransfer?.items.find(transferItem => transferItem.id === item.itemId)?.productName ??
                      'Item'
                    }}
                  </span>
                  <span class="text-xs text-text-secondary">
                    Shipped
                    {{
                      selectedTransfer?.items.find(transferItem => transferItem.id === item.itemId)?.qtyShipped || 0
                    }}
                    · Requested
                    {{
                      selectedTransfer?.items.find(transferItem => transferItem.id === item.itemId)?.qtyRequested || 0
                    }}
                  </span>
                </div>
                <PrimeVueInputNumber
                  v-model="item.qtyReceived"
                  :min="0"
                  :max="selectedTransfer?.items.find(transferItem => transferItem.id === item.itemId)?.qtyShipped || 0"
                />
              </div>
              <PrimeVueTextarea
                v-model="item.issueNotes"
                rows="2"
                auto-resize
                placeholder="Issue notes (optional)"
              />
            </div>
          </div>
        </div>

        <PrimeVueMessage v-if="receiveFormError" severity="error" class="text-sm">
          {{ receiveFormError }}
        </PrimeVueMessage>

        <footer class="flex justify-end gap-2">
          <PrimeVueButton type="button" variant="outlined" label="Cancel" @click="closeReceiveDialog" />
          <PrimeVueButton
            type="submit"
            label="Confirm Receipt"
            class="bg-primary border-primary hover:bg-primary-600"
            :loading="receiveFormIsSubmitting"
          />
        </footer>
      </form>
    </PrimeVueDialog>

    <PrimeVueDialog
      modal
      :visible="isCloseDialogOpen"
      header="Close Transfer"
      class="max-w-lg w-full"
      @update:visible="closeCloseDialog"
    >
      <form class="flex flex-col gap-4" @submit.prevent="handleCloseTransfer">
        <p class="text-sm text-text-secondary">
          Closing the transfer will mark it as complete. Ensure all discrepancies have been resolved and documented.
        </p>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-text-primary">Closing Notes</label>
          <PrimeVueTextarea v-model="closeForm.notes" rows="3" auto-resize placeholder="Optional notes" />
        </div>
        <footer class="flex justify-end gap-2 pt-2">
          <PrimeVueButton type="button" variant="outlined" label="Cancel" @click="closeCloseDialog" />
          <PrimeVueButton type="submit" label="Close Transfer" class="bg-primary border-primary hover:bg-primary-600" />
        </footer>
      </form>
    </PrimeVueDialog>
  </section>
</template>
