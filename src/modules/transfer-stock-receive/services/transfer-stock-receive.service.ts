// constants
import { TRANSFER_STOCK_RECEIVE_LIST_COLUMNS } from '../constants/';
// type
import { ITransferStockReceiveListProvided } from '../interfaces';
export const useTransferStockReceiveService = (): ITransferStockReceiveListProvided => {
  return {
    transferStockReceiveList_columns: TRANSFER_STOCK_RECEIVE_LIST_COLUMNS,
  };
};
