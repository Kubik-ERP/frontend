<script setup lang="ts">
// Interfaces
import type { IStaffMemberCreateEditProvided } from '../interfaces';

const { staffMemberCreateEdit_onOpenDialogCommission, staffMemberCreateEdit_formData } =
  inject<IStaffMemberCreateEditProvided>('staffMemberCreateEdit')!;

const rbac = useRbac();
const voucherPermission = rbac.hasPermission('voucher');
const productPermission = rbac.hasPermission('product_management');
</script>

<template>
  <section id="staff-member-commision-form" class="flex flex-col gap-4">
    <h6 class="font-semibold text-grayscale-70 text-base">Commissions</h6>

    <section id="comission-types" class="grid-wrapper gap-4">
      <section
        v-if="productPermission"
        id="product-comission"
        :class="
          staffMemberCreateEdit_formData.defaultCommissionProduct !== null
            ? 'bg-primary-50 border-primary-300'
            : ''
        "
        class="col-span-full lg:col-span-6 flex items-center justify-between border-2 border-solid border-grayscale-10 px-4 py-2 rounded-lg"
      >
        <section id="description" class="flex flex-col gap-2">
          <h6 class="font-semibold text-grayscale-70 text-base">Product Comission</h6>

          <span class="font-normal text-text-disabled text-sm"> Commissions per product sales </span>
        </section>

        <PrimeVueButton
          class="border border-solid border-primary basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
          :class="staffMemberCreateEdit_formData.defaultCommissionProduct !== null ? 'bg-white' : ''"
          severity="secondary"
          variant="outlined"
          @click="staffMemberCreateEdit_onOpenDialogCommission('PRODUCT')"
        >
          <template #default>
            <section id="content">
              <div
                v-if="staffMemberCreateEdit_formData.defaultCommissionProduct !== null"
                class="flex items-center gap-2"
              >
                <AppBaseSvg name="edit" class="filter-primary-color w-5 h-5" />
                <span class="font-semibold text-sm text-primary">Change</span>
              </div>

              <div v-else class="flex items-center gap-2">
                <AppBaseSvg name="plus-line" class="filter-primary-color w-5 h-5" />
                <span class="font-semibold text-sm text-primary">Set Comission</span>
              </div>
            </section>
          </template>
        </PrimeVueButton>
      </section>

      <section
      v-if="voucherPermission"
        id="voucher-comission"
        :class="
          staffMemberCreateEdit_formData.defaultCommissionVoucher !== null
            ? 'bg-primary-50 border-primary-300'
            : ''
        "
        class="col-span-full lg:col-span-6 flex items-center justify-between border-2 border-solid border-grayscale-10 px-4 py-2 rounded-lg"
      >
        <section id="description" class="flex flex-col gap-2">
          <h6 class="font-semibold text-grayscale-70 text-base">Voucher Comission</h6>

          <span class="font-normal text-text-disabled text-sm"> Commissions per voucher usage </span>
        </section>

        <PrimeVueButton
          class="border border-solid border-primary basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
          :class="staffMemberCreateEdit_formData.defaultCommissionVoucher !== null ? 'bg-white' : ''"
          severity="secondary"
          variant="outlined"
          @click="staffMemberCreateEdit_onOpenDialogCommission('VOUCHER')"
        >
          <template #default>
            <section id="content">
              <div
                v-if="staffMemberCreateEdit_formData.defaultCommissionVoucher !== null"
                class="flex items-center gap-2"
              >
                <AppBaseSvg name="edit" class="filter-primary-color w-5 h-5" />
                <span class="font-semibold text-sm text-primary">Change</span>
              </div>

              <div v-else class="flex items-center gap-2">
                <AppBaseSvg name="plus-line" class="filter-primary-color w-5 h-5" />
                <span class="font-semibold text-sm text-primary">Set Comission</span>
              </div>
            </section>
          </template>
        </PrimeVueButton>
      </section>
    </section>
  </section>
</template>
