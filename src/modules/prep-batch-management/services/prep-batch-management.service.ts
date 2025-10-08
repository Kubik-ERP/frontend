// constant
import { BATCH_LIST_COLUMNS, BATCH_LIST_VALUES } from '../constants';

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
    batchList_values: BATCH_LIST_VALUES,
    batchList_columns: BATCH_LIST_COLUMNS,
    batchList_getClassOfBatchStatus,
  };
};
