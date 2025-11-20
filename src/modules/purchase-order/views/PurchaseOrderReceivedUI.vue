<script setup lang="ts">
import { usePurchaseOrderReceivedService } from '../services/purchase-order-received.service';
import PurchaseOrderReceivedNotesDialog from '../components/PurchaseOrderReceivedNotesDialog.vue';
import eventBus from '@/plugins/mitt';

const {
  purchaseOrderReceived_data,
  purchaseOrderReceived_formData,
  purchaseOrderReceived_validations,
  purchaseOrderReceived_listColumns,
  purchaseOrderReceived_isLoading,
  purchaseOrderReceived_onBack,
  purchaseOrderReceived_listStaff,
  purchaseOrderReceived_onSubmit,
  purchaseOrderReceived_isOwner,
  purchaseOrderReceived_onShowNotesDialog,
  notesBuffer,
  onCloseNotesDialog,
  onSubmitNotesDialog,
} = usePurchaseOrderReceivedService();

provide('purchaseOrderReceived', {
  notesBuffer,
  onCloseNotesDialog,
  onSubmitNotesDialog,
});

const search = ref('');

const handleBarcodeScan = () => {
  const barcode = search.value.trim();
  if (!barcode) return;

  const foundItem = purchaseOrderReceived_formData.value.productItems.find(
    item => item.barcode === barcode || item.sku === barcode,
  );

  if (foundItem) {
    foundItem.actualQuantity = (foundItem.actualQuantity || 0) + 1;
    search.value = '';
  } else {
    eventBus.emit('AppBaseToast', {
      isOpen: true,
      type: EToastType.WARNING,
      message: 'Invalid barcode and do nothing',
      position: EToastPosition.TOP_RIGHT,
    });
  }
};

const filteredItems = computed(() => {
  if (!search.value) {
    return purchaseOrderReceived_formData.value.productItems;
  }

  const searchTerm = search.value.toLowerCase();

  return purchaseOrderReceived_formData.value.productItems.filter(item => {
    const sku = item.sku?.toLowerCase() || '';
    const name = item.name?.toLowerCase() || '';
    const barcode = item.barcode?.toLowerCase() || '';
    return sku.includes(searchTerm) || name.includes(searchTerm) || barcode.includes(searchTerm);
  });
});

function formatOrderDate(dateString: string | undefined): string {
  if (!dateString) return "-";
  const d = new Date(dateString);

  // konversi manual ke WIB
  d.setHours(d.getHours() + 7);

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  return `${dd}-${mm}-${yyyy} ${hh}:${min} WIB`;
}

</script>

