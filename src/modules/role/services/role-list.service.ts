import { DataTableSortEvent } from 'primevue';
import { ROlE_LIST_COLUMNS } from '../constants/index.contant';
import { IRoleListProvided, IRoleListQueryParams } from '../interfaces/role-list.interface';
import { useRoleStore } from '../store';
import eventBus from '@/plugins/mitt';
import { IRole } from '../interfaces/index.interface';

export const useRoleListService = (): IRoleListProvided => {
  const store = useRoleStore();
  const { roleList_isLoading, roleList_items } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();
  const roleList_values = ref<IRole[]>([]);

  const roleList_queryParams = ref<IRoleListQueryParams>({
    page: 1,
    pageSize: 10,
    orderBy: null,
    orderDirection: null,
  });

  const roleList_fetchData = async () => {
    try {
      await store.roleList_fetchListData(roleList_queryParams.value, {
        ...httpAbort_registerAbort('ROLE_LIST_FETCH_DATA'),
        paramsSerializer: useParamsSerializer,
      });
    } catch (error) {
      console.error('Error fetching role list:', error);
      throw error;
    }
  };

  const roleList_onChangePage = (page: number) => {
    roleList_queryParams.value.page = page;
  };

  const roleList_handleOnSortChange = (event: DataTableSortEvent) => {
    roleList_queryParams.value.orderBy = event.sortField as string;
    roleList_queryParams.value.orderDirection = event.sortOrder;
  };

  watch(
    () => roleList_queryParams.value,
    async () => {
      await roleList_fetchData();
    },
    {
      immediate: true,
      deep: true,
    },
  );

  /**
   * @description Handle create
   */
  const handleRole_onCreate = () => {
    store.setFormMode('create', null);
    eventBus.emit('AppBaseDialog', {
      id: 'role-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    });
  };
  /**
   * @description Handle edit
   */
  const handleRole_onEdit = (id: string) => {
    const roleFind = roleList_items.value.data.items.find(r => r.id === id);
    store.setFormMode('update', roleFind);
    eventBus.emit('AppBaseDialog', {
      id: 'role-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    });
  };

  /**
   * @description Handle delete
   * @param roleId
   * @returns
   */
  const handle_delete = async (roleId: string) => {
    try {
      const res = await store.roleList_onDeleteData(roleId);

      if (res) {
        await roleList_fetchData();
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: res.statusCode === 200 ? EToastType.SUCCESS : EToastType.DANGER,
          message: res.message || 'Role Action successfully!',
          position: EToastPosition.TOP_RIGHT,
        };
        eventBus.emit('AppBaseToast', argsEventEmitter);
      }

    } catch (error: unknown) {
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const roleList_onDelete = async (roleId: string): Promise<void> => {
    const role = roleList_items.value.data.items.find(r => r.id === roleId);

    if (!role) {
      console.error(`Brand with ID ${roleId} not found`);
      return;
    }

    // Kalau bisa dihapus, tampilkan konfirmasi
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'role-dialog-confirmation',
      description: 'This action cannot be undone, and the brand you remove will be deleted permanently.',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,

      onClickButtonPrimary: () => {
        // Tutup dialog
        eventBus.emit('AppBaseDialogConfirmation', {
          id: 'role-dialog-confirmation',
          isOpen: false,
        } as IPropsDialogConfirmation);
      },
      onClickButtonSecondary: async () => {
        // Tutup dialog
        eventBus.emit('AppBaseDialogConfirmation', {
          id: 'role-dialog-confirmation',
          isOpen: false,
        } as IPropsDialogConfirmation);

        await handle_delete(roleId);
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete Role',
      title: 'Are you sure you want to delete this role?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  return {
    roleList_columns: ROlE_LIST_COLUMNS,
    roleList_fetchData,
    roleList_isLoading,
    roleList_values: roleList_values,
    roleList_onChangePage,
    roleList_handleOnSortChange,
    roleList_onCreate: handleRole_onCreate,
    roleList_onEdit: handleRole_onEdit,
    roleList_onDelete: roleList_onDelete,
    roleList_queryParams: roleList_queryParams,
    roleList_response: roleList_items,
  };
};
