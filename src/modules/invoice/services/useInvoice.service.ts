// Interfaces
import { IInvoiceListInvoice, IInvoiceProvided } from '../interfaces';

export const useInvoiceService = (): IInvoiceProvided => {
  const invoice_listInvoice: IInvoiceListInvoice[] = [
    {
      id: 1,
      name: 'Cashier Invoice',
    },
    {
      id: 2,
      name: 'Kitchen Invoice',
    },
    {
      id: 3,
      name: 'Table Ticket',
    },
  ];

  const invoice_activeInvoice = ref(1);

  return {
    invoice_listInvoice,
    invoice_activeInvoice,
  };
};
