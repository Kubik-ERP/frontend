<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed } from 'vue';
// Constants
import { APP_LOGO_BASE64 } from '@/app/constants';

// --- Component Props ---
interface IColumn {
  label: string;
  value: string;
}

interface ISummaryData {
  staffName: string;
  storeName: string;
  reportName: string;
  printDate: string;
  printTime: string;
}

interface IProps {
  reportData: ISummaryData;
  columns: IColumn[];

  tableData: any[]; // The component accepts the full, flat array
}

const props = withDefaults(defineProps<IProps>(), {
  reportData: () => ({
    staffName: '',
    storeName: '',
    reportName: '',
    printDate: '',
    printTime: '',
  }),
  columns: () => [],
  tableData: () => [],
});

// --- Automatic Page Calculation Logic ---
const chunkedData = computed(() => {
  // --- Configuration Constants (Adjust these to fine-tune your layout) ---
  const PAGE_HEIGHT_LIMIT = 750; // Approx. height in pixels for the content area of one page.
  const HEADER_HEIGHT = 150; // Approx. height of your main report header (on the first page).
  const ROW_BASE_HEIGHT = 30; // The height of a single-line row.
  const CHARS_PER_LINE = 40; // Approx. characters per line in a cell before text wraps.
  const LINE_WRAP_HEIGHT = 15; // Extra height to add for each wrapped line.

  const chunks = [];
  if (!props.tableData || props.tableData.length === 0) return [];

  let currentPageRows: any[] = [];
  // Start with the main header height for the first page
  let currentPageHeight = HEADER_HEIGHT;

  props.tableData.forEach(item => {
    // Estimate the height of the current row
    let rowHeight = ROW_BASE_HEIGHT;
    props.columns.forEach(column => {
      const cellContent = String(item[column.value] || '');
      // If cell content is long, add extra height for wrapped lines
      if (cellContent.length > CHARS_PER_LINE) {
        rowHeight += Math.floor(cellContent.length / CHARS_PER_LINE) * LINE_WRAP_HEIGHT;
      }
    });

    // If adding this row would exceed the page limit, start a new page
    if (currentPageHeight + rowHeight > PAGE_HEIGHT_LIMIT && currentPageRows.length > 0) {
      chunks.push(currentPageRows); // Finish the current page
      currentPageRows = []; // Start a new page
      currentPageHeight = 0; // Subsequent pages don't have the main header
    }

    currentPageRows.push(item);
    currentPageHeight += rowHeight;
  });

  // Add the last remaining page
  if (currentPageRows.length > 0) {
    chunks.push(currentPageRows);
  }

  return chunks;
});
</script>

<template>
  <div
    id="pdf-template"
    style="
      font-family: 'Inter', Helvetica, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #333333;
      background-color: #ffffff;
      width: 100%;
      margin: 0 auto;
      padding: 0;
      box-sizing: border-box;
    "
  >
    <div id="navbar" style="background-color: #18618b; padding: 24px 32px">
      <img :src="APP_LOGO_BASE64" alt="KUBIXPOS Logo" style="width: 200px" />
    </div>

    <div
      id="content"
      style="
        color: #333333;
        background-color: #ffffff;
        width: 100%;
        margin: 0 auto;
        padding: 0px 32px;
        box-sizing: border-box;
        color: #333333;
      "
    >
      <div v-for="(chunk, index) in chunkedData" :key="index">
        <div
          v-if="index === 0"
          class="main-header-container"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid #8cc8eb;
            border-radius: 4px;
            padding: 16px;
            margin: 32px auto 0 auto;
            background-color: #ffffff;
          "
        >
          <div style="text-align: center">
            <div style="font-size: 24px; font-weight: bolder; color: #333333">
              {{ reportData.reportName }}
            </div>
            <h2 style="font-size: 16px; font-weight: bold; color: #333333">
              {{ reportData.storeName }}
            </h2>
            <div style="font-size: 14px; color: #333333">
              Printed on {{ reportData.printDate }}, {{ reportData.printTime }}
            </div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 8pt">
          <thead>
            <tr>
              <th
                v-for="column in columns"
                :key="column.value"
                style="
                  padding: 8px;
                  border: 1px solid #ddd;
                  text-align: center;
                  font-weight: bold;
                  background-color: #f2f2f2;
                "
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, itemIndex) in chunk" :key="itemIndex">
              <td v-for="column in columns" :key="column.value" style="padding: 8px; border: 1px solid #ddd">
                {{ item[column.value] }}
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="index < chunkedData.length - 1" style="page-break-after: always"></div>
      </div>
    </div>
  </div>
</template>
