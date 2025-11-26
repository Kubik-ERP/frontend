<script setup lang="ts">
import { useInvetoryItemsActionService } from '../services/items-action.service';
import confirmationSVG from '@/app/assets/icons/confirmation.svg';
import imageSVG from '@/app/assets/icons/image.svg';
import { useInventoryItemsListService } from '../services/items-list.service';
import { useOutletStore } from '@/modules/outlet/store';
import { ITEM_UNIT_DROPDOWN } from '../constants';
import InventorySidebarRight from '../components/InventorySidebarRight.vue';

const {
  inventoryItemsAction_formData: form,
  inventoryItemsAction_brandList: brands,
  inventoryItemsAction_categoryList: categories,
  inventoryItemsAction_locationStorage: storageLocations,
  inventoryItemsAction_onSubmit,
  inventoryItemsAction_onCancel,
  inventoryItemsAction_Validation: itemFormValidation,
  inventoryItemsAction_isValid,
  inventoryItemAction_supplierList: suppliers,
  inventoryItemsAction_formOnMode,
  inventoryItems_editingItem,
} = useInvetoryItemsActionService();

const { inventoryItems_onDelete } = useInventoryItemsListService();

const isUpdateModal = ref(false);
const isUnitConversionSidebarVisible = ref(false);
const sidebarRef = ref<InstanceType<typeof InventorySidebarRight> | null>(null);

const openUnitConversionSidebar = () => {
  isUnitConversionSidebarVisible.value = true;
};

