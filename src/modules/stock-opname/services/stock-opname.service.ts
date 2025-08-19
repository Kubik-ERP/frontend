// store
import { useStockOpnameStore } from '../store';

// constant
import { STOCK_OPNAME_RECORD_COLUMNS, STOCK_OPNAME_CREATE_EDIT_COLUMNS } from '../constants';

// type
import type {
  IStockOpnameProvided,
  IStockOpnameListRequestQuery,
  IStockOpnameFormData,
  IStockOpname_detailItems,
} from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { DataTableSortEvent } from 'primevue';

export const useStockOpnameService = (): IStockOpnameProvided => {
  const router = useRouter();
  const store = useStockOpnameStore();

  const { stockOpname_isLoading, stockOpname_detail, stockOpname_lists } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const stockOpname_queryParams = reactive<IStockOpnameListRequestQuery>({
    page: 1,
    pageSize: 10,
    orderBy: null,
    orderDirection: null,
  });

  const stockOpname_onChangePage = (page: number): void => {
    stockOpname_queryParams.page = page;
  };
  const stockOpname_onChangeSort = (event: DataTableSortEvent) => {
    stockOpname_queryParams.orderBy = event.sortField as string | null;
    if(event.sortOrder === -1) {
      stockOpname_queryParams.orderDirection = `desc`
    }
    else if (event.sortOrder === 1) {
      stockOpname_queryParams.orderDirection = `asc`
    }
    else {
      stockOpname_queryParams.orderDirection = null
    }
    // stockOpname_queryParams.orderDirection = event.sortOrder;
  }
  watch(
    () => stockOpname_queryParams,
    debounce(async () => {
      await stockOpname_fetchList();
    }, 500),
    { deep: true },
  );
  const stockOpname_fetchList = async (): Promise<void> => {
    try {
      await store.getStockOpnameList(stockOpname_queryParams, {
        ...httpAbort_registerAbort('STOCK_OPNAME_LIST_REQUEST'),
        paramsSerializer: useParamsSerializer,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  const stockOpname_fetchDetail = async (id: string): Promise<void> => {
    try {
      await store.getStockOpnameDetail(id, {
        ...httpAbort_registerAbort('STOCK_OPNAME_DETAIL_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  const stockOpname_formData = reactive<IStockOpnameFormData>({
    publishNow: false,
    items: [
      {
        masterInventoryItemId: '',
        actualQuantity: 0,
        notes: '',
      },
    ],
  });

  // const stockOpname_onSubmitNotesDialog = (notes: string): void => {

  // }

  const editingNotesForItem = ref<IStockOpname_detailItems>();
  const notesBuffer = ref(''); // A temporary place to hold the notes text
  const notesBufferRules = computed(() => ({
    required,
  }));

  const notesBufferValidation = useVuelidate(
    { notesBuffer: notesBufferRules },
    { notesBuffer },
    {
      $autoDirty: true,
    },
  );

  // ✅ 2. MODIFY this function to accept the whole item
  const stockOpname_onShowNotesDialog = (item: IStockOpname_detailItems): void => {
    // Store the item we are editing
    editingNotesForItem.value = item;
    // Copy its current notes into our buffer
    notesBuffer.value = item.notes || '';

    // Open the dialog
    const argsEventEmitter: IPropsDialog = {
      id: 'stock-opname-dialog-notes',
      isOpen: true,
      isUsingClosableButton: false,
      width: '534px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  // ✅ 3. ADD a new function to save the changes
  const stockOpname_onSubmitNotesDialog = (): void => {
    if (editingNotesForItem.value) {
      // Update the original item's notes with the text from the dialog
      editingNotesForItem.value.notes = notesBuffer.value;
    }
    // Close the dialog
    stockOpname_onCloseNotesDialog();
  };

  // ✅ 4. MODIFY this function to reset the state
  const stockOpname_onCloseNotesDialog = (): void => {
    // Reset the state
    editingNotesForItem.value = undefined;
    notesBuffer.value = '';

    // Close the dialog
    const argsEventEmitter: IPropsDialog = {
      id: 'stock-opname-dialog-notes',
      isOpen: false,
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  const stockOpname_onSubmitCreateEdit = async (publishNow: boolean, stockOpname_id: string): Promise<void> => {
    if (publishNow) {
      stockOpname_formData.publishNow = true;
    } else {
      stockOpname_formData.publishNow = false;
    }
    stockOpname_formData.items = stockOpname_detail.value.stockOpnameItems.map(item => ({
      masterInventoryItemId: item.masterInventoryItemId,
      actualQuantity: item.actualQuantity,
      notes: item.notes,
    }));
    try {
      // console.log(JSON.stringify(stockOpname_formData, null, 2));
      if (stockOpname_id === 'new') {
        await store.createStockOpname(stockOpname_formData, {
          ...httpAbort_registerAbort('STOCK_OPNAME_CREATE_REQUEST'),
        });
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: EToastType.SUCCESS,
          message: 'Stock Opname has been created successfully.',
          position: EToastPosition.TOP_RIGHT,
        };

        eventBus.emit('AppBaseToast', argsEventEmitter);
      } else {
        await store.updateStockOpname(stockOpname_id, stockOpname_formData, {
          ...httpAbort_registerAbort('STOCK_OPNAME_UPDATE_REQUEST'),
        });
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: EToastType.SUCCESS,
          message: 'Stock Opname has been updated successfully.',
          position: EToastPosition.TOP_RIGHT,
        };

        eventBus.emit('AppBaseToast', argsEventEmitter);
      }
      router.push({ name: 'stock-opname.index' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  const statusClass = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-primary-background text-primary';
      case 'on_review':
        return 'bg-secondary-background text-green-primary';
      case 'draft':
        return 'bg-warning-background text-warning-main';
      default:
        return '';
    }
  };

  const stockOpname_onDeleteIssue = async (id: string): Promise<void> => {
    try {
      await store.deleteStockOpname(id, {
        ...httpAbort_registerAbort('STOCK_OPNAME_DELETE_REQUEST'),
      });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Stock Opname has been deleted successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      router.push({ name: 'stock-opname.index' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  const stockOpname_onVerifyIssue = async (id: string): Promise<void> => {
    try {
      await store.verifyStockOpname(id, {
        ...httpAbort_registerAbort('STOCK_OPNAME_VERIFY_REQUEST'),
      });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Stock Opname has been verified successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      router.push({ name: 'stock-opname.index' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  const stockOpname_onShowDialogDeleteIssue = (id: string) => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'stock-opname-delete-dialog-confirmation',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            This action will stop the current recording and discard any unsaved or draft data.
          </p>
        </div>`,
      iconName: 'confirmation-cancel',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialog', { id: 'stock-opname-delete-dialog-confirmation', isOpen: false });
      },
      onClickButtonSecondary: () => {
        // Logic to delete the table goes here
        stockOpname_onDeleteIssue(id);
        eventBus.emit('AppBaseDialog', { id: 'stock-opname-delete-dialog-confirmation', isOpen: false });
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Cancel Stock Opname',
      title: 'Are you sure want to cancel this stock opname record process?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  const stockOpname_onShowDialogIssueRecord = (id: string) => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'stock-opname-issue-record-dialog-confirmation',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            This action will send the record for further review and verification. Make sure all item counts and details are accurate before proceeding.
          </p>
        </div>`,
      iconName: 'confirmation',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        stockOpname_onSubmitCreateEdit(true, id);
        eventBus.emit('AppBaseDialog', { id: 'stock-opname-issue-record-dialog-confirmation', isOpen: false });
      },
      onClickButtonSecondary: () => {
        eventBus.emit('AppBaseDialog', { id: 'stock-opname-issue-record-dialog-confirmation', isOpen: false });
      },
      textButtonPrimary: 'Issue Record',
      textButtonSecondary: 'Cancel',
      title: 'Are you sure want to issue this stock opname record?',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };
  const stockOpname_onShowDialogVerifyRecord = (id: string) => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'stock-opname-verify-record-dialog-confirmation',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            This action will indicating that all stock data has been reviewed and approved. This action is final and cannot be edited afterward.
          </p>
        </div>`,
      iconName: 'confirmation',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        stockOpname_onVerifyIssue(id);
        eventBus.emit('AppBaseDialog', { id: 'stock-opname-verify-record-dialog-confirmation', isOpen: false });
      },
      onClickButtonSecondary: () => {
        eventBus.emit('AppBaseDialog', { id: 'stock-opname-verify-record-dialog-confirmation', isOpen: false });
      },
      textButtonPrimary: 'Verify Record',
      textButtonSecondary: 'Cancel',
      title: 'Are you sure want to verify this stock opname record?',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  return {
    // table
    stockOpnameRecordColumns: STOCK_OPNAME_RECORD_COLUMNS,
    stockOpnameCreateEditColumns: STOCK_OPNAME_CREATE_EDIT_COLUMNS,
    stockOpname_onChangePage,
    stockOpname_onChangeSort,

    // store
    stockOpname_isLoading,
    stockOpname_detail,
    stockOpname_lists,

    // params
    stockOpname_queryParams,

    // API
    stockOpname_fetchList,
    stockOpname_fetchDetail,

    // form
    stockOpname_formData,

    stockOpname_onSubmitCreateEdit,

    statusClass,

    // notes form
    notesBuffer,
    notesBufferValidation,
    stockOpname_onSubmitNotesDialog,
    stockOpname_onShowNotesDialog,
    stockOpname_onCloseNotesDialog,

    stockOpname_onShowDialogDeleteIssue,
    stockOpname_onShowDialogIssueRecord,
    stockOpname_onShowDialogVerifyRecord,
  };
};
