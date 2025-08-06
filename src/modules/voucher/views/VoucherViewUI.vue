<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useVoucherViewService } from "../services/voucher-view.service";

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
          <p class="text-black">{{ voucherView_voucher?.data.isApplyAllProducts ? "All Product" : useLocalization('voucher.details.field.selected-products') }}</p>
        </div>
      </div>

      <!-- Product Table -->
      <div v-if="!voucherView_voucher?.data.isApplyAllProducts" class="border border-primary rounded-md overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 text-sm font-medium text-primary">{{ useLocalization('voucher.productDetail.name') }}
              </th>
              <th class="py-2 px-4 text-sm font-medium text-primary">{{ useLocalization('voucher.productDetail.category')
                }}
              </th>
              <th class="py-2 px-4 text-sm font-medium text-primary">{{ useLocalization('voucher.productDetail.price') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in voucherView_voucher?.data.voucherHasProducts || []" :key="item.productsId"
              class="border-t hover:bg-gray-50 transition">
              <!-- Product Name -->
              <td class="py-2 px-4">{{ item.products?.name || '-' }}</td>

              <!-- Category -->
              <td class="py-2 px-4">{{ item.products.category}}</td>

              <!-- Price -->
              <td class="py-2 px-4">
                <template v-if="item.products?.discountPrice">
                  <div class="flex flex-col">
                    <span class="text-gray-400 line-through text-sm">
                      {{ formatCurrency(item.products.price) }}
                    </span>
                    <span class="font-semibold text-black">
                      {{ formatCurrency(item.products.discountPrice) }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  <span class="font-semibold text-black">
                    {{ formatCurrency(item.products?.price || 0) }}
                  </span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Action Button -->
      <div class="mt-4">
        <button
          class="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-blue-50 transition"
          @click="voucherView_handleEdit(voucherView_voucher?.data.id || '')">
          <!-- Icon Edit -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.232 5.232l3.536 3.536M9 11l3 3L22 4l-3-3-10 10zm0 0l-3 3m3-3L4 20" />
          </svg>
          {{ useLocalization('voucher.main.popover.edit') }}
        </button>
      </div>

    </div>
  </div>

</template>
