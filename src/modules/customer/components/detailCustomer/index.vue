<script setup lang="ts">
import { useCustomerDetailService } from '../../services/customer-detail.service';

const { customerDetails_isLoading, customerDetails } = useCustomerDetailService();

const formatDate = (dateInput: string | number | Date, format: string = 'dd/mm/yyyy hh:MM am/pm'): string => {
  let date: Date;

  if (typeof dateInput === 'number') {
    // Unix timestamp in seconds
    date = new Date(dateInput * 1000); // Convert seconds to milliseconds
  } else if (typeof dateInput === 'string') {
    // String date
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    // Date object
    date = dateInput;
  } else {
    throw new Error('Invalid date input');
  }

  const hours = date.getHours();
  const is12HourFormat = format.includes('am/pm');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

  const map: Record<string, string | number> = {
    yyyy: date.getFullYear(),
    mm: String(date.getMonth() + 1).padStart(2, '0'),
    dd: String(date.getDate()).padStart(2, '0'),
    hh: is12HourFormat ? String(hours12).padStart(2, '0') : String(hours).padStart(2, '0'),
    MM: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
    'am/pm': ampm,
  };

  return format.replace(/yyyy|mm|dd|hh|MM|ss|am\/pm/g, matched => map[matched].toString());
};
</script>
<template>
  <div class="border border-solid border-primary rounded-md p-4 mb-8">
    <section class="flex flex-col gap-2">
      <div class="flex items-center gap-8">
        <h1 class="text-xl font-semibold">
          <template v-if="customerDetails_isLoading">
            <PrimeVueSkeleton width="12rem" height="1.5rem" class="rounded-md"></PrimeVueSkeleton>
          </template>
          <template v-else>
            {{ customerDetails.name }}
          </template>
        </h1>
        <router-link :to="{ name: 'edit-customer', params: { id: customerDetails.id } }">
          <PrimeVueButton
            label="Edit Customer Data"
            variant="text"
            class="flex items-center gap-2 text-primary font-semibold text-sm"
          >
            <template #icon>
              <AppBaseSvg name="edit" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>
        </router-link>
      </div>
      <!-- <p>
        <template v-if="customerDetails_isLoading">
          <PrimeVueSkeleton width="20rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
        </template>
        <template v-else>
          {{ customerDetails.id }}
        </template>
      </p> -->
    </section>

    <section>
      <h2 class="font-semibold text-primary text-lg mt-4 mb-2">Customer Details</h2>
      <div class="grid grid-cols-3 gap-4 justify-evenly">
        <div class="flex flex-col">
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <p class="truncate">
            <template v-if="customerDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else>
              {{ customerDetails.email || '-' }}
            </template>
          </p>
        </div>

        <div class="flex flex-col">
          <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
          <p>
            <template v-if="customerDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else> {{ '(' + customerDetails.code + ')' }} {{ customerDetails.number }} </template>
          </p>
        </div>

        <div class="flex flex-col">
          <label for="address" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
          <p>
            <template v-if="customerDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else>
              {{ customerDetails.address || '-' }}
            </template>
          </p>
        </div>

        <div class="flex flex-col">
          <label for="gender" class="block text-sm font-medium leading-6 text-gray-900">Gender</label>
          <p>
            <template v-if="customerDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else>
              {{ customerDetails.gender || '-' }}
            </template>
          </p>
        </div>

        <div class="flex flex-col">
          <label for="dob" class="block text-sm font-medium leading-6 text-gray-900">Born Date</label>
          <p>
            <template v-if="customerDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else>
              {{ formatDate(customerDetails.dob ?? '', 'dd/mm/yyyy') }}
            </template>
          </p>
        </div>

        <div class="flex flex-col">
          <label for="tags" class="block text-sm font-medium leading-6 text-gray-900">Tag</label>
          <div class="flex flex-wrap gap-2">
            <template v-if="customerDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else>
              <span v-if="(customerDetails.tags ?? []).length === 0">
                <p>-</p>
              </span>
              <span v-else>
                <PrimeVueChip
                  v-for="tag in customerDetails.tags"
                  :key="tag.id"
                  class="w-fit text-xs font-semibold bg-primary-background text-primary px-1.5 py-1"
                  >{{ tag.name }}</PrimeVueChip
                >
              </span>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
