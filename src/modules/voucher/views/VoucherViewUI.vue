<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useVoucherViewService } from "../services/voucher-view.service";
import { PRODUCT_SELECTED_LIST_COLUMNS } from "../constants";

const {
  voucherView_voucher,
  voucherView_fetchVoucher,
  voucherView_handleEdit
} = useVoucherViewService();

const route = useRoute();
const voucherId = route.params.id as string;

onMounted(() => {
  voucherView_fetchVoucher(voucherId);
});

/* -----------------------------
 * Format Currency Helper (Rp)
 * ---------------------------*/
function formatCurrency(value?: number): string {
  if (!value) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

// Computed untuk formatting tanggal
const startPeriod = computed(() => {
  const date = voucherView_voucher?.value?.data?.startPeriod;
  return date ? new Date(date).toLocaleDateString("id-ID") : "-";
});

const endPeriod = computed(() => {
  const date = voucherView_voucher?.value?.data?.endPeriod;
  return date ? new Date(date).toLocaleDateString("id-ID") : "-";
});

</script>

<template>
  <div class="voucher-view-ui flex justify-center items-start mt-5 max-w-7xl mx-auto">
    <div class="w-full p-6">

      <!-- Voucher Details -->
      <div class="grid grid-cols-3 gap-y-6 gap-x-10 mb-6">
        <div>
          <p class="text-gray-500 text-sm mb-1">{{ useLocalization('voucher.details.field.name') }}</p>
          <p class="font-semibold text-black">{{ voucherView_voucher?.data.name }}</p>
        </div>
        <div>
          <p class="text-gray-500 text-sm mb-1">{{ useLocalization('voucher.details.field.validity') }}</p>
          <p class="text-black">
            {{ startPeriod }} - {{ endPeriod }}
          </p>
        </div>
        <div>
          <p class="text-gray-500 text-sm mb-1">{{ useLocalization('voucher.details.field.quota') }}</p>
          <p class="text-black">{{ voucherView_voucher?.data.quota }}</p>
        </div>

        <div>
          <p class="text-gray-500 text-sm mb-1">{{ useLocalization('voucher.details.field.discount-nominal') }}</p>
          <div class="flex items-center gap-2 text-black">
            <!-- Diskon Persen -->
            <template v-if="voucherView_voucher?.data.isPercent == true">
              <span>{{ voucherView_voucher?.data.amount }}%</span>
              <span class="text-gray-400 text-sm">
                {{ useLocalization('voucher.details.field.max-discount-price') }}
                {{ formatCurrency(voucherView_voucher?.data.minPrice || 0) }}
              </span>
            </template>

            <!-- Diskon Nominal -->
            <template v-else>
              <span>{{ formatCurrency(voucherView_voucher?.data.amount || 0) }}</span>
            </template>
          </div>
        </div>

        <div>
          <p class="text-gray-500 text-sm mb-1">{{ useLocalization('voucher.details.field.min-transaction') }}</p>
          <p class="text-black">
            {{ formatCurrency(voucherView_voucher?.data.minPrice || 0) }}
          </p>
        </div>

        <div>
          <p class="text-gray-500 text-sm mb-1">{{ useLocalization('voucher.details.field.last-update') }}</p>
          <p class="text-black">
            {{ voucherView_voucher?.data.updatedAt
              ? new Date(voucherView_voucher.data.updatedAt).toLocaleDateString('id-ID')
              : '-' }}
          </p>
        </div>

        <div>
          <p class="text-gray-500 text-sm mb-1">{{ useLocalization('voucher.details.field.product-scope') }}</p>
          <p class="text-black">{{ voucherView_voucher?.data.isApplyAllProducts ? "All Product" :
            useLocalization('voucher.details.field.selected-products') }}</p>
        </div>
      </div>

      <!-- Product Table -->
      <div v-if="voucherView_voucher?.data.isApplyAllProducts == false" class="mt-6">
        <AppBaseDataTable :columns="PRODUCT_SELECTED_LIST_COLUMNS" header-title="Product Selected"
          :data="voucherView_voucher?.data.voucherHasProducts" :is-using-custom-body="true" :is-using-pagination="false"
          :is-using-header="false" :is-using-filter="false" class="border border-gray-200 rounded-md overflow-hidden">
          <template #body="{ column, data }">
            <template v-if="column.value === 'name'">
              <span>{{ data.products?.name || '-' }}</span>
            </template>

            <template v-else-if="column.value === 'category'">
              <span>{{ data.products?.categoriesHasProducts.map((item: any) => item.categories.category).join(', ') || '-' }}</span>
            </template>

            <template v-else-if="column.value === 'price'">
              <div v-if="data.products?.discountPrice" class="flex flex-col">
                <span class="text-gray-400 line-through text-sm">
                  {{ formatCurrency(data.products.price) }}
                </span>
                <span class="font-semibold text-black">
                  {{ formatCurrency(data.products.discountPrice) }}
                </span>
              </div>
              <div v-else>
                <span class="font-semibold text-black">
                  {{ formatCurrency(data.products?.price || 0) }}
                </span>
              </div>
            </template>
          </template>
        </AppBaseDataTable>
      </div>

      <!-- Action Button -->
      <div v-if="!voucherView_voucher?.data.isApplied" class="mt-4">
        <button
          class="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-blue-50 transition"
          @click="voucherView_handleEdit(voucherView_voucher?.data.id || '')">
          <!-- Icon Edit -->
          <AppBaseSvg name="edit" class="!w-4 !h-4" />
          Edit Voucher
        </button>
      </div>

    </div>
  </div>

</template>
