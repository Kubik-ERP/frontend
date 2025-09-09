<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { IProduct } from '@/modules/catalog-product/interfaces';
import { useVoucherCreateService } from '../services/voucher-create.service';

// --- API Service
const {
  voucherFormData,
  voucherFormDataValidations,
  // voucherFormSetData,
  voucherFormIsLoading,
  voucherFormReset,
  voucherFormOnSubmit,
  voucherProductList,
} = useVoucherCreateService();

// --- State untuk UI
const form = ref({
  title: '',
  code: '',
  validity: null as [Date, Date] | null,
  enableQuota: false,
  quota: 1,
  enableMinTransaction: false,
  minTransaction: 0,
  isPercentage: false,
  discountPercent: 0,
  maxDiscountPrice: 0,
  discountNominal: 0,
  productScope: 'all',
  selectedProducts: [] as string[],
});

// --- Filter Product
const searchProduct = ref('');
const filteredProducts = computed(() =>
  voucherProductList.value.filter((p: IProduct) =>
    p.name.toLowerCase().includes(searchProduct.value.toLowerCase()),
  ),
);

// --- Helper
const getProductName = (id: string) => voucherProductList.value.find(p => p.id === id)?.name || '';

const getProductPrice = (id: string) => {
  const product = voucherProductList.value.find(p => p.id === id);
  return product?.price ?? 0;
};

const getProductCategory = (id: string) => {
  const product = voucherProductList.value.find(p => p.id === id);
  return product?.categoriesHasProducts?.join(', ') || '-';
};

const getProductOldPrice = (id: string) => {
  const product = voucherProductList.value.find(p => p.id === id);
  return product?.discountPrice ?? null;
};

function toggleSelectProduct(id: string) {
  const idx = form.value.selectedProducts.indexOf(id);
  if (idx === -1) {
    form.value.selectedProducts.push(id);
  } else {
    form.value.selectedProducts.splice(idx, 1);
  }
}

function removeSelectedProduct(id: string) {
  const idx = form.value.selectedProducts.indexOf(id);
  if (idx !== -1) {
    form.value.selectedProducts.splice(idx, 1);
  }
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);



