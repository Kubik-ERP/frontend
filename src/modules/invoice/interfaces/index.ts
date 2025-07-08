import { IAuthenticationProfile } from '@/modules/authentication/interfaces';
import { ICashierOrderSummaryPaymentMethod } from '@/modules/cashier/interfaces/cashier-order-summary';
import {
  ICashierResponseCalulateEstimationItem,
  IMidtransQrisPaymentData,
} from '@/modules/cashier/interfaces/cashier-response';
import { IOutlet } from '@/modules/outlet/interfaces';
import { ISettingInvoiceDetail } from '@/modules/setting/interfaces';

export interface IInvoiceModalPayData {
  show: boolean;
  isLoading: boolean;
  showModalPayment: boolean;
  dataPayment: Partial<IMidtransQrisPaymentData>;
  listPayment: ICashierOrderSummaryPaymentMethod[];
  data: {
    selectedPaymentMethod: string;
    moneyReceived: number;
    totalPrice: number;
    change: number;
  };
}

export interface IInvoiceInvoiceData {
  isLoading: boolean;
  data: IInvoiceData | null;
  calculate: ICashierResponseCalulateEstimationItem | null;
  currentUser: IAuthenticationProfile | null;
  currentOutlet: IOutlet | null;
  configInvoice: ISettingInvoiceDetail | null;
  tableKitchenTicket: ITableKitcenTicketData | null;
}

export interface IInvoiceOtherOptionsData {
  isLoadingSendEmail: boolean;
}

export interface IInvoiceCustomer {
  id: string;
  name: string;
  code: string;
  number: string | null;
  dob: string | null;
  email: string | null;
  username: string;
  address: string | null;
  gender: string;
}
export interface IInvoiceProduct {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  pictureUrl: string;
  isPercent: boolean;
}

export interface IInvoiceVariant {
  id: string;
  name: string;
  price: number;
}

export interface IInvoiceDetail {
  id: string;
  productId: string;
  productPrice: number;
  variantId: string;
  notes: string;
  qty: number;
  invoiceId: string;
  variantPrice: number | null;
  products: IInvoiceProduct;
  variant: IInvoiceVariant | null;
}

export interface IInvoicePaymentMethod {
  id: string;
  name: string;
  iconName: string;
  sortNo: number;
  isAvailable: boolean;
}

export interface IInvoiceData {
  id: string;
  paymentMethodsId: string | null;
  customerId: string;
  discountAmount: number;
  tableCode: string;
  paymentStatus: 'unpaid' | 'paid' | 'refund';
  orderStatus: 'in_progress' | 'waiting' | 'served' | 'cancelled';
  createdAt: string;
  updateAt: string;
  deleteAt: string | null;
  subtotal: number;
  invoiceNumber: string;
  orderType: 'dine_in' | 'take_away' | 'self_order';
  paidAt: string | null;
  taxId: string | null;
  serviceChargeId: string | null;
  taxAmount: number | null;
  serviceChargeAmount: number | null;
  grandTotal: number | null;
  customer: IInvoiceCustomer;
  invoiceDetails: IInvoiceDetail[];
  invoiceCharges: [];
  paymentMethods: IInvoicePaymentMethod | null;
  users: {
    fullname: string;
    id: number;
  } | null;
}

export interface IInvoiceResponseInvoice {
  data: IInvoiceData;
}

export interface ITableKitcenTicketData {
  id: string;
  createdAt: string;
  tableCode: string;
  invoiceNumber: string;
  users: {
    id: number;
    fullname: string;
  };
  orderType: 'dine_in' | 'take_away' | 'self_order';
  customer: {
    id: string;
    name: string;
  };
  invoiceDetails: IInvoiceDetail[];
  createdAtFormatted: string;
}

export interface IInvoiceDetail {
  id: string;
  productId: string;
  productPrice: number;
  variantId: string;
  notes: string;
  qty: number;
  invoiceId: string;
  variantPrice: number | null;
  products: IProduct;
  variant: IVariant | null;
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  pictureUrl: string;
  isPercent: boolean;
}

export interface IVariant {
  id: string;
  name: string;
  price: number;
}

export interface IInvoiceResponseTableKitchenTicket {
  data: ITableKitcenTicketData;
}

export interface IInvoiceProvided {
  invoice_activeInvoice: Ref<number>;
  invoice_invoiceData: Ref<IInvoiceInvoiceData>;
  invoice_modalPay: Ref<IInvoiceModalPayData>;
  invoice_otherOptions: Ref<IInvoiceOtherOptionsData>;

  invoice_handlePrint: (
    type: string,
    invoiceRef: HTMLElement,
    kitchenRef: HTMLElement | null,
    cashierRef: HTMLElement | null,
  ) => void;
  invoice_handleDownload: (
    invoiceRef: HTMLElement,
    kitchenRef: HTMLElement | null,
    cashierRef: HTMLElement | null,
  ) => void;
  invoice_handleOtherOptions: (type: 'copy' | 'email' | 'whatsapp') => void;
  invoice_handlePayInvoice: () => void;
  invoice_handleSimulatePayment: (invoiceId: string) => void;
}
