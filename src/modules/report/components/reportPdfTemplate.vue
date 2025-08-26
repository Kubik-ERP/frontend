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
  tableData: any[];
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

const chunkedData = computed(() => {
  // --- Configuration Constants (Adjust these to fine-tune your layout) ---
  const PAGE_HEIGHT_LIMIT = 800; // You may need to adjust this limit
  const NAVBAR_HEIGHT = 80; // ✅ Approx. height of your blue navbar
  const HEADER_HEIGHT = 150; // Approx. height of your main report header
  const ROW_BASE_HEIGHT = 30; // The height of a single-line row
  const CHARS_PER_LINE = 40; // Approx. characters per line in a cell
  const LINE_WRAP_HEIGHT = 15; // Extra height for wrapped lines

  const chunks = [];
  if (!props.tableData || props.tableData.length === 0) return [];

  let currentPageRows: any[] = [];
  // ✅ Start with the height of the navbar AND the main header for page 1
  let currentPageHeight = NAVBAR_HEIGHT + HEADER_HEIGHT;

  props.tableData.forEach(item => {
    let rowHeight = ROW_BASE_HEIGHT;
    props.columns.forEach(column => {
      const cellContent = String(item[column.value] || '');
      if (cellContent.length > CHARS_PER_LINE) {
        rowHeight += Math.floor(cellContent.length / CHARS_PER_LINE) * LINE_WRAP_HEIGHT;
      }
    });

    if (currentPageHeight + rowHeight > PAGE_HEIGHT_LIMIT && currentPageRows.length > 0) {
      chunks.push(currentPageRows);
      currentPageRows = [];
      // ✅ Subsequent pages start with only the navbar's height
      currentPageHeight = NAVBAR_HEIGHT;
    }

    currentPageRows.push(item);
    currentPageHeight += rowHeight;
  });

  if (currentPageRows.length > 0) {
    chunks.push(currentPageRows);
  }

  return chunks;
});
</script>

<template>
  <div id="pdf-template">
    <div v-for="(chunk, index) in chunkedData" :key="index">
      <div id="navbar" style="background-color: #18618b; padding: 24px 32px">
        <img :src="APP_LOGO_BASE64" alt="KUBIXPOS Logo" style="width: 200px" />
      </div>

      <div id="content" style="padding: 0px 32px; /* ... other content styles ... */">
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
      </div>

      <div v-if="index < chunkedData.length - 1" style="page-break-after: always"></div>
    </div>
  </div>
</template>
