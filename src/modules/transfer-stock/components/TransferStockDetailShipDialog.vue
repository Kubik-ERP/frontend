<script setup lang="ts">
// Interfaces
import type { ITransferStockDetailProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  transferStockDetail_formDataOfShip,
  transferStockDetail_formValidationsOfShip,
  transferStockDetail_onCloseDialogShip,
  transferStockDetail_onSubmitShip,
  transferStockDetail_isLoading,
} = inject<ITransferStockDetailProvided>('transferStockDetail')!;
</script>

<template>
  <AppBaseDialog id="transfer-stock-detail-ship">
    <template #header>
      <header class="flex flex-col gap-2 w-full">
        <h6 class="font-semibold text-black text-lg">Ship Transfer Stock</h6>
      </header>
    </template>

    <template #content>
      <form action="" class="flex flex-col w-full">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="font-normal text-sm text-text-secondary w-full"
          is-name-as-label
          label-for="logistic_provider"
          name="Logistic Provider"
          :validators="transferStockDetail_formValidationsOfShip.logistic_provider"
        >
          <PrimeVueInputText
            v-model="transferStockDetail_formDataOfShip.logistic_provider"
            name="logistic_provider"
            placeholder="Enter logistic provider..."
            :class="{ ...classes }"
            class="text-sm w-full"
            v-on="useListenerForm(transferStockDetail_formValidationsOfShip, 'logistic_provider')"
          />
        </AppBaseFormGroup>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="font-normal text-sm text-text-secondary w-full"
          is-name-as-label
          label-for="tracking_number"
          name="Tracking Number"
          :validators="transferStockDetail_formValidationsOfShip.tracking_number"
        >
          <PrimeVueInputText
            v-model="transferStockDetail_formDataOfShip.tracking_number"
            name="tracking_number"
            placeholder="Enter tracking number..."
            :class="{ ...classes }"
            class="text-sm w-full"
            v-on="useListenerForm(transferStockDetail_formValidationsOfShip, 'tracking_number')"
          />
        </AppBaseFormGroup>

        <section id="delivery-note" class="flex flex-col gap-1 w-full">
          <label class="font-normal text-sm text-text-secondary w-full"> Delivery Notes </label>

          <PrimeVueTextarea
            v-model="transferStockDetail_formDataOfShip.delivery_note"
            name="delivery_note"
            placeholder="Enter delivery notes..."
            class="text-sm w-full"
            rows="3"
          />
        </section>
      </form>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10 py-3"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="transferStockDetail_onCloseDialogShip"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-3 w-full max-w-40"
          label="Ship"
          type="button"
          :loading="transferStockDetail_isLoading"
          @click="transferStockDetail_onSubmitShip"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
