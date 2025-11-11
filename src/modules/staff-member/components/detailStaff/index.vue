<script setup lang="ts">
import { useStaffMemberDetailService } from '../../services/staff-member-detail.service';

const { staffMemberDetails_isLoading, staffMemberDetails } = useStaffMemberDetailService();

import { useRbac } from '@/app/composables/useRbac';
const rbac = useRbac();
const hasPermission = rbac.hasPermission('manage_staff_member');
</script>
<template>
  <div class="border border-solid border-primary rounded-md p-4 mb-8">
    <section class="flex flex-col gap-2">
      <div class="flex items-center gap-8">
        <h1 class="text-xl font-semibold">
          <template v-if="staffMemberDetails_isLoading">
            <PrimeVueSkeleton width="12rem" height="1.5rem" class="rounded-md"></PrimeVueSkeleton>
          </template>
          <template v-else>
            {{ staffMemberDetails.name }}
          </template>
        </h1>
        <router-link v-if="hasPermission" :to="{ name: 'staff-member.edit', params: { id: staffMemberDetails.id } }">
          <PrimeVueButton
            label="Edit Staff Data"
            variant="text"
            class="flex items-center gap-2 text-primary font-semibold text-sm"
          >
            <template #icon>
              <AppBaseSvg name="edit" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>
        </router-link>
      </div>
    </section>

    <section>
      <h2 class="font-semibold text-primary text-lg mt-4 mb-2">Staff Details</h2>
      <div class="grid grid-cols-3 gap-4 justify-evenly">
        <div class="flex flex-col">
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <p class="truncate">
            <template v-if="staffMemberDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else>
              {{ staffMemberDetails.email || '-' }}
            </template>
          </p>
        </div>

        <div class="flex flex-col">
          <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
          <p>
            <template v-if="staffMemberDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else> {{ '(' + staffMemberDetails.phoneCode + ')' }} {{ staffMemberDetails.phoneNumber }} </template>
          </p>
        </div>

        <div class="flex flex-col">
          <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
          <p>
            <template v-if="staffMemberDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else>
              {{ staffMemberDetails.title || '-' }}
            </template>
          </p>
        </div>

        <div class="flex flex-col">
          <label for="gender" class="block text-sm font-medium leading-6 text-gray-900">Gender</label>
          <p>
            <template v-if="staffMemberDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else>
              {{ staffMemberDetails.gender || '-' }}
            </template>
          </p>
        </div>

        <div class="flex flex-col">
          <label for="dob" class="block text-sm font-medium leading-6 text-gray-900">Employment Start Date</label>
          <p>
            <template v-if="staffMemberDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else>
              {{ staffMemberDetails.startDate ? useFormatDate(staffMemberDetails.startDate, 'dd/mm/yyyy') : '-' }}
            </template>
          </p>
        </div>
        
        <div class="flex flex-col">
          <label for="dob" class="block text-sm font-medium leading-6 text-gray-900">Employment End Date</label>
          <p>
            <template v-if="staffMemberDetails_isLoading">
              <PrimeVueSkeleton width="16rem" height="1rem" class="rounded-md"></PrimeVueSkeleton>
            </template>
            <template v-else>
              {{ staffMemberDetails.endDate ? useFormatDate(staffMemberDetails.endDate, 'dd/mm/yyyy') : '-' }}
            </template>
          </p>
        </div>

      </div>
    </section>
  </div>
</template>
