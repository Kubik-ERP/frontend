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
          <tr class="bg-secondary/10">
            <th class="text-left p-1.5">
              {{ useLocalization('reports.sales.summary_widget.qty_sold') }}
            </th>
            <td class="text-right p-1.5">
              {{ useCurrencyFormat({ data: props.summary?.jumlahTerjual, hidePrefix: true }) }}
            </td>
          </tr>
          <tr>
            <th class="text-left p-1.5">
              {{ useLocalization('reports.sales.summary_widget.gross_sales') }}
            </th>
            <td class="text-right p-1.5">{{ useCurrencyFormat({ data: props.summary?.kotor }) }}</td>
          </tr>
          <tr class="bg-secondary/10">
            <th class="text-left p-1.5">
              {{ useLocalization('reports.sales.summary_widget.tax') }}
            </th>
            <td class="text-right p-1.5">{{ useCurrencyFormat({ data: props.summary?.pajak }) }}</td>
          </tr>
          <tr>
            <th class="text-left p-1.5">
              {{ useLocalization('reports.sales.summary_widget.service_charge') }}
            </th>
            <td class="text-right p-1.5">{{ useCurrencyFormat({ data: props.summary?.biayaLayanan }) }}</td>
          </tr>
          <tr class="bg-secondary/10">
            <th class="text-left p-1.5">
              {{ useLocalization('reports.sales.summary_widget.discount') }}
            </th>
            <td class="text-right p-1.5">{{ useCurrencyFormat({ data: props.summary?.diskonItem }) }}</td>
          </tr>
          <tr>
            <th class="text-left p-1.5">
              {{ useLocalization('reports.sales.summary_widget.net_sales') }}
            </th>
            <td class="text-right p-1.5">{{ useCurrencyFormat({ data: props.summary?.totalPenjualan }) }}</td>
          </tr>
          <tr class="bg-secondary/10">
            <th class="text-left p-1.5">
              {{ useLocalization('reports.sales.summary_widget.voucher_used') }}
            </th>
            <td class="text-right p-1.5">
              {{ useCurrencyFormat({ data: props.summary?.countPenggunaanVoucher, hidePrefix: true }) }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </PrimeVueCard>
</template>