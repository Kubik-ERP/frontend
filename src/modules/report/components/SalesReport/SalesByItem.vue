<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
// service
import { useReportService } from '../../services/report.service';
const { salesReport_salesByItem_columns } = useReportService();

const popover = ref();

const TEMPORARY_FORMDATA = reactive({
  // ... other properties
  start_date: new Date(),
  end_date: new Date(),
});

const TEMPORARY_DATA = reactive([
  {
    productId: '#001',
    itemName: 'Spaghetti Aglio Olio',
    category: 'Pasta',
    qtySold: 120,
    unitPrice: 100000,
    grossSales: 12000000,
    discount: 1000000,
    netSales: 11000000,
    tax: 1100000,
    totalSales: 12100000,
  },
  {
    productId: '#002',
    itemName: 'Beef Fettuccine',
    category: 'Pasta',
    qtySold: 200,
    unitPrice: 100000,
    grossSales: 200000000,
    discount: 40000000,
    netSales: 160000000,
    tax: 16000000,
    totalSales: 176000000,
  },
  {
    productId: '#003',
    itemName: 'Lasagna',
    category: 'Pasta, Lunch, Dinner',
    qtySold: 90,
    unitPrice: 100000,
    grossSales: 90000000,
    discount: 0,
    netSales: 90000000,
    tax: 9000000,
    totalSales: 99000000,
  },
  {
    productId: '#004',
    itemName: 'Bolognese Mac n Cheese',
    category: 'Pasta, Dinner',
    qtySold: 100,
    unitPrice: 100000,
    grossSales: 100000000,
    discount: 0,
    netSales: 100000000,
    tax: 10000000,
    totalSales: 110000000,
  },
  {
    productId: '#005',
    itemName: 'Hummus',
    category: 'Middle East Food',
    qtySold: 100,
    unitPrice: 100000,
    grossSales: 100000000,
    discount: 0,
    netSales: 100000000,
    tax: 10000000,
    totalSales: 110000000,
  },
  {
    productId: '#006',
    itemName: 'Falafel',
    category: 'Middle East Food',
    qtySold: 100,
    unitPrice: 100000,
    grossSales: 100000000,
    discount: 0,
    netSales: 100000000,
    tax: 10000000,
    totalSales: 110000000,
  },
  {
    productId: '#007',
    itemName: 'Fried Rice',
    category: 'Asian Food, Breakfast',
    qtySold: 100,
    unitPrice: 100000,
    grossSales: 100000000,
    discount: 0,
    netSales: 100000000,
    tax: 10000000,
    totalSales: 110000000,
  },
  {
    productId: '#008',
    itemName: 'Fried Noodle',
    category: 'Asian Food, Breakfast',
    qtySold: 100,
    unitPrice: 100000,
    grossSales: 100000000,
    discount: 0,
    netSales: 100000000,
    tax: 10000000,
    totalSales: 110000000,
  },
  {
    productId: '#009',
    itemName: 'Lemon Tea Ice',
    category: 'Drink',
    qtySold: 100,
    unitPrice: 100000,
    grossSales: 100000000,
    discount: 0,
    netSales: 100000000,
    tax: 10000000,
    totalSales: 110000000,
  },
  {
    productId: '#010',
    itemName: 'Avocado Juice',
    category: 'Drink',
    qtySold: 100,
    unitPrice: 100000,
    grossSales: 100000000,
    discount: 0,
    netSales: 100000000,
    tax: 10000000,
    totalSales: 110000000,
  },
]);
</script>
<template>
  <section>
    <AppBaseDataTable
      :data="TEMPORARY_DATA"
      :columns="salesReport_salesByItem_columns"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Sales By Item</h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton variant="outlined" label="Export" @click="popover.toggle($event)">
          <template #icon>
            <AppBaseSvg name="export" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>
        <PrimeVuePopover
          ref="popover"
          :pt="{
            content: 'p-0',
          }"
        >
          <section id="popover-content" class="flex flex-col">
            <PrimeVueButton
              class="w-full text-black font-normal px-4 py-3"
              variant="text"
              label="Export to .pdf"
            />
            <PrimeVueButton
              class="w-full text-black font-normal px-4 py-3"
              variant="text"
              label="Export to .csv"
            />
          </section>
        </PrimeVuePopover>
      </template>

      <template #filter>
        <CustomDatePicker
          v-model:start-date="TEMPORARY_FORMDATA.start_date"
          v-model:end-date="TEMPORARY_FORMDATA.end_date"
        />
      </template>
    </AppBaseDataTable>
  </section>
</template>
