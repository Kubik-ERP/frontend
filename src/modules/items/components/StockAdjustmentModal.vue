<script setup lang="ts">
import { computed } from 'vue';
import { useItemStockAdjustmentActionService } from '../services/items-stock-adjustment-action.service';
import { useInventoryItemPreviewService } from '../services/items-stock-adjustment.service';
// Service
const {
  itemStockAdjustmentAction_isLoading,
  itemStockAdjustmentAction_formData,
  itemStockAdjustmentAction_Validation,
  itemStockAdjustmentAction_onSubmit,
  itemStockAdjustmentAction_onCancel,
  itemStockAdjustmentAction_typeOption,
  itemStockAdjustmentAction_formOnMode,
  itemStockAdjustmentPreview_item,
} = useItemStockAdjustmentActionService();

const formIsValid = ref(false);

const {
  inventoryItemPreview_item,
  //  inventoryItemPreview_fetchItemById,
  //   stockadjustment_fetchList,
  //   stockadjustment_queryParams
  } = useInventoryItemPreviewService();

// Hitung stok baru otomatis
const newStockQuantity = computed(() => {
  const item = inventoryItemPreview_item.value;
  const form = itemStockAdjustmentAction_formData.value;
  // const preview = itemStockAdjustmentPreview_item.value; // data adjustment lama

  if (!item) return '-';
  if (!form.action) return '-';

  const qty = form.adjustmentQuantity || 0;

  let baseStock: number;

  baseStock = item.stockQuantity || 0;

  if (form.action === 'STOCK_IN') {
    return baseStock + qty;
  }
  if (form.action === 'STOCK_OUT') {
    return baseStock - qty;
  }
  return '-';
});

watch(
  itemStockAdjustmentAction_formData,
  val => {
    formIsValid.value = !!val.action && val.adjustmentQuantity > 0; // quantity harus > 0
  },
  { deep: true },
);
function formatDate(date: string) {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

const handleSubmit = async () => {
  if (itemStockAdjustmentAction_formOnMode.value === 'create') {
    await itemStockAdjustmentAction_onSubmit(itemStockAdjustmentAction_formData.value, 'create');
  } else {
    await itemStockAdjustmentAction_onSubmit(
      itemStockAdjustmentAction_formData.value,
      'edit',
      itemStockAdjustmentPreview_item.value?.id,
    );
  }
};
</script>

<template>
  <AppBaseDialog id="stock-adjustment-modal">
    <template #header>
      <h6 class="font-semibold text-lg">
        {{ itemStockAdjustmentAction_formOnMode === 'create' ? 'Add' : 'Edit' }} Stock Adjustment
      </h6>
    </template>

    <template #content>
      <div class="flex flex-col gap-4">
        <div v-if="itemStockAdjustmentPreview_item" class="flex flex-col items-start">
          <span class="text-md text-gray-600">Addjustment Date :</span>
          <span class="font-semibold ml-1">
            {{
             formatDate(itemStockAdjustmentPreview_item?.createdAt)
            }}
          </span>
        </div>

        <!-- Current Stock -->
        <div>
          <span class="text-sm text-gray-600">Current Stock Quantity :</span>
          <span class="font-semibold ml-1">
            {{
              inventoryItemPreview_item?.stockQuantity
            }}
          </span>
        </div>

        <!-- Type -->
        <AppBaseFormGroup
          is-name-as-label
          label-for="adjustmentType"
          name="Type"
          :validators="itemStockAdjustmentAction_Validation.action"
        >
          <PrimeVueDropdown
            v-model="itemStockAdjustmentAction_formData.action"
            :options="itemStockAdjustmentAction_typeOption"
            option-label="label"
            option-value="value"
            placeholder="Select Type"
            class="w-full"
          >
            <!-- Tampilkan di list dropdown -->
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'w-5 h-5 flex items-center justify-center rounded-full',
                    slotProps.option.value === 'STOCK_IN'
                      ? 'bg-green-100 text-green-500'
                      : 'bg-red-100 text-red-500',
                  ]"
                >
                  <i :class="slotProps.option.value === 'STOCK_IN' ? 'pi pi-arrow-right' : 'pi pi-arrow-left'"></i>
                </span>
                <span>{{ slotProps.option.label }}</span>
              </div>
            </template>

            <!-- Tampilkan di input terpilih -->
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center gap-2">
                <span
                  :class="[
                    'w-5 h-5 flex items-center justify-center rounded-full',
                    slotProps.value === 'STOCK_IN' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500',
                  ]"
                >
                  <i :class="slotProps.value === 'STOCK_IN' ? 'pi pi-arrow-right' : 'pi pi-arrow-left'"></i>
                </span>
                <span>{{ slotProps.value }}</span>
              </div>
              <span v-else class="text-gray-400">Select Type</span>
            </template>
          </PrimeVueDropdown>
        </AppBaseFormGroup>

        <!-- Adjustment Quantity -->
        <AppBaseFormGroup
          is-name-as-label
          label-for="adjustmentQuantity"
          name="Adjustment Quantity"
          :validators="itemStockAdjustmentAction_Validation.adjustmentQuantity"
        >
          <PrimeVueInputNumber
            v-model="itemStockAdjustmentAction_formData.adjustmentQuantity"
            input-id="adjustmentQuantity"
            class="w-full"
            :min="0"
          />
        </AppBaseFormGroup>

        <!-- New Stock Quantity -->
        <div>
          <span class="text-sm text-gray-600">New Stock Quantity :</span>
          <span class="font-semibold ml-1">{{ newStockQuantity }}</span>
        </div>

        <!-- Notes -->
        <AppBaseFormGroup
          is-name-as-label
          label-for="notes"
          name="Notes"
          :validation="itemStockAdjustmentAction_Validation.notes"
        >
          <PrimeVueTextarea
            id="notes"
            v-model="itemStockAdjustmentAction_formData.notes"
            placeholder="Enter notes"
            rows="3"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </AppBaseFormGroup>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <PrimeVueButton
          type="button"
          class="bg-white text-primary border border-primary"
          @click="itemStockAdjustmentAction_onCancel"
        >
          Cancel
        </PrimeVueButton>
        <PrimeVueButton
          type="button"
          class="bg-primary text-white disabled:bg-gray-400 disabled:text-white disabled:border-none"
          :disabled="!formIsValid || itemStockAdjustmentAction_isLoading"
          @click="handleSubmit"
        >
          {{ itemStockAdjustmentAction_formOnMode === 'create' ? 'Save' : 'Update' }}
        </PrimeVueButton>
      </div>
    </template>
  </AppBaseDialog>
</template>
