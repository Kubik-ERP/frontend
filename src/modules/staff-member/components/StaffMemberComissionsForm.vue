<script setup lang="ts">
// Interfaces
import type { IStaffMemberCreateEditProvided } from '../interfaces';

const { staffMemberCreateEdit_onOpenDialogCommission } =
  inject<IStaffMemberCreateEditProvided>('staffMemberCreateEdit')!;
</script>

<template>
  <section id="staff-member-commision-form" class="flex flex-col gap-4">
    <h6 class="font-semibold text-grayscale-70 text-base">Commissions</h6>

    <section id="comission-types" class="grid-wrapper gap-4">
      <section
        id="product-comission"
        class="col-span-full lg:col-span-6 flex items-center justify-between border-2 border-solid border-grayscale-10 px-4 py-2 rounded-lg"
      >
        <section id="description" class="flex flex-col gap-2">
          <h6 class="font-semibold text-grayscale-70 text-base">Product Comission</h6>

          <span class="font-normal text-text-disabled text-sm"> Commissions per product sales </span>
        </section>

        <PrimeVueButton
          class="border-2 border-solid border-primary basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
          severity="secondary"
          variant="outlined"
          @click="staffMemberCreateEdit_onOpenDialogCommission('PRODUCT')"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="plus-line" />
              <span class="font-semibold text-sm text-primary">Set Comission</span>
            </section>
          </template>
        </PrimeVueButton>
      </section>

      <section
        id="voucher-comission"
        class="col-span-full lg:col-span-6 flex items-center justify-between border-2 border-solid border-grayscale-10 px-4 py-2 rounded-lg"
      >
        <section id="description" class="flex flex-col gap-2">
          <h6 class="font-semibold text-grayscale-70 text-base">Voucher Comission</h6>

          <span class="font-normal text-text-disabled text-sm"> Commissions per voucher usage </span>
        </section>

        <PrimeVueButton
          class="border-2 border-solid border-primary basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
          severity="secondary"
          variant="outlined"
          @click="staffMemberCreateEdit_onOpenDialogCommission('VOUCHER')"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="plus-line" />
              <span class="font-semibold text-sm text-primary">Set Comission</span>
            </section>
          </template>
        </PrimeVueButton>
      </section>
    </section>
  </section>
</template>
