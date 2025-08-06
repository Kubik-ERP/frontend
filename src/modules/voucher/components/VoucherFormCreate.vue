<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { IProduct } from '@/modules/catalog-product/interfaces';
import { useVoucherCreateService } from '../services/voucher-create.service';
import excludeSVG from '@/app/assets/icons/exclude.svg';

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
  quota: 0,
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

const isFormValid = computed(
  () =>
    !!form.value.title &&
    !!form.value.code &&
    !!form.value.validity &&
    (form.value.isPercentage ? form.value.discountPercent > 0 : form.value.discountNominal > 0) &&
    (!form.value.enableMinTransaction || form.value.minTransaction >= 0) &&
    (!form.value.enableQuota || form.value.quota > 0) &&
    (form.value.productScope === 'all' || form.value.selectedProducts.length > 0),
);

function formatDate(date: string | Date | null) {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date.replace(/\//g, '-')) : date;

  // Ambil hanya tanggal untuk backend
  return d.toISOString().split('T')[0];
}

watch(
  form,
  val => {
    voucherFormData.value.code = val.code;
    voucherFormData.value.name = val.title;
    voucherFormData.value.is_percentage = val.isPercentage;
    voucherFormData.value.amount = val.isPercentage ? val.discountPercent : val.discountNominal;
    voucherFormData.value.minPrice = val.enableMinTransaction ? val.minTransaction : 0;
    voucherFormData.value.quota = val.enableQuota ? val.quota : 0;
    voucherFormData.value.type = val.productScope === 'all' ? 'all' : 'specific';
    voucherFormData.value.products = val.productScope === 'all' ? [] : val.selectedProducts;
    voucherFormData.value.startDate = val.validity?.[0] ? formatDate(val.validity[0]) : '';
    voucherFormData.value.endDate = val.validity?.[1] ? formatDate(val.validity[1]) : '';
    voucherFormData.value.maxDiscountPrice = val.maxDiscountPrice || 0;

    console.log('StartDate:', voucherFormData.value.startDate);
    console.log('EndDate:', voucherFormData.value.endDate);
  },
  { deep: true },
);

// --- Submit
const handleSubmit = async () => {
  try {
    await voucherFormOnSubmit();
  } catch (err) {
    voucherFormReset()
    console.error(err);
  }
};

/**
 * Description: Handle cancel action
 */

const nextRoute = ref<string | null>(null);
const isLeavingModal = ref(false);

const router = useRouter();

let hasConfirmedLeave = false;

const confirmLeave = () => {
  isLeavingModal.value = false;
  hasConfirmedLeave = true;

  if (nextRoute.value) {
    const targetRoute = nextRoute.value;
    nextRoute.value = null;
    router.push(targetRoute);
  }
};

const cancelLeave = () => {
  isLeavingModal.value = false;
  nextRoute.value = null;
  hasConfirmedLeave = false;
};

onBeforeRouteLeave((to, _from, next) => {
  if (hasConfirmedLeave) {
    hasConfirmedLeave = false;
    return next();
  }

  if (!isLeavingModal.value) {
    isLeavingModal.value = true;
    nextRoute.value = to.fullPath;
    next(false);
  }
});

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

// --- Tambahkan State untuk Dialog Preview
const isPreviewModal = ref(false);

// Hitung subtotal dari produk terpilih
const subtotal = computed(() => {
  if (form.value.productScope === 'all') {
    return voucherProductList.value.reduce((sum, p) => sum + (p.price ?? 0), 0);
  } else {
    return form.value.selectedProducts.reduce((sum, id) => {
      const product = voucherProductList.value.find(p => p.id === id);
      return sum + (product?.price ?? 0);
    }, 0);
  }
});

// Hitung total diskon
const discountTotal = computed(() => {
  if (form.value.isPercentage) {
    const percentDiscount = (subtotal.value * form.value.discountPercent) / 100;
    return Math.min(percentDiscount, form.value.maxDiscountPrice || percentDiscount);
  }
  return form.value.discountNominal;
});

// Handle klik Add Voucher → buka preview dialog
const openPreview = () => {
  isPreviewModal.value = true;
};

// Confirm di Preview → jalankan submit asli
const confirmPreview = async () => {
  isPreviewModal.value = false;
  await handleSubmit();
};
</script>

<template>
  <section class="flex flex-col gap-y-5 p-6 w-full max-w-6xl">
    <form @submit.prevent="openPreview">
      <!-- Title & Validity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppBaseFormGroup v-slot="{ classes }" class="flex flex-col gap-1" :class="{ '!mb-0': form.validity }"
          label-for="title" is-name-as-label :name="useLocalization('voucher.createEditVoucher.field.title')"
          :validators="voucherFormDataValidations.name">
          <PrimeVueInputText v-model="form.title" name="title" placeholder="PROMO RAMADHAN" :class="{ ...classes }"
            class="text-sm w-full" />
        </AppBaseFormGroup>

        <AppBaseFormGroup v-slot="{ classes }" class-label="font-normal text-sm text-text-secondary w-full"
          is-name-as-label label-for="validity" :name="useLocalization('voucher.createEditVoucher.field.validity')"
          :validators="voucherFormDataValidations.startDate">
          <PrimeVueDatePicker v-model="form.validity" name="validity" selection-mode="range" date-format="dd/mm/yy"
            show-icon :class="{ ...classes }" class="text-sm w-full" />
        </AppBaseFormGroup>
      </div>

      <!-- Quota & Promo Code -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <!-- Quota Input -->
        <div class="flex flex-col gap-1">
          <div class="flex flex-row gap-2">
            <PrimeVueCheckbox v-model="form.enableQuota" binary />
            <label class="font-normal text-sm text-text-secondary">
              Quota <span class="text-text-disabled">(Optional)</span>
            </label>
          </div>
          <div class="flex items-start gap-2">
            <div class="flex items-center border rounded-lg overflow-hidden w-fit">
              <button type="button"
                class="px-3 py-1 text-lg font-bold hover:bg-primary-300 disabled:text-gray-300 disabled:bg-gray-100 bg-primary-50 text-primary"
                :disabled="!form.enableQuota || form.quota <= 0" @click="form.quota = Math.max(0, form.quota - 1)">
                -
              </button>
              <div class="px-4 py-1 text-sm w-12 text-center">{{ form.quota }}</div>
              <button type="button"
                class="px-3 py-1 text-lg font-bold hover:bg-primary-300 disabled:text-gray-300 disabled:bg-gray-100 bg-primary-50 text-primary"
                :disabled="!form.enableQuota" @click="form.quota++">
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Promo Code Input -->
        <AppBaseFormGroup v-slot="{ classes }" class="flex flex-col gap-1" is-name-as-label
          :name="useLocalization('voucher.createEditVoucher.field.code')"
          :validators="voucherFormDataValidations.code">
          <PrimeVueInputText v-model="form.code" name="code" placeholder="PROMO2025" :class="{ ...classes }"
            class="text-sm w-full" />
        </AppBaseFormGroup>
      </div>

      <!-- Discount -->
      <div class="flex flex-row gap-6 mt-4 w-full">
        <!-- Discount -->
        <AppBaseFormGroup v-slot="{ classes }" class="flex flex-col gap-1 w-full" is-name-as-label
          :name="useLocalization('voucher.createEditVoucher.field.discount')"
          :validators="voucherFormDataValidations.amount">
          <PrimeVueInputNumber v-model="form.discountNominal" :disabled="form.isPercentage" mode="currency"
            currency="IDR" locale="id-ID" :class="{ ...classes }" class="text-sm w-full" />
        </AppBaseFormGroup>

        <!-- Minimum Transaction -->
        <AppBaseFormGroup v-slot="{ classes }" class="flex flex-col gap-1 w-full" name="minTransaction"
          :label="useLocalization('voucher.createEditVoucher.field.minTransaction')"
          :validators="voucherFormDataValidations.minTransaction">
          <div class="flex flex-row gap-2 items-start mb-1">
            <PrimeVueCheckbox v-model="form.enableMinTransaction" binary />
            <span class="font-normal text-sm text-text-secondary">
              {{ useLocalization('voucher.createEditVoucher.field.minTransaction') }}
              <span class="text-text-disabled">(Optional)</span>
            </span>
          </div>

          <PrimeVueInputNumber v-model="form.minTransaction" :disabled="!form.enableMinTransaction" mode="currency"
            currency="IDR" locale="id-ID" :class="{ ...classes }" class="text-sm w-full"
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
              <div v-for="product in filteredProducts" :key="product.id"
                class="flex justify-between items-center p-3 cursor-pointer transition rounded-md mb-2 border hover:shadow-sm"
                :class="form.selectedProducts.includes(product.id)
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 bg-white'
                  " @click="toggleSelectProduct(product.id)">
                <div class="flex items-start gap-2">
                  <PrimeVueCheckbox :binary="true" :model-value="form.selectedProducts.includes(product.id)" @click.stop
                    @update:model-value="toggleSelectProduct(product.id)" />
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
              <div v-if="form.selectedProducts.length === 0"
                class="flex justify-center items-center text-gray-400 text-sm h-full py-4">
                No Item Selected
              </div>

              <div v-for="id in form.selectedProducts" :key="id"
                class="flex justify-between items-center border border-gray-200 rounded-md p-3 hover:shadow-sm transition bg-white">
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
                  <PrimeVueButton icon="pi pi-trash" class="p-button-text p-button-danger p-button-rounded !w-8 !h-8"
                    @click.stop="removeSelectedProduct(id)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-start gap-4 mt-6">
        <PrimeVueButton label="Cancel" class="p-button-outlined p-button-secondary px-6" @click="handleCancel" />
        <PrimeVueButton label="Add Voucher" :disabled="!isFormValid || voucherFormIsLoading"
          class="p-button-primary px-6" type="submit" />
      </div>
    </form>
  </section>

  <!-- Dialog Preview -->
  <PrimeVueDialog :visible="isPreviewModal" modal :style="{ width: '50rem', maxWidth: '80vw' }" header="Voucher Preview"
    @hide="isPreviewModal = false">
    <template #container>
      <div class="p-8 bg-gray-50 rounded-xl">
        <div class="grid grid-cols-1 md:grid-cols-1 gap-8">
          <!-- Order Summary -->
          <div class="bg-white border border-primary rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <i class="pi pi-shopping-cart text-primary"></i>
              Order Summary
            </h3>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">Subtotal:</span>
              <span class="font-medium text-gray-800">{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm mt-2 text-primary font-medium">
              <span>Discount Applied:</span>
              <span>-{{ formatCurrency(discountTotal) }}</span>
            </div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-red-600">Tax (10%):</span>
              <span class="font-medium text-red-800">{{ formatCurrency(subtotal * 0.1) }}</span>
            </div>
            <hr class="my-3 border-gray-200" />
            <div class="flex justify-between text-lg font-bold mt-2 text-gray-900">
              <span>Final Total:</span>
              <span class="text-primary">{{ formatCurrency(subtotal + subtotal * 0.1 - discountTotal) }}</span>
            </div>
          </div>

          <!-- Discount Details -->
          <div class="bg-white border border-primary rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <i class="pi pi-percentage text-primary"></i>
              Discount Details
            </h3>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">Name</span>
              <span class="font-medium text-gray-900">{{ form.title || '-' }}</span>
            </div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">Type</span>
              <span class="font-medium text-gray-900">{{
                form.isPercentage ? 'Percentage' : 'Fixed Amount'
              }}</span>
            </div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">Value</span>
              <span class="font-medium text-gray-900">
                {{ form.isPercentage ? form.discountPercent + '%' : formatCurrency(form.discountNominal) }}
              </span>
            </div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">Period</span>
              <span class="font-medium text-gray-900">
                {{ form.validity ? formatDate(form.validity[0]) + ' to ' + formatDate(form.validity[1]) : '-' }}
              </span>
            </div>
            <!-- <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">Rounding Method</span>
              <span class="font-medium text-gray-900">Round Down</span>
            </div> -->
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-4 mt-8">
          <PrimeVueButton label="Cancel" class="p-button-outlined p-button-secondary w-32 h-11 text-base font-medium"
            @click="isPreviewModal = false" />
          <PrimeVueButton label="Confirm"
            class="p-button-primary w-32 h-11 text-base font-medium shadow-sm hover:shadow-md transition-shadow"
            @click="confirmPreview" />
        </div>
      </div>
    </template>
  </PrimeVueDialog>

  <!-- Leave Dialog -->
  <PrimeVueDialog :visible="isLeavingModal" modal header="">
    <template #container>
      <div class="w-[35rem] p-8">
        <div class="flex flex-col items-center gap-4 text-center">
          <img :src="excludeSVG" alt="Delete icon" class="mx-auto" />
          <h1 class="text-2xl font-semibold">Yakin meninggalkan halaman?</h1>
          <p>Semua data yang sudah di inputkan akan hilang</p>
          <div class="flex items-center justify-between gap-4">
            <PrimeVueButton class="text-lg w-56 text-primary font-semibold" variant="text"
              :label="useLocalization('productDetail.leavePageModal.discardButton')" @click="confirmLeave" />
            <PrimeVueButton class="w-56 text-lg border-2 border-primary text-primary font-semibold" variant="text"
              :label="useLocalization('productDetail.leavePageModal.cancelButton')" @click="cancelLeave" />
          </div>
        </div>
      </div>
    </template>
  </PrimeVueDialog>
</template>
