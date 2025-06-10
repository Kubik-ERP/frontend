<script setup lang="ts">
// Props
const props = defineProps<{
  modalPlaceOrderDetail: {
    showModalPayment: boolean;
    data: Partial<ICashierResponseMidtransQrisPayment['data']>;
  };
}>();

// Emit
const emit = defineEmits<{
  (e: 'simulate-payment', orderId: string): void;
}>();

// env
const isDevelopmentMode = import.meta.env.VITE_APP_MODE === 'development';

import { ICashierResponseMidtransQrisPayment } from '@/modules/cashier/interfaces/cashier-response';
// Router
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <section id="cashier-summary-modal-payment-qris">
    <PrimeVueDialog
      v-model:visible="props.modalPlaceOrderDetail.showModalPayment"
      modal
      :style="{
        width: '100dvw',
        minHeight: '100dvh',
        maxHeight: '100dvh',
      }"
      class="p-0 m-0 w-full h-full flex items-center justify-center rounded-none lg:rounded-lg"
    >
      <template #container="{ closeCallback }">
        <section
          v-if="props.modalPlaceOrderDetail.data.orderId"
          class="flex flex-col gap-6 p-6 h-full w-full max-w-3xl"
        >
          <section class="items-center justify-center flex flex-col gap-4 flex-grow overflow-y-auto">
            <div class="flex flex-col gap-2">
              <div class="flex justify-between">
                <div class="flex flex-col gap-2 items-center">
                  <AppBaseSvg
                    name="chevron-left"
                    class="!h-4 !w-4 block lg:hidden cursor-pointer"
                    @click="closeCallback"
                  />
                  <span class="text-2xl font-semibold">Payment</span>

                  <AppBaseImage
                    v-for="(item, index) in props.modalPlaceOrderDetail.data.actions"
                    :key="index"
                    :src="item.url"
                    :alt="item.name"
                    class="h-92 w-92 object-contain"
                  />
                </div>
              </div>
            </div>

            <PrimeVueButton
              v-if="isDevelopmentMode"
              class="w-full bg-primary text-white py-2.5 px-8"
              type="button"
              label="Simulate Payment"
              @click="emit('simulate-payment', props.modalPlaceOrderDetail.data.orderId)"
            />

            <PrimeVueButton
              class="w-full bg-primary text-white py-2.5 px-8"
              type="button"
              label="Close"
              @click="
                router.push({
                  name: 'invoice',
                  params: {
                    invoiceId: props.modalPlaceOrderDetail.data.orderId,
                  },
                })
              "
            />
          </section>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
