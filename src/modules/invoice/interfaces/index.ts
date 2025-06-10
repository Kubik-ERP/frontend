import { ICashierOrderSummaryPaymentMethod } from '@/modules/cashier/interfaces/cashier-order-summary';
import { ICashierResponseMidtransQrisPayment } from '@/modules/cashier/interfaces/cashier-response';

export interface IInvoiceModalPayData {
  show: boolean;
  isLoading: boolean;
  showModalPayment: boolean;
  dataPayment: Partial<ICashierResponseMidtransQrisPayment['data']>;
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
  data: IInvoiceResponseInvoice['data'] | null;
}

export interface IInvoiceOtherOptionsData {
  isLoadingSendEmail: boolean;
}

export interface IInvoiceResponseInvoice {
  data: {
    id: string;
    paymentMethodsId: string | null;
    customerId: string;
    discountAmount: number;
    tableCode: string;
    paymentStatus: 'unpaid' | 'paid' | 'refund';
    createdAt: string;
    updateAt: string;
    deleteAt: string | null;
    subtotal: number;
    orderType: 'dine_in' | 'take_away' | 'self_order';
    customer: {
      id: string;
      name: string;
      code: string;
      number: string | null;
      dob: string | null;
      email: string | null;
      username: string;
      address: string | null;
    };
    invoiceDetails: {
      id: string;
      productId: string;
      productPrice: number;
      variantId: string;
      notes: string;
      qty: number;
      invoiceId: string;
      variantPrice: number | null;
      products: {
        id: string;
        name: string;
        price: number;
        discountPrice: number;
        pictureUrl: string;
      };
      variant: {
        id: string;
        name: string;
        price: number;
      } | null;
    }[];
    paymentMethods: {
      id: string;
      name: string;
      iconName: string;
      sortNo: number;
      isAvailable: boolean;
    } | null;
  };
}

export interface IInvoiceProvided {
  invoice_activeInvoice: Ref<number>;
  invoice_invoiceData: Ref<IInvoiceInvoiceData>;
  invoice_modalPay: Ref<IInvoiceModalPayData>;
  invoice_otherOptions: Ref<IInvoiceOtherOptionsData>;

  invoice_handlePrint: (
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
