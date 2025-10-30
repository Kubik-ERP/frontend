<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { IVoucher } from '../interfaces';
import { useVoucherListService } from '../services/voucher-list.service';
import { useVoucherStore } from '../store';
import eventBus from '@/plugins/mitt';

/**
 * Ambil data & method dari service
 */
const {
  voucherList_columns,
  voucherList_fetchListVouchers,
  voucherList_isLoading,
  voucherList_values,
  voucherList_queryParams,
  voucherList_onChangePage,
  voucher_handleOnSortChange,
  voucherList_deleteVoucher,
  voucherList_handleFilter,
} = useVoucherListService();

onMounted(async () => {
  await voucherList_fetchListVouchers();
});

/**
 * Hitung active vouchers
 */
const voucherStore = useVoucherStore();
const activeVoucherCount = computed(() => {
  return voucherStore.voucher_lists.data.items.filter((item: IVoucher) => item.status === 'active').length;
});

/**
 * Popover & Selected Data
 */
const popover = ref();
const selectedData = ref<IVoucher | null>(null);

const router = useRouter();
/**
 * Navigation methods
 */
const goToCreate = () => router.push({ name: 'voucher.create' });
const goToEdit = (id: string, name: string) => router.push({ name: 'voucher.edit', params: { id, name } });
const goToView = (id: string, name: string) => router.push({ name: 'voucher.view', params: { id, name } });

const openActionsMenu = (event: MouseEvent, rowData: IVoucher) => {
  selectedData.value = rowData;
  popover.value.toggle(event);
};

const handleView = (row: IVoucher | null) => {
  if (!row) return;
  goToView(row.id, row.name);
};

const handleEdit = (row: IVoucher | null) => {
  if (!row) return;
  if (row.isApplied) {
    eventBus.emit('AppBaseDialogConfirmation', {
      id: 'voucher-list-dialog-confirmation',
      description: 'This voucher is currently applied to an order and cannot be edit.',
      iconName: 'info',
      isOpen: true,
      onClickButtonPrimary: () => {
        // Close dialog (Cancel)
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'voucher-list-dialog-confirmation',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      },

      textButtonPrimary: 'Cancel',
      title: 'Cant edit voucher',
      type: 'warning',
    });
    return;
  } else {
    goToEdit(row.id, row.name);
  }
};

const handleDelete = async (row: IVoucher | null) => {
  if (!row) return;

  await voucherList_deleteVoucher(row.id);
};

/**
 * filter
 */
const selectedDate = ref<Date | null>(null);

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

</script>

<template>
  <section id="voucher-list" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      :columns="voucherList_columns"
      :data="voucherList_values.data.items"
      header-title="Vouchers"
      :rows-per-page="voucherList_values.data.meta.pageSize"
      :total-records="voucherList_values.data.meta.total"
      :first="(voucherList_values.data.meta.page - 1) * voucherList_values.data.meta.pageSize"
      :is-loading="voucherList_isLoading"
      :sort-field="voucherList_queryParams.orderBy"
      :sort-order="voucherList_queryParams.orderDirection === 'asc' ? 1 : -1"
      is-using-server-side-pagination
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-header
      is-using-custom-body
      :is-using-custom-filter="true"
      @update:currentPage="voucherList_onChangePage"
      @update:sort="voucher_handleOnSortChange"
    >
      <!-- Header Prefix -->
      <template #header-prefix>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
          <!-- Title + Chip -->
          <div class="flex items-center gap-2">
            <h6 class="font-semibold text-gray-900 text-lg sm:text-xl">Voucher</h6>
            <PrimeVueChip
              class="text-xs font-normal bg-secondary-background text-green-primary px-1.5 py-0.5"
              :label="`${activeVoucherCount} Active Vouchers`"
            />
          </div>

          <!-- Button -->
          <PrimeVueButton
            class="w-full bg-primary text-white px-4 py-2 h-10 rounded-md sm:w-fit"
            :label="useLocalization('voucher.main.popover.add')"
            @click="goToCreate"
          >
            <template #icon>
              <AppBaseSvg name="plus-line-white" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>
        </div>
      </template>

      <template #filter>
        <div class="grid grid-col gap-y-2">
          <span class="font-semibold inline-block text-gray-900 text-base w-48">Filter by</span>

          <div class="flex items-center gap-4 w-full">
            <PrimeVueDatePicker
              v-model="selectedDate"
              class="text-sm text-text-disabled placeholder:text-sm placeholder:text-text-disabled w-full max-w-80"
              placeholder="Select range by validity period"
              selection-mode="range"
              show-on-focus
              show-icon
              fluid
              show-button-bar
              :hide-on-range-selection="true"
              @update:modelValue="
                (val: Date | Date[] | (Date | null)[] | null | undefined) => {
                  const startDate = Array.isArray(val) ? val[0] : val;
                  const endDate = Array.isArray(val) ? val[1] : val;
                  if (startDate && endDate)
                    voucherList_handleFilter(
                      formatDate(startDate || new Date()),
                      formatDate(endDate || new Date()),
                    );
                }
              "
            />
          </div>
        </div>
      </template>

      <!-- Body Table -->
      <template #body="{ column, data }">
        <template v-if="column.value === 'action'">
          <PrimeVueButton variant="text" rounded aria-label="Actions" @click="openActionsMenu($event, data)">
            <template #icon>
              <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>

          <PrimeVuePopover
            ref="popover"
            :pt="{
              root: { class: 'z-[9999]' },
              content: 'p-0',
            }"
          >
            <section v-if="selectedData" class="flex flex-col">
              <!-- View -->
              <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="handleView(selectedData)">
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="eye-visible" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">{{
                    useLocalization('voucher.main.popover.view')
                  }}</span>
                </section>
              </PrimeVueButton>

              <!-- Edit -->
              <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="handleEdit(selectedData)">
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="edit" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">{{
                    useLocalization('voucher.main.popover.edit')
                  }}</span>
                </section>
              </PrimeVueButton>

              <!-- Delete -->
              <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="handleDelete(selectedData)">
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="delete" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">{{
                    useLocalization('voucher.main.popover.delete')
                  }}</span>
                </section>
              </PrimeVueButton>
            </section>
          </PrimeVuePopover>
        </template>

        <template v-else-if="column.value === 'name'">
          <span class="font-normal text-sm text-text-primary">
            {{ data[column.value] || '-' }}
          </span>
        </template>

        <template v-else-if="column.value === 'validityPeriod'">
          <span class="font-normal text-sm text-text-primary">
            {{
              data.startPeriod && data.endPeriod
                ? `${new Date(data.startPeriod).toLocaleDateString()} - ${new Date(data.endPeriod).toLocaleDateString()}`
                : '-'
            }}
          </span>
        </template>

        <template v-else-if="column.value === 'status'">
          <span
            v-if="data[column.value] === 'active'"
            class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
          >
            Active
          </span>
          <span
            v-else-if="data[column.value] === 'expired'"
            class="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"
          >
            Expired
          </span>
          <span
            v-else-if="data[column.value] === 'upcoming'"
            class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"
          >
            Upcoming
          </span>
          <span v-else class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {{ data[column.value] || '-' }}
          </span>
        </template>

        <template v-else-if="column.value === 'updatedAt'">
          <span class="font-normal text-sm text-text-primary">
            {{ data[column.value] ? new Date(data[column.value]).toLocaleDateString() : '-' }}
          </span>
        </template>

        <template v-else>
          <span class="font-normal text-sm text-text-primary">
            {{ data[column.value] || '-' }}
          </span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>
