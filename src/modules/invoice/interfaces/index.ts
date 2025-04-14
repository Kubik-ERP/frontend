export interface IInvoiceListInvoice {
  id: number;
  name: string;
}

export interface IInvoiceProvided {
  invoice_listInvoice: IInvoiceListInvoice[];
  invoice_activeInvoice: Ref<number>;
}
