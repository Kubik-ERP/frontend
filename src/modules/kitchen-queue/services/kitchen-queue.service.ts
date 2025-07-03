// Vue
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

// Constant
import { originalInvoices, randomOffset } from '../constants';

// Interface
import type { IInvoice, IInvoiceChunk, IInvoiceItem, IInvoiceColor, IKitchenQueueProvided } from '../interfaces';

export const useKitchenQueue = (): IKitchenQueueProvided => {
  // Timestamp for now, used to simulate invoice start time
  const kitchenQueue_now = Date.now();

  // Dummy refs to calculate invoice item heights
  const kitchenQueue_dummyRefs = ref<HTMLElement[]>([]);

  // Reactive column structure holding chunked invoices for rendering
  const kitchenQueue_columns = ref<IInvoiceChunk[][]>([]);

  // Reactive durations map to display elapsed time per invoice
  const kitchenQueue_durations = ref<Record<string, string>>({});

  // Reactive invoice list with randomized startTime
  const kitchenQueue_invoices: IInvoice[] = originalInvoices.map(invoice => ({
    ...invoice,
    startTime: new Date(kitchenQueue_now - randomOffset()),
  }));

  // Interval ID for updating durations every second
  let kitchenQueue_intervalId: ReturnType<typeof setInterval> | null = null;

  /**
   * Generate color config based on index
   * @param index - global index of the invoice
   * @returns object containing Tailwind classes for header, background, border, text
   */
  const kitchenQueue_generateColor = (index: number): IInvoiceColor => {
    const headerColor = ['bg-[#0F3C56]', 'bg-[#782A5A]'];
    const backgroundColor = ['bg-[#EDF6FC]', 'bg-[#FFFFF]'];
    const borderColor = ['border-[#8CC8EB]', 'border-[#E0A8CB]'];

    const i = index % headerColor.length;
    return {
      background: backgroundColor[i],
      header: headerColor[i],
      border: borderColor[i],
      text: i % 2 === 0 ? 'text-gray-900' : 'text-gray-700',
    };
  };

  /**
   * Format elapsed duration from a given startTime
   * @param startTime - Date object to calculate duration from
   * @returns formatted time string like "00:10:02" or "1 day 03h"
   */
  const kitchenQueue_formatDuration = (startTime: Date): string => {
    const now = Date.now();
    const diffSec = Math.floor((now - startTime.getTime()) / 1000);

    const s = diffSec % 60;
    const m = Math.floor(diffSec / 60) % 60;
    const h = Math.floor(diffSec / 3600) % 24;
    const d = Math.floor(diffSec / (3600 * 24));

    const pad = (n: number) => n.toString().padStart(2, '0');
    return d > 0 ? `${d} day ${pad(h)}h` : `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  /**
   * Main logic to split invoice items into chunks, arrange them in columns, and initialize durations
   */
  const KitchenQueue_chunkInvoices = async () => {
    await nextTick();

    const navbar = document.getElementById('kitchen-queue-navbar');
    const navControl = document.getElementById('kitchen-queue-nav-control');

    const navBarHeight = navbar?.getBoundingClientRect().height || 0;
    const navControlHeight = navControl?.getBoundingClientRect().height || 0;

    const screenHeight = window.innerHeight;
    const headerHeight = 72;
    const padding = 64;
    const availableHeight = screenHeight - navBarHeight - navControlHeight - padding;

    const itemHeights = kitchenQueue_dummyRefs.value.map(el => el?.getBoundingClientRect().height + 2 || 60);

    let offset = 0;
    let globalCounter = 1;
    const invoiceChunks: IInvoiceChunk[] = [];
    const invoicePageMap: Record<string, number> = {};

    // Loop through each invoice and chunk its items
    for (const invoice of kitchenQueue_invoices) {
      const currentHeights = itemHeights.slice(offset, offset + invoice.items.length);
      const chunks: IInvoiceItem[][] = [];
      let currentChunk: IInvoiceItem[] = [];
      let currentHeight = 0;

      for (let i = 0; i < invoice.items.length; i++) {
        const height = currentHeights[i] + (currentChunk.length > 0 ? 2 : 0);
        if (currentHeight + height > availableHeight) {
          chunks.push(currentChunk);
          currentChunk = [];
          currentHeight = 0;
        }
        currentChunk.push(invoice.items[i]);
        currentHeight += height;
      }
      if (currentChunk.length) chunks.push(currentChunk);

      invoicePageMap[invoice.id] = chunks.length;

      // Convert chunks to chunk metadata format
      for (let idx = 0; idx < chunks.length; idx++) {
        const chunk = chunks[idx];
        const totalHeight = chunk.reduce((acc, _, i) => acc + currentHeights[i] + (i > 0 ? 8 : 0), 0);

        invoiceChunks.push({
          ...invoice,
          items: chunk,
          height: totalHeight,
          invoiceId: invoice.id,
          indexCounter: idx,
          globalIndex: idx > 0 ? globalCounter - 1 : globalCounter,
          totalPage: chunks.length,
          isFirst: idx === 0,
        });

        if (idx === 0) globalCounter = globalCounter + 1;
      }

      offset += invoice.items.length;
    }

    // Distribute invoice chunks into columns
    kitchenQueue_columns.value = [];
    const colHeights: number[] = [];
    let currentCol = 0;

    for (const chunk of invoiceChunks) {
      const height = chunk.indexCounter > 0 ? chunk.height : chunk.height + headerHeight + 16;

      if (!kitchenQueue_columns.value[currentCol]) {
        kitchenQueue_columns.value[currentCol] = [];
        colHeights[currentCol] = 0;
      }

      if (colHeights[currentCol] + height > availableHeight) {
        currentCol = currentCol + 1;
        kitchenQueue_columns.value[currentCol] = [];
        colHeights[currentCol] = 0;
      }

      kitchenQueue_columns.value[currentCol].push(chunk);
      colHeights[currentCol] += height;
    }

    // Set durations initially
    kitchenQueue_invoices.forEach(invoice => {
      kitchenQueue_durations.value[invoice.id] = kitchenQueue_formatDuration(invoice.startTime);
    });

    // Set interval to update durations every 1 second
    kitchenQueue_intervalId = setInterval(() => {
      kitchenQueue_invoices.forEach(invoice => {
        kitchenQueue_durations.value[invoice.id] = kitchenQueue_formatDuration(invoice.startTime);
      });
    }, 1000);
  };

  onMounted(() => {
    KitchenQueue_chunkInvoices();
  });

  onBeforeUnmount(() => {
    if (kitchenQueue_intervalId) clearInterval(kitchenQueue_intervalId);
  });

  return {
    kitchenQueue_invoices,
    kitchenQueue_dummyRefs,
    kitchenQueue_columns,
    kitchenQueue_durations,
    kitchenQueue_generateColor,
  };
};
