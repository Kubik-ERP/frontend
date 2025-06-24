<script setup lang="ts">
import { useQueueService } from '../services/queue.service';
const { queueColumns, queueValues, OrderStatusList, OrderTypeList } = useQueueService();

const search = ref('');

const handleSearch = () => {
  console.log(search.value);
};

const filter = reactive<{ date: Date; orderType: string; orderStatus: string }>({
  date: new Date(),
  orderType: '',
  orderStatus: '',
});

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
    case 'In Progress':
      return 'bg-primary-background text-primary';
    case 'Served':
      return 'bg-secondary-background text-green-primary';
    case 'Complete':
      return 'bg-secondary-background text-secondary';
    case 'Cancelled':
      return 'bg-error-background text-error-main';
    default:
      return '';
  }
};
</script>
<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-2 items-center">
      <router-link to="/customer-waiting-list">
        <PrimeVueButton class="w-fit" label="Customer Waiting List System">
          <template #icon>
            <AppBaseSvg name="display" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>
      </router-link>
      <router-link to="/kds">
        <PrimeVueButton class="w-fit" label="Kitchen Display System">
          <template #icon>
            <AppBaseSvg name="display" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>
      </router-link>
    </div>

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
            <h6 class="font-semibold text-black text-xl">Queue</h6>
            <PrimeVueChip
              class="text-xs font-normal bg-secondary-background text-green-primary px-1.5 py-1"
              :label="`${queueValues.length}`"
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
        </div>
      </template>

      <template #filter>
        <section class="flex flex-col gap-2">
          <h6 class="font-semibold text-black text-lg">Filter by</h6>
          <div class="flex items-center gap-4">
            <PrimeVueDatePicker
              v-model="filter.date"
              class="w-full min-w-80"
              placeholder="Real time: "
              show-on-focus
              show-icon
              fluid
              selection-mode="range"
              :manual-input="false"
              date-format="MM dd, yy"
            >
            </PrimeVueDatePicker>

            <PrimeVueSelect
              v-model="filter.orderType"
              :options="OrderTypeList"
              placeholder="Order Type"
              option-label="label"
              option-value="value"
              class="w-full min-w-52"
            >
              <template #option="{ option }">
                <PrimeVueChip
                  :class="[orderTypeClass(option.label), 'text-xs font-semibold px-1.5 py-1']"
                  :label="option.label"
                />
              </template>
              <template #value="{ value, placeholder }">
                <span v-if="!value" class="p-placeholder">
                  {{ placeholder }}
                </span>
                <PrimeVueChip
                  v-else
                  :class="[orderTypeClass(value), 'text-xs font-normal px-1.5 py-1']"
                  :label="value"
                />
              </template>
              <template #dropdownicon>
                <AppBaseSvg name="chevron-down" class="!w-5 !h-5" />
              </template>
            </PrimeVueSelect>

            <PrimeVueSelect
              v-model="filter.orderStatus"
              :options="OrderStatusList"
              placeholder="Order Status"
              option-label="label"
              option-value="value"
              class="w-full min-w-52"
            >
              <template #option="{ option }">
                <PrimeVueChip
                  :class="[orderStatusClass(option.label), 'text-xs font-semibold px-1.5 py-1']"
                  :label="option.label"
                />
              </template>
              <template #value="{ value, placeholder }">
                <span v-if="!value" class="p-placeholder">
                  {{ placeholder }}
                </span>
                <PrimeVueChip
                  v-else
                  :class="[orderStatusClass(value), 'text-xs font-normal px-1.5 py-1']"
                  :label="value"
                />
              </template>
              <template #dropdownicon>
                <AppBaseSvg name="chevron-down" class="!w-5 !h-5" />
              </template>
            </PrimeVueSelect>
          </div>
        </section>
      </template>

      <template #body="{ column, data, index }">
        <template v-if="column.value === 'index'">
          <span class="">{{ index + 1 }}</span>
        </template>

        <template v-else-if="column.value === 'orderNumber'">
          <span class="text-primary">{{ data.orderNumber }}</span>
        </template>

        <!-- order type -->
        <template v-else-if="column.value === 'orderType'">
          <PrimeVueChip
            :class="[orderTypeClass(data[column.value]), 'text-xs font-normal px-1.5 py-1']"
            :label="data[column.value]"
          />
        </template>

        <template v-else-if="column.value === 'orderStatus'">
          <PrimeVueSelect
            v-model="data[column.value]"
            :options="OrderStatusList"
            option-label="label"
            option-value="value"
            class="w-full"
          >
            <template #option="{ option }">
              <PrimeVueChip
                :class="[orderStatusClass(option.label), 'text-xs font-semibold px-1.5 py-1']"
                :label="option.label"
              />
            </template>
            <template #value="{ value }">
              <PrimeVueChip :class="[orderStatusClass(value), 'text-xs font-normal px-1.5 py-1']" :label="value" />
            </template>
            <template #dropdownicon>
              <AppBaseSvg name="chevron-down" class="!w-5 !h-5" />
            </template>
          </PrimeVueSelect>
        </template>

        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </div>
</template>
