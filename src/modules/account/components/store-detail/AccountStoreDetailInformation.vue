<script setup lang="ts">
// Interfaces
import { IOutletOperationalHour } from '@/modules/outlet/interfaces';
import type { IAccountStoreDetailProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { accountStoreDetail_listColumnsOfOperationalHours, accountStoreDetail_operationalHours } =
  inject<IAccountStoreDetailProvided>('accountStoreDetail')!;

const isOperationalHoursAllClosed = (operationalHours: IOutletOperationalHour) => {
  return operationalHours.hours.every(slot => slot.openTime === 'Closed' && slot.closeTime === 'Closed');
};
</script>

<template>
  <section id="account-details" class="flex flex-col gap-2 w-full">
    <header class="flex items-center gap-4">
      <h6 class="font-semibold text-black text-lg">
        {{ useLocalization('account.store-details') }}
      </h6>

      <router-link id="edit-profile" :to="{ name: 'account.edit' }" class="flex items-center gap-2">
        <AppBaseSvg name="edit" />

        <span class="font-semibold text-primary text-sm">
          {{ useLocalization('account.edit-store-details') }}
        </span>
      </router-link>
    </header>

    <section
      id="content"
      class="flex flex-col gap-4 p-4 border border-solid border-grayscale-20 rounded-lg w-full"
    >
      <section id="user-profile" class="flex items-center gap-4">
        <PrimeVueAvatar class="w-16 h-16" label="P" size="large" shape="circle" />

        <div class="flex flex-col gap-4">
          <h5 class="font-semibold text-primary text-xl">Samantha</h5>
          <span class="font-normal text text-disabled text-xs"> Created on: March 24, 2025 </span>
        </div>
      </section>

      <section id="store-information" class="grid grid-rows-1 grid-cols-12 max-w-3xl gap-4">
        <section id="business-type" class="col-span-full lg:col-span-6 flex flex-col gap-1">
          <span class="font-normal text-grayscale-70 text-sm">
            {{ useLocalization('app.business-type') }}
          </span>

          <span class="font-normal text-text-primary text-base"> Restaurant (FnB) </span>
        </section>

        <section id="business-type" class="col-span-full lg:col-span-6 flex flex-col gap-1">
          <span class="font-normal text-grayscale-70 text-sm">
            {{ useLocalization('app.email-address') }}
          </span>

          <span class="font-normal text-text-primary text-base"> lawsonkal@gmail.com </span>
        </section>

        <section id="business-type" class="col-span-full lg:col-span-6 flex flex-col gap-1">
          <span class="font-normal text-grayscale-70 text-sm">
            {{ useLocalization('app.phone-number') }}
          </span>

          <span class="font-normal text-text-primary text-base"> +62 81234567890 </span>
        </section>

        <section id="business-type" class="col-span-full lg:col-span-6 flex flex-col gap-1">
          <span class="font-normal text-grayscale-70 text-sm">
            {{ useLocalization('app.street-address') }}
          </span>

          <span class="font-normal text-text-primary text-base">
            Jl. Kaliurang KM 5, Ngaglik, Sleman, Yogyakarta
          </span>
        </section>
      </section>

      <section id="operational-hours" class="flex flex-col gap-4 mt-2">
        <h6 class="font-semibold text-black text-lg">
          {{ useLocalization('app.operational-hours') }}
        </h6>

        <table class="table-fixed border-collapse rounded-lg">
          <thead>
            <tr class="bg-background border border-solid border-grayscale-20 rounded-tl-lg rounded-tr-lg">
              <th
                v-for="(column, columnIndex) in accountStoreDetail_listColumnsOfOperationalHours"
                :key="`column-${columnIndex}`"
                class="font-normal text-grayscale-70 text-xs xl:text-sm px-6 py-4 text-start"
                :class="[
                  column.width ? `w-[${column.width}]` : '',
                  columnIndex === 0 ? 'rounded-tl-lg' : '',
                  columnIndex === accountStoreDetail_listColumnsOfOperationalHours.length - 1
                    ? 'rounded-tr-lg'
                    : '',
                ]"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>

          <tbody>
            <template v-for="operationalHours in accountStoreDetail_operationalHours" :key="operationalHours.day">
              <tr
                v-for="(slot, slotIndex) in operationalHours.hours"
                :key="`${operationalHours.day}-${slotIndex}`"
                class="border border-solid border-grayscale-20 first:border-t-0 last:rounded-bl-lg last:rounded-br-lg"
                :class="[isOperationalHoursAllClosed(operationalHours) ? 'bg-light-white' : 'bg-transparent']"
              >
                <td
                  v-if="slotIndex === 0"
                  :rowspan="operationalHours.hours.length"
                  class="px-6 py-7 font-normal text-base align-middle border-r border-solid border-grayscale-20"
                  :class="[
                    isOperationalHoursAllClosed(operationalHours) ? 'text-text-disabled' : 'text-text-primary',
                    slotIndex === 0 ? 'rounded-tl-lg' : '',
                    slotIndex === operationalHours.hours.length - 1 ? 'rounded-bl-lg' : '',
                  ]"
                >
                  {{ operationalHours.day }}
                </td>

                <td v-if="slot.openTime === 'Closed'" class="px-6 py-7 font-normal text-text-disabled text-base">
                  {{ slot.openTime }}
                </td>

                <td v-if="slot.closeTime === 'Closed'" class="px-6 py-7 font-normal text-text-disabled text-base">
                  {{ slot.closeTime }}
                </td>

                <template v-else>
                  <td class="px-6 py-7 font-normal text-text-primary text-base">
                    {{ useFormatDate(slot.openTime, 'hh:mm') }}
                  </td>
                  <td class="px-6 py-7 font-normal text-text-primary text-base">
                    {{ useFormatDate(slot.closeTime, 'hh:mm') }}
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </section>
    </section>
  </section>
</template>