function formatDate(date: string | Date | null) {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date.replace(/\//g, '-')) : date;
  // Ambil hanya tanggal untuk backend
  return d.toLocaleDateString('sv-SE');
}

watch(
  form,
  val => {
    voucherFormData.value.code = val.code;
    voucherFormData.value.name = val.title;
    voucherFormData.value.is_percentage = val.isPercentage;
    voucherFormData.value.amount = val.isPercentage ? val.discountPercent : val.discountNominal;
    voucherFormData.value.minPrice = val.enableMinTransaction ? val.minTransaction : 0;
    voucherFormData.value.quota = form.value.quota;
    voucherFormData.value.type = val.productScope === 'all' ? 'all' : 'specific';
    voucherFormData.value.products = val.productScope === 'all' ? [] : val.selectedProducts;
    voucherFormData.value.startDate = val.validity?.[0] ? formatDate(val.validity[0]) : '';
    voucherFormData.value.endDate = val.validity?.[1] ? formatDate(val.validity[1]) : '';
    voucherFormData.value.maxDiscountPrice = val.maxDiscountPrice || 0;
  },
  { deep: true },
);

// --- Submit
const handleSubmit = async () => {
  try {
    await voucherFormOnSubmit();
  } catch (err) {
    voucherFormReset();
    voucherFormReset();
    console.error(err);
  }
};

/**
 * Description: Handle cancel action
 */

const nextRoute = ref<string | null>(null);
const isLeavingModal = ref(false);

const router = useRouter();
const handleCancel = () => {
  if (isLeavingModal.value) {
    isLeavingModal.value = false;
    nextRoute.value = null;
    return;
  }

  if (nextRoute.value) {
    router.push(nextRoute.value);
  } else {
    router.back();
  }
};


const onDateSelect = (val: [Date, Date] | null) => {
  form.value.validity = val;
};
</script>

<template>
  <section class="flex flex-col gap-y-5 p-6 w-full max-w-6xl body">
    <form @submit.prevent="handleSubmit">
      <!-- Title & Validity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class="flex flex-col gap-1"
          :class="{ '!mb-0': form.title }"
          label-for="title"
          is-name-as-label
          :name="useLocalization('voucher.createEditVoucher.field.title')"
          :validators="voucherFormDataValidations.name"
        >
          <PrimeVueInputText
            v-model="form.title"
            name="title"
            placeholder="PROMO RAMADHAN"
            :class="{ ...classes }"
            class="text-sm w-full"
          />
        </AppBaseFormGroup>

        <AppBaseFormGroup
          class="flex flex-col gap-1 font-normal text-sm text-text-secondary w-full"
          :class="{ '!mb-0': form.validity }"
          is-name-as-label
          label-for="validity"
          name="Validity"
        >
          <PrimeVueDatePicker
            v-model="form.validity"
            selection-mode="range"
            date-format="dd/mm/yy"
            class="text-sm w-full"
            show-icon
            show-popover
            :hide-on-range-selection="true"
            :manual-input="false"
            @update:value="onDateSelect"
          />
        </AppBaseFormGroup>
      </div>
      <!-- Quota & Promo Code -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <!-- Quota Input -->
        <div class="flex flex-col gap-1 border-none">
          <label class="font-normal text-sm text-text-secondary">
            Quota <span class="text-red-600">*</span>
          </label>
          <div class="flex items-start gap-2">
            <div class="flex items-center border-gray-100 rounded-lg overflow-hidden w-fit">
              <button
                type="button"
                class="px-3 py-1 text-lg font-bold hover:bg-primary-300 disabled:text-gray-300 disabled:bg-gray-100 bg-primary-50 text-primary"
                :disabled="form.quota <= 1"
                @click="form.quota = Math.max(1, form.quota - 1)"
              >
                -
              </button>
              <div class="px-4 py-1 text-sm w-12 text-center border-none">{{ form.quota }}</div>
              <button
                type="button"
                class="px-3 py-1 text-lg font-bold hover:bg-primary-300 bg-primary-50 text-primary"
                @click="form.quota++"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Promo Code Input -->
        <AppBaseFormGroup
          v-slot="{ classes }"
          class="flex flex-col gap-1"
          is-name-as-label
          :name="useLocalization('voucher.createEditVoucher.field.code')"
          :validators="voucherFormDataValidations.code"
        >
          <PrimeVueInputText
            v-model="form.code"
            name="code"
            placeholder="PROMO2025"
            :class="{ ...classes }"
            class="text-sm w-full"
          />
        </AppBaseFormGroup>
      </div>

      <!-- Discount -->
      <div class="flex flex-row gap-6 mt-4 w-full">
        <!-- Discount -->
        <AppBaseFormGroup
          v-slot="{ classes }"
          class="flex flex-col gap-1 w-full"
          is-name-as-label
          :name="useLocalization('voucher.createEditVoucher.field.discount')"
          :validators="voucherFormDataValidations.amount"
        >
          <PrimeVueInputNumber
            v-model="form.discountNominal"
            :disabled="form.isPercentage"
            mode="currency"
            currency="IDR"
            locale="id-ID"
            :class="{ ...classes }"
            class="text-sm w-full"
          />
        </AppBaseFormGroup>

        <!-- Minimum Transaction -->
        <AppBaseFormGroup
          v-slot="{ classes }"
          class="flex flex-col gap-1 w-full"
          name="minTransaction"
          :label="useLocalization('voucher.createEditVoucher.field.minTransaction')"
          :validators="voucherFormDataValidations.minTransaction"
        >
          <div class="flex flex-row gap-2 items-start mb-1">
            <PrimeVueCheckbox v-model="form.enableMinTransaction" binary />
            <span class="font-normal text-sm text-text-secondary">
              {{ useLocalization('voucher.createEditVoucher.field.minTransaction') }}
              <span class="text-text-disabled">(Optional)</span>
            </span>
          </div>

          <PrimeVueInputNumber
            v-model="form.minTransaction"
            :disabled="!form.enableMinTransaction"
            mode="currency"
            currency="IDR"
            locale="id-ID"
            :class="{ ...classes }"
            class="text-sm w-full"
          />
        </AppBaseFormGroup>
      </div>

      <!-- Discount Type -->
      <div class="flex items-center gap-2 w-48 mt-2">
        <PrimeVueInputSwitch v-model="form.isPercentage" />
        <span class="text-sm text-text-secondary">Percentage</span>
      </div>

      <div v-if="form.isPercentage" class="flex flex-row gap-3 mt-2 w-1/2">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class="flex flex-col gap-1 w-full"
          is-name-as-label
          :name="useLocalization('voucher.createEditVoucher.field.discountPercentage')"
          :validators="voucherFormDataValidations.amount"
        >
          <PrimeVueInputNumber
            v-model="form.discountPercent"
            :disabled="!form.isPercentage"
            mode="decimal"
            :class="{ ...classes }"
            class="text-sm w-full"
          />
        </AppBaseFormGroup>

        <!-- Max Discount Price -->
        <AppBaseFormGroup
          v-slot="{ classes }"
          class="flex flex-col gap-1 w-full"
          is-name-as-label
          :name="useLocalization('voucher.createEditVoucher.field.maxDiscountPrice')"
          :validators="voucherFormDataValidations.maxDiscountPrice"
        >
          <PrimeVueInputNumber
            v-model="form.maxDiscountPrice"
            :disabled="!form.isPercentage"
            mode="currency"
            currency="IDR"
            locale="id-ID"
            :class="{ ...classes }"
            class="text-sm w-full"
          />
        </AppBaseFormGroup>
      </div>

      <!-- Product Selection -->
      <div class="flex flex-col gap-2 mt-4">
        <label class="font-normal text-sm text-text-secondary">Produk <span class="text-red-700">*</span></label>

        <!-- Radio Buttons -->
        <div class="flex flex-col items-start gap-6">
          <div class="flex flex-row items-start gap-1">
            <PrimeVueRadioButton v-model="form.productScope" clasinput-id="all" value="all" />
            <label for="all" class="text-sm text-black">All Product</label>
          </div>

          <div class="flex flex-row items-start gap-1">
            <PrimeVueRadioButton v-model="form.productScope" input-id="selected" value="selected" />
            <label for="selected" class="text-sm text-black">Selected Product</label>
          </div>
        </div>

        <!-- Product Grid -->
        <div v-if="form.productScope === 'selected'" class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          <!-- Left: Product List -->
          <div class="flex flex-col border border-gray-200 rounded-lg overflow-hidden max-h-80">
            <div class="p-2 border-b bg-white sticky top-0 z-10">
              <PrimeVueInputText v-model="searchProduct" placeholder="Search Product" class="text-sm w-full" />
            </div>

            <div class="overflow-y-auto flex-1 p-2">
              <div
                v-for="product in filteredProducts"
                :key="product.id"
                class="flex justify-between items-center p-3 cursor-pointer transition rounded-md mb-2 border hover:shadow-sm"
                :class="
                  form.selectedProducts.includes(product.id)
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 bg-white'
                "
                @click="toggleSelectProduct(product.id)"
              >
                <div class="flex items-start gap-2">
                  <PrimeVueCheckbox
                    :binary="true"
                    :model-value="form.selectedProducts.includes(product.id)"
                    @click.stop
                    @update:model-value="toggleSelectProduct(product.id)"
                  />
                  <div class="flex flex-col">
                    <span class="text-sm font-medium">{{ product.name }}</span>
                    <span class="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded w-fit mt-1">
                      {{ product.categoriesHasProducts?.join(', ') }}
                    </span>
                  </div>
                </div>

                <div class="flex flex-col text-right">
                  <!-- Harga aktif -->
                  <span class="text-sm font-semibold text-black">
                    {{
                      product.discountPrice !== product.price
                        ? formatCurrency(product.price ?? 0)
                        : formatCurrency(product.price)
                    }}
                  </span>

                  <!-- Coret harga lama jika ada diskon -->
                  <span v-if="product.discountPrice !== product.price" class="text-xs text-gray-400 line-through">
                    {{ formatCurrency(product.price) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Selected Product -->
          <div class="flex flex-col border border-gray-200 rounded-lg overflow-hidden max-h-80">
            <div class="overflow-y-auto flex-1 p-2 flex flex-col gap-2">
              <div
                v-if="form.selectedProducts.length === 0"
                class="flex justify-center items-center text-gray-400 text-sm h-full py-4"
              >
                No Item Selected
              </div>

              <div
                v-for="id in form.selectedProducts"
                :key="id"
                class="flex justify-between items-center border border-gray-200 rounded-md p-3 hover:shadow-sm transition bg-white"
              >
                <div class="flex flex-col">
                  <span class="text-sm font-medium">{{ getProductName(id) }}</span>
                  <span class="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded w-fit mt-1">
                    {{ getProductCategory(id) }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <div class="flex flex-col text-right">
                    <span class="text-sm font-semibold text-black">{{ formatCurrency(getProductPrice(id)) }}</span>
                    <span v-if="getProductOldPrice(id) !== null" class="text-xs text-gray-400 line-through">
                      {{ formatCurrency(getProductOldPrice(id)!) }}
                    </span>
                  </div>
                  <PrimeVueButton
                    icon="pi pi-trash"
                    class="p-button-text p-button-danger p-button-rounded !w-8 !h-8"
                    @click.stop="removeSelectedProduct(id)"
                  />
                  <PrimeVueButton
                    icon="pi pi-trash"
                    class="p-button-text p-button-danger p-button-rounded !w-8 !h-8"
                    @click.stop="removeSelectedProduct(id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-start gap-4 mt-6">
        <PrimeVueButton label="Cancel" class="p-button-outlined p-button-secondary px-6" @click="handleCancel" />
        <PrimeVueButton
          label="Add Voucher"
          :disabled=" voucherFormIsLoading"
          class="p-button-primary px-6"
          type="submit"
        />
      </div>
    </form>
  </section>
</template>
