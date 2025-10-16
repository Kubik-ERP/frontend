// constant
import {
  BATCH_LIST_COLUMNS,
  BATCH_LIST_VALUES,
  BATCH_DETAILS_INGRIDIENTS_COLUMNS,
  BATCH_DETAILS_VALUES,
} from '../constants';

// type
import type { IBatchListProvided } from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';
export const useBatchService = (): IBatchListProvided => {
  const menuRecipeList_onShowDialogDelete = (id: string) => {
    console.log(id);
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'batch-list-dialog-delete',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            This action will stop the current recording and discard any unsaved or draft data.
          </p>
        </div>`,
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialog', { id: 'batch-list-dialog-delete', isOpen: false });
      },
      onClickButtonSecondary: () => {
        // Logic to delete the table goes here
        eventBus.emit('AppBaseDialog', { id: 'batch-list-dialog-delete', isOpen: false });
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete',
      title: 'Delete Batch',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };
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
    menuRecipeList_onShowDialogDelete,
  };
};
