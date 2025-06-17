<script setup lang="ts">
// Components
import CashInOutListCreateDialog from '../components/CashInOutListCreateDialog.vue';

// Services
import { useCashInOutListService } from '../services/cash-in-out.service';

/**
 * @description Reactive data binding
 */
const popover = ref();

/**
 * @description Destructure all the data and methods what we need
 */
const {
  cashInOutList_formData,
  cashInOutList_formValidations,
  cashInOutList_listColumns,
  cashInOutList_listTypes,
  cashInOutList_listValues,
  cashInOutList_onClose,
  cashInOutList_onCreate,
} = useCashInOutListService();

/**
 * @description Provide all the data and methods what we need
 */
provide('cashInOutList', {
  cashInOutList_formData,
  cashInOutList_formValidations,
  cashInOutList_listTypes,
  cashInOutList_onClose,
});
</script>

<template>
  <section id="cash-in-out-list" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      btn-cta-create-title="Add Cash In/Out"
      :columns="cashInOutList_listColumns"
      :data="cashInOutList_listValues"
      header-title="Cash In/Out"
      is-using-btn-cta-create
      is-using-custom-body
      @click-btn-cta-create="cashInOutList_onCreate"
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
          <PrimeVueButton variant="text" rounded aria-label="detail" @click="popover.toggle($event)">
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
                @click="$router.push({ name: 'customer.edit', params: { id: data.id } })"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="edit" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Edit</span>
                  </section>
                </template>
              </PrimeVueButton>

              <PrimeVueButton class="w-full px-4 py-3" variant="text">
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

        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>

    <CashInOutListCreateDialog />
    <AppBaseDialogConfirmation id="sales-order-cash-in-out-dialog-confirmation" />
  </section>
</template>
