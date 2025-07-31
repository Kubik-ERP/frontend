<script setup lang="ts">
// Interfaces
import type { IStaffMemberCreateEditProvided } from '../interfaces';

const {
  staffMemberCreateEdit_columnsOfCommissions,
  staffMemberCreateEdit_commisionType,
  staffMemberCreateEdit_onCloseDialogCommission,
} = inject<IStaffMemberCreateEditProvided>('staffMemberCreateEdit')!;

/**
 * @description This component is only temporary for development purposes.
 */
const commissionValue = ref(0);
const commissionType = ref('Rp');
const commissionTypes = ref(['Rp', '%']);
</script>

<template>
  <AppBaseDialog id="staff-member-comission-item-dialog">
    <template #header>
      <h6 class="font-semibold text-black text-lg">
        {{ staffMemberCreateEdit_commisionType === 'PRODUCT' ? 'Product Commissions' : 'Voucher Commissions' }}
      </h6>
    </template>

    <template #content>
      <form class="flex flex-col gap-4 w-full">
        <div class="flex flex-col gap-2 w-fit">
          <label for="commission-input" class="text-base text-gray-800"> Default Product Commissions </label>

          <PrimeVueInputGroup class="w-64 rounded-lg border border-gray-300 overflow-hidden">
            <PrimeVueInputNumber
              id="commission-input"
              v-model="commissionValue"
              placeholder="0"
              :min-fraction-digits="0"
              :max-fraction-digits="2"
              :prefix="commissionType === 'Rp' ? 'Rp' : ''"
              :suffix="commissionType === '%' ? '%' : ''"
              mode="decimal"
              input-id="commission-input-field"
            />

            <PrimeVueInputGroupAddon class="bg-transparent pr-0 pl-2">
              <PrimeVueSelect
                v-model="commissionType"
                :options="commissionTypes"
                :pt="{
                  root: 'border-none bg-transparent shadow-none ring-0 focus:ring-0 p-0',
                  label: 'pr-2',
                }"
              />
            </PrimeVueInputGroupAddon>
          </PrimeVueInputGroup>
        </div>
        <!-- <PrimeVueInputGroup>
          <PrimeVueInputNumber
            id="item-comission"
            class="w-full max-w-60"
            placeholder="0"
            :min="0"
            mode="decimal"
            input-id="item-comission-input"
            suffix="%"
          />

          <PrimeVueInputGroupAddon>
            <AppBaseSvg name="chevron-down" class="!w-5 !h-5" />
          </PrimeVueInputGroupAddon>
        </PrimeVueInputGroup> -->

        <div class="flex items-center gap-2">
          <PrimeVueCheckbox binary />
          <span class="font-normal text-black text-sm">
            All
            {{ staffMemberCreateEdit_commisionType === 'PRODUCT' ? 'products' : 'vouchers' }}
            have same default commission
          </span>
        </div>

        <PrimeVueDataTable :value="[]">
          <template #empty>
            <section class="flex items-center justify-center w-full">
              <span class="font-semibold text-sm text-text-primary">No data available</span>
            </section>
          </template>

          <PrimeVueColumn
            v-for="(column, columnIndex) in staffMemberCreateEdit_columnsOfCommissions"
            :key="`column-${columnIndex}`"
            :field="column.value"
            :header="column.label"
          >
            <template #body="{ data }">
              <template v-if="column.value === 'comissions'"> Comissions </template>

              <template v-else>
                <span class="font-normal text-sm text-text-primary">{{ data[column.value] ?? '-' }}</span>
              </template>
            </template>
          </PrimeVueColumn>
        </PrimeVueDataTable>
      </form>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4 mt-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="staffMemberCreateEdit_onCloseDialogCommission"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40"
          label="Save"
          type="button"
          @click="staffMemberCreateEdit_onCloseDialogCommission"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
