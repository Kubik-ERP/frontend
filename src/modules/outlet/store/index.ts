// Constants
import {
  OUTLET_BASE_ENDPOINT,
  OUTLET_OPERATIONAL_HOURS_ENDPOINT,
  OUTLET_TABLE_ENDPOINT,
} from '../constants/outlet-api.constant';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type {
  IOutletDetailResponse,
  IOutletListResponse,
  IOutletOperationalHoursResponse,
  IOutletProfileResponse,
  IOutletStateStore,
  IOutletTableResponse,
} from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';
import { IAccountStoreTableConfigurationFormData } from '@/modules/account/interfaces';

export const useOutletStore = defineStore('outlet', {
  state: (): IOutletStateStore => ({
    outlet_currentOutlet: null,
    outlet_detail: null,
    outlet_isLoading: false,
    outlet_lists: [],
    outlet_operationalHours: [],
    outlet_profile: null,
    outlet_tables: null,
    outlet_selectedOutletOnAccountPage: null,
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
    outlet_listAvailableFloor: (state): IDropdownItem[] => {
      if (!state.outlet_tables || state.outlet_tables.length === 0) {
        return [];
      }

      const sortedTables = [...state.outlet_tables].sort((a, b) => a.floorName.localeCompare(b.floorName));
      const uniqueFloors = Array.from(new Set(sortedTables.map(table => table.floorName)));

      return uniqueFloors.map(floor => ({
        label: floor,
        value: floor,
      }));
    },
  },
  actions: {
    /**
     * @description Handle fetch api outlet create new outlet
     * @url /store
     * @method POST
     * @access private
     */
    async fetchOutlet_createNewOutlet(
      pin: string,
      payload: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(OUTLET_BASE_ENDPOINT, payload, {
          headers: {
            pin: pin,
          },
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
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet create new store table
     * @url /store-tables
     * @method POST
     * @access private
     */
    async fetchOutlet_createNewStoreTable(
      payload: IAccountStoreTableConfigurationFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(OUTLET_TABLE_ENDPOINT, payload, {
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
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet delete outlet
     * @url /store/${outletId}
     * @method DELETE
     * @access private
     */
    async fetchOutlet_deleteOutlet(
      pin: string,
      outletId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.outlet_isLoading = true;
      try {
        const response = await httpClient.delete<unknown>(`${OUTLET_BASE_ENDPOINT}/${outletId}`, {
          headers: {
            pin: pin,
          },
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
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet delete store table
     * @url /store-tables/${tableId}
     * @method DELETE
     * @access private
     */
    async fetchOutlet_deleteStoreTable(
      tableId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.delete<unknown>(`${OUTLET_TABLE_ENDPOINT}/${tableId}`, {
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
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet detail
     * @url /store/${outletId}
     * @method GET
     * @access private
     */
    async fetchOutlet_detail(
      outletId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IOutletDetailResponse> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.get<IOutletDetailResponse>(`${OUTLET_BASE_ENDPOINT}/store/${outletId}`, {
          ...requestConfigurations,
        });

        this.outlet_detail = response.data.data;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet get list outlet
     * @url /store
     * @method GET
     * @access private
     */
    async fetchOutlet_lists(requestConfigurations: AxiosRequestConfig): Promise<IOutletListResponse> {
      this.outlet_isLoading = true;
      try {
        const response = await httpClient.get<IOutletListResponse>(OUTLET_BASE_ENDPOINT, {
          ...requestConfigurations,
        });

        console.log('Full Response:', response.data);
        console.log('Data Items:', response.data.data.items);

        this.outlet_lists = response.data.data.items;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet list operational hours
     * @url /store/operational-hours
     * @method GET
     * @access private
     */
    async fetchOutlet_listOperationalHours(
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IOutletOperationalHoursResponse> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.get<IOutletOperationalHoursResponse>(OUTLET_OPERATIONAL_HOURS_ENDPOINT, {
          ...requestConfigurations,
        });

        this.outlet_operationalHours = response.data.data;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet profile
     * @url /store/profile
     * @method GET
     * @access private
     */
    async fetchOutlet_profile(requestConfigurations: AxiosRequestConfig): Promise<IOutletProfileResponse> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.get<IOutletProfileResponse>(OUTLET_BASE_ENDPOINT + '/profile', {
          ...requestConfigurations,
        });

        this.outlet_profile = response.data.data;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet store table
     * @url /store-tables
     * @method GET
     * @access private
     */
    async fetchOutlet_storeTable(requestConfigurations: AxiosRequestConfig): Promise<IOutletTableResponse> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.get<IOutletTableResponse>(OUTLET_TABLE_ENDPOINT, {
          ...requestConfigurations,
        });

        this.outlet_tables = response.data.data;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet update outlet
     * @url /store/${outletId}
     * @method PUT
     * @access private
     */
    async fetchOutlet_updateOutlet(
      pin: string,
      outletId: string,
      payload: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.put<unknown>(`${OUTLET_BASE_ENDPOINT}/manage/${outletId}`, payload, {
          headers: {
            pin: pin,
          },
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
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet update profile
     * @url /store/profile
     * @method PUT
     * @access private
     */
    async fetchOutlet_updateProfile(
      payload: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IOutletProfileResponse> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.put<IOutletProfileResponse>(`${OUTLET_BASE_ENDPOINT}/profile`, payload, {
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
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet update store table
     * @url /store-tables/${tableId}
     * @method PUT
     * @access private
     */
    async fetchOutlet_updateStoreTable(
      tableId: string,
      payload: IAccountStoreTableConfigurationFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.put<unknown>(`${OUTLET_TABLE_ENDPOINT}/${tableId}`, payload, {
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
        this.outlet_isLoading = false;
      }
    },
  },
  persist: {
    key: 'outlet',
    pick: ['outlet_currentOutlet', 'outlet_profile', 'outlet_selectedOutletOnAccountPage'],
    storage: localStorage,
  },
});
