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
  reportName: string;
  storeName: string;
  storeAddress: string;
  staffMember: string;
  period: string;
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
    reportName: '',
    storeName: '',
    storeAddress: '',
    staffMember: '',
    period: '',
    printDate: '',
    printTime: '',
  }),
  columns: () => [],
  tableData: () => [],
});

// --- Smart Page Chunking Logic ---
const chunkedData = computed(() => {
  // --- Configuration Constants (Based on A4 paper dimensions) ---
  const PAGE_HEIGHT_PX = 1123; // Approx. height of an A4 page.
  const NAVBAR_HEIGHT = 95;
  const HEADER_HEIGHT = 233; // Height of the main report summary.
  const FOOTER_HEIGHT = 80;
  const TABLE_HEADER_HEIGHT = 40;
  const ROW_HEIGHT = 40; // Estimated height of a single table row.

  const chunks: any[][] = [];
  if (!props.tableData || props.tableData.length === 0) return [];

  // --- Calculate for Page 1 ---
  const firstPageContentHeight =
    PAGE_HEIGHT_PX - NAVBAR_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - TABLE_HEADER_HEIGHT;
  const rowsOnFirstPage = Math.floor(firstPageContentHeight / ROW_HEIGHT);

  if (props.tableData.length > 0) {
    const firstChunk = props.tableData.slice(0, rowsOnFirstPage);
    chunks.push(firstChunk);
  }

  // --- Calculate for Subsequent Pages ---
  const subsequentPagesContentHeight = PAGE_HEIGHT_PX - NAVBAR_HEIGHT - FOOTER_HEIGHT - TABLE_HEADER_HEIGHT;
  const rowsOnSubsequentPages = Math.floor(subsequentPagesContentHeight / ROW_HEIGHT);

  let currentIndex = rowsOnFirstPage;
  if (rowsOnSubsequentPages > 0) {
    while (currentIndex < props.tableData.length) {
      const nextChunk = props.tableData.slice(currentIndex, currentIndex + rowsOnSubsequentPages);
      chunks.push(nextChunk);
      currentIndex += rowsOnSubsequentPages;
    }
  }

  return chunks;
});
</script>

<template>
  <div id="pdf-template">
    <!-- 
      The main loop now renders a container for the page content,
      followed by a separate, dedicated page-break element.
    -->
    <template v-for="(chunk, index) in chunkedData" :key="index">
      <div
        class="page-container"
        style="position: relative; height: 1123px; display: flex; flex-direction: column"
      >
        <!-- Navbar (Repeats on every page) -->
        <div id="navbar" style="background-color: #ffefe8; padding: 24px 32px; border-bottom: 1px solid #f3631d">
          <img :src="APP_LOGO_BASE64" alt="KUBIXPOS Logo" style="width: 200px" />
        </div>

        <!-- Main Content Area -->
        <div id="content" style="padding: 0px 32px; flex-grow: 1">
          <!-- Report Header (First page only) -->
          <div
            v-if="index === 0"
            class="main-header-container"
            style="border-bottom: 1px solid #f3631d; padding: 16px; margin: 32px auto 0 auto; min-height: 201px"
          >
            <div
              style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px"
            >
              <div style="font-size: 16pt; font-weight: bold; color: #333333">{{ reportData.reportName }}</div>
              <h2 style="font-size: 12pt; font-weight: bold; color: #b7b7b7">{{ reportData.storeName }}</h2>
              <h2 style="font-size: 12pt; font-weight: bold; color: #333333">{{ reportData.storeAddress }}</h2>
              <h2 style="font-size: 12pt; font-weight: bold; color: #333333">
                Staff Member : {{ reportData.staffMember }}
              </h2>
              <h2 style="font-size: 10pt; color: #b7b7b7">
                Period : {{ reportData.period }} | Printed on {{ reportData.printDate }},
                {{ reportData.printTime }}
              </h2>
            </div>
          </div>

          <!-- Table for the current page/chunk -->
          <table style="width: 100%; border-collapse: collapse; font-size: 8pt; margin-top: 20px">
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
                <td
                  v-for="column in columns"
                  :key="column.value"
                  style="padding: 8px; text-align: center; border: 1px solid #ddd"
                >
                  {{ item[column.value] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 
          Footer is positioned absolutely at the bottom of each page container.
        -->
        <footer
          style="
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px 32px;
            font-size: 8pt;
            color: #888;
            border-top: 1px solid #eee;
          "
        >
          <p style="margin: 0; margin-right: 5px">Powered by</p>
          <img :src="APP_LOGO_BASE64" alt="KUBIXPOS Logo" style="height: 20px; vertical-align: middle" />
        </footer>
      </div>

      <!-- ✅ THIS IS THE FIX: A separate, empty element for the page break -->
      <!-- <div v-if="index === chunkedData.length - 1">
        <pre>{{ 'chunked data length : ' + chunkedData.length }}</pre>
        <pre>{{ 'index : ' + index }}</pre>
        <pre>{{ chunkedData }}</pre>
      </div> -->
    </template>
  </div>
</template>
