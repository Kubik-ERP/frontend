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
  isUsingCustomHeader?: boolean;
  isUsingFilter?: boolean;
  isUsingHeader?: boolean;
  isUsingPagination?: boolean;
  clickBtnCtaCreate?: () => void;
  rowsPerPage?: number;
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
  isUsingCustomHeader: false,
  isUsingHeader: true,
  isUsingFilter: true,
  isUsingPagination: true,
  clickBtnCtaCreate: () => {},
  rowsPerPage: 10,
});

const emits = defineEmits(['clickBtnCtaCreate']);
</script>

<template>
  <PrimeVueDataTable
    :paginator="props.isUsingPagination"
    :value="props.data"
    :rows="props.rowsPerPage"
    table-style="min-width: 50rem"
    :pt="{
      root: 'border border-solid border-grayscale-20 rounded-sm',
      header: 'p-0',
    }"
  >
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
              <h6 class="font-semibold text-gray-900 text-xl">
                {{ props.headerTitle }}
              </h6>

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

            <section id="filter" class="flex items-center gap-4 px-6 py-5">
              <span class="font-semibold text-gray-900 text-base">Filter by</span>

              <PrimeVueDatePicker
                class="w-full max-w-80"
                placeholder="Last 7 days "
                show-on-focus
                show-icon
                fluid
              />
            </section>
          </header>
        </template>
      </template>
    </template>

    <template #paginatorcontainer="{ page, pageCount, prevPageCallback, nextPageCallback }">
      <div class="flex items-center gap-2 justify-between w-full py-2">
        <!-- Previous Page Button -->
        <PrimeVueButton class="border-primary w-fit px-4" variant="outlined" @click="prevPageCallback">
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="arrow-left" />
              <span class="font-normal text-sm text-primary">Previous</span>
            </section>
          </template>
        </PrimeVueButton>

        <div>
          <template v-for="p in pageCount" :key="p">
            <PrimeVueButton
              :label="p.toString()"
              class="border-none aspect-square p-4"
              :class="
                page === p - 1 ? 'bg-blue-secondary-background text-primary' : 'bg-transparent text-grayscale-20'
              "
            />
          </template>
        </div>
        <!-- Page Numbers -->

        <!-- Next Page Button -->
        <PrimeVueButton class="border-primary w-fit px-4" variant="outlined" @click="nextPageCallback">
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
    >
      <template #body="{ data }">
        <template v-if="props.isUsingCustomBody">
          <slot name="body" :data="data" :column="column" />
        </template>

        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </PrimeVueColumn>
  </PrimeVueDataTable>
</template>
