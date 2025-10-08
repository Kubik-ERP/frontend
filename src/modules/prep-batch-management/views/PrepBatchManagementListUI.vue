<script setup lang="ts">
// services
import { useBatchService } from '../services/prep-batch-management.service';

const { batchList_columns, batchList_values, batchList_getClassOfBatchStatus } = useBatchService();

const popoverRefs = ref<Record<string, ComponentPublicInstance | null>>({});
const setPopoverRef = (recordId: number, el: Element | ComponentPublicInstance | null) => {
  if (el) {
    popoverRefs.value[`main-${recordId}`] = el as ComponentPublicInstance;
  }
};
const togglePopover = (event: Event, recordId: number) => {
  const popover = popoverRefs.value[`main-${recordId}`] as ComponentPublicInstance & {
    toggle: (event: Event) => void;
  };
  if (popover && popover.toggle) {
    popover.toggle(event);
  }
};
</script>
<template>
  <AppBaseDataTable
    :columns="batchList_columns"
    :data="batchList_values"
    is-using-custom-body
    is-using-custom-header-prefix
    is-using-custom-header-suffix
    is-using-pagination
    :is-using-filter="false"
  >
    <template #header-prefix>
      <h1>
        <span class="font-semibold text-2xl text-text-primary">
          <!-- {{ useLocalization('prepBatchManagement.listPage.title') }} -->
          Batch List
        </span>
      </h1>
    </template>
    <template #header-suffix>
      <div class="flex items-center gap-2">
        <PrimeVueButton class="bg-primary border-none w-fit px-5">
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="plus-line-white" class="w-4 h-4" />

              <span class="font-semibold text-base text-white">
                <!-- {{ useLocalization('account.add-store-facility') }} -->
                Add New Batch
              </span>
            </section>
          </template>
        </PrimeVueButton>
      </div>
    </template>
    <template #body="{ column, data }">
      <template v-if="column.value === 'action'">
        <PrimeVueButton variant="text" rounded aria-label="detail" @click="togglePopover($event, data.batch)">
          <template #icon>
            <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>
        <PrimeVuePopover
          :ref="(el: Element | ComponentPublicInstance | null) => setPopoverRef(data.batch, el)"
          :pt="{
            content: 'p-0',
          }"
        >
          <section id="popover-content" class="flex flex-col">
            <PrimeVueButton
              class="w-full px-4 py-3"
              variant="text"
              @click="
                () => {
                  console.log(data);
                }
              "
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="eye-visible" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Preview</span>
                </section>
              </template>
            </PrimeVueButton>
            <PrimeVueButton
              class="w-full px-4 py-3"
              variant="text"
              @click="
                () => {
                  console.log(data);
                }
              "
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="edit" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Edit</span>
                </section>
              </template>
            </PrimeVueButton>

            <PrimeVueButton
              class="w-full px-4 py-3"
              variant="text"
              @click="
                () => {
                  console.log(data);
                }
              "
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="delete" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Delete</span>
                </section>
              </template>
            </PrimeVueButton>
          </section>
        </PrimeVuePopover>
      </template>
      <template v-else-if="column.value === 'batchDate'">
        <span class="font-normal text-sm text-text-primary">
          {{ useFormatDate(data[column.value], 'dd/mm/yyyy') }}
        </span>
      </template>
      <template v-else-if="column.value === 'batchStatus'">
        <span>
          <PrimeVueChip
            :class="[batchList_getClassOfBatchStatus(data[column.value]), 'text-xs font-normal py-1 px-1.5 w-fit']"
            :label="useTitleCaseWithSpaces(data[column.value])"
          />
        </span>
      </template>
      <template v-else-if="column.value === 'targetYield'">
        <span class="font-normal text-sm text-text-primary flex gap-2">
          {{ data[column.value] }}
          <p class="text-disabled">Portion</p>
        </span>
      </template>
      <template v-else-if="column.value === 'notes'">
        <span class="font-normal text-sm text-text-primary">
          {{ data[column.value] || '-' }}
        </span>
      </template>
      <template v-else-if="column.value === 'updatedAt'">
        <span class="font-normal text-sm text-text-primary">
          {{ useFormatDate(data[column.value], 'dd/mm/yyyy') }}
        </span>
      </template>
      <template v-else>
        <span class="font-normal text-sm text-text-primary">
          {{ data[column.value] }}
        </span>
      </template>
    </template>
  </AppBaseDataTable>
</template>
