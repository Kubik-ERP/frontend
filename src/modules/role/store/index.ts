import { AxiosRequestConfig } from 'axios';
import { IRole, IRoleFormData } from '../interfaces/index.interface';
import { IRoleActionResponse, IRoleListQueryParams, IRoleListResponse } from '../interfaces/role-list.interface';
import httpClient from '@/plugins/axios';
import { ROLE_API_BASE_ENDPOINT } from '../constants/index.contant';

export const useRoleStore = defineStore('role', {
  state() {
    return {
      roleList_isLoading: false,
      roleList_items: {
        statusCode: 200,
        message: '',
        data: {
          items: [] as IRole[],
          meta: {
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 1,
          },
        },
      } as IRoleListResponse,
      roleList_editingItem: null as IRoleFormData | null,
      roleList_formMode: 'create' as 'create' | 'update',
    };
  },
  persist: true,
  actions: {
    setFormMode(mode: 'create' | 'update', payload: IRoleFormData | null = null) {
      this.roleList_formMode = mode;
      if (payload) {
        this.roleList_editingItem = payload;
      }
    },

    async roleList_fetchListData(
      params: IRoleListQueryParams,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IRoleListResponse> {
      this.roleList_isLoading = true;
      try {
        const response = await httpClient.get<IRoleListResponse>(ROLE_API_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });

        this.roleList_items = response.data;
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.roleList_isLoading = false;
      }
    },
    async roleList_onDeleteData(id: string): Promise<IRoleActionResponse> {
      this.roleList_isLoading = true;
      try {
        const response = await httpClient.delete<IRoleActionResponse>(`${ROLE_API_BASE_ENDPOINT}/${id}`);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.roleList_isLoading = false;
         await this.roleList_fetchListData({
          page: 1,
          pageSize: 10,
          orderBy: null,
          orderDirection: null,
        }, {});
      }
    },

    async role_onCreateData(payload: IRoleFormData): Promise<IRoleActionResponse> {
      this.roleList_isLoading = true;
      try {
        const response = await httpClient.post<IRoleActionResponse>(ROLE_API_BASE_ENDPOINT, payload);

        this.roleList_items.data.items.push(response.data.data);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.roleList_isLoading = false;
      }
    },

    async role_onUpdateData(payload: IRoleFormData, id: string): Promise<IRoleActionResponse> {
      this.roleList_isLoading = true;
      try {
        const response = await httpClient.patch<IRoleActionResponse>(`${ROLE_API_BASE_ENDPOINT}/${id}`, payload);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.roleList_isLoading = false;
      }
    },
  },
});
