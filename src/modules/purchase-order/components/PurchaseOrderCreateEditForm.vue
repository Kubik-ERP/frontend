<script setup lang="ts">
// Interfaces
import type { IPurchaseOrderCreateEditProvided } from '../interfaces';

/**
 * @description Reactive data binding
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const popovers = ref<Record<string, any>>({});

/**
 * @description Inject all the data and methods what we need
 */
const {
  purchaseOrderCreateEdit_formData,
  purchaseOrderCreateEdit_formValidations,
  purchaseOrderCreateEdit_listColumns,
  purchaseOrderCreateEdit_listSuppliers,
  purchaseOrderCreateEdit_onDeleteProductItem,
  purchaseOrderCreateEdit_onShowDialogAddProductItem,
  purchaseOrderCreateEdit_onShowDialogEditQuantity,
  purchaseOrderCreateEdit_onSubmitForm,
  purchaseOrderCreateEdit_selectedProductItems,
  purchaseOrderCreateEdit_totalPrice,
} = inject('purchaseOrderCreateEdit') as IPurchaseOrderCreateEditProvided;
</script>

<template>
  <form class="default-wrapper gap-6" @submit.prevent="purchaseOrderCreateEdit_onSubmitForm">
    <section id="oder-details" class="flex flex-col gap-2 w-full">
      <h6 class="font-semibold text-lg text-primary">Order Details</h6>

      <section id="form-groups" class="grid grid-rows-1 grid-cols-12 gap-4">
        <section id="supplier" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="supplier"
            name="Supplier"
            spacing-bottom="mb-0"
            :validators="purchaseOrderCreateEdit_formValidations.supplierId"
          >
            <PrimeVueSelect
              id="supplier"
              v-model="purchaseOrderCreateEdit_formData.supplierId"
              filter
              :options="purchaseOrderCreateEdit_listSuppliers"
              option-label="label"
              option-value="value"
              class="text-base text-text-primary w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(purchaseOrderCreateEdit_formValidations, 'supplierId')"
            />
          </AppBaseFormGroup>
        </section>

        <section id="order-date" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="font-normal text-sm text-text-secondary w-full"
            is-name-as-label
            label-for="orderDate"
            name="Order Date"
            :validators="purchaseOrderCreateEdit_formValidations.orderDate"
          >
            <PrimeVueDatePicker
              v-model="purchaseOrderCreateEdit_formData.orderDate"
              name="orderDate"
              selection-mode="range"
              date-format="dd/mm/yy"
              show-icon
              :class="{ ...classes }"
              class="text-sm w-full"
              v-on="useListenerForm(purchaseOrderCreateEdit_formValidations, 'orderDate')"
            />
          </AppBaseFormGroup>
        </section>
      </section>
    </section>

    <AppBaseDataTable
      :columns="purchaseOrderCreateEdit_listColumns"
      :data="purchaseOrderCreateEdit_selectedProductItems"
      is-using-custom-body
      is-using-custom-header
      is-using-custom-footer
      :is-using-border-on-header="false"
      :is-using-pagination="false"
      :max-visible-rows="5"
    >
      <template #header>
        <header class="flex items-center justify-between py-5">
          <h6 class="font-semibold text-lg text-primary">Items<span class="text-error-main">*</span></h6>

          <PrimeVueButton
            class="bg-primary border-none w-fit px-5"
            severity="secondary"
            @click="purchaseOrderCreateEdit_onShowDialogAddProductItem"
          >
            <template #default>
              <section id="content" class="flex items-center gap-2">
                <AppBaseSvg name="plus-line-white" />

                <span class="font-semibold text-base text-white"> Add Item Order </span>
              </section>
            </template>
          </PrimeVueButton>
        </header>
      </template>

      <template #body="{ column, data }">
        <template v-if="purchaseOrderCreateEdit_selectedProductItems.length === 0">
          <td :colspan="purchaseOrderCreateEdit_listColumns.length" class="text-center py-8">
            <span class="font-normal text-sm text-gray-500">No order items</span>
          </td>
        </template>

        <template v-else>
          <template v-if="column.value === 'unitPrice' || column.value === 'totalPrice'">
            <span class="font-normal text-sm text-text-primary">
              {{
                useCurrencyFormat({
                  data: data[column.value],
                  hidePrefix: false,
                  addSuffix: false,
                })
              }}
            </span>
          </template>

          <template v-else-if="column.value === 'action'">
            <PrimeVueButton
              variant="text"
              rounded
              aria-label="detail"
              @click="(event: Event) => popovers[`popover-${data.poNumber}`]?.toggle(event)"
            >
              <template #icon>
                <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
              </template>
            </PrimeVueButton>

            <PrimeVuePopover
              :ref="
                (el: any) => {
                  if (el) popovers[`popover-${data.poNumber}`] = el;
                }
              "
              :pt="{
                content: 'p-0',
              }"
            >
              <section id="popover-content" class="flex flex-col">
                <PrimeVueButton
                  class="w-full px-4 py-3"
                  variant="text"
                  @click="purchaseOrderCreateEdit_onShowDialogEditQuantity(data)"
                >
                  <template #default>
                    <section id="content" class="flex items-center gap-2 w-full">
                      <AppBaseSvg name="edit" class="!w-4 !h-4" />
                      <span class="font-normal text-sm text-text-primary">Edit Quantity</span>
                    </section>
                  </template>
                </PrimeVueButton>

                <PrimeVueButton
                  class="w-full px-4 py-3"
                  variant="text"
                  @click="purchaseOrderCreateEdit_onDeleteProductItem(data)"
                >
                  <template #default>
                    <section id="content" class="flex items-center gap-2 w-full">
                      <AppBaseSvg name="delete" class="!w-4 !h-4" />
                      <span class="font-normal text-sm text-text-primary">Delete Item</span>
                    </section>
                  </template>
                </PrimeVueButton>
              </section>
            </PrimeVuePopover>
          </template>

          <template v-else>
            <span class="font-normal text-sm text-text-primary">{{ data[column.value] ?? '-' }}</span>
          </template>
        </template>
      </template>

      <template #footer>
        <div class="flex items-center justify-end pe-44 pt-2">
          <div class="flex items-center gap-4">
            <span class="font-semibold text-base text-primary">Total Price</span>
            <span class="font-semibold text-base text-primary">
              {{
                useCurrencyFormat({
                  data: purchaseOrderCreateEdit_totalPrice,
                  hidePrefix: false,
                  addSuffix: false,
                })
              }}
            </span>
          </div>
        </div>
      </template>
    </AppBaseDataTable>
  </form>
</template>
