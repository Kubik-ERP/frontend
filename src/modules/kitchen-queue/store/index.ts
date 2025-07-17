// Interfaces
import type { AxiosRequestConfig } from 'axios';

// Plugins
import httpClient from '@/plugins/axios';
import {
  IItem,
  IKitchenQueueData,
  IKitchenQueueListResponse,
  IKitchenQueueStateStore,
  IProduct,
} from '../interfaces';
import {
  INVOICE_ORDER_STATUS,
  KITCHEN_QUEUE_BASE_ENDPOINT,
  KITCHEN_QUEUE_INVOICE,
} from '../constants/kitchen-queue-api.constant';

export const useKitchenQueueStore = defineStore('kitchen-queue', {
  state: (): IKitchenQueueStateStore => ({
    kitchenQueue_isLoading: false,
    kitchenQueue_invoices: [],
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle
     * @url /
     * @method GET
     * @access private
     */
    async kitchenQueue_list(
      params: unknown,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IKitchenQueueData[]> {
      try {
        const response = await httpClient.get<IKitchenQueueListResponse>(KITCHEN_QUEUE_INVOICE, {
          params,
          ...requestConfigurations,
        });

        this.kitchenQueue_invoices = response.data.data;

        return Promise.resolve(response.data.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    async kitchenQueue_updateStatusInvoice(
      invoiceId: string,
      orderStatus: 'placed' | 'in_progress' | 'completed',
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      try {
        const response = await httpClient.put<{ data: unknown }>(
          `${INVOICE_ORDER_STATUS}/${invoiceId}`,
          { orderStatus },
          requestConfigurations,
        );

        return Promise.resolve(response);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    /**
     * @description Update the status of a queue item
     * @url /:queueId
     * @method PUT
     */
    async kitchenQueue_updateStatusQueue(
      queueReferenceId: string,
      invoiceId: string,
      queueId: string,
      orderStatus: 'placed' | 'in_progress' | 'completed',
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IKitchenQueueData[]> {
      this.kitchenQueue_isLoading = true;

      try {
        await httpClient.put<{ data: IProduct }>(
          `${KITCHEN_QUEUE_BASE_ENDPOINT}/${queueId}`,
          { orderStatus },
          requestConfigurations,
        );

        // Update the invoice in the state
        const invoiceIndex = this.kitchenQueue_invoices.findIndex(
          invoice => invoice.queueReferenceId === queueReferenceId && invoice.invoiceId === invoiceId,
        );

        if (invoiceIndex !== -1) {
          const updatedInvoice = this.kitchenQueue_invoices[invoiceIndex];

          updatedInvoice.queues.forEach(item => {
            if (item.id === queueId) {
              item.product.orderStatus = orderStatus;
            }
          });
          this.kitchenQueue_invoices[invoiceIndex] = updatedInvoice;
        }

        return Promise.resolve(this.kitchenQueue_invoices);
      } catch (error: unknown) {
        console.error('kitchenQueue_updateStatusQueue error', error);
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.kitchenQueue_isLoading = false;
      }
    },

    /**
     * @description Update the status of multiple queue items in bulk
     * @url /
     * @method PUT
     */
    async kitchenQueue_updateStatusQueueBulk(
      queueReferenceId: string,
      item: IItem[],
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IKitchenQueueData[]> {
      const activeQueue = this.kitchenQueue_invoices.find(
        invoice => invoice.queueReferenceId === queueReferenceId,
      );

      if (!activeQueue) {
        return Promise.reject(new Error('Active queue not found'));
      }

      activeQueue.isLoading = true;

      try {
        await httpClient.put<{ data: IProduct[] }>(
          `${KITCHEN_QUEUE_BASE_ENDPOINT}`,
          item.map(invoice => {
            return {
              queueId: invoice.id,
              orderStatus: invoice.product.orderStatus,
            };
          }),
          requestConfigurations,
        );

        // Update the invoice in the state
        const invoiceIndex = this.kitchenQueue_invoices.findIndex(
          invoice => invoice.queueReferenceId === queueReferenceId,
        );

        if (invoiceIndex !== -1) {
          this.kitchenQueue_invoices.splice(invoiceIndex, 1);
        }

        return Promise.resolve(this.kitchenQueue_invoices);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        activeQueue.isLoading = false;
      }
    },
  },
});
