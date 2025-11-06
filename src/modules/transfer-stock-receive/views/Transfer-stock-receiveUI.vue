<script setup lang="ts">
// service
import { useTransferStockReceiveService } from '../services/transfer-stock-receive.service';
const { transferStockReceiveList_columns } = useTransferStockReceiveService();

const popovers = ref<Record<string, unknown>>({});
const togglePopover = (id: string, event: Event) => {
  const popover = popovers.value[`popover-${id}`] as { toggle?: (event: Event) => void } | null;
  popover?.toggle?.(event);
};
</script>
<template>
  <section>
    <AppBaseDataTable
      header-title="Transfer Stock Receiver List"
      :columns="transferStockReceiveList_columns"
      is-using-custom-body
      :is-using-filter="false"
    >
      <template #body="{ column, data }">
        <template v-if="column.value === 'action'">
          <PrimeVueButton
            variant="text"
            rounded
            aria-label="detail"
            @click="(event: Event) => togglePopover(data.transferNumber, event)"
          >
            <template #icon>
              <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>

          <PrimeVuePopover
            :ref="
              (el: unknown) => {
                if (el) popovers[`popover-${data.transferNumber}`] = el;
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
                @click="$router.push({ name: 'transfer-stock.detail', params: { id: data.id } })"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="eye-visible" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Transfer Details</span>
                  </section>
                </template>
              </PrimeVueButton>

              <!-- Edit Transfer (Only for draft status) -->
              <PrimeVueButton
                v-if="data.status === 'draft'"
                class="w-full px-4 py-3"
                variant="text"
                @click="$router.push({ name: 'transfer-stock.edit', params: { id: data.id } })"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="edit" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Edit Transfer</span>
                  </section>
                </template>
              </PrimeVueButton>

              <!-- Shipping Document (Only for shipped/received/closed status) -->
              <router-link
                :to="{ name: 'transfer-stock.shipping-document', params: { id: data.id } }"
                target="_blank"
              >
                <PrimeVueButton class="w-full px-4 py-3" variant="text">
                  <template #default>
                    <section id="content" class="flex items-center gap-2 w-full">
                      <AppBaseSvg name="document" class="!w-4 !h-4" />
                      <span class="font-normal text-sm text-text-primary">Shipping Document</span>
                    </section>
                  </template>
                </PrimeVueButton>
              </router-link>

              <!-- Cancel Transfer (Only for draft/approved status) -->
              <PrimeVueButton class="w-full px-4 py-3" variant="text">
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="close-red" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Cancel Transfer</span>
                  </section>
                </template>
              </PrimeVueButton>
            </section>
          </PrimeVuePopover>
        </template>

        <template v-else>
          <span class="font-normal text-sm text-grayscale-70">{{ data[column.value] ?? '-' }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>
