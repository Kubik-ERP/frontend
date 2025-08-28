<script setup lang="ts">
// Interface
import { DataTableSortEvent } from 'primevue/datatable';

// Stores
import { useMobileStore } from '@/app/store/mobile.store';

/**
 * @description Define the props interface
 */
interface IProps {
  btnCtaCreateTitle?: string;
  columns: IColumnDataTable[];
  data: Array<unknown>;
  headerTitle?: string;
  isUsingBorderOnHeader?: boolean;
  isUsingBtnCtaCreate?: boolean;
  isUsingCustomBody?: boolean;
  isUsingCustomFilter?: boolean;
  isUsingCustomFooter?: boolean;
  isUsingCustomHeader?: boolean;
  isUsingCustomHeaderPrefix?: boolean;
  isUsingCustomHeaderSuffix?: boolean;
  removableSort?: boolean;
  sortField?: string;
  sortOrder?: number | null;
  isUsingFilter?: boolean;
  isUsingHeader?: boolean;
  isUsingPagination?: boolean;
  isUsingSearchOnHeader?: boolean;
  isLoading?: boolean;
  clickBtnCtaCreate?: () => void;
  rowsPerPage?: number;
  totalRecords?: number;
  first?: number;
  isUsingServerSidePagination?: boolean;
  onPageChange?: (event: { page: number; rows: number }) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  maxVisibleRows?: number;
  scrollHeight?: string;
}

/**
 * @description Define props with default values and interfaces
 */
const props = withDefaults(defineProps<IProps>(), {
  btnCtaCreateTitle: 'Create',
  columns: () => [],
  data: () => [],
  headerTitle: '',
  isUsingBorderOnHeader: true,
  isUsingBtnCtaCreate: false,
  isUsingCustomBody: false,
  isUsingCustomFilter: false,
  isUsingCustomFooter: false,
  isUsingCustomHeader: false,
  isUsingCustomHeaderPrefix: false,
  isUsingCustomHeaderSuffix: false,
  removableSort: true,
  sortField: '',
  sortOrder: null,
  isUsingHeader: true,
  isUsingFilter: true,
  isUsingPagination: true,
  isUsingSearchOnHeader: false,
  isLoading: false,
  clickBtnCtaCreate: () => {},
  rowsPerPage: 10,
  totalRecords: 0,
  first: 1,
  isUsingServerSidePagination: false,
  onPageChange: () => {},
  searchValue: '',
  searchPlaceholder: 'Search...',
  maxVisibleRows: 0,
  scrollHeight: 'auto',
});

// Mobile store
const mobileStore = useMobileStore();
const { isCurrentlyMobile } = storeToRefs(mobileStore);

const emits = defineEmits(['clickBtnCtaCreate', 'update:currentPage', 'update:sort', 'update:searchValue']);

// Mobile filter state
const showMobileFilters = ref(false);

/**
 * @description Toggle mobile filters
 */
const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value;
};

/**
 * @description Computed property for two-way binding of search value
 */
const searchModel = computed({
  get: () => props.searchValue,
  set: (value: string) => emits('update:searchValue', value),
});

/**
 * @description Handle page change event
 * @param event - The event object containing the page and rows information
 */
const handlePageChange = (event: { page: number; rows: number }) => {
  emits('update:currentPage', event.page + 1);

  props.onPageChange?.(event);
};

const currentPage = computed(() => Math.floor(props.first / props.rowsPerPage));
const totalPages = computed(() => Math.ceil(props.totalRecords / props.rowsPerPage));

/**
 * @description Handle sort event
 * @param event - The event object containing the sort field and order
 */
const handleSort = (event: DataTableSortEvent) => {
  emits('update:sort', {
    sortField: event.sortField,
    sortOrder: event.sortOrder,
  });
};

/**
 *  @description Compute the displayed pages for pagination
 *  This logic ensures that the pagination displays a maximum of 7 pages,
 */
const displayedPages = computed(() => {
  const pages: (number | string)[] = [];
  const current = currentPage.value;
  const total = totalPages.value;
  const last = total - 1;

  if (total <= 7) {
    for (let i = 0; i < total; i++) pages.push(i);
  } else if (current <= 2) {
    pages.push(0, 1, 2, '...', last - 2, last - 1, last);
  } else if (current >= last - 2) {
    pages.push(0, 1, 2, '...', last - 2, last - 1, last);
  } else {
    pages.push(0, '...', current - 1, current, current + 1, '...', last);
  }

  return pages;
});

/**
 * @description Computed property for scroll height when maxVisibleRows is set
 */
const computedScrollHeight = computed(() => {
  if (props.maxVisibleRows > 0) {
    // Approximate height per row (adjust based on your row height)
    const rowHeight = 60; // 60px per row (adjust as needed)
    const headerHeight = 48; // Header height
    return `${props.maxVisibleRows * rowHeight + headerHeight}px`;
  }
  return props.scrollHeight;
});

