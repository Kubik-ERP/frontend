export interface ICashierResponseCalulateEstimationDetail {
  productId: string;
  variantId: string;
  productPrice: number;
  variantPrice: number;
  qty: number;
  discountAmount: number;
  subtotal: number;
}

export interface ICashierResponseCalulateEstimationItem {
  total: number;
  discountTotal: number;
  items: ICashierResponseCalulateEstimationItem[];
}

export interface ICashierResponseCalulateEstimation {
  data: ICashierResponseCalulateEstimationItem;
}

export interface ICashierResponseProcessCheckout {
  data: {
    orderId: string;
  };
}

export interface ICashierResponseMidtransQrisPayment {
  data: {
    statusCode: string;
    statusMessage: string;
    transactionId: string;
    orderId: string;
    merchantId: string;
    grossAmount: string;
    currency: string;
    paymentType: string;
    transactionTime: string;
    transactionStatus: string;
    fraudStatus: string;
    actions: {
      name: string;
      method: string;
      url: string;
    }[];
    acquirer: string;
    qrString: string;
    expiryTime: string;
  };
}

export interface ICashierResponseWebsocketMessage {
  orderId: string;
  message: string;
}
