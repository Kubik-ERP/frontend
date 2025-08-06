// Constants
import { STAFF_MEMBER_BASE_ENDPOINT } from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type {
  IStaffMemberListResponse,
  IStaffMemberDetailsResponse,
  IStaffMemberStore,
  IStaffMemberListRequestQuery,
} from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useStaffMemberStore = defineStore('staff-member', {
  state: (): IStaffMemberStore => ({
    staffMember_isLoading: false,
    staffMember_lists: {
      employees: [
        {
          id: 'example-staff-member-id',
          name: 'example staff member',
          email: 'example@kubik.com',
          phoneNumber: '+1234567890',
          profileUrl: null,
          startDate: null,
          endDate: null,
          gender: null,
          title: null,
          employeesShift: [],
        },
      ],
      meta: {
        limit: 10,
        page: 1,
        total: 0,
        totalPages: 0,
      },
    },
  }),
  getters: {
    /**
     * @description Handle business logic for mapping staff member lists to options
     */
    staffMember_listDropdownItemStaff: (state): IDropdownItem[] => {
      return state.staffMember_lists.employees.map(staffMember => ({
        label: staffMember.name,
        value: staffMember.id,
      }));
    },
    /**
     * @description Handle business logic for mapping staff member title lists to options
     */
    staffMember_listDropdownItemTitles: (state): IDropdownItem[] => {
      // Step 1: Extract and format all titles first.
      const allFormattedTitles = state.staffMember_lists.employees
        .map(staffMember => {
          const title = staffMember.title;
          if (typeof title === 'string' && title.trim() !== '') {
            const trimmed = title.trim();

            // ✅ Capitalize each word in the string
            return trimmed
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          }
          return null; // Return null for invalid titles
        })
        .filter(title => title !== null) as string[]; // Remove the nulls

      // Step 2: Get unique titles using a Set.
      const uniqueTitles = [...new Set(allFormattedTitles)];

      // Step 3: Map the unique titles to the dropdown format.
      return uniqueTitles.map(title => ({
        label: title,
        value: title,
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
    ): Promise<IStaffMemberDetailsResponse> {
      this.staffMember_isLoading = true;

      try {
        const response = await httpClient.get<IStaffMemberDetailsResponse>(
          `${STAFF_MEMBER_BASE_ENDPOINT}/${staffMemberId}`,
          {
            ...requestConfigurations,
          },
        );
        // console.log('Fetched staff member details:', response.data); // Debugging log
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
    async staffMember_list(
      params: IStaffMemberListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IStaffMemberListResponse> {
      this.staffMember_isLoading = true;

      try {
        const response = await httpClient.get<IStaffMemberListResponse>(STAFF_MEMBER_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });
        this.staffMember_lists = {
          employees: response.data.data.data || [],
          meta: response.data.data.meta,
        };

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
     * @method put
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