/**
 * @description Check if scrollable mode is enabled
 */
const isScrollable = computed(() => {
  return props.maxVisibleRows > 0 || props.scrollHeight !== 'auto';
});
</script>

<template>
  <!-- Mobile Scrollable Wrapper -->
  <div class="w-full overflow-x-auto lg:overflow-x-visible">
    <PrimeVueDataTable
      :paginator="props.isUsingPagination && !props.isUsingCustomFooter"
      :value="props.data"
      :rows="props.rowsPerPage"
      :first="props.first"
      :lazy="props.isUsingServerSidePagination"
      :total-records="props.totalRecords"
      :removable-sort="props.removableSort"
      :sort-field="props.sortField"
      :sort-order="props.sortOrder ?? 0"
      :scroll-height="isScrollable ? computedScrollHeight : undefined"
      :scrollable="isScrollable"
      table-style="min-width: 50rem"
      :pt="{
        root: 'rounded-sm',
        header: 'border-none p-0',
        tableContainer: `border border-solid border-grayscale-20 ${!props.isUsingBorderOnHeader ? 'rounded-tl-lg rounded-tr-lg' : '!border-t-0'} ${props.isUsingCustomFooter ? '!border-b-0 !rounded-bl-none !rounded-br-none' : ''}`,
        pcPaginator: {
          root: `border-l border-r border-b border-t-0 border-solid border-grayscale-20 rounded-tl-none rounded-tr-none ${props.isUsingCustomFooter ? 'hidden' : ''}`,
        },
      }"
      @page="handlePageChange"
      @sort="handleSort"
    >
      <template #empty>
        <section class="flex items-center justify-center w-full">
          <span class="font-semibold text-sm text-text-primary">No data available</span>
        </section>
      </template>

      <template #header>
        <template v-if="props.isUsingHeader">
          <template v-if="props.isUsingCustomHeader">
            <slot name="header" />
          </template>

          <template v-else>
            <header class="flex flex-col border border-solid border-grayscale-20">
              <!-- Title and CTA Section -->
              <section
                id="title-and-cta"
                class="flex flex-col lg:flex-row lg:items-center justify-between w-full border-b border-solid border-grayscale-20 px-4 lg:px-6 py-4 lg:py-5 gap-4 lg:gap-0"
              >
                <!-- Header Prefix/Title Section -->
                <div class="flex-1 min-w-0">
                  <template v-if="props.isUsingCustomHeaderPrefix">
                    <slot name="header-prefix" />
                  </template>

                  <template v-else>
                    <h6 class="font-semibold text-gray-900 text-lg lg:text-xl">
                      {{ props.headerTitle }}
                    </h6>
                  </template>
                </div>

                <!-- Header Suffix/Search Section -->
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
                  <template v-if="props.isUsingCustomHeaderSuffix">
                    <slot name="header-suffix" />
                  </template>

                  <template v-else>
                    <!-- Search Field -->
                    <div v-if="props.isUsingSearchOnHeader" class="flex-1 lg:flex-initial">
                      <PrimeVueIconField>
                        <PrimeVueInputIcon>
                          <template #default>
                            <AppBaseSvg name="search" class="w-4 h-4" />
                          </template>
                        </PrimeVueInputIcon>

                        <PrimeVueInputText
                          v-model="searchModel"
                          :placeholder="props.searchPlaceholder"
                          class="text-sm w-full"
                          :class="isCurrentlyMobile ? 'min-w-0' : 'min-w-80'"
                        />
                      </PrimeVueIconField>
                    </div>

                    <!-- CTA Button -->
                    <template v-if="props.isUsingBtnCtaCreate">
                      <PrimeVueButton
                        class="bg-primary border-none w-full sm:w-fit px-5"
                        severity="secondary"
                        @click="emits('clickBtnCtaCreate')"
                      >
                        <template #default>
                          <section id="content" class="flex items-center justify-center gap-2">
                            <AppBaseSvg name="plus-line-white" class="w-4 h-4" />
                            <span class="font-semibold text-sm lg:text-base text-white">
                              {{ props.btnCtaCreateTitle }}
                            </span>
                          </section>
                        </template>
                      </PrimeVueButton>
                    </template>
                  </template>
                </div>
              </section>

              <!-- Filter Section -->
              <section
                v-if="props.isUsingFilter"
                id="filter"
                class="px-4 lg:px-6 border-b border-solid border-grayscale-20"
              >
                <!-- Mobile Filter Toggle -->
                <div v-if="isCurrentlyMobile" class="flex items-center justify-between py-4">
                  <span class="font-semibold text-gray-900 text-sm lg:text-base">Filters</span>
                  <PrimeVueButton
                    :icon="showMobileFilters ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                    variant="text"
                    size="small"
                    @click="toggleMobileFilters"
                  />
                </div>

                <!-- Filter Content -->
                <div
                  v-if="!isCurrentlyMobile || showMobileFilters"
                  :class="['pb-4', isCurrentlyMobile ? 'transition-all duration-300 ease-in-out' : '']"
                >
                  <template v-if="props.isUsingCustomFilter">
                    <slot name="filter" />
                  </template>

                  <template v-else>
                    <div class="flex flex-col gap-4 lg:pt-4">
                      <span v-if="!isCurrentlyMobile" class="font-semibold text-gray-900 text-sm lg:text-base"
                        >Filter by</span
                      >
                      <PrimeVueDatePicker
                        class="w-full max-w-80"
                        placeholder="Last 7 days"
                        show-on-focus
                        show-icon
                        fluid
                      />
                    </div>
                  </template>
                </div>
              </section>
            </header>
          </template>
        </template>
      </template>

      <template #paginatorcontainer="{ page, pageCount, prevPageCallback, nextPageCallback }">
        <div class="flex flex-col sm:flex-row items-center gap-2 justify-between w-full py-2 px-2">
          <!-- Mobile: Page Info -->
          <div v-if="isCurrentlyMobile" class="text-sm text-gray-600 order-1 sm:order-none">
            Page {{ page + 1 }} of {{ pageCount }}
          </div>

          <!-- Previous Page Button -->
          <PrimeVueButton
            :disabled="page === 0 || pageCount === 0"
            class="border-primary w-fit px-3 lg:px-4 order-2 sm:order-none"
            variant="outlined"
            :size="isCurrentlyMobile ? 'small' : 'normal'"
            @click="prevPageCallback"
          >
            <template #default>
              <section id="content" class="flex items-center gap-1 lg:gap-2">
                <AppBaseSvg name="arrow-left" class="!w-4 !h-4" />
                <span v-if="!isCurrentlyMobile" class="font-normal text-sm text-primary">Previous</span>
              </section>
            </template>
          </PrimeVueButton>

          <!-- Page Numbers - Hidden on mobile, shown on desktop -->
          <div v-if="!isCurrentlyMobile" class="flex items-center gap-1">
            <template v-for="(p, idx) in displayedPages" :key="idx">
              <template v-if="p === '...'">
                <span class="px-2 text-gray-400">...</span>
              </template>
              <template v-else>
                <PrimeVueButton
                  :label="(Number(p) + 1).toString()"
                  class="border-none aspect-square p-2 lg:p-4"
                  :class="
                    currentPage === Number(p)
                      ? 'bg-blue-secondary-background text-primary'
                      : 'bg-transparent text-grayscale-20'
                  "
                  @click="emits('update:currentPage', Number(p) + 1)"
                />
              </template>
            </template>
          </div>

          <!-- Next Page Button -->
          <PrimeVueButton
            :disabled="page === (pageCount || 1) - 1 || pageCount === 0"
            class="border-primary w-fit px-3 lg:px-4 order-3 sm:order-none"
            variant="outlined"
            :size="isCurrentlyMobile ? 'small' : 'normal'"
            @click="nextPageCallback"
          >
            <template #default>
              <section id="content" class="flex items-center gap-1 lg:gap-2">
                <span v-if="!isCurrentlyMobile" class="font-normal text-sm text-primary">Next</span>
                <AppBaseSvg name="arrow-right" class="!w-4 !h-4" />
              </section>
            </template>
          </PrimeVueButton>
        </div>
      </template>

      <PrimeVueColumn
        v-for="(column, columnIndex) in props.columns"
        :key="`column-${columnIndex}`"
        :field="column.value"
        :header="column.label"
        :sortable="column.sortable"
        :pt="{
          columnTitle: 'text-sm font-normal text-grayscale-70',
          headerCell: 'bg-background border-b-grayscale-20',
        }"
        :style="`
        width: ${column.width ? column.width : 'auto'};
      `"
      >
        <template #body="{ data, index }">
          <template v-if="props.isLoading">
            <PrimeVueSkeleton />
          </template>

          <template v-else>
            <template v-if="props.isUsingCustomBody">
              <slot name="body" :column="column" :data="data" :index="index" />
            </template>

            <template v-else>
              <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
            </template>
          </template>
        </template>
      </PrimeVueColumn>
    </PrimeVueDataTable>
  </div>

  <!-- Custom Footer Section -->
  <section
    v-if="props.isUsingCustomFooter"
    class="border-l border-r border-b border-solid border-grayscale-20 bg-background rounded-bl-lg rounded-br-lg px-4 py-3 -mt-8"
  >
    <slot name="footer" />
  </section>
</template>
