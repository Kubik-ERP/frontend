<script setup lang="ts">
/**
 * @description Define the props interface
 */
interface IProps {
  btnCtaCreateTitle?: string;
  columns: IColumnDataTable[];
  data: Array<unknown>;
  headerTitle?: string;
  isUsingBtnCtaCreate?: boolean;
  isUsingCustomBody?: boolean;
  isUsingCustomFilter?: boolean;
  isUsingCustomHeader?: boolean;
  isUsingCustomHeaderPrefix?: boolean;
  isUsingCustomHeaderSuffix?: boolean;
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
}

/**
 * @description Define props with default values and interfaces
 */
const props = withDefaults(defineProps<IProps>(), {
  btnCtaCreateTitle: 'Create',
  columns: () => [],
  data: () => [],
  headerTitle: '',
  isUsingBtnCtaCreate: false,
  isUsingCustomBody: false,
  isUsingCustomFilter: false,
  isUsingCustomHeader: false,
  isUsingCustomHeaderPrefix: false,
  isUsingCustomHeaderSuffix: false,
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
});

const emits = defineEmits(['clickBtnCtaCreate', 'update:currentPage']);

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
</script>

<template>
  <PrimeVueDataTable
    :paginator="props.isUsingPagination"
    :value="props.data"
    :rows="props.rowsPerPage"
    :first="props.first"
    :lazy="props.isUsingServerSidePagination"
    :total-records="props.totalRecords"
    :loading="props.isLoading"
    table-style="min-width: 50rem"
    :pt="{
      root: 'border border-solid border-grayscale-20 rounded-sm',
      header: 'p-0',
    }"
    @page="handlePageChange"
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
          <header class="flex flex-col">
            <section
              id="title-and-cta"
              class="flex items-center justify-between w-full border-b border-solid border-grayscale-20 px-6 py-5"
            >
              <template v-if="props.isUsingCustomHeaderPrefix">
                <slot name="header-prefix" />
              </template>

              <template v-else>
                <h6 class="font-semibold text-gray-900 text-xl">
                  {{ props.headerTitle }}
                </h6>
              </template>

              <template v-if="props.isUsingCustomHeaderSuffix">
                <slot name="header-suffix" />
              </template>

              <template v-else>
                <section id="right-content" class="flex items-center gap-4">
                  <PrimeVueIconField v-if="props.isUsingSearchOnHeader">
                    <PrimeVueInputIcon>
                      <template #default>
                        <AppBaseSvg name="search" />
                      </template>
                    </PrimeVueInputIcon>

                    <PrimeVueInputText placeholder="Search by Member ID or Name" class="text-sm w-full min-w-80" />
                  </PrimeVueIconField>

                  <template v-if="props.isUsingBtnCtaCreate">
                    <PrimeVueButton
                      class="bg-primary border-none w-fit px-5"
                      severity="secondary"
                      @click="emits('clickBtnCtaCreate')"
                    >
                      <template #default>
                        <section id="content" class="flex items-center gap-2">
                          <AppBaseSvg name="plus-line-white" />

                          <span class="font-semibold text-base text-white">
                            {{ props.btnCtaCreateTitle }}
                          </span>
                        </section>
                      </template>
                    </PrimeVueButton>
                  </template>
                </section>
              </template>
            </section>

            <section v-if="props.isUsingFilter" id="filter" class="flex items-center gap-4 px-6 py-5">
              <template v-if="props.isUsingCustomFilter">
                <slot name="filter" />
              </template>

              <template v-else>
                <span class="font-semibold text-gray-900 text-base">Filter by</span>

                <PrimeVueDatePicker
                  class="w-full max-w-80"
                  placeholder="Last 7 days "
                  show-on-focus
                  show-icon
                  fluid
                />
              </template>
            </section>
          </header>
        </template>
      </template>
    </template>

    <template #paginatorcontainer="{ page, pageCount, prevPageCallback, nextPageCallback }">
      <div class="flex items-center gap-2 justify-between w-full py-2">
        <!-- Previous Page Button -->
        <PrimeVueButton
          :disabled="page === 0 || pageCount === 0"
          class="border-primary w-fit px-4"
          variant="outlined"
          @click="prevPageCallback"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="arrow-left" />
              <span class="font-normal text-sm text-primary">Previous</span>
            </section>
          </template>
        </PrimeVueButton>

        <div>
          <template v-for="(p, idx) in displayedPages" :key="idx">
            <template v-if="p === '...'">
              <span class="px-2 text-gray-400">...</span>
            </template>
            <template v-else>
              <PrimeVueButton
                :label="(Number(p) + 1).toString()"
                class="border-none aspect-square p-4"
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
        <!-- Page Numbers -->

        <!-- Next Page Button -->
        <PrimeVueButton
          :disabled="page === (pageCount || 1) - 1 || pageCount === 0"
          class="border-primary w-fit px-4"
          variant="outlined"
          @click="nextPageCallback"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <span class="font-normal text-sm text-primary">Next</span>
              <AppBaseSvg name="arrow-right" />
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
        <template v-if="props.isUsingCustomBody">
          <slot name="body" :column="column" :data="data" :index="index" />
        </template>

        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </PrimeVueColumn>
  </PrimeVueDataTable>
</template>
