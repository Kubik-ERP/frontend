<script setup lang="ts">
// import { useRoleListService } from '@/modules/role/services/role-list.service';
import { useUserPermissionService } from '../services/user-permission.service';
import {  useAccessControlPermissionsListService} from '@/modules/access-control/services/access-control-permissions-list.service';
import { useRoleListService } from '@/modules/role/services/role-list.service';
// Services
// const {
//   // roleList_fetchData,
// } = useRoleListService();
const { userPermission_activeTab, userPermission_listTabs } = useUserPermissionService();
const { accessControlPermission_fetchList } = useAccessControlPermissionsListService();
const { roleList_fetchData } = useRoleListService();
/**
 * @description Watch active tab changes
 */
watch(
  userPermission_activeTab,
  async newTab => {
    switch (newTab.toUpperCase()) {
      case 'ACCESS-CONTROL': {
        await accessControlPermission_fetchList();
        break;
      }
      case 'ROLE-MANAGEMENT': {
       await roleList_fetchData();
        break;
      }
      default: {
        console.warn(`Unknown tab: ${newTab}`);
      }
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <section id="user-permission" class="flex flex-col relative inset-0 z-0">
    <AppBaseTabs v-model:value="userPermission_activeTab" :items="userPermission_listTabs" />
  </section>
</template>
