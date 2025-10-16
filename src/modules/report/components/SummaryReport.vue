<script setup lang="ts">
const props = defineProps({
  summary: {
    type: Object,
    required: true,
    default: () => ({
      jumlahTerjual: 0,
      kotor: 0,
      pajak: 0,
      biayaLayanan: 0,
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
          <tr class="bg-primary-border">
            <th class="text-left p-1.5">Qty Sold</th>
            <td class="text-right p-1.5">
              {{ useCurrencyFormat({ data: props.summary?.jumlahTerjual, hidePrefix: true }) }}
            </td>
          </tr>
          <tr>
            <th class="text-left p-1.5">Gross Sales</th>
            <td class="text-right p-1.5">{{ useCurrencyFormat({ data: props.summary?.kotor }) }}</td>
          </tr>
          <tr class="bg-primary-border">
            <th class="text-left p-1.5">Tax</th>
            <td class="text-right p-1.5">{{ useCurrencyFormat({ data: props.summary?.pajak }) }}</td>
          </tr>
          <tr>
            <th class="text-left p-1.5">Service Charge</th>
            <td class="text-right p-1.5">{{ useCurrencyFormat({ data: props.summary?.biayaLayanan }) }}</td>
          </tr>
          <tr class="bg-primary-border">
            <th class="text-left p-1.5">Discount</th>
            <td class="text-right p-1.5">{{ useCurrencyFormat({ data: props.summary?.diskonItem }) }}</td>
          </tr>
          <tr>
            <th class="text-left p-1.5">Nett Sales</th>
            <td class="text-right p-1.5">{{ useCurrencyFormat({ data: props.summary?.totalPenjualan }) }}</td>
          </tr>
          <tr class="bg-primary-border">
            <th class="text-left p-1.5">Voucher Used</th>
            <td class="text-right p-1.5">
              {{ useCurrencyFormat({ data: props.summary?.countPenggunaanVoucher, hidePrefix: true }) }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </PrimeVueCard>
</template>