<template>
  <section class="default-wrapper">
    <div class="pb-8">
      <section class="grid grid-cols-3 gap-2 mt-2">
        <div class="flex flex-col">
          <h3 class="font-semibold">PO Number</h3>
          <p>{{ purchaseOrderReceived_data?.orderNumber }}</p>
        </div>
        <div class="flex flex-col">
          <h3 class="font-semibold">Supplier</h3>
          <p>{{ purchaseOrderReceived_data?.supplierInfo.supplierName }}</p>
        </div>
       <div class="flex flex-col">
        <h3 class="font-semibold">Order Date</h3>
        <p>{{ formatOrderDate(purchaseOrderReceived_data?.orderDate) }}</p>
      </div>
      </section>
    </div>

    <div class="mb-6 w-full">
      <AppBaseFormGroup
        v-if="purchaseOrderReceived_isOwner"
        v-slot="{ classes }"
        class-label="block text-sm font-semibold leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="receivedBy"
        :name="'Received By'"
        spacing-bottom="mb-0"
        :validators="purchaseOrderReceived_validations.userId"
      >
        <PrimeVueDropdown
          id="receivedBy"
          v-model="purchaseOrderReceived_formData.userId"
          :options="purchaseOrderReceived_listStaff"
          option-label="label"
          option-value="value"
          placeholder="Pilih Staff"
          class="w-full"
          :class="{ ...classes }"
          filter
          show-clear
        />
      </AppBaseFormGroup>
      <div v-else class="flex flex-col"></div>
    </div>

    <AppBaseDataTable
      :data="filteredItems"
      :columns="purchaseOrderReceived_listColumns"
      :is-using-filter="false"
      :is-loading="purchaseOrderReceived_isLoading"
      is-using-custom-body
      :is-using-custom-footer="true"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Item List</h1>
      </template>
      <template #header-suffix>
        <div class="flex items-center gap-2">
          <PrimeVueIconField>
            <PrimeVueInputIcon>
              <AppBaseSvg name="search" class="!w-4 !h-4" />
            </PrimeVueInputIcon>
            <PrimeVueInputText
              v-model="search"
              placeholder="Search by SKU/Item Name or Scan Barcode"
              @keydown.enter.prevent="handleBarcodeScan"
            />
          </PrimeVueIconField>
        </div>
      </template>
      <template #body="{ column, data }">
        <template v-if="column.value === 'orderedQuantity'">
          {{ data.orderedQuantity }}
        </template>
        <template v-else-if="column.value === 'actualQuantity'">
          <span class="font-normal text-sm text-text-primary">
            <PrimeVueInputNumber
              v-model="data.actualQuantity"
              mode="decimal"
              class="text-sm max-h-9"
              show-buttons
              button-layout="horizontal"
            >
              <template #decrementicon>
                <AppBaseSvg name="minus" class="!w-4 !h-4" />
              </template>
              <template #incrementicon>
                <AppBaseSvg name="plus-line" class="!w-4 !h-4" />
              </template>
            </PrimeVueInputNumber>
          </span>
        </template>
        <template v-else-if="column.value === 'difference'">
          <div class="flex items-center gap-1">
            <span
              v-if="data.actualQuantity - data.orderedQuantity === 0"
              class="font-normal text-sm text-text-primary"
            >
              <PrimeVueChip class="aspect-square rounded-full bg-success-background">
                <template #icon>
                  <AppBaseSvg name="checkCircle-green" class="!w-3 !h-3" />
                </template>
              </PrimeVueChip>
            </span>
            <span
              v-else-if="data.actualQuantity - data.orderedQuantity < 0"
              class="font-normal text-sm text-text-primary"
            >
              <PrimeVueChip class="aspect-square rounded-full bg-error-background">
                <template #icon>
                  <AppBaseSvg name="chevron-down-red" class="!w-3 !h-3" />
                </template>
              </PrimeVueChip>
            </span>
            <span
              v-else-if="data.actualQuantity - data.orderedQuantity > 0"
              class="font-normal text-sm text-text-primary"
            >
              <PrimeVueChip class="aspect-square rounded-full bg-grayscale-10">
                <template #icon>
                  <AppBaseSvg name="chevron-up" class="!w-3 !h-3" />
                </template>
              </PrimeVueChip>
            </span>
            <span class="font-normal text-sm text-text-primary">
              <span v-if="data.actualQuantity - data.orderedQuantity > 0">+</span>
              {{ data.actualQuantity - data.orderedQuantity }}
            </span>
          </div>
        </template>
        <template v-else-if="column.value === 'expiredAt'">
          <PrimeVueDatePicker v-model="data.expiredAt" date-format="dd/mm/yy" show-icon class="text-sm w-full" />
        </template>
        <template v-else-if="column.value === 'notes'">
          <PrimeVueButton
            class="text-primary hover:text-white"
            :label="data.notes ? 'View Notes' : 'Add Notes'"
            text
            @click="purchaseOrderReceived_onShowNotesDialog(data)"
          />
        </template>
        <template v-else>
          {{ data[column.value] }}
        </template>
      </template>
    </AppBaseDataTable>

    <footer class="flex items-center justify-between py-8">
      <div class="flex items-center gap-2">
        <PrimeVueButton
          label="Receive PO"
          class="bg-primary text-white border-none"
          @click="purchaseOrderReceived_onSubmit"
        />
        <PrimeVueButton
          label="Cancel"
          class="text-primary border border-solid border-primary"
          variant="text"
          @click="purchaseOrderReceived_onBack"
        />
      </div>
    </footer>

    <PurchaseOrderReceivedNotesDialog />

    <AppBaseDialogConfirmation id="purchase-order-received-confirmation-dialog" />
  </section>
</template>
