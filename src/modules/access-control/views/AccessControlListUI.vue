<script setup lang="ts">
import { useAccessControlPermissionsListService } from '../services/access-control-permissions-list.service';

const {
  accessControlPermission_listValue: permissions,
  accessControlPermission_listRole,
  accessControlPermission_onEdit,
} = useAccessControlPermissionsListService();

provide('accessControlPermission', {
  accessControlPermission_listValue: permissions,
  accessControlPermission_listRole,
  accessControlPermission_onEdit,
});
</script>

<template>
  <div class="container mx-auto px-4 mt-6">
    <!-- Header -->
    <div class="flex flex-wrap justify-between items-center gap-3">
      <h2 class="font-semibold text-lg">Permission</h2>
      <PrimeVueButton
        class="flex items-center gap-2 text-primary bg-white border border-primary-300 px-3 py-1.5 rounded-md text-sm hover:bg-gray-50"
        @click="accessControlPermission_onEdit"
      >
        <AppBaseSvg name="edit" class="!w-4 !h-4" color="primary" />
        Edit Permission
      </PrimeVueButton>
    </div>

    <!-- Tables -->
    <div v-for="(group, gIdx) in permissions" :key="gIdx" class="rounded-lg mt-6">
      <!-- Category Header -->
      <div class="py-2 font-semibold text-base md:text-lg">
        {{ group.name }}
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="text-left px-4 py-2 border border-gray-300 text-sm w-1/3 min-w-[200px]">Functionality</th>
              <th
                v-for="role in accessControlPermission_listRole"
                :key="role.id"
                class="px-2 py-2 text-center border-y border-gray-300 text-xs sm:text-sm font-medium min-w-[100px]"
              >
                {{ role.name }}
              </th>
            </tr>
          </thead>
          <tbody class="border-b border-solid border-gray-300">
            <tr v-for="(item, idx) in group.permissions" :key="idx" class="hover:bg-gray-50">
              <td class="px-4 py-2 border border-gray-300 text-sm min-w-[200px]">
                {{ item.name }}
              </td>
              <td
                v-for="role in accessControlPermission_listRole"
                :key="role.id"
                class="px-2 py-2 border-y border-gray-300 text-center"
              >
                <PrimeVueCheckbox
                  class="text-primary"
                  :model-value="item.storeRolePermissions.some(r => r.roleId === role.id)"
                  :binary="true"
                  disabled
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
