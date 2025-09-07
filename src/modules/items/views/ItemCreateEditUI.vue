<script setup lang="ts">
import { useInvetoryItemsActionService } from '../services/items-action.service';
import confirmationSVG from '@/app/assets/icons/confirmation.svg';
import { useInventoryItemsListService } from '../services/items-list.service';

const {
  inventoryItemsAction_formData: form,
  inventoryItemsAction_brandList: brands,
  inventoryItemsAction_categoryList: categories,
  inventoryItemsAction_locationStorage: storageLocations,
  inventoryItemsAction_onSubmit,
  inventoryItemsAction_onCancel,
  inventoryItemsAction_Validation: itemFormValidation,
  inventoryItemAction_supplierList: suppliers,
  inventoryItemsAction_formOnMode,
  inventoryItems_editingItem,
  inventoryItems_handleBarcodeScanner,
} = useInvetoryItemsActionService();

const { inventoryItems_onDelete } = useInventoryItemsListService();

const isUpdateModal = ref(false);

const isFormInvalid = computed(() => {
  return (
    !form.value.name ||
    !form.value.sku ||
    !form.value.brandId ||
    !form.value.categoryId ||
    !form.value.unit ||
    !form.value.pricePerUnit ||
    !form.value.storageLocationId ||
    !form.value.supplierId ||
    !form.value.stockQuantity ||
    !form.value.reorderLevel ||
    !form.value.minimumStockQuantity
  );
});

const onSubmit = () => {
  if (inventoryItemsAction_formOnMode.value === 'create') {
    inventoryItemsAction_onSubmit(form.value, 'create');
  } else {
    isUpdateModal.value = true;
  }
};

const onCancel = () => {
  inventoryItemsAction_onCancel();
};

const cancelUpdate = () => {
  isUpdateModal.value = false;
};

const confirmUpdate = async () => {
  await inventoryItemsAction_onSubmit(form.value, 'edit', inventoryItems_editingItem.value?.id);
};
</script>

