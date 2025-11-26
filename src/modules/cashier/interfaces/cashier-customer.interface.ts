import { ComputedRef, Ref } from 'vue';
import { MenuItem } from 'primevue/menuitem';
import type { VirtualScrollerLazyEvent } from 'primevue/virtualscroller';
import type { MenuPassThroughAttributes } from 'primevue';
import {
  ICashierOrderSummaryModalAddCustomer,
  ICashierOrderSummaryModalInvoiceDetail,
  ICashierOrderSummaryModalVoucher,
  ICashierResponseAddCustomer,
  ICashierVoucher,
} from './cashier-order-summary';
import { ICashierCustomerState } from '.';

// Service returns this subset
export interface ICashierCustomerService {
  cashierCustomer_customerState: Ref<ICashierCustomerState>;
  cashierCustomer_fetchCustomerList: (page: number, search?: string) => Promise<void>;
  cashierCustomer_getVoucherActive: (search: string, productIds?: string[]) => Promise<void>;
  cashierCustomer_handleModalAddCustomer: (response: ICashierResponseAddCustomer | null) => void;
  cashierCustomer_handleVoucher: (id: string) => void;
  cashierCustomer_hasCustomerManagementPermission: ComputedRef<boolean>;
  cashierCustomer_menuOrderItem: Ref<MenuItem[]>;
  cashierCustomer_modalAddCustomer: Ref<ICashierOrderSummaryModalAddCustomer>;
  cashierCustomer_modalMenuOrderItem: Ref<{ show: boolean }>;
  cashierCustomer_modalVoucher: Ref<ICashierOrderSummaryModalVoucher>;
  cashierCustomer_onCloseDialogCashDrawerOverview: () => void;
  cashierCustomer_onCloseDialogQueueOverview: () => void;
  cashierCustomer_onCloseDialogStockOverview: () => void;
  cashierCustomer_onCloseDialogTableOverview: () => void;
  cashierCustomer_onOpenDialogCashDrawerOverview: () => Promise<void>;
  cashierCustomer_onOpenDialogQueueOverview: () => Promise<void>;
  cashierCustomer_onOpenDialogStockOverview: () => Promise<void>;
  cashierCustomer_onOpenDialogTableOverview: () => void;
  cashierCustomer_onScrollFetchMoreCustomers: (event: VirtualScrollerLazyEvent) => void;
  cashierCustomer_onSearchCustomer: (search: string) => void;
  cashierCustomer_voucherData: Ref<ICashierVoucher[]>;
}

// Provided includes additional properties from other services
export interface ICashierCustomerProvided extends ICashierCustomerService {
  cashierCustomer_handleInvoiceDetail: (invoiceId: string) => Promise<void>;
  cashierCustomer_hasManagementPermission: ComputedRef<boolean>;
  cashierCustomer_menuOrder?: Ref<MenuPassThroughAttributes>;
  cashierCustomer_modalInvoiceDetail: Ref<ICashierOrderSummaryModalInvoiceDetail>;
}
