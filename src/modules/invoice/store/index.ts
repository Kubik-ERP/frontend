import httpClient from '@/plugins/axios';
import {
  INVOICE_BASE_ENDPOINT,
  INVOICE_BASE_TICKET,
  INVOICE_SENT_EMAIL_ENDPOINT,
} from '../constants/invoiceApi.constant';
import { IInvoiceResponseInvoice, IInvoiceResponseTableKitchenTicket } from '../interfaces';

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
    invoice_fetchTableKitchenTicket: async (invoiceId: string): Promise<IInvoiceResponseTableKitchenTicket> => {
      try {
        const response = await httpClient.get<IInvoiceResponseTableKitchenTicket>(
          INVOICE_BASE_TICKET + '/' + invoiceId,
        );

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },
    invoice_sendEmail: async (invoiceId: string): Promise<void> => {
      try {
        await httpClient.post(INVOICE_SENT_EMAIL_ENDPOINT + '/' + invoiceId);
        return Promise.resolve();
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
