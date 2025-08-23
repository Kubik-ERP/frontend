<script setup lang="ts">
import { useAccessControlPermissionsListService } from "../services/access-control-permissions-list.service";
import { IAccessControlPermission } from "../interfaces/index.interface";
import { IRole } from "@/modules/role/interfaces/index.interface";
import { useAccessControlPermissionsActionService } from "../services/access-control-permision-action.service";

// list service (fetch permissions + roles)
const {
  accessControlPermission_listValue: permissions,
  accessControlPermission_listRole,
} = useAccessControlPermissionsListService();

// action service (submit / cancel / setData)
const {
  accessControlPermission_isLoading: actionIsLoading,
  accessControlPermission_onSubmit,
  accessControlPermission_onCancel,
  accessControlPermission_setData,
} = useAccessControlPermissionsActionService();

// helper toggle role in listAssigned
function toggleRole(item: IAccessControlPermission, role: IRole) {
  const exists = item.storeRolePermissions.find((r) => r.roleId === role.id);
  if (exists) {
    item.storeRolePermissions = item.storeRolePermissions.filter(
      (r) => r.roleId !== role.id
    );
  } else {
    item.storeRolePermissions.push({ roleId: role.id });
  }
}

// submit
async function onSave() {
  // mapping ke payload sesuai interface
  const payload = {
    permissions: permissions.value.flatMap((group) =>
      group.permissions.map((p) => ({
        id: p.id,
        roles: p.storeRolePermissions.map((r) => r.roleId),
      }))
    ),
  };

  // simpan payload ke service (biar reactive formData ikut terupdate)
  accessControlPermission_setData(payload.permissions);

  // jalankan submit service
  await accessControlPermission_onSubmit(payload);
}
</script>

<template>
  <div class="mx-30 my-10">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="font-semibold text-lg">Permission</h2>
    </div>

    <!-- Tables -->
    <div
      v-for="(group, gIdx) in permissions"
      :key="gIdx"
      class="rounded-lg mt-4"
    >
      <!-- Category Header -->
      <div class="py-2 font-semibold">
        {{ group.name }}
      </div>

      <table
        class="w-full border-collapse border border-gray-300 overflow-scroll"
      >
        <thead>
          <tr class="bg-gray-100">
            <th
              class="text-left px-4 py-2 border border-gray-300 text-sm w-1/3 min-w-[250px]"
            >
              Functionality
            </th>
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
          <tr
            v-for="(item, idx) in group.permissions"
            :key="idx"
            class="hover:bg-gray-50"
          >
            <td
              class="px-4 py-2 border border-gray-300 text-sm w-1/3 min-w-[250px]"
            >
              {{ item.name }}
            </td>
            <td
              v-for="role in accessControlPermission_listRole"
              :key="role.id"
              class="px-2 py-2 border-y border-gray-300 text-center"
            >
              <PrimeVueCheckbox
                class="text-primary"
                :binary="true"
                :model-value="
                  item.storeRolePermissions.some((r) => r.roleId === role.id)
                "
                @update:model-value="toggleRole(item, role)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-row justify-start gap-3 mt-10 w-lg">
      <!-- Cancel -->
      <PrimeVueButton
        type="button"
        class="w-full bg-white border-primary text-primary disabled:bg-gray-400 disabled:text-white disabled:border-none"
        :loading="actionIsLoading"
        @click="accessControlPermission_onCancel"
      >
        Cancel
      </PrimeVueButton>

      <!-- Update / Save -->
      <PrimeVueButton
        type="button"
        class="w-full disabled:bg-gray-400 disabled:text-white disabled:border-none"
        :loading="actionIsLoading"
        @click="onSave"
      >
        Update Permission
      </PrimeVueButton>
    </div>
  </div>
</template>
