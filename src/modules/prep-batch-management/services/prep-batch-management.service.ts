// constant
import {
  BATCH_LIST_COLUMNS,
  BATCH_LIST_VALUES,
  BATCH_DETAILS_INGRIDIENTS_COLUMNS,
  BATCH_DETAILS_VALUES,
} from '../constants';

// type
import type { IBatchListProvided } from '../interfaces';

export const useBatchService = (): IBatchListProvided => {
  const batchList_getClassOfBatchStatus = (batchStatus: string): string => {
    if (!batchStatus) {
      return '';
    }

    switch (batchStatus.toUpperCase()) {
      case 'CANCELLED': {
        return 'bg-error-background text-error-main';
      }
      case 'PLANNED': {
        return 'bg-warning-background text-warning-main';
      }
      case 'IN_PROGRESS': {
        return 'bg-secondary-background text-secondary';
      }
      case 'POSTED': {
        return 'bg-success-background text-success';
      }
      default: {
        return '';
      }
    }
  };
  return {
    // columns
    batchList_columns: BATCH_LIST_COLUMNS,
    batchDetailsIngridient_columns: BATCH_DETAILS_INGRIDIENTS_COLUMNS,
    // values
    batchList_values: BATCH_LIST_VALUES,
    batchDetails_values: BATCH_DETAILS_VALUES,
    // method
    batchList_getClassOfBatchStatus,
  };
};
