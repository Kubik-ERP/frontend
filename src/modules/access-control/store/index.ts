import httpClient from '@/plugins/axios';
// import { dummyResponse } from "../constants/dummy.constant";
import { IAccessControlPermissionActionResponse, IAccessControlPermissionListResponse } from '../interfaces/index.interface';
import { ACCESS_CONTROL_PERMISSION_BASE_ENDPOINT } from '../constants/index.constant';
import { IAccessControlPermissionPayload } from '../interfaces/access-control-action.interface';

export const useAccessControlStore = defineStore('access-control', {
  state: () => ({
    accessControlPermission_isLoading: false,
    accessControlPermission_listvalue: {
      statusCode: 0,
      message: '',
      data: [],
    } as IAccessControlPermissionListResponse,
  }),
  actions: {
    async getAccessControlPermission_List(): Promise<IAccessControlPermissionListResponse> {
      try {
        const response = await httpClient.get<IAccessControlPermissionListResponse>(
          ACCESS_CONTROL_PERMISSION_BASE_ENDPOINT,
        );
        this.accessControlPermission_listvalue = response.data;
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    async assignAccessControlPermission_roles(payload: IAccessControlPermissionPayload): Promise<IAccessControlPermissionActionResponse> {
      try {
        const response = await httpClient.patch<IAccessControlPermissionActionResponse>(
          `${ACCESS_CONTROL_PERMISSION_BASE_ENDPOINT}/assign-to-roles`,
          payload,
        );
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    }
  },
});
