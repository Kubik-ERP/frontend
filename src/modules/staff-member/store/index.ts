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
     * @description Handle fetch api staff member - list
     * @url /staff-member/list
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
  },
});
