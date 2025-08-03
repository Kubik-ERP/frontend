// Constants
import { ACCOUNT_BANK_ATTACH_ENDPOINT, ACCOUNT_USER_BANKS_ENDPOINT } from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';

// Plugins
import httpClient from '@/plugins/axios';
import { IAccountBankAccountFormData } from '../interfaces';

export const useAccountStore = defineStore('account', {
  state: () => ({
    account_bank: null,
    account_isLoading: false,
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
  },
});
