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
  <AppBaseDialog
    id="transfer-stock-detail-ship"
    title="Ship Transfer Stock"
    custom-body-class="px-6"
    custom-footer-class="px-6 pb-6"
    custom-header-class="px-6 pt-6"
  >
    <template #body>
      <div class="space-y-4">
        <div>
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
        </div>
        
        <div>
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
        </div>
        
        <div>
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="font-normal text-sm text-text-secondary w-full"
            is-name-as-label
            label-for="delivery_note"
            name="Delivery Notes"
            :validators="transferStockDetail_formValidationsOfShip.delivery_note"
          >
            <PrimeVueTextarea
              v-model="transferStockDetail_formDataOfShip.delivery_note"
              name="delivery_note"
              placeholder="Enter delivery notes..."
              :class="{ ...classes }"
              class="text-sm w-full"
              rows="3"
              v-on="useListenerForm(transferStockDetail_formValidationsOfShip, 'delivery_note')"
            />
          </AppBaseFormGroup>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-4">
        <PrimeVueButton
          class="border border-gray-300 text-gray-700 px-4 py-2"
          label="Cancel"
          variant="outlined"
          @click="transferStockDetail_onCloseDialogShip"
        />
        <PrimeVueButton
          class="bg-blue-600 text-white px-4 py-2"
          label="Ship"
          :loading="transferStockDetail_isLoading"
          @click="transferStockDetail_onSubmitShip"
        />
      </div>
    </template>
  </AppBaseDialog>
</template>