<script setup lang="ts">
import { computed } from 'vue';

import { TRANSFER_STOCK_STATUS_BADGE } from '../constants';
import type { ITransferStockRecord } from '../interfaces';
import { useTransferStockService } from '../services/useTransferStock.service';

const {
  transferStock_isLoading,
  transferStock_isSubmitting,
  inventoryItems_isLoading,
  activeTab,
  setActiveTab,
  displayedList,
  displayedMeta,
  displayedQuery,
  selectedRecord,
  selectRecord,
  refreshActiveList,
  handleTablePage,
  isCreateTransferDialogOpen,
  isCreateRequestDialogOpen,
  openCreateTransferDialog,
  closeCreateTransferDialog,
  openCreateRequestDialog,
  closeCreateRequestDialog,
  transferForm,
  requestForm,
  transferItemSelector,
  requestItemSelector,
  storeOptions,
  currentStoreName,
  inventoryItemOptions,
  resolveStoreName,
  outlet_isLoading,
  handleTransferAddItem,
  handleTransferRemoveItem,
  handleRequestAddItem,
  handleRequestRemoveItem,
  refreshTransferItemOptions,
  refreshRequestItemOptions,
  submitTransferForm,
  submitRequestForm,
} = useTransferStockService();

const isTransferTabActive = computed(() => activeTab.value === 'transfer');
const isRequestTabActive = computed(() => activeTab.value === 'request');

const dataTableRows = computed(() => displayedQuery.value.pageSize ?? 10);
const dataTableFirst = computed(() => ((displayedQuery.value.page ?? 1) - 1) * (displayedQuery.value.pageSize ?? 10));

const detailStatusBadge = computed(() => {
  if (!selectedRecord.value) return null;
  return TRANSFER_STOCK_STATUS_BADGE[selectedRecord.value.status];
});

const itemDropdownOptions = computed(() =>
  inventoryItemOptions.value.map(option => ({
    label: `${option.name} (${option.sku}) · Stock ${option.stockQuantity}`,
    value: option.id,
  })),
);

const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const formatUser = (name?: string | null, email?: string | null) => {
  if (!name && !email) return '-';
  if (name && email) return `${name} · ${email}`;
  return name ?? email ?? '-';
};
</script>

