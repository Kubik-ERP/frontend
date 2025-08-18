<script setup lang="ts">
import { ref } from 'vue';
import { useInventoryItemsListService } from '../services/items-list.service';
import { IInventoryItems } from '../interfaces';

const popover = ref();
const selectedData = ref<IInventoryItems | null>(null);

const openActionsMenu = (event: Event, data: IInventoryItems) => {
  selectedData.value = data;
  popover.value?.toggle(event);
};

const {
  inventoryItems_colums,
  inventoryItems_values,
  inventoryItems_isLoading,
  inventoryItems_onCreate,
  inventoryItems_onChangePage,
  inventoryItems_handleOnSortChange,
  inventoryItems_queryParams,
  inventoryItems_onEdit,
  inventoryItems_onDelete,
  inventoryItem_onAdjustment,
} = useInventoryItemsListService();
</script>

<template>
  <section id="inventory-items-list-ui" class="flex flex-col">
    <AppBaseDataTable
      :columns="inventoryItems_colums"
      :data="inventoryItems_values.data.items"
      header-title="Inventory Items"
      :rows-per-page="inventoryItems_values.data.meta.pageSize"
      :total-records="inventoryItems_values.data.meta.total"
      :first="(inventoryItems_values.data.meta.page - 1) * inventoryItems_values.data.meta.pageSize"
      :is-loading="inventoryItems_isLoading"
      :sort-field="inventoryItems_queryParams.orderBy"
      :sort-order="inventoryItems_queryParams.orderDirection === 'asc' ? 1 : -1"
      is-using-server-side-pagination
      is-using-custom-header-suffix
      is-using-header
      is-using-custom-body
      :is-using-custom-filter="true"
      @update:currentPage="inventoryItems_onChangePage"
      @update:sort="inventoryItems_handleOnSortChange"
    >
      <!-- Header Suffix -->
      <template #header-suffix>
        <div class="flex items-center space-x-2">
          <PrimeVueIconField>
            <PrimeVueInputIcon>
              <i class="pi pi-search text-gray-400"></i>
            </PrimeVueInputIcon>
            <PrimeVueInputText
              v-model="inventoryItems_queryParams.search"
              placeholder="Search items..."
              class="w-80 h-10 pl-10 pr-4 border border-gray-300 rounded-md"
            />
          </PrimeVueIconField>
          <PrimeVueButton
            class="bg-primary hover:bg-primary-600 text-white px-4 py-2 h-10 rounded-md flex items-center gap-2"
            @click="inventoryItems_onCreate"
          >
            <i class="pi pi-plus text-sm"></i>
            Create Item
          </PrimeVueButton>
        </div>
      </template>

      <!-- header Filter -->
      <!-- <template #filter>
        <section class="flex items-center gap-3">
          <span class="font-semibold text-sm text-gray-800">Filter by</span>

          <PrimeVueMultiSelect v-model="inventoryItems_queryParams.orderType" display="chip"
            :options="dailySalesList_typesOfOrderType" option-label="label" option-value="value" filter
            placeholder="Order Type" class="text-sm text-text-disabled w-full" />

          <PrimeVueMultiSelect v-model="inventoryItems_queryParams.paymentStatus" display="chip"
            :options="dailySalesList_typesOfPaymentStatus" option-label="label" option-value="value" filter show-clear
            placeholder="Payment Status" class="text-sm text-text-disabled w-full" />

          <PrimeVueMultiSelect v-model="inventoryItems_queryParams.orderStatus" display="chip"
            :options="dailySalesList_typesOfOrderStatus" option-label="label" option-value="value" filter
            placeholder="Order Status" class="text-sm text-text-disabled w-full" />
          </div>
        </section>
      </template> -->

      <!-- Body Table -->
      <template #body="{ column, data }">
        <div class="">
          <!-- SKU -->
          <template v-if="column.value === 'sku'">
            <span class="text-gray-700">{{ data.sku || '-' }}</span>
          </template>

          <!-- Item Name -->
          <template v-else-if="column.value === 'name'">
            <span class="text-gray-700">{{ data.name || '-' }}</span>
          </template>

          <!-- Category -->
          <template v-else-if="column.value === 'categoryName'">
            <span class="text-gray-700">{{ data.categoryId || '-' }}</span>
          </template>

          <!-- Brand -->
          <template v-else-if="column.value === 'brandName'">
            <span class="text-gray-700">{{ data.brandId || '-' }}</span>
          </template>

          <!-- Unit -->
          <template v-else-if="column.value === 'unit'">
            <span class="text-gray-700">{{ data.unit || '-' }}</span>
          </template>

          <!-- Stock Quantity -->
          <template v-else-if="column.value === 'stockQuantity'">
            <span class="text-gray-700">{{ data.stockQuantity ?? 0 }}</span>
          </template>

          <!-- Reorder Level -->
          <template v-else-if="column.value === 'reorderLevel'">
            <span class="text-gray-700">{{ data.reorderLevel ?? 0 }}</span>
          </template>

          <!-- Minimum Stock Quantity -->
          <template v-else-if="column.value === 'minimumStockQuantity'">
            <span class="text-gray-700">{{ data.minimumStockQuantity ?? 0 }}</span>
          </template>

          <!-- Price Per Unit -->
          <template v-else-if="column.value === 'unitPrice'">
            <span class="text-gray-700">Rp{{ data.pricePerUnit?.toLocaleString('id-ID') ?? 0 }}</span>
          </template>

          <!-- expiry date -->
          <template v-else-if="column.value === 'expiryDate'">
            <span class="text-gray-700">
              {{
                new Date(data.expiryDate).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              }}
            </span>
          </template>

          <!-- supplier -->
          <template v-else-if="column.value === 'supplierId'">
            <span class="text-gray-700">{{ data.supplierId || '-' }}</span>
          </template>

          <!-- storage location -->
          <template v-else-if="column.value === 'storageLocationId'">
            <span class="text-gray-700">{{ data.storageLocationId || '-' }}</span>
          </template>

          <!-- Actions -->
          <template v-else-if="column.value === 'action'">
            <PrimeVueButton variant="text" rounded aria-label="Actions" @click="openActionsMenu($event, data)">
              <template #icon>
                <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
              </template>
            </PrimeVueButton>

            <PrimeVuePopover ref="popover" :pt="{ root: { class: 'z-[9999]' }, content: 'p-0' }">
              <section v-if="selectedData" class="flex flex-col">
                <!-- Edit -->
                <PrimeVueButton
                  class="w-full px-4 py-3"
                  variant="text"
                  @click="inventoryItems_onEdit(selectedData.id)"
                >
                  <section class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="edit" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Edit</span>
                  </section>
                </PrimeVueButton>

                <PrimeVueButton
                  class="w-full px-4 py-3"
                  variant="text"
                  @click="inventoryItem_onAdjustment(selectedData.id)"
                >
                  <section class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="settings" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Stock Adjustment</span>
                  </section>
                </PrimeVueButton>

                <!-- Delete -->
                <PrimeVueButton
                  class="w-full px-4 py-3"
                  variant="text"
                  @click="inventoryItems_onDelete(selectedData.id)"
                >
                  <section class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="delete" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Delete</span>
                  </section>
                </PrimeVueButton>
              </section>
            </PrimeVuePopover>
          </template>
        </div>
      </template>
    </AppBaseDataTable>
  </section>
  <AppBaseDialogConfirmation id="inventory-items-dialog-confirmation" />
</template>
