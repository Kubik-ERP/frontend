// Constants
import {
  CUSTOMER_DELETE_REQUEST,
  CUSTOMER_LIST_REQUEST,
  CUSTOMER_LIST_COLUMNS,
  CUSTOMER_LIST_VALUES,
} from '../constants/customer.constant';

// Interfaces
import { ICustomerRequestQuery, type ICustomerListProvided } from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Store
import { useCatalogStore } from '../store';
import { EToastPosition, EToastType } from '@/app/constants/toast.constant';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useCustomerListService = (): ICustomerListProvided => {
  /**
   * @description Injected variables
   */
  const store = useCatalogStore(); // Instance of the store
  const { catalog_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const customerList_queryParams = reactive<ICustomerRequestQuery>({
    limit: '10',
    page: '1',
    search: '',
  });

  /**
   * @description Handle fetch api catalog. We call the fetchCatalog_deleteCustomer function from the store to handle the request.
   */
  const customerList_fetchDeleteCustomer = async (customerId: string): Promise<void> => {
    try {
      await store.fetchCatalog_deleteCustomer(customerId, {
        ...httpAbort_registerAbort(CUSTOMER_DELETE_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        message: 'Customer has been deleted successfully',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.SUCCESS,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      console.error('Error deleting customer:', error);
    }
  };

  /**
   * @description Handle fetch api catalog. We call the fetchCatalog_listCustomers function from the store to handle the request.
   */
  const customerList_fetchListCustomers = async (): Promise<void> => {
    try {
      await store.fetchCatalog_listCustomers(customerList_queryParams, {
        ...httpAbort_registerAbort(CUSTOMER_LIST_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for event click button delete customer
   */
  const customerList_onDelete = async (customerId: string): Promise<void> => {
    console.log('customerList_onDelete', customerId);
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'catalog-customer-delete-dialog-confirmation',
      description: 'Deleting this customer data will permanently remove it from the system',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        const argsEventEmitter: IPropsDialog = {
          id: 'catalog-customer-delete-dialog-confirmation',
          isOpen: false,
        };

        eventBus.emit('AppBaseDialog', argsEventEmitter);
      },
      onClickButtonSecondary: async () => {
        await customerList_fetchDeleteCustomer(customerId);
        await customerList_fetchListCustomers();

        const argsEventEmitter: IPropsDialog = {
          id: 'catalog-customer-delete-dialog-confirmation',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialog', argsEventEmitter);
      },
      title: 'Are you sure want to delete this customer data?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  return {
    customerList_columns: CUSTOMER_LIST_COLUMNS,
    customerList_fetchListCustomers,
    customerList_isLoading: catalog_isLoading,
    customerList_onDelete,
    customerList_queryParams: customerList_queryParams,
    customerList_values: CUSTOMER_LIST_VALUES as never[],
  };
};