<template>
  <section id="transfer-stock-page" class="flex flex-col gap-6">
    <header class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-text-primary">Transfer Stock</h1>
        <p class="text-sm text-text-secondary max-w-2xl">
          Monitor outgoing transfers and incoming stock requests across stores, and initiate new requests when stock
          needs to be rebalanced.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <PrimeVueButton
          icon="pi pi-arrow-right-arrow-left"
          label="New Transfer"
          class="bg-primary hover:bg-primary-600 border-primary text-white"
          @click="openCreateTransferDialog"
        />
        <PrimeVueButton
          icon="pi pi-plus-circle"
          label="Request Stock"
          variant="outlined"
          class="border-primary text-primary"
          @click="openCreateRequestDialog"
        />
      </div>
    </header>

    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-7 flex flex-col gap-4">
        <div class="flex items-center justify-between bg-white border border-grayscale-10 rounded-xl px-4 py-3">
          <div class="flex items-center gap-2">
            <PrimeVueButton
              label="Outgoing Transfers"
              icon="pi pi-send"
              @click="setActiveTab('transfer')"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all',
                isTransferTabActive
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border border-grayscale-20 text-text-primary hover:bg-grayscale-5',
              ]"
            />
            <PrimeVueButton
              label="Incoming Requests"
              icon="pi pi-inbox"
              @click="setActiveTab('request')"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all',
                isRequestTabActive
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border border-grayscale-20 text-text-primary hover:bg-grayscale-5',
              ]"
            />
          </div>

          <PrimeVueButton
            icon="pi pi-refresh"
            variant="text"
            :loading="transferStock_isLoading"
            class="text-text-secondary"
            @click="refreshActiveList"
          />
        </div>

        <PrimeVueDataTable
          :value="displayedList"
          data-key="id"
          selection-mode="single"
          :selection="selectedRecord"
          table-class="min-w-full"
          :loading="transferStock_isLoading"
          :paginator="true"
          :rows="dataTableRows"
          :total-records="displayedMeta.total"
          :lazy="true"
          :rows-per-page-options="[10, 20, 30, 50]"
          :first="dataTableFirst"
          @update:selection="selectRecord($event as ITransferStockRecord | null)"
          @page="handleTablePage"
          class="rounded-xl border border-grayscale-10 shadow-sm overflow-hidden"
        >
          <PrimeVueColumn field="transactionCode" header="Transaction">
            <template #body="{ data }">
              <div class="flex flex-col gap-1">
                <span class="font-semibold text-sm text-text-primary">{{ data.transactionCode }}</span>
                <span class="text-xs text-text-secondary">Created {{ formatDateTime(data.createdAt) }}</span>
              </div>
            </template>
          </PrimeVueColumn>

          <PrimeVueColumn header="Stores">
            <template #body="{ data }">
              <div class="flex flex-col text-xs text-text-secondary">
                <span class="font-semibold text-text-primary">
                  From: {{ resolveStoreName(data.storeFromId) }}
                </span>
                <span class="font-semibold text-text-secondary">
                  To: {{ resolveStoreName(data.storeToId) }}
                </span>
              </div>
            </template>
          </PrimeVueColumn>

          <PrimeVueColumn field="status" header="Status">
            <template #body="{ data }">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border"
                :class="[
                  TRANSFER_STOCK_STATUS_BADGE[data.status].tone === 'success'
                    ? 'bg-emerald-100 border-emerald-200 text-emerald-700'
                    : TRANSFER_STOCK_STATUS_BADGE[data.status].tone === 'info'
                      ? 'bg-blue-100 border-blue-200 text-blue-700'
                      : TRANSFER_STOCK_STATUS_BADGE[data.status].tone === 'warning'
                        ? 'bg-amber-100 border-amber-200 text-amber-700'
                        : TRANSFER_STOCK_STATUS_BADGE[data.status].tone === 'danger'
                          ? 'bg-rose-100 border-rose-200 text-rose-700'
                          : 'bg-slate-100 border-slate-200 text-slate-700',
                ]"
              >
                {{ TRANSFER_STOCK_STATUS_BADGE[data.status].text }}
              </span>
            </template>
          </PrimeVueColumn>

          <PrimeVueColumn header="Updated">
            <template #body="{ data }">
              <span class="text-xs text-text-secondary">{{ formatDateTime(data.updatedAt) }}</span>
            </template>
          </PrimeVueColumn>
        </PrimeVueDataTable>

        <div class="flex justify-between text-xs text-text-disabled">
          <span>Showing page {{ displayedMeta.page }} of {{ displayedMeta.totalPages }}</span>
          <span>Total records: {{ displayedMeta.total }}</span>
        </div>
      </div>

      <div class="lg:col-span-5">
        <section class="bg-white border border-grayscale-10 rounded-xl shadow-sm p-6 h-full flex flex-col gap-4">
          <header class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-text-primary">
                {{ selectedRecord?.transactionCode ?? 'Select a record' }}
              </h2>
              <p class="text-sm text-text-secondary">
                {{ selectedRecord ? 'Transfer detail summary' : 'Choose a transfer or request to view more detail.' }}
              </p>
            </div>
            <span
              v-if="detailStatusBadge"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border"
              :class="[
                detailStatusBadge.tone === 'success'
                  ? 'bg-emerald-100 border-emerald-200 text-emerald-700'
                  : detailStatusBadge.tone === 'info'
                    ? 'bg-blue-100 border-blue-200 text-blue-700'
                    : detailStatusBadge.tone === 'warning'
                      ? 'bg-amber-100 border-amber-200 text-amber-700'
                      : detailStatusBadge.tone === 'danger'
                        ? 'bg-rose-100 border-rose-200 text-rose-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700',
              ]"
            >
              {{ detailStatusBadge.text }}
            </span>
          </header>

          <template v-if="selectedRecord">
            <div class="grid grid-cols-1 gap-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-text-disabled uppercase">From Store</span>
                  <span class="text-sm text-text-primary font-medium">
                    {{ resolveStoreName(selectedRecord.storeFromId) }}
                  </span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-text-disabled uppercase">To Store</span>
                  <span class="text-sm text-text-primary font-medium">
                    {{ resolveStoreName(selectedRecord.storeToId) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-text-disabled uppercase">Requested By</span>
                  <span class="text-sm text-text-primary">
                    {{ formatUser(selectedRecord.requestedUser?.fullname, selectedRecord.requestedUser?.email) }}
                  </span>
                  <span class="text-xs text-text-secondary">{{ formatDateTime(selectedRecord.requestAt) }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-text-disabled uppercase">Approved By</span>
                  <span class="text-sm text-text-primary">
                    {{ formatUser(selectedRecord.approvedUser?.fullname, selectedRecord.approvedUser?.email) }}
                  </span>
                  <span class="text-xs text-text-secondary">{{ formatDateTime(selectedRecord.approvedAt) }}</span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-text-disabled uppercase">Shipped By</span>
                  <span class="text-sm text-text-primary">
                    {{ formatUser(selectedRecord.shippedUser?.fullname, selectedRecord.shippedUser?.email) }}
                  </span>
                  <span class="text-xs text-text-secondary">{{ formatDateTime(selectedRecord.shippedAt) }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-text-disabled uppercase">Received By</span>
                  <span class="text-sm text-text-primary">
                    {{ formatUser(selectedRecord.receivedUser?.fullname, selectedRecord.receivedUser?.email) }}
                  </span>
                  <span class="text-xs text-text-secondary">{{ formatDateTime(selectedRecord.receivedAt) }}</span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-text-disabled uppercase">Delivery Note</span>
                  <span class="text-sm text-text-primary">{{ selectedRecord.deliveryNote ?? '-' }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-text-disabled uppercase">Logistic</span>
                  <span class="text-sm text-text-primary">
                    {{ selectedRecord.logisticProvider ?? '-' }}
                    <template v-if="selectedRecord.trackingNumber">
                      · {{ selectedRecord.trackingNumber }}
                    </template>
                  </span>
                </div>
              </div>

              <div class="flex flex-col gap-1">
                <span class="text-xs text-text-disabled uppercase">Notes</span>
                <p class="text-sm text-text-primary whitespace-pre-line">
                  {{ selectedRecord.note ?? '-' }}
                </p>
              </div>

              <div class="border border-dashed border-grayscale-20 rounded-lg p-4">
                <p class="text-xs text-text-disabled uppercase mb-2">Items</p>
                <p class="text-sm text-text-secondary">
                  Item details will be available in a future update. Refer to the generated document or warehouse record
                  for the complete list.
                </p>
              </div>
            </div>
          </template>

          <template v-else>
            <section class="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <AppBaseSvg name="box" class="!w-10 !h-10 text-grayscale-30" />
              <p class="text-sm text-text-secondary max-w-sm">
                No record selected. Choose a transfer or request from the table to see more details.
              </p>
            </section>
          </template>
        </section>
      </div>
    </section>

    <PrimeVueDialog
      modal
      :visible="isCreateTransferDialogOpen"
      header="Create Transfer Stock"
      class="max-w-3xl w-full"
      @update:visible="closeCreateTransferDialog"
    >
      <form class="flex flex-col gap-4" @submit.prevent="submitTransferForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Destination Store</label>
            <PrimeVueDropdown
              v-model="transferForm.storeToId"
              :options="storeOptions"
              option-label="label"
              option-value="value"
              placeholder="Select store"
              :loading="outlet_isLoading"
              :disabled="outlet_isLoading"
            />
            <small v-if="!storeOptions.length" class="text-xs text-text-disabled">
              You need at least one additional store to create a transfer.
            </small>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-text-primary">Reference Notes</label>
            <PrimeVueTextarea
              v-model="transferForm.note"
              auto-resize
              rows="2"
              placeholder="Optional notes for the warehouse team"
            />
          </div>
        </div>

        <section class="border border-dashed border-grayscale-20 rounded-lg p-4 flex flex-col gap-3">
          <header class="flex flex-col sm:flex-row sm:items-end gap-3">
            <div class="flex-1 flex flex-col gap-2">
              <label class="text-sm font-medium text-text-primary">Select Item</label>
              <PrimeVueDropdown
                v-model="transferItemSelector.optionId"
                :options="itemDropdownOptions"
                option-label="label"
                option-value="value"
                placeholder="Choose inventory item"
                :disabled="!transferForm.storeToId || inventoryItems_isLoading"
                show-clear
              />
            </div>

            <div class="w-full sm:w-32 flex flex-col gap-2">
              <label class="text-sm font-medium text-text-primary">Quantity</label>
              <PrimeVueInputNumber
                v-model="transferItemSelector.qty"
                :min="1"
                :disabled="!transferForm.storeToId"
                input-class="w-full"
              />
            </div>
          </header>

          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="flex-1 flex items-center gap-2">
              <PrimeVueInputText
                v-model="transferItemSelector.search"
                placeholder="Search item name or SKU"
                :disabled="!transferForm.storeToId"
              />
              <PrimeVueButton
                icon="pi pi-search"
                label="Search"
                size="small"
                class="whitespace-nowrap"
                :loading="inventoryItems_isLoading"
                :disabled="!transferForm.storeToId"
                @click="refreshTransferItemOptions"
              />
            </div>
            <PrimeVueButton
              type="button"
              icon="pi pi-plus"
              label="Add Item"
              size="small"
              class="bg-primary border-primary hover:bg-primary-600"
              :disabled="!transferForm.storeToId || !transferItemSelector.optionId"
              @click="handleTransferAddItem"
            />
          </div>

          <div v-if="transferForm.items.length" class="overflow-auto border border-grayscale-10 rounded-lg">
            <table class="min-w-full divide-y divide-grayscale-10">
              <thead class="bg-grayscale-5">
                <tr class="text-xs uppercase text-text-disabled">
                  <th class="px-3 py-2 text-left">Item</th>
                  <th class="px-3 py-2 text-left">SKU</th>
                  <th class="px-3 py-2 text-left">Available</th>
                  <th class="px-3 py-2 text-left">Qty</th>
                  <th class="px-3 py-2" />
                </tr>
              </thead>
              <tbody class="divide-y divide-grayscale-10 bg-white text-sm">
                <tr v-for="item in transferForm.items" :key="item.itemId">
                  <td class="px-3 py-2 text-text-primary font-medium">{{ item.name }}</td>
                  <td class="px-3 py-2 text-text-secondary">{{ item.sku }}</td>
                  <td class="px-3 py-2 text-text-secondary">{{ item.stockQuantity }}</td>
                  <td class="px-3 py-2 text-text-primary font-semibold">{{ item.qty }}</td>
                  <td class="px-3 py-2 text-right">
                    <PrimeVueButton
                      icon="pi pi-trash"
                      size="small"
                      severity="danger"
                      variant="text"
                      @click="handleTransferRemoveItem(item.itemId)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-sm text-text-secondary">No items added yet. Search and add from your inventory.</p>
        </section>

        <footer class="flex justify-end gap-2">
          <PrimeVueButton type="button" label="Cancel" variant="outlined" @click="closeCreateTransferDialog" />
          <PrimeVueButton
            type="submit"
            label="Create Transfer"
            class="bg-primary border-primary hover:bg-primary-600"
            :loading="transferStock_isSubmitting"
          />
        </footer>
      </form>
    </PrimeVueDialog>

    <PrimeVueDialog
      modal
      :visible="isCreateRequestDialogOpen"
      header="Request Stock"
      class="max-w-3xl w-full"
      @update:visible="closeCreateRequestDialog"
    >
      <form class="flex flex-col gap-4" @submit.prevent="submitRequestForm">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-text-primary">Requesting Store</label>
          <PrimeVueInputText :model-value="currentStoreName" disabled class="text-text-primary font-semibold" />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-text-primary">Notes</label>
          <PrimeVueTextarea
            v-model="requestForm.note"
            rows="2"
            auto-resize
            placeholder="Optional context for the central warehouse"
          />
        </div>

        <section class="border border-dashed border-grayscale-20 rounded-lg p-4 flex flex-col gap-3">
          <header class="flex flex-col sm:flex-row sm:items-end gap-3">
            <div class="flex-1 flex flex-col gap-2">
              <label class="text-sm font-medium text-text-primary">Select Item</label>
              <PrimeVueDropdown
                v-model="requestItemSelector.optionId"
                :options="itemDropdownOptions"
                option-label="label"
                option-value="value"
                placeholder="Choose inventory item"
                :disabled="inventoryItems_isLoading"
                show-clear
              />
            </div>

            <div class="w-full sm:w-32 flex flex-col gap-2">
              <label class="text-sm font-medium text-text-primary">Quantity</label>
              <PrimeVueInputNumber
                v-model="requestItemSelector.qty"
                :min="1"
                input-class="w-full"
              />
            </div>
          </header>

          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="flex-1 flex items-center gap-2">
              <PrimeVueInputText
                v-model="requestItemSelector.search"
                placeholder="Search item name or SKU"
              />
              <PrimeVueButton
                icon="pi pi-search"
                label="Search"
                size="small"
                class="whitespace-nowrap"
                :loading="inventoryItems_isLoading"
                @click="refreshRequestItemOptions"
              />
            </div>
            <PrimeVueButton
              type="button"
              icon="pi pi-plus"
              label="Add Item"
              size="small"
              class="bg-primary border-primary hover:bg-primary-600"
              :disabled="!requestItemSelector.optionId"
              @click="handleRequestAddItem"
            />
          </div>

          <div v-if="requestForm.items.length" class="overflow-auto border border-grayscale-10 rounded-lg">
            <table class="min-w-full divide-y divide-grayscale-10">
              <thead class="bg-grayscale-5">
                <tr class="text-xs uppercase text-text-disabled">
                  <th class="px-3 py-2 text-left">Item</th>
                  <th class="px-3 py-2 text-left">SKU</th>
                  <th class="px-3 py-2 text-left">Available</th>
                  <th class="px-3 py-2 text-left">Qty</th>
                  <th class="px-3 py-2" />
                </tr>
              </thead>
              <tbody class="divide-y divide-grayscale-10 bg-white text-sm">
                <tr v-for="item in requestForm.items" :key="item.itemId">
                  <td class="px-3 py-2 text-text-primary font-medium">{{ item.name }}</td>
                  <td class="px-3 py-2 text-text-secondary">{{ item.sku }}</td>
                  <td class="px-3 py-2 text-text-secondary">{{ item.stockQuantity }}</td>
                  <td class="px-3 py-2 text-text-primary font-semibold">{{ item.qty }}</td>
                  <td class="px-3 py-2 text-right">
                    <PrimeVueButton
                      icon="pi pi-trash"
                      size="small"
                      severity="danger"
                      variant="text"
                      @click="handleRequestRemoveItem(item.itemId)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-sm text-text-secondary">
            Add the items you need to replenish. The request will be sent to the initiating store.
          </p>
        </section>

        <footer class="flex justify-end gap-2">
          <PrimeVueButton type="button" label="Cancel" variant="outlined" @click="closeCreateRequestDialog" />
          <PrimeVueButton
            type="submit"
            label="Submit Request"
            class="bg-primary border-primary hover:bg-primary-600"
            :loading="transferStock_isSubmitting"
          />
        </footer>
      </form>
    </PrimeVueDialog>
  </section>
</template>
