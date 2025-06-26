<script setup>
import { ref, onMounted, nextTick } from 'vue'

const invoices = [
    {
        id: 'INV001',
        customer: 'Budi',
        eta: 10,
        items: Array.from({ length: 2 }, (_, i) => ({
            name: `Menu ${i + 1}`,
            variant: 'Varian A',
            qty: 1,
            notes: 'Tanpa sambal',
        })),
    },
    {
        id: 'INV002',
        customer: 'Sari',
        eta: 15,
        items: Array.from({ length: 12 }, (_, i) => ({
            name: `Menu ${i + 1}`,
            variant: 'Varian B',
            qty: 2,
            notes: i % 3 === 0 ? 'Tambah kerupuk dan saus' : '',
        })),
    },
    {
        id: 'INV003',
        customer: 'Udin',
        eta: 8,
        items: Array.from({ length: 6 }, (_, i) => ({
            name: `Menu ${i + 1}`,
            variant: 'Varian C',
            qty: 1,
            notes: 'Tanpa sayur',
        })),
    },
    {
        id: 'INV004',
        customer: 'Udin',
        eta: 8,
        items: Array.from({ length: 6 }, (_, i) => ({
            name: `Menu ${i + 1}`,
            variant: 'Varian C',
            qty: 1,
            notes: 'Tanpa sayur',
        })),
    },
    {
        id: 'INV005',
        customer: 'Udin',
        eta: 8,
        items: Array.from({ length: 6 }, (_, i) => ({
            name: `Menu ${i + 1}`,
            variant: 'Varian C',
            qty: 1,
            notes: 'Tanpa sayur',
        })),
    },
    {
        id: 'INV006',
        customer: 'Udin',
        eta: 8,
        items: Array.from({ length: 2 }, (_, i) => ({
            name: `Menu ${i + 1}`,
            variant: 'Varian C',
            qty: 1,
            notes: 'Tanpa sayur',
        })),
    },
    {
        id: 'INV007',
        customer: 'Udin',
        eta: 8,
        items: Array.from({ length: 2 }, (_, i) => ({
            name: `Menu ${i + 1}`,
            variant: 'Varian C',
            qty: 1,
            notes: 'Tanpa sayur',
        })),
    },

]

const dummyRefs = ref([])
const columns = ref([])

const generateColor = (index) => {
    const headerColor = ['bg-[#981C1C]', 'bg-[#B06900]', 'bg-[#367839]', 'bg-[#1C4A98]', 'bg-[#6B1C98]']
    const backgroundColor = ['bg-[#FBEBEB]', 'bg-[#FFF5E6]', 'bg-[#FFFFFF]', 'bg-[#E6ECFB]', 'bg-[#F3E6FB]']
    const borderColor = ['border-[#981C1C]', 'border-[#B06900]', 'border-[#367839]', 'border-[#1C4A98]', 'border-[#6B1C98]']

    return {
        background: backgroundColor[index % backgroundColor.length],
        header: headerColor[index % headerColor.length],
        border: borderColor,
        text: index % 2 === 0 ? 'text-gray-900' : 'text-gray-700',
    }
}

onMounted(async () => {
    await nextTick()

    const screenHeight = window.innerHeight
    const headerHeight = 100
    const padding = 32
    const availableHeight = screenHeight - padding

    const itemHeights = dummyRefs.value.map(
        (el) => el?.getBoundingClientRect().height + 16 || 60
    )

    let offset = 0
    const invoiceChunks = []

    for (const invoice of invoices) {
        const currentHeights = itemHeights.slice(offset, offset + invoice.items.length)
        const chunks = []
        let currentChunk = []
        let currentHeight = 0

        for (let i = 0; i < invoice.items.length; i++) {
            const height = currentHeights[i] + (currentChunk.length > 0 ? 8 : 0)
            if (currentHeight + height > availableHeight) {
                chunks.push(currentChunk)
                currentChunk = []
                currentHeight = 0
            }
            currentChunk.push(invoice.items[i])
            currentHeight += height
        }
        if (currentChunk.length) chunks.push(currentChunk)

        chunks.forEach((chunk, idx) => {
            const totalHeight = chunk.reduce((acc, _, i) => acc + currentHeights[i] + (i > 0 ? 8 : 0), 0)
            invoiceChunks.push({
                id: `${invoice.id}${idx > 0 ? `-part${idx + 1}` : ''}`,
                customer: invoice.customer,
                eta: invoice.eta,
                items: chunk,
                height: totalHeight,
                isFirst: idx === 0,
            })
        })

        offset += invoice.items.length
    }

    columns.value = []
    const colHeights = []
    let currentCol = 0

    for (const chunk of invoiceChunks) {
        const height = chunk.height + headerHeight + 26

        if (!columns.value[currentCol]) {
            columns.value[currentCol] = []
            colHeights[currentCol] = 0
        }

        if (colHeights[currentCol] + height > availableHeight) {
            currentCol += 1
            columns.value[currentCol] = []
            colHeights[currentCol] = 0
        }

        columns.value[currentCol].push(chunk)
        colHeights[currentCol] += height
    }
})
</script>

<template>
    <div class="absolute top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none">
        <div v-for="invoice in invoices" :key="invoice.id">
            <div v-for="(item, idx) in invoice.items" :key="idx" :ref="el => el && dummyRefs.push(el)"
                class="rounded p-2 w-72">
                <div class="font-medium">{{ item.name }} ({{ item.variant }})</div>
                <div class="text-sm">Qty: {{ item.qty }}</div>
                <div v-if="item.notes" class="text-xs italic text-gray-500 mt-1">
                    Notes: {{ item.notes }}
                </div>
            </div>
        </div>
    </div>

    <div class="w-full h-screen overflow-hidden bg-gray-100 p-4 box-border">
        <div class="grid h-full overflow-x-auto gap-4" style="grid-auto-flow: column; grid-auto-rows: max-content;">
            <div v-for="(col, i) in columns" :key="i" class="flex flex-col space-y-4 w-72 flex-shrink-0 rounded">
                <div v-for="(invoice, j) in col" :key="j" class="flex flex-col bg-white rounded shadow border"
                    :class="generateColor(j + i).border">
                    <div :class="`${generateColor(j + i).header} text-white px-4 py-3 rounded-t`">
                        <div class="flex justify-between">
                            <div class="flex gap-2">
                                <span>#{{ i + 1 }}</span>
                                <span>{{ invoice.customer }}</span>
                            </div>
                            <div>
                                <span class="font-bold text-lg">#{{ invoice.id }}</span>
                            </div>
                        </div>
                        
                        <p class="text-sm">Pemesan: {{ invoice.customer }}</p>
                        <p class="text-xs">Estimasi: {{ invoice.eta }} menit</p>
                    </div>

                    <div :class="'p-4 space-y-2 overflow-hidden ' + generateColor(j + i).background">

                        <div class="w-full flex">
                            <PrimeVueButton class="w-full flex gap-4" icon="pi pi-check" size="small">
                                <AppBaseSvg name="checkCircle" />

                                Order Complete
                            </PrimeVueButton>
                        </div>

                        <div v-for="(item, index) in invoice.items" :key="index" class="rounded p-2">
                            <div class="font-medium">{{ item.name }} ({{ item.variant }})</div>
                            <div v-if="item.notes" class="text-xs italic text-gray-500 mt-1">
                                Notes: {{ item.notes }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
