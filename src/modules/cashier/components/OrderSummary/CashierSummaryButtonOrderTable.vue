<script setup></script>
<template>
  <section id="cashier-summary-button-order-table">
    <div class="border-t-2 border-t-grayscale-10">
      <div class="flex justify-between w-full items-center py-4 gap-2">
        <button
          :class="[
            'flex border truncate cursor-pointer active:bg-text-disabled/10 hover:bg-text-disabled/5  border-text-disabled rounded-sm p-2.5 justify-between items-center',
            props.isSelfOrder ? 'w-full' : 'w-1/2',
          ]"
          @click="cashierOrderSummary_modalOrderType.show = true"
        >
          <span v-if="cashierOrderSummary_modalOrderType.selectedOrderType" class="text-black">
            {{
              CASHIER_ORDER_TYPE.find(f => f.code === cashierOrderSummary_modalOrderType.selectedOrderType)
                ?.label || 'Order Type'
            }}
          </span>
          <span v-else class="text-text-disabled">Order Type</span>

          <AppBaseSvg name="order" class="!h-5 !w-5" />
        </button>
        <button
          v-if="!props.isSelfOrder"
          class="flex w-1/2 border truncate cursor-pointer active:bg-text-disabled/10 hover:bg-text-disabled/5 border-text-disabled rounded-sm p-2.5 justify-between items-center"
          @click="cashierOrderSummary_modalSelectTable.show = true"
        >
          <span>
            <span v-if="cashierOrderSummary_modalSelectTable.selectedTable" class="text-black">
              {{
                cashierOrderSummary_modalSelectTable.selectedTable.length > 0
                  ? cashierOrderSummary_modalSelectTable.selectedTable.toString()
                  : 'Select Table'
              }}
            </span>
            <span v-else class="text-text-disabled"> Select Table </span>
          </span>

          <AppBaseSvg name="table" class="!h-5 !w-5" />
        </button>
      </div>
    </div>
  </section>
</template>
