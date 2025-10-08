<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
// Interfaces
import type { IOutletTable } from '@/modules/outlet/interfaces';
import type { IAccountStoreDetailProvided } from '../../interfaces';

// Composable service
import { useAccountStoreDetailsService } from '../../services/account-store-detail.service';

// Utilities
// import { useLocalization } from '@/composables/useLocalization';

const modelValue = defineModel<string[] | null>();

interface IProps {
  storeTable: IOutletTable;
  cashierPreview?: boolean;
  isTableSummary?: boolean;
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
  isTableSummary: false,
});

/**
 * @description Inject all the data and methods what we need
 */
const { accountStoreDetail_onShowDialogDetailTable } = inject<IAccountStoreDetailProvided>('accountStoreDetail')!;

/**
 * @description Inject the table configuration service to change table status
 */
const { accountStoreDetail_fetchChangeTableStatus } = useAccountStoreDetailsService();

/**
 * @description Handles changing table status (UI + API)
 */
const onToggleTableStatus = async (table: IOutletTable['storeTables'][number]) => {
  try {
    // Locally toggle the table status first for instant feedback
    table.statusTable = table.statusTable === 'occupied' ? 'available' : 'occupied';

    // Send request to backend to persist change
    await accountStoreDetail_fetchChangeTableStatus(table.id, table.statusTable);
  } catch (error) {
    console.error('Failed to change table status:', error);
    // Revert the change on error
    table.statusTable = table.statusTable === 'occupied' ? 'available' : 'occupied';
  }
};
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
            ? 'bg-secondary-hover text-white border-2 border-teal-400'
            : table.statusTable === 'occupied' && props.cashierPreview
              ? 'bg-primary-50 text-primary-400 border-2'
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
                if (table.statusTable === 'occupied') {
                  return;
                }
                const index = modelValue.indexOf(table.name);
                if (index === -1) modelValue.push(table.name);
                else modelValue.splice(index, 1);
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
        <div v-if="props.cashierPreview" class="text-[10px] lg:text-sm">
          {{
            table.statusTable === 'occupied'
              ? useLocalization('account.occupied')
              : useLocalization('account.available')
          }}
        </div>
        <div class="text-sm pb-2">{{ table.seats }} {{ useLocalization('account.seats') }}</div>

        <!-- ✅ Badge toggle now calls API -->
        <button
          v-if="!props.cashierPreview && props.isTableSummary"
          class="px-2 py-1 rounded-full text-xs font-semibold"
          :class="[table.statusTable === 'occupied' ? 'bg-red-500 text-white' : 'bg-green-500 text-white']"
          @click="
            () => {
              if (table.statusTable === 'available' && (modelValue || []).includes(table.name)) {
                const index = modelValue?.indexOf(table.name) ?? -1;

                if (index !== -1) {
                  modelValue?.splice(index, 1);
                }
              }
              onToggleTableStatus(table);
            }
          "
        >
          {{
            table.statusTable === 'occupied'
              ? useLocalization('account.occupied')
              : useLocalization('account.available')
          }}
        </button>
      </div>
    </section>
  </section>
</template>

<style>
#account-store-table-layout {
  background-image: url('@/app/assets/images/bg-layout-table.png');
  background-size: 100% 100%;
  border: 1px solid #8cc8eb;
  border-radius: 4px;
}

.table-item {
  position: absolute;
  box-sizing: border-box;
  user-select: none;
}

.table-item,
.table-item .text {
  transition: all 0.05s ease-in-out;
}

section#zoom-in-out {
  box-shadow: 0px 0px 10px 2px #00000026;
}
</style>
