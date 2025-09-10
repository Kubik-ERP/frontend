import { IRole } from '@/modules/role/interfaces/index.interface';
import { IAccessControlPermissionProvided } from '../interfaces/access-control-list.interface';
import { useAccessControlStore } from '../store/index';
import { useRoleStore } from '@/modules/role/store';
import { IRoleListQueryParams } from '@/modules/role/interfaces/role-list.interface';

export const useAccessControlPermissionsListService = (): IAccessControlPermissionProvided => {
  const store = useAccessControlStore();
  const roleStore = useRoleStore();
  const { accessControlPermission_isLoading, accessControlPermission_listvalue } = storeToRefs(store);
  const { roleList_items } = storeToRefs(roleStore);
  const router = useRouter();
  const accessControlPermission_listRole = ref<IRole[]>([]);

  const fetchAccessControlPermissionList = async () => {
    accessControlPermission_isLoading.value = true;
    try {
      const res = await store.getAccessControlPermission_List();
      accessControlPermission_listvalue.value = res;
    } catch (error) {
      console.log(error);
    } finally {
      accessControlPermission_isLoading.value = false;
    }
  };

  const fetchAccessControlPermissionRoleList = async () => {
    accessControlPermission_isLoading.value = true;
    const params: IRoleListQueryParams = {
      page: 1,
      pageSize: 100,
      orderBy: null,
      orderDirection: null,
    };
    try {
      const response = await roleStore.roleList_fetchListData(
        params,
        useHttpAbort().httpAbort_registerAbort('ROLE_LIST_FETCH_DATA'),
      );
      accessControlPermission_listRole.value = response.data.items;
    } catch (error) {
      console.log(error);
    } finally {
      accessControlPermission_isLoading.value = false;
    }
  };

  const accessControlPermission_onEdit = () => {
    router.push({ name: 'user-permission.edit' });
  };

  onMounted(() => {
    fetchAccessControlPermissionList();
    fetchAccessControlPermissionRoleList();
  });

  return {
    accessControlPermission_isLoading,
    accessControlPermission_listValue: accessControlPermission_listvalue,
    accessControlPermission_listRole: roleList_items,
    accessControlPermission_onEdit,
    accessControlPermission_fetchList: fetchAccessControlPermissionList,
  };
};
