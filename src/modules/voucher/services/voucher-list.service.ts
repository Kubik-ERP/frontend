import { DataTableSortEvent } from "primevue";
import { VOUCHER_LIST_COLUMNS, VOUCHER_LIST_REQUEST } from "../constants";
import { IVoucherListRequestQuery, IVoucherListProvided } from "../interfaces/voucher-list.interface";
import { useVoucherStore } from "../store/index";
import eventBus from "@/plugins/mitt";

export const useVoucherListService = (): IVoucherListProvided => {
  const store = useVoucherStore();
  const { voucher_isLoading, voucher_lists } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const voucherList_queryParams = reactive<IVoucherListRequestQuery>({
    startDate: '',
    endDate: '',
    page: 1,
    pageSize: 10,
    orderBy: 'updatedAt',
    orderDirection: 'desc',
  });

  /**
   * Fetch Voucher List
   */
  const voucherList_fetchListVouchers = async (): Promise<void> => {
    try {
      await store.voucherList_fetchListVouchers(voucherList_queryParams, {
        ...httpAbort_registerAbort(VOUCHER_LIST_REQUEST),
        paramsSerializer: useParamsSerializer,
      });
    } catch (error: unknown) {
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
  };

  /**
   * Handle page change
   */
  const voucherList_onChangePage = (page: number): void => {
    voucherList_queryParams.page = page;
  };

  /**
   * Watch query params
   */
  watch(
    () => ({ ...voucherList_queryParams }),
    debounce(async () => {
      await voucherList_fetchListVouchers();
    }, 500),
    { deep: true },
  );

  /**
   * Handle sort change
   */
  const voucher_handleOnSortChange = (event: DataTableSortEvent): void => {
    voucherList_queryParams.orderBy = event.sortField as string;
    voucherList_queryParams.orderDirection = event.sortOrder === 1 ? "asc" : "desc";
    voucherList_fetchListVouchers();
  };

  /**
   * Delete Voucher
   */
  const voucherList_fetchdeleteVoucher = async (voucherId: string): Promise<void> => {
    try {
      await store.voucherList_deleteVoucher(voucherId, {
        ...httpAbort_registerAbort(VOUCHER_LIST_REQUEST),
      });

      // Show toast success
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Voucher has been deleted successfully',
        position: EToastPosition.TOP_RIGHT,
      };
      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    } finally {
      // Refetch list after delete
      await voucherList_fetchListVouchers();
    }
  };

  /**
   * Dialog confirmation delete voucher
   */
  const voucherList_deleteVoucher = async (voucherId: string): Promise<void> => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'voucher-list-dialog-confirmation',
      description:
        'This action cannot be undone, and the voucher you remove will be deleted permanently.',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        // Close dialog (Cancel)
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'voucher-list-dialog-confirmation',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      },
      onClickButtonSecondary: async () => {
        // Close dialog
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'voucher-list-dialog-confirmation',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);

        // Proceed delete
        await voucherList_fetchdeleteVoucher(voucherId);
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete Voucher',
      title: 'Are you sure want to delete this voucher?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };



  return {
    voucherList_columns: VOUCHER_LIST_COLUMNS,
    voucherList_isLoading: voucher_isLoading,
    voucherList_onChangePage,
    voucher_handleOnSortChange,
    voucherList_queryParams,
    voucherList_fetchListVouchers,
    voucherList_deleteVoucher: voucherList_deleteVoucher,
    voucherList_values: voucher_lists,
  };
};
