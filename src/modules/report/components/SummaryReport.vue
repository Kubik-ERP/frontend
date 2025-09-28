<script setup lang="ts">
const props = defineProps({
  summary: {
    type: Object,
    required: true,
    default: () => ({
      jumlahTerjual: 0,
      kotor: 0,
      pajak: 0,
      diskonItem: 0,
      refund: 0,
      totalPenjualan: 0,
      countPenggunaanVoucher: 0,
    }),
  },
});
</script>
<template>
  <PrimeVueCard>
    <template #content>
      <table class="w-full">
        <tbody>
          <tr class="bg-primary-background">
            <th class="text-left">Qty Sold</th>
            <td class="text-right">{{ props.summary?.jumlahTerjual }}</td>
          </tr>
          <tr>
            <th class="text-left">Gross Sales</th>
            <td class="text-right">{{ useCurrencyFormat({ data: props.summary?.kotor }) }}</td>
          </tr>
          <tr class="bg-primary-background">
            <th class="text-left">Tax</th>
            <td class="text-right">{{ useCurrencyFormat({ data: props.summary?.pajak }) }}</td>
          </tr>
          <tr>
            <th class="text-left">Discount</th>
            <td class="text-right">{{ useCurrencyFormat({ data: props.summary?.diskonItem }) }}</td>
          </tr>
          <tr class="bg-primary-background">
            <th class="text-left">Nett Sales</th>
            <td class="text-right">{{ useCurrencyFormat({ data: props.summary?.totalPenjualan }) }}</td>
          </tr>
          <tr>
            <th class="text-left">Voucher Used</th>
            <td class="text-right">{{ props.summary?.countPenggunaanVoucher }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </PrimeVueCard>
</template>