const onSubmit = () => {
  if (sidebarRef.value) {
    form.value.conversions = sidebarRef.value.getLatestConversions();
  }

  if (inventoryItemsAction_formOnMode.value === 'create') {
    inventoryItemsAction_onSubmit('create');
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
  if (sidebarRef.value) {
    form.value.conversions = sidebarRef.value.getLatestConversions();
  }
  await inventoryItemsAction_onSubmit('edit', inventoryItems_editingItem.value?.id);
};

const outletStore = useOutletStore();
const businessType = outletStore.outlet_currentOutlet?.businessType;

// handle image for retail
const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    form.value.imageFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      form.value.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removePhoto = () => {
  form.value.imagePreview = null;
  form.value.imageFile = null;
};


</script>

<template>
  <section id="items-create-edit" class="flex justify-center items-center min-h-screen p-4 sm:p-6">
    <div class="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <!-- Item Details -->
      <section>
        <div v-if="businessType !== 'Restaurant'">
          <div class="flex flex-col items-center justify-center mb-4">
            <p>{{ useLocalization('items.form.photo.label') }}</p>
            <AppBaseImage :src="form.imagePreview" alt="Photo" class="w-64 h-64 object-cover rounded-lg border" />

            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />

            <div class="flex items-center justify-center gap-2 mt-4">
              <PrimeVueButton
                :label="useLocalization('items.form.photo.button')"
                class="shadow-xs hover:bg-transparent rounded-xl px-8 py-2 text-primary border-primary border-2"
                variant="outlined"
                @click="triggerFileInput"
              >
                <template #icon>
                  <img :src="imageSVG" alt="" />
                </template>
              </PrimeVueButton>
              <PrimeVueButton
                v-if="form.imagePreview"
                variant="text"
                severity="danger"
                :label="useLocalization('items.form.photo.delete')"
                @click="removePhoto"
              >
                <template #icon>
                  <AppBaseSvg name="delete" class="!w-5 !h-5" />
                </template>
              </PrimeVueButton>
            </div>
          </div>
        </div>
        <h3 class="font-semibold text-lg text-primary mb-4">{{ useLocalization('items.form.details') }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Item Name -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="item-name"
            :name="useLocalization('items.form.name')"
            spacing-bottom="mb-0"
            :validators="itemFormValidation.name"
          >
            <PrimeVueInputText
              id="item-name"
              v-model="form.name"
              class="w-full"
              :class="{ ...classes }"
              :placeholder="useLocalization('items.form.namePlaceholder')"
              required
            />
          </AppBaseFormGroup>

          <!-- Brand -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="brand"
            :name="useLocalization('items.form.brand')"
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
              :placeholder="useLocalization('items.form.brandPlaceholder')"
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
            :name="useLocalization('items.form.barcode')"
            spacing-bottom="mb-0"
          >
            <div class="relative w-full">
              <PrimeVueInputText
                id="barcode"
                v-model="form.barcode"
                :placeholder="useLocalization('items.form.barcodePlaceholder')"
                class="w-full pr-8"
                :class="{ ...classes }"
              />
              <PrimeVueInputIcon
                class="absolute right-2 top-7 -translate-y-1/2 w-5 h-5 bg-transparent border-none text-gray-400"
                type="button"
              >
                <AppBaseSvg name="scan" class="h-5 w-5" />
              </PrimeVueInputIcon>
            </div>
          </AppBaseFormGroup>

          <!-- SKU -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="sku"
            :name="useLocalization('items.form.sku')"
            spacing-bottom="mb-0"
            :validators="itemFormValidation.sku"
          >
            <PrimeVueInputText
              id="sku"
              v-model="form.sku"
              class="w-full"
              :class="{ ...classes }"
              :placeholder="useLocalization('items.form.skuPlaceholder')"
              required
            />
          </AppBaseFormGroup>

          <!-- Category -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="category"
            :name="useLocalization('items.form.category')"
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
              :placeholder="useLocalization('items.form.categoryPlaceholder')"
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
            :name="useLocalization('items.form.unit')"
            spacing-bottom="mb-0"
            :validators="itemFormValidation.unit"
          >
            <PrimeVueDropdown
              id="unit"
              v-model="form.unit"
              :options="ITEM_UNIT_DROPDOWN"
              option-label="label"
              option-value="value"
              filter
              show-clear
              :placeholder="useLocalization('items.form.unitPlaceholder')"
              class="w-full"
              :class="{ ...classes }"
            />
            <div v-if="businessType === 'Restaurant'" class="mt-2 flex items-center gap-2">
              <PrimeVueButton
                icon="pi pi-calculator"
                class="p-button-secondary text-primary p-button-sm"
                @click="openUnitConversionSidebar"
              />
              <span class="text-sm">Unit Conversion</span>
            </div>
          </AppBaseFormGroup>

          <!-- Notes (full width di mobile, half di tablet+) -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="notes"
            :name="useLocalization('items.form.notes')"
            spacing-bottom="mb-0"
            class="col-span-1 md:col-span-2"
          >
            <PrimeVueTextarea id="notes" v-model="form.notes" rows="3" class="w-full" :class="{ ...classes }" />
          </AppBaseFormGroup>
        </div>
      </section>

      <!-- Stock & Inventory -->
      <section>
        <h3 class="font-semibold text-lg text-primary mb-4">{{ useLocalization('items.form.stock') }}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium text-gray-700 mb-1"
            is-name-as-label
            :name="useLocalization('items.form.minStockQuantity')"
            :validators="itemFormValidation.minimumStockQuantity"
          >
            <PrimeVueInputNumber v-model="form.minimumStockQuantity" class="w-full" :class="{ ...classes }" />
          </AppBaseFormGroup>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium text-gray-700 mb-1"
            is-name-as-label
            :name="useLocalization('items.form.reorderLevel')"
            :validators="itemFormValidation.reorderLevel"
          >
            <PrimeVueInputNumber v-model="form.reorderLevel" class="w-full" :class="{ ...classes }" />
          </AppBaseFormGroup>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="storage-location"
            :name="useLocalization('items.form.storageLocation')"
            spacing-bottom="mb-0"
            :validators="itemFormValidation.storageLocation"
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
              :placeholder="useLocalization('items.form.storageLocationPlaceholder')"
              class="w-full"
              :class="{ ...classes }"
            />
          </AppBaseFormGroup>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 hidden">
           <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium text-gray-700 mb-1 hidden"
            is-name-as-label
            :name="useLocalization('items.form.expiryDate')"
            :validators="itemFormValidation.expiryDate"
          >
            <div class="p-input-icon-right w-full">
              <PrimeVueCalendar
                v-model="form.expiryDate as unknown as Date"
                date-format="yy-mm-dd"
                class="w-full hidden"
                :class="{ ...classes }"
              />
            </div>
          </AppBaseFormGroup>
           <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium text-gray-700 mb-1 hidden"
            is-name-as-label
            :name="useLocalization('items.form.stockQuantity')"
            :validators="itemFormValidation.stockQuantity"
          >
            <PrimeVueInputNumber v-model="form.stockQuantity" class="w-full hidden" :class="{ ...classes }" />
          </AppBaseFormGroup>
        </div>
      </section>

      <!-- Price & Supplier -->
      <section>
        <h3 class="font-semibold text-lg text-primary mb-4">
          {{ useLocalization('items.form.priceAndSupplier') }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium text-gray-700 mb-1"
            is-name-as-label
            :name="
              businessType === 'Restaurant'
                ? useLocalization('items.form.pricePerUnit')
                : useLocalization('items.form.priceRetail')
            "
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
            v-if="businessType !== 'Restaurant'"
            v-slot="{ classes }"
            class-label="block text-sm font-medium text-gray-700 mb-1"
            is-name-as-label
            :name="useLocalization('items.form.priceGrosir')"
            :validators="itemFormValidation.priceGrosir"
          >
            <PrimeVueInputNumber
              v-model="form.priceGrosir"
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
            :name="useLocalization('items.form.supplier')"
            :validators="itemFormValidation.supplierId"
          >
            <PrimeVueDropdown
              v-model="form.supplierId"
              :options="suppliers"
              option-label="supplierName"
              option-value="id"
              filter
              show-clear
              :placeholder="useLocalization('items.form.supplierPlaceholder')"
              class="w-full"
              :class="{ ...classes }"
            />
          </AppBaseFormGroup>
        </div>
      </section>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
        <PrimeVueButton
          :label="useLocalization('items.form.buttons.cancel')"
          variant="text"
          class="w-full sm:w-auto !px-6 border-2 border-primary"
          @click="onCancel"
        />
        <PrimeVueButton
          :label="
            useLocalization(
              inventoryItemsAction_formOnMode === 'create'
                ? 'items.form.buttons.add'
                : 'items.form.buttons.update',
            )
          "
          class="w-full sm:w-auto !px-6 bg-primary text-white"
          :disabled="!inventoryItemsAction_isValid"
          @click="onSubmit"
        />
      </div>

      <PrimeVueButton
        v-if="inventoryItemsAction_formOnMode !== 'create'"
        :label="useLocalization('items.form.buttons.delete')"
        severity="danger"
        icon="pi pi-trash"
        class="mt-4 sm:absolute sm:bottom-6 bg-transparent sm:right-20 !px-6 border-none text-red-600"
        @click="inventoryItems_onDelete(inventoryItems_editingItem?.id ?? '')"
      />
    </div>
  </section>

  <InventorySidebarRight
    v-model:visible="isUnitConversionSidebarVisible"
    :unit="form.unit"
    :initial-conversions="form.conversions"
    @save="form.conversions = $event"
  />

  <!-- Dialog Update -->
  <PrimeVueDialog :visible="isUpdateModal" modal header="">
    <template #container>
      <div class="w-full sm:w-[35rem] p-6 sm:p-8">
        <div class="flex flex-col items-center gap-4 text-center">
          <span><img :src="confirmationSVG" alt="confirmation" /></span>
          <h1 class="text-xl sm:text-2xl font-semibold">
            {{ useLocalization('items.form.dialog.updateConfirmationTitle') }}
          </h1>
          <p class="text-sm sm:text-base">{{ useLocalization('items.form.dialog.updateConfirmationMessage') }}</p>
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <PrimeVueButton
              variant="text"
              class="w-full sm:w-56 text-lg border-2 border-primary text-primary font-semibold"
              @click="cancelUpdate"
            >
              {{ useLocalization('items.form.buttons.cancel') }}
            </PrimeVueButton>
            <PrimeVueButton
              class="w-full sm:w-56 py-2 cursor-pointer border-2 border-primary rounded-lg text-white bg-primary font-semibold"
              unstyled
              :label="useLocalization('items.form.dialog.confirm')"
              @click="confirmUpdate"
            />
          </div>
        </div>
      </div>
    </template>
  </PrimeVueDialog>

  <AppBaseDialogConfirmation id="inventory-items-dialog-confirmation" />
</template>
