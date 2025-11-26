import { ComputedRef, Reactive, Ref } from 'vue';
import type { MenuPassThroughAttributes } from 'primevue';
import {
  ICashierCalulateEstimationData,
  ICashierListTable,
  ICashierOrderSummary,
  ICashierOrderSummaryData,
  ICashierOrderSummaryModalAddEdit,
  ICashierOrderSummaryModalCancelOrder,
  ICashierOrderSummaryModalInvoiceDetail,
  ICashierOrderSummaryModalOrderType,
  ICashierOrderSummaryModalPaymentMethod,
  ICashierOrderSummaryModalPlaceOrder,
  ICashierOrderSummaryModalPlaceOrderConfirmation,
  ICashierOrderSummaryModalSelectTable,
  ICashierOrderSummaryModalVoucher,
  ICashierCustomerState,
} from './cashier-order-summary';
import { ILoyaltyPointBenefit } from '@/modules/point-configuration/interfaces';

export interface ICashierOrderProvided {
  cashierOrder_calculateEstimation: Ref<ICashierCalulateEstimationData>;
  cashierOrder_data: Ref<ICashierOrderSummaryData>;
  cashierOrder_getListActiveFloor: ComputedRef<ICashierListTable[]>;
  cashierOrder_handleCalculateEstimation: (
    recalculating?: boolean,
    voucherId?: string,
    customerId?: string | undefined,
    getVoucherActive?: () => Promise<void>,
    voucherData?: unknown,
    cashierCustomer_modalVoucher?: Ref<ICashierOrderSummaryModalVoucher>,
  ) => Promise<void>;
  cashierOrder_handleCancelOrder: (
    cashierPayment_modalPaymentMethod: Ref<ICashierOrderSummaryModalPaymentMethod>,
    cashierCustomer_customerState: Ref<ICashierCustomerState>,
    cashierOrder_modalSelectTable: Ref<ICashierOrderSummaryModalSelectTable>,
    cashierCustomer_modalVoucher: Ref<ICashierOrderSummaryModalVoucher>,
  ) => void;
  cashierOrder_handleEditOrder: () => Promise<void>;
  cashierOrder_handleIsExpandedToggle: () => void;
  cashierOrder_handlePlaceOrderConfirmation: (
    cashierPayment_modalPaymentMethod?: Ref<ICashierOrderSummaryModalPaymentMethod>,
    cashierOrder_handlePlaceOrderDetail?: () => Promise<void>,
  ) => Promise<void>;
  cashierOrder_handlePlaceOrderDetail: (
    cashierPayment_modalPaymentMethod?: Ref<ICashierOrderSummaryModalPaymentMethod>,
    cashierPayment_paymentForm?: Reactive<{ paymentAmount: number }>,
    cashierCustomer_modalVoucher?: Ref<ICashierOrderSummaryModalVoucher>,
    cashierCustomer_customerState?: Ref<ICashierCustomerState>,
  ) => Promise<void>;
  cashierOrder_handleSaveUnpaidOrder: (
    cashierPayment_modalPaymentMethod?: Ref<ICashierOrderSummaryModalPaymentMethod>,
    cashierCustomer_modalVoucher?: Ref<ICashierOrderSummaryModalVoucher>,
    cashierCustomer_customerState?: Ref<ICashierCustomerState>,
  ) => Promise<void>;
  cashierOrder_handleSelectTable: () => void;
  cashierOrder_handleToggleSelectTable: (table: string) => void;
  cashierOrder_initializeRoute: (
    cashierCustomer_customerState: Ref<ICashierCustomerState>,
    cashierPayment_modalPaymentMethod: Ref<ICashierOrderSummaryModalPaymentMethod>,
    cashierPayment_handleFetchPaymentMethod: () => Promise<void>,
  ) => void;
  cashierOrder_isButtonPlaceOrderDisabled: ComputedRef<boolean>;
  cashierOrder_isLoadingUnpaidOrder: Ref<boolean>;
  cashierOrder_isRetailBusinessType: ComputedRef<boolean>;
  cashierOrder_isShowQuickOverview: Ref<boolean>;
  cashierOrder_menuOrder?: Ref<MenuPassThroughAttributes>;
  cashierOrder_menuOrderItem?: Ref<never[]>;
  cashierOrder_modalAddEditNotes: Ref<ICashierOrderSummaryModalAddEdit>;
  cashierOrder_modalCancelOrder: Ref<ICashierOrderSummaryModalCancelOrder>;
  cashierOrder_modalInvoiceDetail: Ref<ICashierOrderSummaryModalInvoiceDetail>;
  cashierOrder_modalMenuOrderItem: Ref<{ show: boolean }>;
  cashierOrder_modalOrderSummary: Ref<{ show: boolean }>;
  cashierOrder_modalOrderType: Ref<ICashierOrderSummaryModalOrderType>;
  cashierOrder_modalPlaceOrderConfirmation: Ref<ICashierOrderSummaryModalPlaceOrder>;
  cashierOrder_modalPlaceOrderDetail: Ref<ICashierOrderSummaryModalPlaceOrderConfirmation>;
  cashierOrder_modalSelectTable: Ref<ICashierOrderSummaryModalSelectTable>;
  cashierOrder_selectedLoyaltyBenefit: Ref<ILoyaltyPointBenefit | null>;
  cashierOrder_selectedLoyaltyBenefitId: Ref<string | null>;
  cashierOrder_setSelectedLoyaltyBenefit: (benefit: ILoyaltyPointBenefit | null) => void;
  cashierOrder_summary: ComputedRef<ICashierOrderSummary>;
}