<template>
  <section id="items-create-edit" class="flex justify-center items-center min-h-screen p-4 sm:p-6">
    <div class="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <!-- Item Details -->
      <section>
        <h3 class="font-semibold text-lg text-primary mb-4">Item Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Item Name -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="item-name"
            name="Item Name"
            spacing-bottom="mb-0"
            :validators="itemFormValidation.name"
          >
            <PrimeVueInputText
              id="item-name"
              v-model="form.name"
              class="w-full"
              :class="{ ...classes }"
              placeholder="Enter item name"
              required
            />
          </AppBaseFormGroup>

          <!-- Brand -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="brand"
            name="Brand"
            spacing-bottom="mb-0"
            :validators="itemFormValidation.brand"
          >
            <PrimeVueDropdown
              id="brand"
              v-model="form.brandId"
              :options="brands"
              option-label="brandName"
              option-value="id"
              filter
              show-clear
              placeholder="Select or search brand"
              class="w-full"
              :class="{ ...classes }"
            />
          </AppBaseFormGroup>

          <!-- Barcode -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="barcode"
            name="Barcode"
            spacing-bottom="mb-0"
          >
            <div class="relative w-full">
              <PrimeVueInputText
                id="barcode"
                v-model="form.barcode"
                placeholder="Scan or input product barcode"
                class="w-full pr-8"
                :class="{ ...classes }"
              />
              <PrimeVueButton
                class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-transparent border-none text-gray-400"
                type="button"
                @click="inventoryItems_handleBarcodeScanner"
              >
                <i class="pi pi-camera"></i>
              </PrimeVueButton>
            </div>
          </AppBaseFormGroup>

          <!-- SKU -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="sku"
            name="SKU"
            spacing-bottom="mb-0"
            :validators="itemFormValidation.sku"
          >
            <PrimeVueInputText
              id="sku"
              v-model="form.sku"
              class="w-full"
              :class="{ ...classes }"
              placeholder="Enter SKU"
              required
            />
          </AppBaseFormGroup>

          <!-- Category -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="category"
            name="Category"
            spacing-bottom="mb-0"
            :validators="itemFormValidation.categoryId"
          >
            <PrimeVueDropdown
              id="category"
              v-model="form.categoryId"
              :options="categories"
              option-label="name"
              option-value="id"
              filter
              show-clear
              placeholder="Select or search category"
              class="w-full"
              :class="{ ...classes }"
            />
          </AppBaseFormGroup>

          <!-- Unit -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="unit"
            name="Unit"
            spacing-bottom="mb-0"
            :validators="itemFormValidation.unit"
          >
            <PrimeVueInputText
              id="unit"
              v-model="form.unit"
              class="w-full"
              :class="{ ...classes }"
              placeholder="Enter unit"
            />
          </AppBaseFormGroup>

          <!-- Notes (full width di mobile, half di tablet+) -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="notes"
            name="Notes"
            spacing-bottom="mb-0"
            class="col-span-1 md:col-span-2"
          >
            <PrimeVueTextarea id="notes" v-model="form.notes" rows="3" class="w-full" :class="{ ...classes }" />
          </AppBaseFormGroup>
        </div>
      </section>

      <!-- Stock & Inventory -->
      <section>
        <h3 class="font-semibold text-lg text-primary mb-4">Stock & Inventory</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium text-gray-700 mb-1"
            is-name-as-label
            name="Stock Quantity"
            :validators="itemFormValidation.stockQuantity"
          >
            <PrimeVueInputNumber v-model="form.stockQuantity" class="w-full" :class="{ ...classes }" />
          </AppBaseFormGroup>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium text-gray-700 mb-1"
            is-name-as-label
            name="Minimum Stock Quantity"
            :validators="itemFormValidation.minimumStockQuantity"
          >
            <PrimeVueInputNumber v-model="form.minimumStockQuantity" class="w-full" :class="{ ...classes }" />
          </AppBaseFormGroup>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium text-gray-700 mb-1"
            is-name-as-label
            name="Reorder Level"
            :validators="itemFormValidation.reorderLevel"
          >
            <PrimeVueInputNumber v-model="form.reorderLevel" class="w-full" :class="{ ...classes }" />
          </AppBaseFormGroup>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium text-gray-700 mb-1"
            is-name-as-label
            name="Expiry Date"
            :validators="itemFormValidation.expiryDate"
          >
            <div class="p-input-icon-right w-full">
              <PrimeVueCalendar
                v-model="form.expiryDate as unknown as Date"
                date-format="yy-mm-dd"
                class="w-full"
                :class="{ ...classes }"
              />
            </div>
          </AppBaseFormGroup>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full hidden"
            is-name-as-label
            label-for="storage-location"
            name="Storage Location"
            spacing-bottom="mb-0"
            :validators="itemFormValidation.storageLocationId"
            :default-value="storageLocations[0] ?? ''"
          >
            <PrimeVueDropdown

              id="storage-location"
              v-model="form.storageLocationId"
              :options="storageLocations"
              option-label="name"
              option-value="id"
              filter
              show-clear
              placeholder="Select or search storage location"
              class="w-full hidden"
              :class="{ ...classes }"
            />
          </AppBaseFormGroup>
        </div>
      </section>

      <!-- Price & Supplier -->
      <section>
        <h3 class="font-semibold text-lg text-primary mb-4">Price & Supplier</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium text-gray-700 mb-1"
            is-name-as-label
            name="Price Per Unit"
            :validators="itemFormValidation.pricePerUnit"
          >
            <PrimeVueInputNumber
              v-model="form.pricePerUnit"
              mode="currency"
              currency="IDR"
              locale="id-ID"
              class="w-full"
              :class="{ ...classes }"
            />
          </AppBaseFormGroup>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium text-gray-700 mb-1"
            is-name-as-label
            name="Supplier"
            :validators="itemFormValidation.supplierId"
          >
            <PrimeVueDropdown
              v-model="form.supplierId"
              :options="suppliers"
              option-label="supplierName"
              option-value="id"
              filter
              show-clear
              placeholder="Select or search supplier"
              class="w-full"
              :class="{ ...classes }"
            />
          </AppBaseFormGroup>
        </div>
      </section>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
        <PrimeVueButton
          label="Cancel"
          variant="text"
          class="w-full sm:w-auto !px-6 border-2 border-primary"
          @click="onCancel"
        />
        <PrimeVueButton
          :label="inventoryItemsAction_formOnMode === 'create' ? 'Add Item' : 'Update Item'"
          class="w-full sm:w-auto !px-6"
          :disabled="isFormInvalid"
          @click="onSubmit"
        />
      </div>

      <PrimeVueButton
        v-if="inventoryItemsAction_formOnMode !== 'create'"
        label="Delete Item"
        severity="danger"
        icon="pi pi-trash"
        class="mt-4 sm:absolute sm:bottom-6 sm:right-20 !px-6 bg-transparent border-none text-red-600"
        @click="inventoryItems_onDelete(inventoryItems_editingItem?.id ?? '')"
      />
    </div>
  </section>

  <!-- Dialog Update -->
  <PrimeVueDialog :visible="isUpdateModal" modal header="">
    <template #container>
      <div class="w-full sm:w-[35rem] p-6 sm:p-8">
        <div class="flex flex-col items-center gap-4 text-center">
          <span><img :src="confirmationSVG" alt="confirmation" /></span>
          <h1 class="text-xl sm:text-2xl font-semibold">Are you sure want to update this category?</h1>
          <p class="text-sm sm:text-base">The update will affect the related inventory category data</p>
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <PrimeVueButton
              variant="text"
              class="w-full sm:w-56 text-lg border-2 border-primary text-primary font-semibold"
              @click="cancelUpdate"
            >
              Cancel
            </PrimeVueButton>
            <PrimeVueButton
              class="w-full sm:w-56 py-2 cursor-pointer border-2 border-primary rounded-lg text-white bg-primary font-semibold"
              unstyled
              label="Yes, I'm Sure"
              @click="confirmUpdate"
            />
          </div>
        </div>
      </div>
    </template>
  </PrimeVueDialog>

  <AppBaseDialogConfirmation id="inventory-items-dialog-confirmation" />
</template>
