<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
// Interfaces
import type { IOutletTable } from '@/modules/outlet/interfaces';
// Interfaces
import type { IAccountStoreDetailProvided } from '../../interfaces';

const modelValue = defineModel<string[] | null>();

interface IProps {
  storeTable: IOutletTable;
  cashierPreview?: boolean;
}

/**
 * @description Define props with default values and interfaces
 */
const props = withDefaults(defineProps<IProps>(), {
  storeTable: () => ({
    id: '',
    createdAt: '',
    floorName: '',
    storeId: '',
    uid: 0,
    updatedAt: '',
    storeTables: [
      {
        createdAt: '',
        floorId: '',
        id: '',
        name: '',
        positionX: 0,
        positionY: 0,
        width: 0,
        height: 0,
        floorName: '',
        isEnableQrCode: false,
        seats: 0,
        shape: 'RECTANGLE',
        storeId: '',
        uid: 0,
        statusTable: 'available',
        updatedAt: '',
      },
    ],
  }),
  cashierPreview: false,
  selectedTable: null,
});

/**
 * @description Inject all the data and methods what we need
 */
const { accountStoreDetail_onShowDialogDetailTable } = inject<IAccountStoreDetailProvided>('accountStoreDetail')!;
</script>

<template>
  <section id="account-store-table-layout" class="flex flex-col gap-4">
    <section
      :id="`${props.storeTable.floorName}`"
      class="relative w-full h-[500px] bg-dots inset-0 z-0"
      :class="{
        'floor-plan-container touch-none': !props.cashierPreview,
      }"
    >
      <div
        v-for="(table, tableIndex) in props.storeTable.storeTables"
        :key="`table-${tableIndex}`"
        class="table-item border-secondary flex flex-col items-center justify-center pt-2 gap-1"
        :class="[
          table.shape === 'ROUND' ? 'rounded-full' : 'rounded-lg',
          table.isEnableQrCode ? 'has-qr-code' : '',
          (modelValue || []).includes(table.name)
            ? 'bg-secondary-hover text-white border border-teal-400'
            : table.statusTable === 'occupied' && props.cashierPreview
              ? 'bg-primary-50 text-primary border-1 border-primary'
              : 'bg-white text-secondary-hover border border-teal-400',
          props.cashierPreview ? 'cursor-pointer' : '',
        ]"
        :data-id="table.name"
        :style="{
          transform: `translate(${table.positionX}px, ${table.positionY}px)`,
          width: `${table.width}px`,
          height: `${table.height}px`,
        }"
        @click="
          () => {
            if (props.cashierPreview) {
              if (modelValue) {
                const index = modelValue.indexOf(table.name);

                if (index === -1) {
                  modelValue.push(table.name);
                } else {
                  modelValue.splice(index, 1);
                }
              }
            }
          }
        "
      >
        <AppBaseSvg
          v-if="!props.cashierPreview"
          name="eye-visible"
          class="!w-4 !h-4 cursor-pointer"
          @click="accountStoreDetail_onShowDialogDetailTable(table)"
        />
        <div class="font-bold text-sm">{{ table.name }}</div>
        <div v-if="props.cashierPreview" class="text-[10px] lg:text-sm">{{ table.statusTable === 'occupied' ? useLocalization('account.occupied') : useLocalization('account.available') }}</div>
        <div class="text-sm pb-2">{{ table.seats }} {{ useLocalization('account.seats') }}</div>
      </div>
    </section>
  </section>
</template>

<style>
/* Latar belakang titik-titik untuk container lantai */
.floor-plan-container {
  background-image: radial-gradient(#d1d5db 2px, transparent 2px);
  background-size: 20px 20px;
  border: 1px solid #8cc8eb;
  border-radius: 4px;
}

/* Styling dasar untuk setiap item meja */
.table-item {
  position: absolute; /* Penting untuk positioning */
  box-sizing: border-box; /* Agar border dan padding termasuk dalam width/height */
  user-select: none; /* Mencegah seleksi teks saat dragging */
}

/* Mengatur agar transisi saat resize lebih mulus (opsional) */
.table-item,
.table-item .text {
  transition: all 0.05s ease-in-out;
}

section#zoom-in-out {
  box-shadow: 0px 0px 10px 2px #00000026;
}
</style>
