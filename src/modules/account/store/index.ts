// Constants
import {
  ACCOUNT_BANK_ATTACH_ENDPOINT,
  ACCOUNT_USER_BANKS_ENDPOINT,
  ACCOUNT_STORE_DETAIL_FACILITY_ENDPOINT,
} from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';

// Plugins
import httpClient from '@/plugins/axios';
import {
  IAccountBankAccountFormData,
  IStoreFacility_queryParams,
  IStoreFacilityFormData,
  IStoreFacilities,
  IStoreAssignedStaffActionResponse,
  IStoreAssignedStaffFormData,
} from '../interfaces';
import { IStaffMemberListResponse } from '@/modules/staff-member/interfaces';
import { STAFF_MEMBER_BASE_ENDPOINT } from '@/modules/staff-member/constants';

export const useAccountStore = defineStore('account', {
  state: () => ({
    account_bank: null,
    account_isLoading: false,
    account_storeFacilities: {
      data: [],
      meta: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1,
      },
    } as IStoreFacilities,
    account_storeFacilities_isLoading: false,
    account_storeStaffAssigned: {
     data:{
       employees: [],
      meta: {
        limit: 10,
        page: 1,
        total: 0,
        totalPages: 0,
      },
     }
    } as IStaffMemberListResponse
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api account attach bank account.
     * @url /bank/attach
     * @method POST
     * @access private
     */
    async fetchAccount_attachBankAccount(
      payload: IAccountBankAccountFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.account_isLoading = true;

      try {
        const response = await httpClient.post(ACCOUNT_BANK_ATTACH_ENDPOINT, payload, requestConfigurations);

        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.account_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api account user banks.
     * @url /bank/user-banks
     * @method GET
     * @access private
     */
    async fetchAccount_userBanks(requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.account_isLoading = true;

      try {
        const response = await httpClient.get(ACCOUNT_USER_BANKS_ENDPOINT, requestConfigurations);

        console.log('[AccountService] fetchAccount_userBanks response:', response.data);
        this.account_bank = response.data;

        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.account_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api account update attached bank.
     * @url /bank/user-banks
     * @method PUT
     * @access private
     */
    async fetchAccount_updateAttachedBank(
      id: string,
      payload: IAccountBankAccountFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.account_isLoading = true;

      try {
        const response = await httpClient.put(
          `${ACCOUNT_USER_BANKS_ENDPOINT}/${id}`,
          payload,
          requestConfigurations,
        );

        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.account_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api account get store facilities.
     * @url /facilities
     * @method GET
     * @access private
     */

    async fetchAccount_storeFacilities(
      params: IStoreFacility_queryParams,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.account_storeFacilities_isLoading = true;

      try {
        const response = await httpClient.get(ACCOUNT_STORE_DETAIL_FACILITY_ENDPOINT, {
          params,
          ...requestConfigurations,
        });
        this.account_storeFacilities = response.data.data;
        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.account_storeFacilities_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api account update store facilities.
     * @url /facilities
     * @method PATCH
     * @access private
     */

    async fetchAccount_updateStoreFacilities(
      id: string,
      payload: IStoreFacilityFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.account_storeFacilities_isLoading = true;

      try {
        const response = await httpClient.patch(
          `${ACCOUNT_STORE_DETAIL_FACILITY_ENDPOINT}/${id}`,
          payload,
          requestConfigurations,
        );
        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.account_storeFacilities_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api account Delete store facilities.
     * @url /facilities
     * @method DELETE
     * @access private
     */

    async fetchAccount_deleteStoreFacilities(
      id: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.account_storeFacilities_isLoading = true;

      try {
        const response = await httpClient.delete(
          `${ACCOUNT_STORE_DETAIL_FACILITY_ENDPOINT}/${id}`,
          requestConfigurations,
        );
        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.account_storeFacilities_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api account Create store facilities.
     * @url /facilities
     * @method POST
     * @access private
     */

    async fetchAccount_createStoreFacilities(
      payload: IStoreFacilityFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.account_storeFacilities_isLoading = true;

      try {
        const response = await httpClient.post(ACCOUNT_STORE_DETAIL_FACILITY_ENDPOINT, payload, {
          ...requestConfigurations,
        });
        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.account_storeFacilities_isLoading = false;
      }
    },

    async fetchAccount_assignedStaff(
      params: IStoreFacility_queryParams,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IStaffMemberListResponse> {
      try {
        const response = await httpClient.get(STAFF_MEMBER_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });
        this.account_storeStaffAssigned = response.data;
        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    async createAccount_assignedStaff(
      payload: IStoreAssignedStaffFormData,
      requestConfigurations: AxiosRequestConfig): Promise<IStoreAssignedStaffActionResponse> {
      try {
        const response = await httpClient.post<IStoreAssignedStaffActionResponse>(STAFF_MEMBER_BASE_ENDPOINT, payload, requestConfigurations);
        return response.data;
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
