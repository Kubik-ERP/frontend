import httpClient from '@/plugins/axios';
import { INVOICE_BASE_ENDPOINT } from '../constants/invoiceApi.constant';
import { IInvoiceResponseInvoice } from '../interfaces';

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({}),
  actions: {
    invoice_fetchInvoiceById: async (invoiceId: string): Promise<IInvoiceResponseInvoice> => {
      try {
        const response = await httpClient.get<IInvoiceResponseInvoice>(INVOICE_BASE_ENDPOINT + '/' + invoiceId);
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },
  },
});
