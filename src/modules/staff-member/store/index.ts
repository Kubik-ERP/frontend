// Constants
import { STAFF_MEMBER_BASE_ENDPOINT } from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { IStaffMemberListResponse, IStaffMemberStore } from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useStaffMembetStore = defineStore('staff-member', {
  state: (): IStaffMemberStore => ({
    staffMember_isLoading: false,
    staffMember_lists: [],
  }),
  getters: {
    /**
     * @description Handle business logic for mapping staff member lists to options
     */
    staffMember_listDropdownItemStaff: (state): IDropdownItem[] => {
      return state.staffMember_lists.map(staffMember => ({
        label: staffMember.name,
        value: staffMember.id,
      }));
    },
  },
  actions: {
    /**
     * @description Handle fetch api staff member - create
     * @url /employees
     * @method POST
     * @access private
     */
    async staffMember_createNewStaffMember(
      payload: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.staffMember_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(STAFF_MEMBER_BASE_ENDPOINT, payload, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.staffMember_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api staff member - delete
     * @url /employees/${staffMemberId}
     * @method DELETE
     * @access private
     */
    async staffMember_deleteStaffMember(
      staffMemberId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.staffMember_isLoading = true;

      try {
        const response = await httpClient.delete<unknown>(`${STAFF_MEMBER_BASE_ENDPOINT}/${staffMemberId}`, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.staffMember_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api staff member - detail
     * @url /employees/${staffMemberId}
     * @method GET
     * @access private
     */
    async staffMember_fetchDetailStaffMember(
      staffMemberId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IStaffMemberListResponse> {
      this.staffMember_isLoading = true;

      try {
        const response = await httpClient.get<IStaffMemberListResponse>(
          `${STAFF_MEMBER_BASE_ENDPOINT}/${staffMemberId}`,
          {
            ...requestConfigurations,
          },
        );

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.staffMember_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api staff member - list
     * @url /employees
     * @method GET
     * @access private
     */
    async staffMember_list(requestConfigurations: AxiosRequestConfig): Promise<IStaffMemberListResponse> {
      this.staffMember_isLoading = true;

      try {
        const response = await httpClient.get<IStaffMemberListResponse>(STAFF_MEMBER_BASE_ENDPOINT, {
          ...requestConfigurations,
        });

        if (response.data.data.length > 0) {
          this.staffMember_lists = response.data.data;
        }

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.staffMember_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api staff member - update
     * @url /employees/${staffMemberId}
     * @method PUT
     * @access private
     */
    async staffMember_updateStaffMember(
      staffMemberId: string,
      payload: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.staffMember_isLoading = true;

      try {
        const response = await httpClient.put<unknown>(`${STAFF_MEMBER_BASE_ENDPOINT}/${staffMemberId}`, payload, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.staffMember_isLoading = false;
      }
    },
  },
});
