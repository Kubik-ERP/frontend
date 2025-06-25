<script setup lang="ts">

import type { ICustomerDetails } from '../../interfaces';

const customer = ref(inject('customerDetails').customer as ICustomerDetails);
</script>
<template>
  <div class="border border-solid border-primary rounded-md p-4 mb-8">
    <section class="flex flex-col gap-2">
      <div class="flex items-center gap-8">
        <h1 class="text-xl font-semibold">{{ customer.name }}</h1>
        <router-link :to="`/customer/edit-customer/${customer.id}`">
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
      <p>{{ customer.id }}</p>
    </section>

    <section>
      <h2 class="font-semibold text-primary text-lg mt-4 mb-2">Customer Details</h2>
      <div class="grid grid-cols-3 gap-4 justify-evenly">
        <div class="flex flex-col">
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <p class="truncate">{{ customer.email }}</p>
        </div>

        <div class="flex flex-col">
          <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
          <p>(+{{ customer.code }}) {{ customer.number }}</p>
        </div>

        <div class="flex flex-col">
          <label for="address" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
          <p>{{ customer.address }}</p>
        </div>

        <div class="flex flex-col">
          <label for="gender" class="block text-sm font-medium leading-6 text-gray-900">Gender</label>
          <p>{{ customer.gender }}</p>
        </div>

        <div class="flex flex-col">
          <label for="dob" class="block text-sm font-medium leading-6 text-gray-900">Born Date</label>
          <p>{{ useFormatDate(customer.dob,'dd/mm/yyyy') }}</p>
        </div>

        <div class="flex flex-col">
          <label for="tags" class="block text-sm font-medium leading-6 text-gray-900">Tag</label>
          <div class="flex flex-wrap gap-2">
          <PrimeVueChip v-for="tag in customer.tags" :key="tag" class="w-fit text-xs font-semibold bg-primary-background text-primary px-1.5 py-1">{{
            tag
          }}</PrimeVueChip>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
