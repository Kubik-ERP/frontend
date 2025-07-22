// Vue
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

// Interface
import type { IInvoiceChunk, IInvoiceColor, IKitchenQueueProvided, IItem } from '../interfaces';

// Constant
import { INVOICE_ORDER_STATUS, KITCHEN_QUEUE_INVOICE } from '../constants/kitchen-queue-api.constant';

// Socket
import { useSocket } from '@/plugins/socket';

// Store
import { useOutletStore } from '@/modules/outlet/store';
import { useKitchenQueueStore } from '../store';

const { httpAbort_registerAbort } = useHttpAbort();

export const useKitchenQueue = (): IKitchenQueueProvided => {
  const store = useKitchenQueueStore(); // Instance of the store

  const storeOutlet = useOutletStore();

  const { kitchenQueue_invoices } = storeToRefs(store);

  const kitchenQueue_isLoading = ref(false);

  // Dummy refs to calculate invoice item heights
  const kitchenQueue_dummyRefs = ref<HTMLElement[]>([]);

  // Reactive column structure holding chunked invoices for rendering
  const kitchenQueue_columns = ref<IInvoiceChunk[][]>([]);

  // Reactive durations map to display elapsed time per invoice
  const kitchenQueue_durations = ref<Record<string, string>>({});

  // Interval ID for updating durations every second
  let kitchenQueue_intervalId: ReturnType<typeof setInterval> | null = null;

  // Scroll container reference for horizontal scrolling
  const kitchenQueue_scrollContainer = ref<HTMLElement | null>(null);

  // Meter value to track current page and total pages for horizontal scroll
  const kitchenQueue_meterValue = ref({
    meter: { value: 1, label: '', color: 'var(--p-primary-hover-color)' },
    max: 1,
  });

  const kitchenQueue_listTabs = ref<'orders' | 'order-history'>('orders');

  /**
   * Generate color config based on index
   * @param index - global index of the invoice
   * @returns object containing Tailwind classes for header, background, border, text
   */
  const kitchenQueue_generateColor = (status: string): IInvoiceColor => {
    const headerColor = ['bg-[#0F3C56]', 'bg-[#782A5A]'];
    const backgroundColor = ['bg-[#EDF6FC]', 'bg-[#FFFFF]'];
    const borderColor = ['border-[#8CC8EB]', 'border-[#E0A8CB]'];

    switch (status.toUpperCase()) {
      case 'PLACED':
        return {
          background: backgroundColor[0],
          header: headerColor[0],
          border: borderColor[0],
          text: 'text-gray-900',
        };
      case 'IN_PROGRESS':
        return {
          background: backgroundColor[1],
          header: headerColor[1],
          border: borderColor[1],
          text: 'text-gray-700',
        };
      case 'COMPLETED':
        return {
          background: backgroundColor[1],
          header: headerColor[1],
          border: borderColor[1],
          text: 'text-gray-700',
        };
      default:
        return {
          background: 'bg-gray-200',
          header: 'bg-gray-500',
          border: 'border-gray-300',
          text: 'text-gray-600',
        };
    }
  };

  /**
   * Generate color classes for status chips
   * @param status - current status of the invoice
   * @returns Tailwind classes for chip background and text color
   */
  const kitchenQueue_generateChipColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'PLACED':
        return 'text-primary border-primary hover:bg-primary hover:text-white';
      case 'IN_PROGRESS':
        return 'text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white';
      case 'COMPLETED':
        return 'text-success border-success hover:bg-success hover:text-white';
      default:
        return 'text-gray-500 border-gray-500 hover:bg-gray-500 hover:text-white';
    }
  };

  /**
   * Format elapsed duration from a given startTime
   * @param startTime - Date object to calculate duration from
   * @returns formatted time string like "00:10:02" or "1 day 03h"
   */
  const kitchenQueue_formatDuration = (startTime: Date | string): string => {
    const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
    const now = Date.now();
    const diffSec = Math.floor((now - start.getTime()) / 1000);

    const s = diffSec % 60;
    const m = Math.floor(diffSec / 60) % 60;
    const h = Math.floor(diffSec / 3600) % 24;
    const d = Math.floor(diffSec / (3600 * 24));

    const pad = (n: number) => n.toString().padStart(2, '0');
    return d > 0 ? `${d}day ${pad(h)}h` : `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  /**
   * Main logic to split invoice queues into chunks, arrange them in columns, and initialize durations
   */
  const kitchenQueue_chunkInvoices = async () => {
    kitchenQueue_dummyRefs.value = [];

    await nextTick();

    const navbar = document.getElementById('kitchen-queue-navbar');
    const navControl = document.getElementById('kitchen-queue-nav-control');

    const navBarHeight = navbar?.getBoundingClientRect().height || 0;
    const navControlHeight = navControl?.getBoundingClientRect().height || 0;

    const screenHeight = window.innerHeight;
    const headerHeight = 110;
    const padding = 64;
    const availableHeight = screenHeight - navBarHeight - navControlHeight - padding;

    const itemHeights = kitchenQueue_dummyRefs.value.map(el => el?.getBoundingClientRect().height + 4 || 60);

    let offset = 0;
    let globalCounter = 1;
    const invoiceChunks: IInvoiceChunk[] = [];
    const invoicePageMap: Record<string, number> = {};

    // Loop through each invoice and chunk its items
    for (const invoice of kitchenQueue_invoices.value) {
      const currentHeights = itemHeights.slice(offset, offset + invoice.queues.length);
      const chunks: IItem[][] = [];
      let currentChunk: IItem[] = [];
      let currentHeight = 0;

      for (let i = 0; i < invoice.queues.length; i++) {
        const height = currentHeights[i] + (currentChunk.length > 0 ? 6 : 0);
        if (currentHeight + height > availableHeight) {
          chunks.push(currentChunk);
          currentChunk = [];
          currentHeight = 0;
        }
        currentChunk.push(invoice.queues[i]);
        currentHeight += height;
      }
      if (currentChunk.length) chunks.push(currentChunk);

      invoicePageMap[invoice.queueReferenceId] = chunks.length;

      // Convert chunks to chunk metadata format
      for (let idx = 0; idx < chunks.length; idx++) {
        const chunk = chunks[idx];
        const totalHeight = chunk.reduce((acc, _, i) => acc + currentHeights[i] + (i > 0 ? 2 : 0), 0);

        invoiceChunks.push({
          ...invoice,
          items: chunk,
          height: totalHeight,
          invoiceId: invoice.invoiceId,
          indexCounter: idx,
          globalIndex: idx > 0 ? globalCounter - 1 : globalCounter,
          totalPage: chunks.length,
          isFirst: idx === 0,
        });

        if (idx === 0) globalCounter = globalCounter + 1;
      }

      offset += invoice.queues.length;
    }

    // Distribute invoice chunks into columns
    kitchenQueue_columns.value = [];
    const colHeights: number[] = [];
    let currentCol = 0;

    for (const chunk of invoiceChunks) {
      const height = chunk.indexCounter > 0 ? chunk.height : chunk.height + headerHeight + 4;

      if (kitchenQueue_columns.value[currentCol] && colHeights[currentCol] + height > availableHeight) {
        currentCol = currentCol + 1;
      }

      if (!kitchenQueue_columns.value[currentCol]) {
        kitchenQueue_columns.value[currentCol] = [];
        colHeights[currentCol] = 0;
      }

      kitchenQueue_columns.value[currentCol].push(chunk);
      colHeights[currentCol] += height;
    }

    // Set durations initially
    kitchenQueue_invoices.value.forEach(invoice => {
      kitchenQueue_durations.value[invoice.queueReferenceId] = kitchenQueue_formatDuration(invoice.createdAt);
    });

    // Set interval to update durations every 1 second
    kitchenQueue_intervalId = setInterval(() => {
      kitchenQueue_invoices.value.forEach(invoice => {
        kitchenQueue_durations.value[invoice.queueReferenceId] = kitchenQueue_formatDuration(invoice.createdAt);
      });
    }, 1000);
  };

  /**
   * Fetch invoices from the store and chunk them for rendering
   */
  const kitchenQueue_fetchInvoices = async () => {
    try {
      await store.kitchenQueue_list(
        {},
        {
          ...httpAbort_registerAbort(KITCHEN_QUEUE_INVOICE),
        },
      );
      kitchenQueue_chunkInvoices();
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    }
  };

  /**
   * Handle horizontal scrolling for the kitchen queue
   * @param event - scroll event
   * @param type - direction of scroll ('left' or 'right')
   */
  const kitchenQueue_handleScrollHorizontal = (direction: 'left' | 'right') => {
    if (!kitchenQueue_scrollContainer.value) return;

    const el = kitchenQueue_scrollContainer.value;
    const scrollAmount = el.clientWidth;

    if (direction === 'left') {
      el.scrollLeft -= scrollAmount;
    } else {
      el.scrollLeft += scrollAmount;
    }

    // Delay to allow scroll to finish
    setTimeout(kitchenQueue_updateScrollPosition, 300);
  };

  /**
   * Update scroll position and meter value after rendering
   * This is called after the component is mounted and whenever the scroll position changes
   */
  const kitchenQueue_updateScrollPosition = async () => {
    await nextTick();

    setTimeout(() => {
      if (!kitchenQueue_scrollContainer.value) return;

      const el = kitchenQueue_scrollContainer.value;

      const totalPage = Math.ceil(el.scrollWidth / el.clientWidth) - 1;
      const currentPage = Math.floor(el.scrollLeft / el.clientWidth) + 1;

      kitchenQueue_meterValue.value.meter.value = currentPage;
      kitchenQueue_meterValue.value.max = totalPage;
    }, 200);
  };

  const kitchenQueue_handleNextStatus = (
    status: 'placed' | 'in_progress' | 'completed',
  ): 'placed' | 'in_progress' | 'completed' => {
    switch (status) {
      case 'placed':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      case 'completed':
        return 'placed';
      default:
        return 'placed';
    }
  };

  /**
   * Handle status change for an invoice
   * @param invoice - the invoice object to update
   * @param newStatus - new status to set
   */
  const kitchenQueue_handleDebounceUpdateStatus = (
    queueReferenceId: string,
    invoiceId: string,
    queueId: string,
    status: string,
    columnData: {
      index: number;
      itemIndex: number;
    }
  ) => {
    kitchenQueue_handleUpdateStatus(
      queueReferenceId,
      invoiceId,
      queueId,
      kitchenQueue_handleNextStatus(status as 'placed' | 'in_progress' | 'completed'),
      columnData,
    );
  };

  /**
   * Handle refreshing the view after an update
   * This is used to ensure the UI reflects the latest data after an update
   */
  const kitchenQueue_handleRefreshView = async () => {
    kitchenQueue_isLoading.value = true;

    await nextTick();

    await new Promise(resolve => setTimeout(resolve, 20));

    await kitchenQueue_chunkInvoices();

    kitchenQueue_isLoading.value = false;
  };

  /**
   * Update the status of a queue item in bulk
   * @param queueReferenceId - reference ID of the queue
   * @param queues - array of queue items to update
   * @param requestConfigurations - Axios request configurations
   */
  const kitchenQueue_handleStatusQueue = async (index: number) => {
    const invoice = store.kitchenQueue_invoices[index];
    const itemStatuses = invoice.queues.map(item => item.product.orderStatus);

    let newStatus: 'placed' | 'in_progress' | 'completed' = 'placed';

    if (itemStatuses.every(status => status === 'completed')) {
      newStatus = 'completed';
    } else if (itemStatuses.some(status => status === 'in_progress' || status === 'completed')) {
      newStatus = 'in_progress';
    }

    if (invoice.orderStatus === newStatus) return;

    await store.kitchenQueue_updateStatusInvoice(invoice.invoiceId, newStatus, {
      ...httpAbort_registerAbort(`${INVOICE_ORDER_STATUS}/${invoice.invoiceId}`),
    });

    invoice.orderStatus = newStatus;

    // kitchenQueue_columns.value[index].forEach(chunk => {
    //   chunk.orderStatus = newStatus;

    //   chunk.queues.forEach(item => {
    //     item.product.orderStatus = newStatus;
    //   });
    // });
  };
  /**
   * Update the status of an invoice in the kitchen queue
   * @param invoiceId - ID of the invoice to update
   * @param queueId - ID of the queue item
   * @param orderStatus - new status to set
   * @param index - index of the item in the invoice
   */
  const kitchenQueue_handleUpdateStatus = async (
    queueReferenceId: string,
    invoiceId: string,
    queueId: string,
    orderStatus: 'placed' | 'in_progress' | 'completed',
    columnData: {
      index: number;
      itemIndex: number;
    }
  ) => {
    try {
      // Find the invoice in the state and update its status
      const index = store.kitchenQueue_invoices.findIndex(
        invoice => invoice.queueReferenceId === queueReferenceId && invoice.invoiceId === invoiceId,
      );

      if (index !== -1) {
        store.kitchenQueue_invoices[index].queues.forEach(item => {
          if (item.id === queueId) {
            item.product.orderStatus = orderStatus;
          }
        });

        kitchenQueue_handleStatusQueue(index);
      }

      await store.kitchenQueue_updateStatusQueue(queueReferenceId, invoiceId, queueId, orderStatus, {
        ...httpAbort_registerAbort(`${KITCHEN_QUEUE_INVOICE}/${queueId}`),
      });

      kitchenQueue_columns.value[columnData.index][columnData.itemIndex].orderStatus = orderStatus;
    } catch (error) {
      console.error('Failed to update invoice status:', error);
    }
  };

  /**
   * Bulk update the status of multiple invoices in the kitchen queue
   * @param invoiceId - ID of the invoice to update
   * @param queues - array of queues to update
   */
  const kitchenQueue_handleUpdateStatusBulk = async (queueReferenceId: string, queues: IItem[]) => {
    try {
      kitchenQueue_isLoading.value = true;

      const index = store.kitchenQueue_invoices.findIndex(
        invoice => invoice.queueReferenceId === queueReferenceId,
      );

      if (index !== -1) {
        kitchenQueue_handleStatusQueue(index);
      }

      const mappedItems = queues.map(item => ({
        ...item,
        orderStatus: kitchenQueue_handleNextStatus(item.product.orderStatus),
      }));

      await store.kitchenQueue_updateStatusQueueBulk(queueReferenceId, mappedItems, {
        ...httpAbort_registerAbort(KITCHEN_QUEUE_INVOICE),
      });

      await kitchenQueue_handleRefreshView();
    } catch (error) {
      console.error('Failed to update invoices status:', error);
    } finally {
      kitchenQueue_isLoading.value = false;
    }
  };

  // Socket connection for real-time updates
  const socket = useSocket();

  /**
   * @description Subscribe to payment events
   * @returns void
   */
  const subscribe = async () => {
    const store = storeOutlet.outlet_currentOutlet;

    if (!store?.id) return;

    socket.emit('subscribe-new-order', store.id);

    socket.on('new-order-incoming', async (data: { storeId: string; message: string }) => {
      if (data.storeId === store.id) {
        await kitchenQueue_fetchInvoices();

        await kitchenQueue_handleRefreshView();
      }
    });
  };

  /**
   * @description Unsubscribe from payment events
   * @returns void
   */
  const unsubscribe = () => {
    const storeId = storeOutlet.outlet_currentOutlet;

    if (!storeId?.id) return;
    socket.emit('unsubscribe-new-order', storeId);

    socket.off('new-order-incoming');
  };

  onBeforeUnmount(() => {
    if (kitchenQueue_intervalId) clearInterval(kitchenQueue_intervalId);
  });

  onMounted(async () => {
    kitchenQueue_isLoading.value = true;

    await kitchenQueue_updateScrollPosition();

    await kitchenQueue_fetchInvoices();

    kitchenQueue_isLoading.value = false;

    subscribe();
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return {
    kitchenQueue_invoices,
    kitchenQueue_isLoading,
    kitchenQueue_dummyRefs,
    kitchenQueue_columns,
    kitchenQueue_durations,
    kitchenQueue_scrollContainer,
    kitchenQueue_meterValue,
    kitchenQueue_listTabs,
    kitchenQueue_generateColor,
    kitchenQueue_generateChipColor,
    kitchenQueue_handleScrollHorizontal,
    kitchenQueue_updateScrollPosition,
    kitchenQueue_handleDebounceUpdateStatus,
    kitchenQueue_handleUpdateStatus,
    kitchenQueue_handleUpdateStatusBulk,
  };
};
