<script setup lang="ts">
import { useCustomerDetailService } from '../../services/customer-detail.service';

const { customerDetails_isLoading, customerDetails } = useCustomerDetailService();
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
      <p>
        <template v-if="customerDetails_isLoading">
          <PrimeVueSkeleton width="20rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
        </template>
        <template v-else>
          {{ customerDetails.email }}
        </template>
      </p>
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
              {{ customerDetails.email }}
            </template>
          </p>
        </div>

        <div class="flex flex-col">
          <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
          <p>
            <template v-if="customerDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else> {{ '(+' + customerDetails.code + ')' }} {{ customerDetails.number }} </template>
          </p>
        </div>

        <div class="flex flex-col">
          <label for="address" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
          <p>
            <template v-if="customerDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else>
              {{ customerDetails.address ?? '-' }}
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
              {{ customerDetails.gender ?? '-' }}
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
              {{ useFormatDate(customerDetails.dob, 'dd/mm/yyyy') }}
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
              <PrimeVueChip
                v-for="tag in customerDetails.tags"
                :key="tag"
                class="w-fit text-xs font-semibold bg-primary-background text-primary px-1.5 py-1"
                >{{ tag }}</PrimeVueChip
              >
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
