import { defineStore } from 'pinia';
import { ref } from 'vue';

import httpClient from '@/plugins/axios';

import {
  TRANSFER_STOCK_DEFAULT_PAGE_META,
  TRANSFER_STOCK_ITEM_LIST_ENDPOINT,
  TRANSFER_STOCK_REQUEST_ENDPOINT,
  TRANSFER_STOCK_TRANSFER_ENDPOINT,
} from '../constants';
import type {
  ITransferStockCreatePayload,
  ITransferStockItemListPayload,
  ITransferStockItemListRequest,
  ITransferStockItemListResponse,
  ITransferStockItemOption,
  ITransferStockListParams,
  ITransferStockListPayload,
  ITransferStockListResponse,
  ITransferStockMutationResponse,
  ITransferStockRecord,
  ITransferStockRequestPayload,
} from '../interfaces';

const BASE_LIST_QUERY: Required<ITransferStockListParams> = {
  page: 1,
  pageSize: 10,
  orderBy: 'updatedAt',
  orderDirection: 'desc',
};

const extractPayload = <T>(response: { data?: T; result?: T } | undefined | null): T | null => {
  if (!response) return null;
  if (response.data) return response.data;
  if (response.result) return response.result;
  return null;
};

export const useTransferStockStore = defineStore('transfer-stock', () => {
  const transferStock_isLoading = ref(false);
  const transferStock_isSubmitting = ref(false);
  const transferStock_isFetchingItems = ref(false);

  const transferStock_transfers = ref<ITransferStockRecord[]>([]);
  const transferStock_transferMeta = ref<IPageMeta>({ ...TRANSFER_STOCK_DEFAULT_PAGE_META });
  const transferStock_transferQuery = ref<ITransferStockListParams>({ ...BASE_LIST_QUERY });

  const transferStock_requests = ref<ITransferStockRecord[]>([]);
  const transferStock_requestMeta = ref<IPageMeta>({ ...TRANSFER_STOCK_DEFAULT_PAGE_META });
  const transferStock_requestQuery = ref<ITransferStockListParams>({ ...BASE_LIST_QUERY });

  const transferStock_itemOptions = ref<ITransferStockItemOption[]>([]);
  const transferStock_itemMeta = ref<IPageMeta>({ ...TRANSFER_STOCK_DEFAULT_PAGE_META });
  const transferStock_itemParams = ref<ITransferStockItemListRequest | null>(null);

  const fetchTransferList = async (params: ITransferStockListParams = {}) => {
    transferStock_isLoading.value = true;
    const query = { ...BASE_LIST_QUERY, ...transferStock_transferQuery.value, ...params };

    try {
      const response = await httpClient.get<ITransferStockListResponse>(TRANSFER_STOCK_TRANSFER_ENDPOINT, {
        params: query,
      });
      const payload = extractPayload<ITransferStockListPayload>(response.data) ?? {
        items: [],
        meta: { ...TRANSFER_STOCK_DEFAULT_PAGE_META },
      };

      transferStock_transfers.value = payload.items ?? [];
      transferStock_transferMeta.value = payload.meta ?? { ...TRANSFER_STOCK_DEFAULT_PAGE_META };
      transferStock_transferQuery.value = query;
    } finally {
      transferStock_isLoading.value = false;
    }
  };

  const fetchRequestList = async (params: ITransferStockListParams = {}) => {
    transferStock_isLoading.value = true;
    const query = { ...BASE_LIST_QUERY, ...transferStock_requestQuery.value, ...params };

    try {
      const response = await httpClient.get<ITransferStockListResponse>(TRANSFER_STOCK_REQUEST_ENDPOINT, {
        params: query,
      });
      const payload = extractPayload<ITransferStockListPayload>(response.data) ?? {
        items: [],
        meta: { ...TRANSFER_STOCK_DEFAULT_PAGE_META },
      };

      transferStock_requests.value = payload.items ?? [];
      transferStock_requestMeta.value = payload.meta ?? { ...TRANSFER_STOCK_DEFAULT_PAGE_META };
      transferStock_requestQuery.value = query;
    } finally {
      transferStock_isLoading.value = false;
    }
  };

  const fetchItemOptions = async (payload: ITransferStockItemListRequest) => {
    if (!payload.storeToId) {
      resetItemOptions();
      return;
    }

    transferStock_isFetchingItems.value = true;
    transferStock_itemParams.value = payload;

    const queryParams: Record<string, unknown> = {};
    if (payload.search) {
      queryParams.search = payload.search;
    }
    if (payload.page) {
      queryParams.page = payload.page;
    }
    if (payload.pageSize) {
      queryParams.pageSize = payload.pageSize;
    }

    try {
      const response = await httpClient.post<ITransferStockItemListResponse>(
        TRANSFER_STOCK_ITEM_LIST_ENDPOINT,
        {
          store_to_id: payload.storeToId,
        },
        {
          params: queryParams,
        },
      );

      const data = extractPayload<ITransferStockItemListPayload>(response.data) ?? {
        items: [],
        meta: { ...TRANSFER_STOCK_DEFAULT_PAGE_META },
      };

      transferStock_itemOptions.value = data.items ?? [];
      transferStock_itemMeta.value = data.meta ?? { ...TRANSFER_STOCK_DEFAULT_PAGE_META };
    } finally {
      transferStock_isFetchingItems.value = false;
    }
  };

  const resetItemOptions = () => {
    transferStock_itemOptions.value = [];
    transferStock_itemMeta.value = { ...TRANSFER_STOCK_DEFAULT_PAGE_META };
    transferStock_itemParams.value = null;
  };

  const createTransfer = async (payload: ITransferStockCreatePayload) => {
    transferStock_isSubmitting.value = true;
    try {
      const response = await httpClient.post<ITransferStockMutationResponse>(
        TRANSFER_STOCK_TRANSFER_ENDPOINT,
        {
          store_to_id: payload.storeToId,
          note: payload.note,
          items: payload.items.map(item => ({
            itemId: item.itemId,
            qty: item.qty,
          })),
        },
      );

      return extractPayload<ITransferStockRecord>(response.data);
    } finally {
      transferStock_isSubmitting.value = false;
    }
  };

  const createRequest = async (payload: ITransferStockRequestPayload) => {
    transferStock_isSubmitting.value = true;
    try {
      const body: Record<string, unknown> = {
        note: payload.note,
        items: payload.items.map(item => ({
          itemId: item.itemId,
          qty: item.qty,
        })),
      };

      if (payload.storeToId) {
        body.store_to_id = payload.storeToId;
      }

      const response = await httpClient.post<ITransferStockMutationResponse>(
        TRANSFER_STOCK_REQUEST_ENDPOINT,
        body,
      );

      return extractPayload<ITransferStockRecord>(response.data);
    } finally {
      transferStock_isSubmitting.value = false;
    }
  };

  return {
    transferStock_isLoading,
    transferStock_isSubmitting,
    transferStock_isFetchingItems,
    transferStock_transfers,
    transferStock_transferMeta,
    transferStock_transferQuery,
    transferStock_requests,
    transferStock_requestMeta,
    transferStock_requestQuery,
    transferStock_itemOptions,
    transferStock_itemMeta,
    transferStock_itemParams,
    fetchTransferList,
    fetchRequestList,
    fetchItemOptions,
    resetItemOptions,
    createTransfer,
    createRequest,
  };
});
