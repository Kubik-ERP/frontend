<script setup lang="ts">
import { useStockOpnameService } from '../services/stock-opname.service.ts';

const route = useRoute();

const stockOpname_id = ref<string>((route.params.id as string) || 'new');
console.log('🚀 ~ stockOpname_id:', stockOpname_id.value);

const {
  // table
  stockOpnameCreateEditColumns,

  // store
  stockOpname_isLoading,
  stockOpname_detail,

  // params

  // API
  stockOpname_fetchDetail,

  statusClass,
  stockOpname_onShowDialogDeleteIssue,
  stockOpname_onShowDialogIssueRecord,
  stockOpname_onShowDialogVerifyRecord,
} = useStockOpnameService();

// 1. A ref to hold the text from your search input
const search = ref('');

// 2. A computed property that creates the filtered list
const filteredItems = computed(() => {
  // If the search input is empty, return the original full list
  if (!search.value) {
    return stockOpname_detail.value.stockOpnameItems;
  }

  const searchTerm = search.value.toLowerCase();

  // Otherwise, filter the list
  return stockOpname_detail.value.stockOpnameItems.filter(item => {
    // Check for a match in either the SKU or the name (case-insensitive)
    const sku = item.masterInventoryItems?.sku?.toLowerCase() || '';
    const name = item.masterInventoryItems?.name?.toLowerCase() || '';
    return sku.includes(searchTerm) || name.includes(searchTerm);
  });
});

onMounted(async () => {
  await stockOpname_fetchDetail(stockOpname_id.value);
});
</script>
<template>
  <!-- <pre>
    {{ stockOpname_detail }}
  </pre> -->
  <section class="pb-8">
    <h1 class="font-bold text-2xl text-text-primary">Details</h1>
    <section class="grid grid-cols-3 gap-2 mt-2">
      <div class="flex flex-col">
        <h3>Stock Opname record</h3>
        <p>{{ stockOpname_detail.code }}</p>
      </div>
      <div class="flex flex-col">
        <h3>Issue Date</h3>
        <p>{{ useFormatDate(stockOpname_detail.createdAt) }}</p>
      </div>
      <div class="flex flex-col">
        <h3>Performed By</h3>
        <p>{{ stockOpname_detail.users.fullname }}</p>
      </div>
      <div class="flex flex-col">
        <h3>Performed By</h3>
        <PrimeVueChip
          :class="[statusClass(stockOpname_detail.status), 'text-xs font-normal py-1 px-1.5 w-fit']"
          :label="useTitleCaseWithSpaces(stockOpname_detail.status)"
        />
      </div>
      <div class="flex flex-col">
        <h3>Performed By</h3>
        <p>{{ useFormatDate(stockOpname_detail.updatedAt!) }}</p>
      </div>
    </section>
  </section>
  
  <section class="pb-16">
    <AppBaseDataTable
      :data="filteredItems"
      :columns="stockOpnameCreateEditColumns"
      :is-using-filter="false"
      :is-loading="stockOpname_isLoading"
      is-using-custom-body
      :is-using-custom-footer="true"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Item List</h1>
      </template>
      <template #header-suffix>
        <!-- input search -->
        <div class="flex items-center gap-2">
          <PrimeVueIconField>
            <PrimeVueInputIcon>
              <AppBaseSvg name="search" class="!w-4 !h-4" />
            </PrimeVueInputIcon>
            <PrimeVueInputText v-model="search" :placeholder="'Search SKU or Item Name'" />
          </PrimeVueIconField>
        </div>
      </template>
      <template #body="{ column, data }">
        <template v-if="column.value === 'sku'">
          <span class="font-semibold text-sm text-text-primary"> {{ data.masterInventoryItems?.sku }}</span>
        </template>
        <template v-else-if="column.value === 'name'">
          <span class="font-normal text-sm text-text-primary"> {{ data.masterInventoryItems?.name }}</span>
        </template>
        <template v-else-if="column.value === 'actualQuantity'">
          <span class="font-normal text-sm text-text-primary">
            {{ data.actualQuantity }}
          </span>
        </template>
        <template v-else-if="column.value === 'diffQuantity'">
          <div class="flex items-center gap-1">
            <span
              v-if="data.actualQuantity - data.expectedQuantity === 0"
              class="font-normal text-sm text-text-primary"
            >
              <PrimeVueChip class="aspect-square rounded-full bg-success-background">
                <template #icon>
                  <AppBaseSvg name="checkCircle-green" class="!w-3 !h-3" />
                </template>
              </PrimeVueChip>
            </span>
            <span
              v-else-if="data.actualQuantity - data.expectedQuantity < 0"
              class="font-normal text-sm text-text-primary"
            >
              <PrimeVueChip class="aspect-square rounded-full bg-error-background">
                <template #icon>
                  <AppBaseSvg name="chevron-down-red" class="!w-3 !h-3" />
                </template>
              </PrimeVueChip>
            </span>
            <span
              v-else-if="data.actualQuantity - data.expectedQuantity > 0"
              class="font-normal text-sm text-text-primary"
            >
              <PrimeVueChip class="aspect-square rounded-full bg-grayscale-10">
                <template #icon>
                  <AppBaseSvg name="chevron-up" class="!w-3 !h-3" />
                </template>
              </PrimeVueChip>
            </span>
            <span class="font-normal text-sm text-text-primary">
              <span v-if="data.actualQuantity - data.expectedQuantity > 0">+</span>
              {{ data.actualQuantity - data.expectedQuantity }}
            </span>
          </div>
        </template>
        <template v-else-if="column.value === 'notes'">
          <span class="font-normal text-sm text-text-primary cursor-pointer"> {{ data.notes ?? '-' }}</span>
        </template>
        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
  <footer v-if="stockOpname_detail.status !== 'verified'" class="flex items-center justify-between py-8">
    <div class="flex items-center gap-2">
      <router-link :to="{ name: 'stock-opname.create', params: { id: stockOpname_detail.id } }">
        <PrimeVueButton variant="outlined" label="Recalculate" />
      </router-link>
      <PrimeVueButton
        :label="
          stockOpname_detail.status === 'draft'
            ? 'Issue Stock Opname'
            : stockOpname_detail.status === 'on_review'
              ? 'Verify Report'
              : ''
        "
        @click="
          stockOpname_detail.status === 'draft'
            ? stockOpname_onShowDialogIssueRecord(stockOpname_detail.id)
            : stockOpname_detail.status === 'on_review'
              ? stockOpname_onShowDialogVerifyRecord(stockOpname_detail.id)
              : ''
        "
      />
    </div>

    <PrimeVueButton
      variant="text"
      class="text-error-main hover:bg-error-background"
      label="Cancel Stock Opaname"
      @click="stockOpname_onShowDialogDeleteIssue(stockOpname_detail.id)"
    >
      <template #icon>
        <AppBaseSvg name="close-circle-red" color="text-error-main" class="!w-4 !h-4" />
      </template>
    </PrimeVueButton>
  </footer>

  <AppBaseDialogConfirmation id="stock-opname-delete-dialog-confirmation" />
  <AppBaseDialogConfirmation id="stock-opname-issue-record-dialog-confirmation" />
  <AppBaseDialogConfirmation id="stock-opname-verify-record-dialog-confirmation" />
</template>
