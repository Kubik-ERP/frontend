import { IUserPermissionProvided } from '../interfaces/user-permission.interface';
import { LIST_TABS_USER_PERMISSION } from '../constants/user-permissioin.constant';
import { useAccessControlPermissionsListService } from '@/modules/access-control/services/access-control-permissions-list.service';
import { useRoleListService } from '@/modules/role/services/role-list.service';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useUserPermissionService = (): IUserPermissionProvided => {
  /**
   * @description Reactive data binding
   */
  const userPermission_activeTab = ref<string>('ACCESS-CONTROL');
  const {
    accessControlPermission_fetchList
  } = useAccessControlPermissionsListService();
  const {
    roleList_fetchData
  } = useRoleListService();
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

  onMounted(() => {
    userPermission_activeTab.value = 'ACCESS-CONTROL';
  });

  return {
    userPermission_activeTab,
    userPermission_listTabs: LIST_TABS_USER_PERMISSION,
  };
};
