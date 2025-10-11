<script setup lang="ts">
import { IMidtransQrisPaymentData } from '@/modules/cashier/interfaces/cashier-response';

// Props
const props = defineProps<{
  modalPlaceOrderDetail: {
    showModalPayment: boolean;
    data: Partial<IMidtransQrisPaymentData>;
  };
}>();

// Emit
const emit = defineEmits<{
  (e: 'simulate-payment', invoiceId: string): void;
  (e: 'close'): void;
}>();

// env
const bucketURL = import.meta.env.VITE_APP_BASE_BUCKET_URL;
const router = useRouter();
const route = useRoute();

const handleClose = () => {
  if (route.name === 'invoice') {
    // If on the 'invoice' page, just emit an event to close the modal
    emit('close');
  } else {
    // Otherwise, perform the original navigation logic
    router.push({
      name:
        route.name === 'cashier' || route.name === 'cashier-order-edit'
          ? 'invoice'
          : 'self-order-invoice',
      params: {
        invoiceId: props.modalPlaceOrderDetail.data.invoiceId,
      },
    });
  }
}
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
          v-if="props.modalPlaceOrderDetail.data.invoiceId"
          class="flex flex-col gap-6 p-6 h-full w-full max-w-3xl"
        >
          <section class="items-center justify-center flex flex-col gap-4 flex-grow overflow-y-auto">
            <div class="flex flex-col gap-2">
              <div class="flex justify-between">
                <div class="flex flex-col gap-2 items-center">
                  <div class="flex lg:flex-col gap-2 items-center">
                    <AppBaseSvg
                      name="chevron-left"
                      class="!h-4 !w-4 block lg:hidden cursor-pointer"
                      @click="closeCallback"
                    />
                    <span class="text-2xl font-semibold">Payment</span>
                  </div>
                  <AppBaseImage
                    v-if="props.modalPlaceOrderDetail.data.qrImage"
                    :src="bucketURL + props.modalPlaceOrderDetail.data.qrImage"
                    :alt="'qris-static'"
                    class="h-92 w-92 object-contain"
                  />
                  <div v-else>
                    <template v-for="(item, index) in props.modalPlaceOrderDetail.data.actions">
                      <AppBaseImage
                        v-if="index === 0"
                        :key="index"
                        :src="item.url"
                        :alt="item.name"
                        class="h-92 w-92 object-contain"
                      />
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <PrimeVueButton
              class="w-full bg-primary text-white py-2.5 px-8"
              type="button"
              label="Make Payment"
              @click="emit('simulate-payment', props.modalPlaceOrderDetail.data.invoiceId)"
            />

            <PrimeVueButton
              class="w-full bg-primary text-white py-2.5 px-8"
              type="button"
              label="Close"
              @click="
                handleClose()
              "
            />
          </section>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
