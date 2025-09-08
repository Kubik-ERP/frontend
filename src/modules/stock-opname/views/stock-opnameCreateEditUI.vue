<script setup lang="ts">
import { useStockOpnameService } from '../services/stock-opname.service.ts';
import DialogNotes from '../components/DialogNotes.vue';

const route = useRoute();

const stockOpname_id = ref<string>((route.params.id as string) || 'new');
// console.log('🚀 ~ stockOpname_id:', stockOpname_id.value);

const {
  // table
  stockOpnameCreateEditColumns,

  // store
  stockOpname_isLoading,
  stockOpname_detail,

  // params

  // API
  stockOpname_fetchDetail,
  stockOpname_onSubmitCreateEdit,

  // notes
  notesBuffer,
  notesBufferValidation,
  stockOpname_onSubmitNotesDialog,
  stockOpname_onShowNotesDialog,
  stockOpname_onCloseNotesDialog,
} = useStockOpnameService();

provide('stockOpname', {
  notesBuffer,
  notesBufferValidation,
  stockOpname_onSubmitNotesDialog,
  stockOpname_onShowNotesDialog,
  stockOpname_onCloseNotesDialog,
});

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
    <h1 class="font-bold text-2xl text-text-primary">{{ useLocalization('stockOpname.createEditPage.title') }}</h1>
    <section class="flex items-center justify-between mt-2">
      <div class="flex flex-col">
        <h3>{{ useLocalization('stockOpname.createEditPage.recordLabel') }}</h3>
        <p>{{ stockOpname_detail.code }}</p>
      </div>
      <div class="flex flex-col">
        <h3>{{ useLocalization('stockOpname.createEditPage.issueDateLabel') }}</h3>
        <p>{{ useFormatDate(stockOpname_detail.createdAt) }}</p>
      </div>
      <div class="flex flex-col">
        <h3>{{ useLocalization('stockOpname.createEditPage.performedByLabel') }}</h3>
        <p>{{ stockOpname_detail.users.fullname }}</p>
      </div>
    </section>
  </section>
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
      <h1 class="font-bold text-2xl text-text-primary">{{ useLocalization('stockOpname.createEditPage.itemListTitle') }}</h1>
    </template>
    <template #header-suffix>
      <!-- input search -->
      <div class="flex items-center gap-2">
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <AppBaseSvg name="search" class="!w-4 !h-4" />
          </PrimeVueInputIcon>
          <PrimeVueInputText v-model="search" :placeholder="useLocalization('stockOpname.createEditPage.searchPlaceholder')" />
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
          <PrimeVueInputNumber
            v-model="data.actualQuantity"
            mode="decimal"
            :min="0"
            :max="data.masterInventoryItems?.expectedQuantity"
            class="text-sm max-h-9"
            show-buttons
            button-layout="horizontal"
          >
            <template #decrementicon>
              <AppBaseSvg name="minus" class="!w-4 !h-4" />
            </template>
            <template #incrementicon>
              <AppBaseSvg name="plus-line" class="!w-4 !h-4" />
            </template>
          </PrimeVueInputNumber>
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
        <span
          v-if="data.notes"
          class="font-normal text-sm text-text-primary cursor-pointer"
          @click="stockOpname_onShowNotesDialog(data)"
        >
          {{ data.notes }}</span
        >
        <span v-else>
          <PrimeVueButton
            variant="text"
            class="text-sm"
            rounded
            aria-label="detail"
            :label="useLocalization('stockOpname.createEditPage.addNotesButton')"
            @click="stockOpname_onShowNotesDialog(data)"
          >
            <template #icon>
              <AppBaseSvg name="edit" class="!w-4 !h-4" />
            </template>
          </PrimeVueButton>
        </span>
      </template>
      <template v-else-if="column.value === 'action'">
        <span class="font-normal text-sm text-text-primary">
          <AppBaseSvg name="three-dots" class="!w-4 !h-4" />
        </span>
      </template>
      <template v-else>
        <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
      </template>
    </template>
  </AppBaseDataTable>
  <footer class="flex items-center justify-between py-8">
    <div class="flex items-center gap-2">
      <PrimeVueButton
        variant="outlined"
        :label="useLocalization('stockOpname.createEditPage.saveDraftButton')"
        @click="stockOpname_onSubmitCreateEdit(false, stockOpname_id)"
      />
      <PrimeVueButton :label="useLocalization('stockOpname.createEditPage.issueButton')" @click="stockOpname_onSubmitCreateEdit(true, stockOpname_id)" />
    </div>
    <router-link :to="{ name: 'stock-opname.index' }">
      <PrimeVueButton variant="text" :label="useLocalization('stockOpname.createEditPage.cancelButton')" />
    </router-link>
  </footer>
  <DialogNotes />
</template>
