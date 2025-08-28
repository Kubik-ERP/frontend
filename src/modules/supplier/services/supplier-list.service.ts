// Composable
import { useParamsSerializer } from '@/app/composables/useHttp';
import { useSnakeCase } from '@/app/composables';

// Constants
import { SUPPLIER_LIST_COLUMNS, SUPPLIER_LIST_REQUEST } from '../constants';

// Interfaces
import type { ISupplierListProvided, ISupplierListRequestQuery } from '../interfaces/supplier-list.interface';

import { DataTableSortEvent } from 'primevue';

// Stores
import { useSupplierStore } from '../store';
import eventBus from '@/plugins/mitt';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useSupplierListService = (): ISupplierListProvided => {
  /**
   * @description Injected variables
   */
  const store = useSupplierStore(); // Instance of the store
  const { supplier_isLoading, supplier_supplierLists } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();
  const router = useRouter();

  /**
   * @description Reactive data binding
   */
  const supplierList_queryParams = reactive<ISupplierListRequestQuery>({
    page: 1,
    pageSize: 10,
    search: null,
    orderBy: null,
    orderDirection: null,
  });

  /**
   * @description Handle fetch api suppliers. We call the supplier_list function from the store to handle the request.
   */
  const supplierList_fetchSuppliers = async (): Promise<void> => {
    try {
      const filteredSorting = {
        orderBy: useSnakeCase(supplierList_queryParams.orderBy?.toString()) || null,
        orderDirection: mapOrderDirection(supplierList_queryParams.orderDirection),
      };

      await store.supplier_list(
        {
          ...supplierList_queryParams,
          ...filteredSorting,
        } as ISupplierListRequestQuery,
        {
          ...httpAbort_registerAbort(SUPPLIER_LIST_REQUEST),
          paramsSerializer: useParamsSerializer,
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle bussiness logic to mapping order direction
   */
  const mapOrderDirection = (val: 0 | 1 | -1 | string | undefined | null): 'asc' | 'desc' | null => {
    if (val === 1) return 'asc';
    if (val === -1) return 'desc';
    return null;
  };

  /**
   * @description Handle business logic for changing page size
   */
  const supplierList_onChangePage = (page: number): void => {
    supplierList_queryParams.page = page;
  };

  /**
   * @description Watcher for query parameters changes
   */
  watch(
    () => supplierList_queryParams,
    debounce(async () => {
      await supplierList_fetchSuppliers();
    }, 500),
    { deep: true },
  );

  /**
   * @description Handle sorting changes
   */
  const supplierList_handleOnSortChange = (event: DataTableSortEvent) => {
    supplierList_queryParams.orderBy = event.sortField as string | null;
    supplierList_queryParams.orderDirection = event.sortOrder;
  };

  /**
   * @description Handle create supplier navigation
   */
  const supplierList_onCreateSupplier = () => {
    router.push({ name: 'supplier.create' });
  };

  /**
   * @description Handle edit supplier navigation
   */
  const supplierList_onEditSupplier = (supplierId: string) => {
    router.push({ name: 'supplier.edit', params: { id: supplierId } });
  };

  /**
   * @description Handle delete supplier
   */
  const supplierList_onDeleteSupplier = async (supplierId: string) => {
    try {
      await store.supplier_delete(supplierId, {
        ...httpAbort_registerAbort(`SUPPLIER_DELETE_${supplierId}`),
      });

      // Refresh the list after deletion
      await supplierList_fetchSuppliers();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const supplierList_onDeleteSupplierDialog = async (voucherId: string, editMode?: boolean): Promise<void> => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'supplier-list-dialog-confirmation',
      description:
        'This action cannot be undone, and the supplier you remove will be deleted permanently.',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        // Close dialog (Cancel)
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'supplier-list-dialog-confirmation',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      },
      onClickButtonSecondary: async () => {
        // Close dialog
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'supplier-list-dialog-confirmation',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);

        // Proceed delete

        if (editMode === true) {
          await supplierList_onDeleteSupplier(voucherId);
          router.push({ name: 'supplier-list', params: { id: voucherId } });
        } else {
          await supplierList_onDeleteSupplier(voucherId);
        }
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete Supplier',
      title: 'Are you sure want to delete this supplier?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

    const supplierList_onPreviewSupplier = (supplierId: string) => {
    router.push({ name: 'supplier.preview', params: { id: supplierId } });
  };

  const supplierList_onImport = () => {
    eventBus.emit('AppBaseDialog', {
      id: 'supplier-import-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    });
  };

  return {
    supplierList_columns: SUPPLIER_LIST_COLUMNS,
    supplierList_fetchSuppliers,
    supplierList_isLoading: supplier_isLoading,
    supplierList_onChangePage,
    supplierList_handleOnSortChange,
    supplierList_queryParams,
    supplierList_values: supplier_supplierLists,
    supplierList_onCreateSupplier,
    supplierList_onEditSupplier,
    supplierList_onDeleteSupplier: supplierList_onDeleteSupplierDialog,
    supplierList_onPreviewSupplier,
    supplierList_onImport,
  };
};
