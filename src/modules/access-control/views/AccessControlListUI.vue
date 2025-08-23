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
  <div class="mt-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="font-semibold text-lg">Permission</h2>
      <PrimeVueButton
        class="flex text-primary bg-white items-center gap-2 border border-primary-300 px-3 py-1.5 rounded-md text-sm hover:bg-gray-50"
        @click="accessControlPermission_onEdit"
      >
        <AppBaseSvg name="edit" class="!w-4 !h-4" color="primary" />
        Edit Permission
      </PrimeVueButton>
    </div>

    <!-- Tables -->
    <!-- <div class="max-h-[650px] overflow-y-auto"> -->
    <div v-for="(group, gIdx) in permissions" :key="gIdx" class="rounded-lg">
      <!-- Category Header -->
      <div class="py-2 font-semibold">
        {{ group.name }}
      </div>

      <table class="w-full border-collapse border border-gray-300 overflow-hidden">
        <thead>
          <tr class="bg-gray-100">
            <th class="text-left px-4 py-2 border border-gray-300 text-sm w-1/3 min-w-[250px]">Functionality</th>
            <th
              v-for="role in accessControlPermission_listRole"
              :key="role.id"
              class="px-2 py-2 text-center border-y border-gray-300 borderr-solid text-sm font-medium"
            >
              {{ role.name }}
            </th>
          </tr>
        </thead>
        <tbody class="border-b border-solid border-gray-300">
          <tr v-for="(item, idx) in group.permissions" :key="idx" class="hover:bg-gray-50">
            <td class="px-4 py-2 border border-gray-300 text-sm w-1/3 min-w-[250px]">
              {{ item.name }}
            </td>
            <td
              v-for="role in accessControlPermission_listRole"
              :key="role.id"
              class="px-2 py-2 border-y border-gray-300 text-center"
            >
              <PrimeVueCheckbox
                class="text-primary"
                :model-value="item.storeRolePermissions.some((r) => r.roleId === role.id)"
                :binary="true"
                disabled
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- </div> -->
  </div>
</template>
