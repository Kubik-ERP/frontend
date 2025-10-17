<script setup lang="ts">
import { ref, watch } from 'vue';
import { ITEM_UNIT_DROPDOWN } from '../constants';
import type { IUnitConversion } from '../interfaces';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  unit: {
    type: String,
    default: '', // unit utama yang dipilih di form item (misal: 'kg', 'g', 'ml', dll)
  },
  initialConversions: {
    type: Array as () => IUnitConversion[],
    default: () => [],
  }
});

const emit = defineEmits(['update:visible', 'save']);

// Base units: kg for weight, l for volume, pcs for count
const conversionRates: Record<string, {rate: number, type: 'weight' | 'volume' | 'count'}> = {
  // weight, base: kg
  mg: { rate: 0.000001, type: 'weight' },
  g: { rate: 0.001, type: 'weight' },
  kg: { rate: 1, type: 'weight' },
  // volume, base: l
  ml: { rate: 0.001, type: 'volume' },
  l: { rate: 1, type: 'volume' },
  tsp: { rate: 0.00492892, type: 'volume' },
  tbsp: { rate: 0.0147868, type: 'volume' },
  cup: { rate: 0.236588, type: 'volume' },
  // count, base: pcs
  pcs: { rate: 1, type: 'count' },
  pck: { rate: 1, type: 'count' },
  bottle: { rate: 1, type: 'count' },
  can: { rate: 1, type: 'count' },
  sachet: { rate: 1, type: 'count' },
  box: { rate: 1, type: 'count' },
  dozen: { rate: 12, type: 'count' },
  portion: { rate: 1, type: 'count' },
  slice: { rate: 1, type: 'count' },
  serving: { rate: 1, type: 'count' },
  batch: { rate: 1, type: 'count' },
};

type ConversionItem = {
  id: number;
  fromUnit: string; // this is the unitSymbol
  value: number | null;
};

// --- daftar konversi dinamis
const conversions = ref<ConversionItem[]>([]);

watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    if (props.initialConversions.length > 0) {
      conversions.value = JSON.parse(JSON.stringify(props.initialConversions.map(c => ({ fromUnit: c.unitSymbol, value: c.value, id: Date.now() + Math.random() }))));
    } else {
      conversions.value = [{ id: Date.now(), fromUnit: 'g', value: null }];
      conversions.value.forEach(calculateAnswer);
    }
  }
}, { immediate: true });


// --- fungsi hitung otomatis
const calculateAnswer = (item: ConversionItem) => {
  const from = conversionRates[item.fromUnit];
  const base = conversionRates[props.unit];

  if (from && base && from.type === base.type) {
    // Auto-calculate ONLY for weight and volume, which have reliable fixed rates.
    if (from.type === 'weight' || from.type === 'volume') {
      item.value = base.rate / from.rate;
    } else {
      // For ALL 'count' types, clear the value. The user MUST enter it manually.
      item.value = null;
    }
  } else {
    // If units are incompatible, clear the value.
    item.value = null;
  }
};

// --- tambah baris konversi baru
const addConversion = () => {
  conversions.value.push({
    id: Date.now(),
    fromUnit: '',
    value: null,
  });
};

// --- hapus baris
const removeConversion = (id: number) => {
  conversions.value = conversions.value.filter(c => c.id !== id);
};

// --- update otomatis ketika unit di halaman item berubah
watch(
  () => props.unit,
  () => {
    // reset answer setiap kali unit utama berubah
    conversions.value.forEach((item) => calculateAnswer(item));
  },
  { immediate: true }
);

const getLatestConversions = () => {
  console.log("Raw conversions data in sidebar:", JSON.stringify(conversions.value, null, 2));
  return conversions.value
    .filter(c => c.fromUnit && c.value !== null && c.value > 0)
    .map(c => {
      const unitInfo = ITEM_UNIT_DROPDOWN.find(u => u.value === c.fromUnit);
      return {
        unitName: unitInfo ? unitInfo.label : c.fromUnit,
        unitSymbol: c.fromUnit,
        value: c.value as number
      };
    });
};

defineExpose({
  getLatestConversions
});

const onHide = () => {
  const filteredConversions = getLatestConversions();
  emit('save', filteredConversions);
  emit('update:visible', false);
};
</script>

<template>
  <PrimeVueSidebar
    :visible="visible"
    position="right"
    class="w-full sm:w-[51%]"
    @update:visible="onHide"
    :dismissable="false"
    modal
  >
    <template #header>
      <h3 class="font-semibold text-lg">Unit Conversion</h3>
    </template>

    <div class="p-4 flex flex-col gap-3">
      <!-- ITEM LIST -->
      <div
        v-for="(item) in conversions"
        :key="item.id"
        class="flex items-center gap-2"
      >
        <!-- Kotak utama berisi teks, dropdown, input -->
        <div
          class="flex items-center flex-wrap gap-2 flex-1 bg-white"
        >
          <span class="text-sm text-gray-700 whitespace-nowrap">How many</span>

          <!-- Dropdown From Unit -->
          <PrimeVueDropdown
            v-model="item.fromUnit"
            :options="ITEM_UNIT_DROPDOWN"
            option-label="label"
            option-value="value"
            placeholder="Unit"
            class="w-full md:w-36 h-[38px] text-sm"
            panel-class="text-sm"
            @change="calculateAnswer(item)"
          />

          <span class="text-sm text-gray-700 whitespace-nowrap">
            are in 1 {{ ITEM_UNIT_DROPDOWN.find(u => u.value === props.unit)?.label || 'Unit' }}?
          </span>

          <!-- Input Number -->
          <PrimeVueInputNumber
            v-model="item.value"
            input-class="!text-sm !h-[38px]"
            class="w-full md:w-28 text-sm"
            placeholder="Answer"
          />
        </div>

        <!-- Tombol Hapus di luar kotak -->
        <PrimeVueButton
          icon="pi pi-trash"
          class="p-2 text-red-500 border-none bg-transparent hover:bg-red-50 rounded-md"
          @click="removeConversion(item.id)"
        />
      </div>

      <!-- Tombol Add Conversion -->
      <PrimeVueButton
        icon="pi pi-plus"
        label="Add Conversion"
        outlined
        class="mt-2 w-fit text-sm text-primary border-primary"
        @click="addConversion"
      />
    </div>
  </PrimeVueSidebar>
</template>
