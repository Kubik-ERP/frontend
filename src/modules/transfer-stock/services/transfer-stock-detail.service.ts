// Constants
// import {
//   TRANSFER_STOCK_DETAILS_REQUEST,
// } from '../constants';

// Interfaces
import type { ITransferStockDetail } from '../interfaces';

// Stores
import { useTransferStockStore } from '../store';

/**
 * @description Transfer Stock Detail Service interface
 */
export interface ITransferStockDetailProvided {
  transferStockDetail_detail: globalThis.Ref<ITransferStockDetail | null>;
  transferStockDetail_fetchDetails: (id: string) => Promise<unknown>;
  transferStockDetail_isLoading: globalThis.Ref<boolean>;
  transferStockDetail_onLoadInitialData: (id: string) => Promise<void>;
}

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useTransferStockDetailService = (): ITransferStockDetailProvided => {
  /**
   * @description Injected variables
   */
  const store = useTransferStockStore(); // Instance of the store
  const { transferStock_data, transferStock_isLoading } = storeToRefs(store);
  // const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Handle fetch api transfer stock - details
   */
  const transferStockDetail_fetchDetails = async (id: string): Promise<unknown> => {
    try {
      await store.transferStock_detail(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for loading initial data
   */
  const transferStockDetail_onLoadInitialData = async (id: string): Promise<void> => {
    try {
      await transferStockDetail_fetchDetails(id);
    } catch (error) {
      console.error('Error loading transfer stock details:', error);
    }
  };

  return {
    transferStockDetail_detail: transferStock_data,
    transferStockDetail_fetchDetails,
    transferStockDetail_isLoading: transferStock_isLoading,
    transferStockDetail_onLoadInitialData,
  };
};
