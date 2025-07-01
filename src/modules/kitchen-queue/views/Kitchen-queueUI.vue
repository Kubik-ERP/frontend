<script setup>
import { ref, onMounted, nextTick } from 'vue';

const now = Date.now();

const randomOffset = () => {
  const min = 30 * 1000;
  const max = 5 * 60 * 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const originalInvoices = [
  {
    id: 'INV001',
    customer: 'Budi',
    eta: 10,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'A1, B2',
    items: [
      { name: 'Nasi Goreng', variant: 'Pedas', qty: 1 },
      { name: 'Mie Ayam', qty: 1 },
    ],
  },
  {
    id: 'INV002',
    customer: 'Sari',
    eta: 15,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'C3',
    items: [
      { name: 'Sate Ayam', variant: 'Tanpa Lemak', qty: 2, notes: 'Tambahkan lontong' },
      { name: 'Soto Betawi', variant: 'Biasa', qty: 1 },
      { name: 'Nasi Uduk', qty: 1, notes: 'Tanpa kacang' },
    ],
  },
  {
    id: 'INV003',
    customer: 'Udin',
    eta: 8,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'B1',
    items: [{ name: 'Bakso Urat', variant: 'Super', qty: 1, notes: 'Extra pedas' }],
  },
  {
    id: 'INV004',
    customer: 'Rina',
    eta: 12,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'D4',
    items: [
      { name: 'Ayam Bakar', variant: 'Manis', qty: 1, notes: 'Tanpa lalapan' },
      { name: 'Es Teh Manis', qty: 1 },
      { name: 'Tempe Mendoan', variant: 'Garing', qty: 1 },
    ],
  },
  {
    id: 'INV005',
    customer: 'Anto',
    eta: 5,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'A2',
    items: [
      { name: 'Nasi Kuning', variant: 'Komplit', qty: 1 },
      { name: 'Bakmi Jawa', variant: 'Basah', qty: 1, notes: 'Tanpa kecap' },
      { name: 'Wedang Jahe', qty: 1, notes: 'Kurang manis' },
    ],
  },
  {
    id: 'INV006',
    customer: 'Siti',
    eta: 20,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'F1',
    items: [
      { name: 'Rawon', variant: 'Spesial', qty: 1 },
      { name: 'Perkedel', qty: 2 },
    ],
  },
  {
    id: 'INV007',
    customer: 'Eko',
    eta: 9,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'E3',
    items: [
      { name: 'Lontong Sayur', variant: 'Pedas', qty: 1, notes: 'Tanpa telur' },
      { name: 'Es Campur', qty: 1 },
    ],
  },
  {
    id: 'INV008',
    customer: 'Linda',
    eta: 14,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'B3',
    items: [
      { name: 'Nasi Pecel', qty: 1, notes: 'Tanpa sambal' },
      { name: 'Kerupuk Udang', variant: 'Besar', qty: 1 },
      { name: 'Teh Tawar', qty: 1 },
    ],
  },
  {
    id: 'INV009',
    customer: 'Wawan',
    eta: 18,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'C1',
    items: [
      { name: 'Tahu Tek', variant: 'Sedang', qty: 1 },
      { name: 'Es Jeruk', qty: 1, notes: 'Tanpa gula' },
    ],
  },
  {
    id: 'INV010',
    customer: 'Dewi',
    eta: 6,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'A5',
    items: [
      { name: 'Nasi Padang', variant: 'Rendang', qty: 1, notes: 'Tanpa kuah' },
      { name: 'Sayur Nangka', qty: 1 },
      { name: 'Teh Manis Hangat', variant: 'Sedikit Gula', qty: 1 },
    ],
  },
  {
    id: 'INV011',
    customer: 'Agus',
    eta: 11,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'B4',
    items: [
      { name: 'Sop Iga', variant: 'Komplit', qty: 1, notes: 'Tanpa bawang goreng' },
      { name: 'Air Putih', qty: 1 },
    ],
  },
  {
    id: 'INV012',
    customer: 'Tini',
    eta: 7,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'G1',
    items: [
      { name: 'Bakwan Jagung', qty: 2 },
      { name: 'Nasi Campur Bali', variant: 'Biasa', qty: 1, notes: 'Kurangi sambal matah' },
    ],
  },
  {
    id: 'INV013',
    customer: 'Yuni',
    eta: 13,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'H2',
    items: [
      { name: 'Gado-Gado', qty: 1, notes: 'Tanpa kerupuk' },
      { name: 'Es Kelapa Muda', qty: 1 },
    ],
  },
  {
    id: 'INV014',
    customer: 'Tono',
    eta: 17,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'F3',
    items: [
      { name: 'Ayam Penyet', variant: 'Ekstra Sambal', qty: 1, notes: 'Pedas maksimal' },
      { name: 'Jus Alpukat', variant: 'Tanpa Cokelat', qty: 1 },
    ],
  },
  {
    id: 'INV015',
    customer: 'Raisa',
    eta: 10,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'G4',
    items: [
      { name: 'Sate Kambing', qty: 1 },
      { name: 'Nasi Putih', qty: 1 },
      { name: 'Teh Pucuk', qty: 1, notes: 'Dingin' },
    ],
  },
  {
    id: 'INV016',
    customer: 'Dian',
    eta: 19,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'A3',
    items: [
      { name: 'Nasi Liwet', variant: 'Komplit', qty: 1 },
      { name: 'Telur Dadar', qty: 2, notes: 'Agak gosong' },
    ],
  },
  {
    id: 'INV017',
    customer: 'Bambang',
    eta: 8,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'C5',
    items: [
      { name: 'Ikan Bakar', variant: 'Manis', qty: 1 },
      { name: 'Lalapan', qty: 1 },
    ],
  },
  {
    id: 'INV018',
    customer: 'Citra',
    eta: 16,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'E2',
    items: [
      { name: 'Soto Ayam', qty: 1, notes: 'Tanpa seledri' },
      { name: 'Kerupuk Bawang', qty: 1 },
      { name: 'Teh Botol', qty: 1, variant: 'Dingin' },
      { name: 'Soto Ayam', qty: 1, notes: 'Tanpa seledri' },
      { name: 'Kerupuk Bawang', qty: 1 },
      { name: 'Teh Botol', qty: 1, variant: 'Dingin' },
      { name: 'Soto Ayam', qty: 1, notes: 'Tanpa seledri' },
      { name: 'Kerupuk Bawang', qty: 1 },
      { name: 'Teh Botol', qty: 1, variant: 'Dingin' },
      { name: 'Soto Ayam', qty: 1, notes: 'Tanpa seledri' },
      { name: 'Kerupuk Bawang', qty: 1 },
      { name: 'Teh Botol', qty: 1, variant: 'Dingin' },
      { name: 'Soto Ayam', qty: 1, notes: 'Tanpa seledri' },
      { name: 'Kerupuk Bawang', qty: 1 },
      { name: 'Teh Botol', qty: 1, variant: 'Dingin' },
      { name: 'Soto Ayam', qty: 1, notes: 'Tanpa seledri' },
      { name: 'Kerupuk Bawang', qty: 1 },
      { name: 'Teh Botol', qty: 1, variant: 'Dingin' },
      { name: 'Kerupuk Bawang', qty: 1 },
      { name: 'Teh Botol', qty: 1, variant: 'Dingin' },
      { name: 'Soto Ayam', qty: 1, notes: 'Tanpa seledri' },
      { name: 'Kerupuk Bawang', qty: 1 },
      { name: 'Teh Botol', qty: 1, variant: 'Dingin' },
      { name: 'Soto Ayam', qty: 1, notes: 'Tanpa seledri' },
      { name: 'Kerupuk Bawang', qty: 1 },
      { name: 'Teh Botol', qty: 1, variant: 'Dingin' },
      { name: 'Soto Ayam', qty: 1, notes: 'Tanpa seledri' },
      { name: 'Kerupuk Bawang', qty: 1 },
      { name: 'Teh Botol', qty: 1, variant: 'Dingin' },
      { name: 'Soto Ayam', qty: 1, notes: 'Tanpa seledri' },
      { name: 'Kerupuk Bawang', qty: 1 },
      { name: 'Teh Botol', qty: 1, variant: 'Dingin' },
      { name: 'Soto Ayam', qty: 1, notes: 'Tanpa seledri' },
      { name: 'Kerupuk Bawang', qty: 1 },
      { name: 'Teh Botol', qty: 1, variant: 'Dingin' },
    ],
  },
  {
    id: 'INV017',
    customer: 'Bambang',
    eta: 8,
    startTime: new Date(now - randomOffset()),
    tableNumber: 'C5',
    items: [{ name: 'Lumpia Basah', variant: 'Agak pedas', qty: 1 }],
  },
];

const invoices = originalInvoices.map(invoice => ({
  ...invoice,
  startTime: new Date(now - randomOffset()),
}));

const dummyRefs = ref([]);
const columns = ref([]);
const durations = ref({});
let intervalId = null;

const generateColor = index => {
  const headerColor = ['bg-[#981C1C]', 'bg-[#B06900]', 'bg-[#367839]', 'bg-[#1C4A98]', 'bg-[#6B1C98]'];
  const backgroundColor = ['bg-[#FBEBEB]', 'bg-[#FFF5E6]', 'bg-[#FFFFFF]', 'bg-[#E6ECFB]', 'bg-[#F3E6FB]'];
  const borderColor = [
    'border-[#981C1C]',
    'border-[#B06900]',
    'border-[#367839]',
    'border-[#1C4A98]',
    'border-[#6B1C98]',
  ];

  const i = index % headerColor.length;
  return {
    background: backgroundColor[i],
    header: headerColor[i],
    border: borderColor[i],
    text: i % 2 === 0 ? 'text-gray-900' : 'text-gray-700',
  };
};

onMounted(async () => {
  await nextTick();

  const screenHeight = window.innerHeight;
  const headerHeight = 72;
  const padding = 49;
  const availableHeight = screenHeight - padding;

  const itemHeights = dummyRefs.value.map(el => el?.getBoundingClientRect().height + 1 || 60);

  let offset = 0;
  let globalCounter = 1;
  const invoiceChunks = [];
  const invoicePageMap = {};

  for (const invoice of invoices) {
    const currentHeights = itemHeights.slice(offset, offset + invoice.items.length);
    const chunks = [];
    let currentChunk = [];
    let currentHeight = 0;

    for (let i = 0; i < invoice.items.length; i++) {
      const height = currentHeights[i] + (currentChunk.length > 0 ? 2 : 0);
      if (currentHeight + height > availableHeight) {
        chunks.push(currentChunk);
        currentChunk = [];
        currentHeight = 0;
      }
      currentChunk.push(invoice.items[i]);
      currentHeight += height;
    }
    if (currentChunk.length) chunks.push(currentChunk);

    invoicePageMap[invoice.id] = chunks.length;

    for (let idx = 0; idx < chunks.length; idx++) {
      const chunk = chunks[idx];
      const totalHeight = chunk.reduce((acc, _, i) => acc + currentHeights[i] + (i > 0 ? 8 : 0), 0);

      invoiceChunks.push({
        id: `${invoice.id}${idx > 0 ? `-part${idx + 1}` : ''}`,
        customer: invoice.customer,
        eta: invoice.eta,
        startTime: invoice.startTime,
        tableNumber: invoice.tableNumber,
        items: chunk,
        height: totalHeight,
        isFirst: idx === 0,
        globalIndex: idx > 0 ? globalCounter - 1 : globalCounter,
        indexCounter: idx,
        invoiceId: invoice.id,
        totalPage: chunks.length,
      });

      if (idx === 0) globalCounter = globalCounter+1;
    }

    offset += invoice.items.length;
  }

  columns.value = [];
  const colHeights = [];
  let currentCol = 0;

  for (const chunk of invoiceChunks) {
    const height = chunk.indexCounter > 0 ? chunk.height : chunk.height + headerHeight + 2;

    if (!columns.value[currentCol]) {
      columns.value[currentCol] = [];
      colHeights[currentCol] = 0;
    }

    if (colHeights[currentCol] + height > availableHeight) {
      currentCol = currentCol + 1;
      columns.value[currentCol] = [];
      colHeights[currentCol] = 0;
    }

    columns.value[currentCol].push(chunk);
    colHeights[currentCol] += height;
  }

  invoices.forEach(invoice => {
    durations.value[invoice.id] = formatDuration(invoice.startTime);
  });

  intervalId = setInterval(() => {
    invoices.forEach(invoice => {
      durations.value[invoice.id] = formatDuration(invoice.startTime);
    });
  }, 1000);
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});

function formatDuration(startTime) {
  const now = Date.now();
  const diffSec = Math.floor((now - startTime.getTime()) / 1000);

  const s = diffSec % 60;
  const m = Math.floor(diffSec / 60) % 60;
  const h = Math.floor(diffSec / 3600) % 24;
  const d = Math.floor(diffSec / (3600 * 24));

  const pad = n => n.toString().padStart(2, '0');

  return d > 0 ? `${d} day ${pad(h)}h` : `${pad(h)}:${pad(m)}:${pad(s)}`;
}
</script>

<template>
  <div class="absolute top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none">
    <div v-for="invoice in invoices" :key="invoice.id">
      <div
        v-for="(item, idx) in invoice.items"
        :key="idx"
        :ref="el => el && dummyRefs.push(el)"
        class="rounded p-2 flex flex-col gap-1 mt-3 w-72"
      >
        <div class="font-semibold text-sm flex justify-between">
          <span>
            {{ item.name }}
          </span>

          <PrimeVueCheckbox size="small" />
        </div>

        <div class="ml-4 flex flex-col gap-1">
          <div v-if="item.variant" class="text-primary text-xs">{{ item.variant }}</div>

          <div v-if="item.notes" class="flex flex-col text-xs gap-1">
            <span class="font-semibold">Notes</span>
            <span class="text-primary">{{ item.notes }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="w-full h-[calc(100vh)] overflow-hidden bg-gray-100 box-border">
    <div
      class="grid h-full overflow-x-auto gap-4 px-4"
      style="grid-auto-flow: column; grid-auto-rows: max-content"
    >
      <div v-for="(col, i) in columns" :key="i" class="flex flex-col space-y-4 w-72 flex-shrink-0 rounded">
        <div
          v-for="(invoice, j) in col"
          :key="j"
          class="flex flex-col bg-white rounded shadow border"
          :class="generateColor(invoice.globalIndex).border"
        >
          <div
            v-if="invoice.isFirst"
            :class="`${generateColor(invoice.globalIndex).header} text-white px-4 py-3 rounded-t`"
          >
            <div class="flex justify-between">
              <div class="flex gap-2">
                <span>#{{ invoice.globalIndex }}</span>
                <span>{{ invoice.customer }}</span>
              </div>
              <div>
                <span class="text-[10px]">#{{ invoice.id }}</span>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <!-- <p class="text-sm">Duration: <span class="font-bold">{{ durations[invoice.id] || '00:00:00' }}</span></p> -->
              <p class="text-sm">Duration: <span class="font-bold">00:10:00</span></p>
              <div class="flex items-center gap-2">
                <p class="text-sm">{{ invoice.tableNumber }}</p>

                <PrimeVueChip size="small" class="text-primary text-xs p-1 px-2">Dine In</PrimeVueChip>
              </div>
            </div>
          </div>

          <div :class="' space-y-2 overflow-hidden ' + generateColor(invoice.globalIndex).background">
            <div v-if="!invoice.isFirst" class="text-xs ml-2 pt-2 text-[#434343]">
              #{{ invoice.globalIndex }} Continue {{ invoice.indexCounter + 1 }} of
              {{ invoice.totalPage }}
            </div>

            <div :class="[!invoice.isFirst ? 'py-0 px-4' : 'p-4']">
              <div class="w-full flex">
                <PrimeVueButton
                  v-if="invoice.isFirst"
                  class="w-full flex gap-4 py-1"
                  icon="pi pi-check"
                  size="small"
                >
                  <AppBaseSvg name="checkCircle" />

                  Order Complete
                </PrimeVueButton>
              </div>

              <div v-for="(item, index) in invoice.items" :key="index" class="flex flex-col gap-1 mt-3">
                <div class="font-semibold text-sm flex justify-between">
                  <span>
                    {{ item.name }}
                  </span>

                  <PrimeVueCheckbox size="small" class="bg-transparent" />
                </div>

                <div class="ml-4 flex flex-col gap-1">
                  <div v-if="item.variant" class="text-primary text-xs">{{ item.variant }}</div>

                  <div v-if="item.notes" class="flex flex-col text-xs gap-1">
                    <span class="font-semibold">Notes</span>
                    <span class="text-primary">{{ item.notes }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="invoice.totalPage > 1" class="ml-4 pb-2 text-xs text-[#434343]">
              #{{ invoice.globalIndex }} Continue {{ invoice.indexCounter + 1 }} of {{ invoice.totalPage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
