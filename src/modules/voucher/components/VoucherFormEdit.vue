<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IProduct } from '@/modules/catalog-product/interfaces';
import { useVoucherEditService } from '../services/voucher-edit.service';
import confirmationSVG from '@/app/assets/icons/confirmation.svg';
import { useVoucherCreateService } from '../services/voucher-create.service';
import { IVoucherEditRequest } from '../interfaces/voucher-edit.interface';

// --- API Service (Edit)
const {
  voucherEdit_formData,
  voucherFormDataValidations,
  voucherEdit_fetchVoucher,
  voucherEdit_submit,
  voucherEdit_isLoading,
} = useVoucherEditService();

const { voucherProductList } = useVoucherCreateService();

// --- State untuk UI sama seperti Create
const form = ref({
  title: '',
  validity: null as [Date, Date] | null,
  enableQuota: false,
  quota: 1,
  promoCode: '',
  enableMinTransaction: false,
  minTransaction: 0,
  isPercentage: false,
  discountPercent: 0,
  maxDiscountPrice: 0,
  discountNominal: 0,
  productScope: 'all',
  selectedProducts: [] as string[],
});

// Router & fetch data
const route = useRoute();
const router = useRouter();
const voucherId = route.params.id as string;

onMounted(async () => {
  await voucherEdit_fetchVoucher(voucherId);

  // Mapping dari data API ke form UI
  const v = voucherEdit_formData.value;
  console.log(v.hasProducts.products);
  form.value.title = v.name;
  form.value.promoCode = v.promoCode;
  form.value.validity = v.startPeriod && v.endPeriod ? [new Date(v.startPeriod), new Date(v.endPeriod)] : null;
  form.value.enableQuota = v.quota > 0;
  form.value.quota = v.quota || 0;
  form.value.enableMinTransaction = v.minPrice > 0;
  form.value.minTransaction = v.minPrice || 0;
  form.value.isPercentage = v.isPercent;
  form.value.discountPercent = v.isPercent ? v.amount : 0;
  form.value.discountNominal = v.isPercent ? 0 : v.amount;
  form.value.maxDiscountPrice = v.hasProducts?.type === 'specific' ? v.maxPrice || 0 : 0;
  form.value.productScope = v.hasProducts?.type || 'all';
  form.value.selectedProducts = v.hasProducts?.products || [];
});

// Format currency helper
const formatCurrency = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

const buildVoucherPayload = (): IVoucherEditRequest => {
  const [start, end] = form.value.validity || [null, null];

  return {
    name: form.value.title,
    promoCode: form.value.promoCode,
    amount: form.value.isPercentage ? form.value.discountPercent : form.value.discountNominal,
    minPrice: form.value.enableMinTransaction ? form.value.minTransaction : 0,
    maxPrice: form.value.isPercentage ? form.value.maxDiscountPrice : form.value.discountNominal,
    startPeriod: start ? start.toLocaleDateString('sv-SE') : '',
    endPeriod: end ? end.toLocaleDateString('sv-SE') : '',
    status: voucherEdit_formData.value.status || 'active',
    quota: form.value.quota,
    isPercent: form.value.isPercentage,
    hasProducts: {
      type: form.value.productScope === 'all' ? 'all' : 'specific',
      products: form.value.productScope === 'specific' ? form.value.selectedProducts.filter(Boolean) : [],
    },
  };
};

// Submit form
const handleUpdateProduct = async () => {
  const payload = buildVoucherPayload();
  console.log('payload : ', payload);
  await voucherEdit_submit(voucherId, payload);
  router.push({ name: 'voucher-view', params: { id: voucherId } });
};

// Modal state
const isUpdateModal = ref(false);

// Your action to call when confirming
const confirmUpdate = async () => {
  try {
    await handleUpdateProduct();

    router.push({ name: 'voucher.index' });

    isUpdateModal.value = false;
  } catch (error) {
    console.error('Failed to update product:', error);
    // Optionally show error feedback
  }
};

// Cancel just closes the modal
const cancelUpdate = () => {
  isUpdateModal.value = false;
};

// helpers
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
</script>

<template>
  <section class="flex flex-col gap- p-6 w-full max-w-6xl">
    <form @submit.prevent="isUpdateModal = true">
      <!-- Title & Validity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class="flex flex-col gap-1"
          :class="{ '!mb-0': form.validity }"
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
          v-slot="{ classes }"
          class-label="font-normal text-sm text-text-secondary w-full"
          is-name-as-label
          label-for="validity"
          :name="useLocalization('voucher.createEditVoucher.field.validity')"
          :validators="voucherFormDataValidations.startDate"
        >
          <PrimeVueDatePicker
            v-model="form.validity"
            :hide-on-range-selection="true"
            name="validity"
            selection-mode="range"
            date-format="dd/mm/yy"
            show-icon
            :class="{ ...classes }"
            class="text-sm w-full"
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
            v-model="form.promoCode"
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
        <label class="font-normal text-sm text-text-secondary">Produk*</label>

        <!-- Radio Buttons -->
        <div class="flex flex-col items-start gap-6">
          <div class="flex flex-row items-start gap-1">
            <PrimeVueRadioButton v-model="form.productScope" clasinput-id="all" value="all" />
            <label for="all" class="text-sm text-black">All Product</label>
          </div>

          <div class="flex flex-row items-start gap-1">
            <PrimeVueRadioButton v-model="form.productScope" input-id="specific" value="specific" />
            <label for="specific" class="text-sm text-black">Selected Product</label>
          </div>
        </div>

        <!-- Product Grid -->
        <div v-if="form.productScope === 'specific'" class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-start gap-4 mt-6">
        <PrimeVueButton label="Cancel" class="p-button-outlined p-button-secondary px-6" @click="router.back()" />
        <PrimeVueButton
          label="Update Voucher"
          :disabled="voucherEdit_isLoading"
          class="p-button-primary px-6"
          type="submit"
        />
      </div>
    </form>
  </section>

  <PrimeVueDialog :visible="isUpdateModal" modal header="">
    <template #container>
      <div class="w-[35rem] p-8">
        <div class="flex flex-col items-center gap-4 text-center">
          <span><img :src="confirmationSVG" alt="" /></span>
          <h1 class="text-2xl font-semibold">Are you sure want to update this voucher item?</h1>
          <p>The update will affect the voucher items</p>
          <div class="flex items-center justify-between gap-4">
            <PrimeVueButton
              variant="text"
              class="w-56 text-lg border-2 border-primary text-primary font-semibold"
              @click="cancelUpdate"
              >Cancel</PrimeVueButton
            >
            <PrimeVueButton
              class="text-xl w-56 py-2 cursor-pointer border-2 border-primary rounded-lg text-white bg-primary font-semibold"
              unstyled
              label="Yes, I'm Sure"
              @click="confirmUpdate"
            />
          </div>
        </div>
      </div>
    </template>
  </PrimeVueDialog>
</template>
