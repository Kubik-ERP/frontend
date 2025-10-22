import { computed, onMounted, reactive, ref, watch } from 'vue';
import type { DataTablePageEvent } from 'primevue/datatable';
import { storeToRefs } from 'pinia';

import { EToastPosition, EToastType } from '@/app/constants/toast.constant';
import eventBus from '@/plugins/mitt';
import { useOutletStore } from '@/modules/outlet/store';
import { useOutletListService } from '@/modules/outlet/services/outlet-list.service';
import { useInventoryItemsStore } from '@/modules/items/store';
import { useParamsSerializer } from '@/app/composables/useHttp';

import { useTransferStockStore } from '../store';
import type {
  ITransferStockFormItem,
  ITransferStockItemOption,
  ITransferStockRecord,
} from '../interfaces';

interface IItemSelectorState {
  optionId: string;
  qty: number;
  search: string;
}

const emitToast = (message: string, type: EToastType) => {
  eventBus.emit('AppBaseToast', {
    isOpen: true,
    message,
    position: EToastPosition.TOP_RIGHT,
    type,
  });
};

export const useTransferStockService = () => {
  const transferStockStore = useTransferStockStore();
  const outletStore = useOutletStore();
  const { outletList_fetchOutletLists } = useOutletListService();
  const inventoryItemsStore = useInventoryItemsStore();

  const {
    transferStock_isLoading,
    transferStock_isSubmitting,
    transferStock_transfers,
    transferStock_transferMeta,
    transferStock_transferQuery,
    transferStock_requests,
    transferStock_requestMeta,
    transferStock_requestQuery,
  } = storeToRefs(transferStockStore);
  const { outlet_isLoading } = storeToRefs(outletStore);
  const { inventoryItems_isLoading } = storeToRefs(inventoryItemsStore);

  const activeTab = ref<'transfer' | 'request'>('transfer');
  const selectedRecord = ref<ITransferStockRecord | null>(null);

  const displayedList = computed<ITransferStockRecord[]>(() =>
    activeTab.value === 'transfer' ? transferStock_transfers.value : transferStock_requests.value,
  );
  const displayedMeta = computed<IPageMeta>(() =>
    activeTab.value === 'transfer' ? transferStock_transferMeta.value : transferStock_requestMeta.value,
  );
  const displayedQuery = computed(() =>
    activeTab.value === 'transfer' ? transferStock_transferQuery.value : transferStock_requestQuery.value,
  );

  const isCreateTransferDialogOpen = ref(false);
  const isCreateRequestDialogOpen = ref(false);

  const transferForm = reactive({
    storeToId: '',
    note: '',
    items: [] as ITransferStockFormItem[],
  });
  const requestForm = reactive({
    note: '',
    items: [] as ITransferStockFormItem[],
  });

  const transferItemSelector = reactive<IItemSelectorState>({
    optionId: '',
    qty: 1,
    search: '',
  });
  const requestItemSelector = reactive<IItemSelectorState>({
    optionId: '',
    qty: 1,
    search: '',
  });

  const currentStoreId = computed(
    () =>
      outletStore.$state.outlet_selectedOutletOnAccountPage?.id ??
      outletStore.outlet_currentOutlet?.id ??
      '',
  );
  const currentStoreName = computed(
    () =>
      outletStore.$state.outlet_selectedOutletOnAccountPage?.name ??
      outletStore.outlet_currentOutlet?.name ??
      '-',
  );

  const storeOptions = computed(() =>
    outletStore.outlet_lists.items
      .filter(store => store.id !== currentStoreId.value)
      .map(store => ({
        label: store.name ?? store.address ?? store.id,
        value: store.id,
      })),
  );

  const inventoryItemOptions = computed<ITransferStockItemOption[]>(() =>
    inventoryItemsStore.inventoryItems_lists.data.items.map(item => ({
      id: item.id,
      name: item.itemName ?? item.name,
      sku: item.sku,
      stockQuantity: item.stockQuantity,
    })),
  );

  const resolveStoreName = (storeId: string | null | undefined): string => {
    if (!storeId) return '-';
    if (storeId === currentStoreId.value) return currentStoreName.value;

    const matchingStore = outletStore.outlet_lists.items.find(store => store.id === storeId);
    return matchingStore?.name ?? storeId;
  };

  const fetchInventoryItems = async (search: string | null = null) => {
    await inventoryItemsStore.InventoryItems_fetchData(
      {
        page: 1,
        pageSize: 20,
        search,
        orderBy: null,
        orderDirection: null,
      },
      {
        paramsSerializer: useParamsSerializer,
      },
    );
  };

  const initializeData = async () => {
    const tasks: Promise<unknown>[] = [
      transferStockStore.fetchTransferList(),
      transferStockStore.fetchRequestList(),
      outletList_fetchOutletLists({
        page: 1,
        pageSize: 100,
      }),
      fetchInventoryItems(),
    ];

    await Promise.allSettled(tasks);
  };

  onMounted(async () => {
    await initializeData();
    if (displayedList.value.length) {
      selectedRecord.value = displayedList.value[0];
    }
  });

  watch(
    () => activeTab.value,
    async tab => {
      if (tab === 'transfer' && !transferStock_transfers.value.length) {
        await transferStockStore.fetchTransferList();
      }
      if (tab === 'request' && !transferStock_requests.value.length) {
        await transferStockStore.fetchRequestList();
      }

      if (displayedList.value.length) {
        selectedRecord.value = displayedList.value[0];
      } else {
        selectedRecord.value = null;
      }
    },
  );

  watch(
    () => displayedList.value,
    list => {
      if (!list.length) {
        selectedRecord.value = null;
        return;
      }

      if (!selectedRecord.value) {
        selectedRecord.value = list[0];
        return;
      }

      const exists = list.some(item => item.id === selectedRecord.value?.id);
      if (!exists) {
        selectedRecord.value = list[0];
      }
    },
    { deep: true },
  );

  watch(
    () => transferForm.storeToId,
    async newStoreId => {
      transferForm.items = [];
      transferItemSelector.optionId = '';
      transferItemSelector.qty = 1;
      transferItemSelector.search = '';

      if (isCreateTransferDialogOpen.value && newStoreId) {
        await fetchInventoryItems(transferItemSelector.search || null);
      }
    },
  );

  const setActiveTab = (tab: 'transfer' | 'request') => {
    activeTab.value = tab;
  };

  const selectRecord = (record: ITransferStockRecord | null) => {
    selectedRecord.value = record;
  };

  const refreshActiveList = async () => {
    if (activeTab.value === 'transfer') {
      await transferStockStore.fetchTransferList(transferStock_transferQuery.value);
    } else {
      await transferStockStore.fetchRequestList(transferStock_requestQuery.value);
    }
  };

  const handleTablePage = async (event: DataTablePageEvent) => {
    const nextPage = event.page + 1;
    const pageSize = event.rows;

    if (activeTab.value === 'transfer') {
      await transferStockStore.fetchTransferList({ page: nextPage, pageSize });
    } else {
      await transferStockStore.fetchRequestList({ page: nextPage, pageSize });
    }
  };

  const resetTransferForm = () => {
    transferForm.storeToId = '';
    transferForm.note = '';
    transferForm.items = [];
    transferItemSelector.optionId = '';
    transferItemSelector.qty = 1;
    transferItemSelector.search = '';
  };

  const resetRequestForm = () => {
    requestForm.note = '';
    requestForm.items = [];
    requestItemSelector.optionId = '';
    requestItemSelector.qty = 1;
    requestItemSelector.search = '';
  };

  const ensureOutletList = async () => {
    if (!outletStore.outlet_lists.items.length) {
      await outletList_fetchOutletLists({
        page: 1,
        pageSize: 100,
      });
    }
  };

  const openCreateTransferDialog = async () => {
    await ensureOutletList();
    resetTransferForm();
    await fetchInventoryItems();
    isCreateTransferDialogOpen.value = true;
  };

  const closeCreateTransferDialog = () => {
    isCreateTransferDialogOpen.value = false;
    resetTransferForm();
  };

  const openCreateRequestDialog = async () => {
    await ensureOutletList();
    resetRequestForm();
    isCreateRequestDialogOpen.value = true;

    if (currentStoreId.value) {
      await fetchInventoryItems();
    }
  };

  const closeCreateRequestDialog = () => {
    isCreateRequestDialogOpen.value = false;
    resetRequestForm();
  };

  const addItemToForm = (form: ITransferStockFormItem[], selector: IItemSelectorState, options: ITransferStockItemOption[]) => {
    const option = options.find(item => item.id === selector.optionId);

    if (!option) {
      emitToast('Please select an item before adding.', EToastType.WARNING);
      return;
    }

    if (selector.qty < 1) {
      emitToast('Quantity must be at least 1.', EToastType.WARNING);
      return;
    }

    const existingIndex = form.findIndex(item => item.itemId === option.id);
    if (existingIndex >= 0) {
      form[existingIndex].qty += selector.qty;
    } else {
      form.push({
        itemId: option.id,
        name: option.name,
        sku: option.sku,
        stockQuantity: option.stockQuantity,
        qty: selector.qty,
      });
    }

    selector.optionId = '';
    selector.qty = 1;
  };

  const removeItemFromForm = (form: ITransferStockFormItem[], itemId: string) => {
    const index = form.findIndex(item => item.itemId === itemId);
    if (index >= 0) {
      form.splice(index, 1);
    }
  };

  const handleTransferAddItem = () => addItemToForm(transferForm.items, transferItemSelector, inventoryItemOptions.value);
  const handleTransferRemoveItem = (itemId: string) => removeItemFromForm(transferForm.items, itemId);

  const handleRequestAddItem = () => addItemToForm(requestForm.items, requestItemSelector, inventoryItemOptions.value);
  const handleRequestRemoveItem = (itemId: string) => removeItemFromForm(requestForm.items, itemId);

  const refreshTransferItemOptions = async () => {
    if (!transferForm.storeToId) {
      emitToast('Please select a destination store first.', EToastType.WARNING);
      return;
    }

    await fetchInventoryItems(transferItemSelector.search || null);
  };

  const refreshRequestItemOptions = async () => {
    if (!currentStoreId.value) {
      emitToast('Current store is not available.', EToastType.DANGER);
      return;
    }

    await fetchInventoryItems(requestItemSelector.search || null);
  };

  const submitTransferForm = async () => {
    if (!transferForm.storeToId) {
      emitToast('Destination store is required.', EToastType.WARNING);
      return;
    }

    if (!transferForm.items.length) {
      emitToast('Please add at least one item.', EToastType.WARNING);
      return;
    }

    try {
      await transferStockStore.createTransfer({
        storeToId: transferForm.storeToId,
        note: transferForm.note || null,
        items: transferForm.items.map(item => ({
          itemId: item.itemId,
          qty: item.qty,
        })),
      });

      emitToast('Transfer stock created successfully.', EToastType.SUCCESS);
      closeCreateTransferDialog();
      await transferStockStore.fetchTransferList({ page: 1 });
      activeTab.value = 'transfer';
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const submitRequestForm = async () => {
    if (!currentStoreId.value) {
      emitToast('Current store is not available.', EToastType.DANGER);
      return;
    }

    if (!requestForm.items.length) {
      emitToast('Please add at least one item.', EToastType.WARNING);
      return;
    }

    try {
      await transferStockStore.createRequest({
        storeToId: currentStoreId.value,
        note: requestForm.note || null,
        items: requestForm.items.map(item => ({
          itemId: item.itemId,
          qty: item.qty,
        })),
      });

      emitToast('Request stock created successfully.', EToastType.SUCCESS);
      closeCreateRequestDialog();
      await transferStockStore.fetchRequestList({ page: 1 });
      activeTab.value = 'request';
    } catch (error) {
      // Error handled by interceptor
    }
  };

  return {
    // loading state
    transferStock_isLoading,
    transferStock_isSubmitting,
    inventoryItems_isLoading,

    // listing states
    activeTab,
    setActiveTab,
    displayedList,
    displayedMeta,
    displayedQuery,
    selectedRecord,
    selectRecord,
    refreshActiveList,
    handleTablePage,

    // dialogs and forms
    isCreateTransferDialogOpen,
    isCreateRequestDialogOpen,
    openCreateTransferDialog,
    closeCreateTransferDialog,
    openCreateRequestDialog,
    closeCreateRequestDialog,

    // form states
    transferForm,
    requestForm,
    transferItemSelector,
    requestItemSelector,
    storeOptions,
    outlet_isLoading,
    currentStoreName,
    inventoryItemOptions,
    resolveStoreName,

    // form actions
    handleTransferAddItem,
    handleTransferRemoveItem,
    handleRequestAddItem,
    handleRequestRemoveItem,
    refreshTransferItemOptions,
    refreshRequestItemOptions,
    submitTransferForm,
    submitRequestForm,
  };
};
