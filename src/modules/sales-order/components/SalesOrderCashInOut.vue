<script setup lang="ts">
// Services
import { useCashInOutService } from '../services/cash-in-out.service';

// Components
import CashInOutCreateDialog from './CashInOutCreateDialog.vue';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  cashInOut_formData,
  cashInOut_formValidations,
  cashInOut_listColumns,
  cashInOut_listItemsOfSplitButton,
  cashInOut_listTypes,
  cashInOut_listValues,
  cashInOut_onClose,
  cashInOut_onCreate,
} = useCashInOutService();

/**
 * @description Provide all the data and methods what we need
 */
provide('cashInOut', {
  cashInOut_formData,
  cashInOut_formValidations,
  cashInOut_listTypes,
  cashInOut_onClose,
});
</script>

<template>
  <section id="sales-order-cash-in-out" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      btn-cta-create-title="Add Cash In/Out"
      :columns="cashInOut_listColumns"
      :data="cashInOut_listValues"
      header-title="Cash In/Out"
      is-using-btn-cta-create
      is-using-custom-body
      @click-btn-cta-create="cashInOut_onCreate"
    >
      <template #body="{ column, data }">
        <template v-if="column.value === 'type'">
          <div class="flex items-center gap-3">
            <AppBaseSvg
              :name="data[column.value] === 'Cash Out' ? 'arrow-left-circle-danger' : 'arrow-right-circle-success'"
              class="!w-5 !h-5"
            />

            <span class="font-normal text-sm text-text-primary">
              {{ data[column.value] }}
            </span>
          </div>
        </template>

        <template v-else-if="column.value === 'createdBy'">
          <span class="font-normal text-sm text-text-disabled">by {{ data[column.value] }}</span>
        </template>

        <template v-else-if="column.value === 'action'">
          <PrimeVueSplitButton
            :model="cashInOut_listItemsOfSplitButton"
            severity="contrast"
            :pt="{
              root: '[&>button.p-splitbutton-button]:hidden [&>button.p-splitbutton-dropdown]:bg-transparent [&>button.p-splitbutton-dropdown]:border-none',
            }"
          >
            &nbsp;
            <template #dropdownicon>
              <AppBaseSvg name="three-dots" class="!w-5 !h-5 text-gray-400" />
            </template>
          </PrimeVueSplitButton>
        </template>

        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>

    <CashInOutCreateDialog />
  </section>
</template>
