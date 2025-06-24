<script setup lang="ts">
import { useQueueService } from '../services/queue.service';
const { queueColumns, queueValues } = useQueueService();

const search = ref('');
const popover = ref();

const handleSearch = () => {
  console.log(search.value);
};

const orderTypeClass = (orderType: string) => {
  switch (orderType) {
    case 'Dine In':
      return 'bg-primary-background text-primary';
    case 'Takeaway':
      return 'bg-secondary-background text-green-primary';
    case 'Self Order':
      return 'bg-error-background text-error-main';
    default:
      return '';
  }
};

const orderStatusClass = (orderStatus: string) => {
  switch (orderStatus) {
    case 'Paid':
      return 'bg-background-success text-success';
    case 'Unpaid':
      return 'bg-warning-background text-warning-main';
    case 'Cancelled':
      return 'bg-error-background text-error-main';
    case 'Refunded':
      return 'bg-error-background text-error-main';
    default:
      return '';
  }
};
</script>
<template>
  <div>
    <AppBaseDataTable
      :data="queueValues"
      :columns="queueColumns"
      :paginator="true"
      :rows="10"
      :rows-per-page-options="[10, 20, 30]"
      is-using-server-side-pagination
      is-using-custom-body
      is-using-custom-filter
      is-using-custom-header-prefix
      is-using-custom-header-suffix
    >
      <template #header-prefix>
        <section class="w-full">
          <div class="flex items-center gap-2">
            <h6 class="font-semibold text-black text-xl">Order List</h6>
            <PrimeVueChip
              class="text-xs font-normal bg-secondary-background text-green-primary px-1.5 py-1"
              :label="`${queueValues.length} Orders`"
            />
          </div>
        </section>
      </template>

      <template #header-suffix>
        <div class="flex items-center gap-4">
          <form @submit.prevent="handleSearch">
            <PrimeVueIconField>
              <PrimeVueInputIcon>
                <template #default>
                  <AppBaseSvg name="search" />
                </template>
              </PrimeVueInputIcon>

              <PrimeVueInputText
                v-model="search"
                placeholder="Search Order Number"
                class="text-sm w-full min-w-80"
              />
            </PrimeVueIconField>
          </form>
          <PrimeVueButton class="whitespace-nowrap" label="Kitchen Display System">
            <template #icon>
              <AppBaseSvg name="display" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>
        </div>
      </template>

      <template #filter> filter </template>

      <template #body="{ column, data, index }">
        <template v-if="column.value === 'index'">
          <span class="">{{ index + 1 }}</span>
        </template>

        <template v-else-if="column.value === 'orderNumber'">
          <span class="font-semibold">{{ data.orderNumber }}</span>
        </template>

        <!-- order type -->
        <template v-else-if="column.value === 'orderType'">
          <PrimeVueChip
            :class="[orderTypeClass(data[column.value]), 'text-xs font-normal px-1.5 py-1']"
            :label="data[column.value]"
          />
        </template>

        <template v-else-if="column.value === 'orderStatus'">
          <PrimeVueChip
            :class="[orderStatusClass(data[column.value]), 'text-xs font-normal px-1.5 py-1']"
            :label="data[column.value]"
          />
        </template>

        <!-- action -->
        <template v-else-if="column.value === 'action'" >
          <PrimeVueButton variant="text" rounded aria-label="Action" @click="popover.toggle($event)">
            <template #icon>
              <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>

          <PrimeVuePopover
            ref="popover"
            :pt="{
              content: 'p-0',
            }"
          >
            <section id="popover-content" class="flex flex-col">
              <PrimeVueButton
                class="w-full px-4 py-3"
                variant="text"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="eye-visible" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">View Order Details</span>
                  </section>
                </template>
              </PrimeVueButton>

              <PrimeVueButton class="w-full px-4 py-3" variant="text">
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="edit" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Change Status</span>
                  </section>
                </template>
              </PrimeVueButton>
            </section>
          </PrimeVuePopover>
        </template>

        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </div>
</template>
