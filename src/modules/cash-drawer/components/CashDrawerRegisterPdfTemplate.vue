<script setup lang="ts">
// Constants
import { APP_LOGO_BASE64 } from '@/app/constants';

// Script setup tetap sama, tidak ada perubahan
interface ISummaryData {
  financials: Array<{
    label: string;
    value: number;
  }>;
  paymentBreakdown: Array<{
    label: string;
    value: number;
  }>;
  openRegisterDate: string;
  staffName: string;
  closeRegisterDate: string;
  storeName: string;
  printDate: string;
  printTime: string;
}

interface IProps {
  summaryData: ISummaryData;
}

withDefaults(defineProps<IProps>(), {
  summaryData: () => ({
    financials: [],
    paymentBreakdown: [],
    openRegisterDate: '',
    staffName: '',
    closeRegisterDate: '',
    storeName: '',
    printDate: '',
    printTime: '',
  }),
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
      /* max-width: 210mm; */
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
        padding: 32px;
        box-sizing: border-box;
        color: #333333;
      "
    >
      <p style="font-size: 16px; line-height: 20px">
        Here’s the register summary for the shift closed on {{ summaryData.openRegisterDate }} at
        {{ summaryData.storeName }}
      </p>

      <!-- Main Content Container -->
      <div
        style="
          border: 1px solid #8cc8eb;
          border-radius: 4px;
          padding: 16px;
          margin: 32px 72px 0 72px;
          background-color: #ffffff;
        "
      >
        <!-- Store Info Header -->
        <div style="text-align: center">
          <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 5px 0; color: #333333">
            {{ summaryData.storeName }}
          </h2>
          <div style="font-size: 14px; color: #333333">
            Register Summary<br />
            Printed on {{ summaryData.printDate }}, {{ summaryData.printTime }}
          </div>
        </div>

        <!-- Shift Information -->
        <div style="border-bottom: 1px solid #d9d9d9; padding: 24px 0">
          <table style="width: 100%; font-size: 14px; border-collapse: collapse">
            <tbody>
              <tr>
                <td style="width: 25%; font-weight: normal">Staff</td>
                <td style="width: 5%; text-align: center">:</td>
                <td style="font-weight: bold">{{ summaryData.staffName }}</td>
              </tr>
              <tr>
                <td style="font-weight: normal">Open On</td>
                <td style="text-align: center">:</td>
                <td style="">{{ summaryData.openRegisterDate }}</td>
              </tr>
              <tr>
                <td style="font-weight: normal">Closed On</td>
                <td style="text-align: center">:</td>
                <td style="">{{ summaryData.closeRegisterDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Financial Summary -->
        <div style="border-bottom: 1px solid #d9d9d9; padding: 24px 0">
          <table style="width: 100%; font-size: 14px; border-collapse: collapse">
            <tbody>
              <tr v-for="(item, key) in summaryData.financials" :key="key">
                <td style="font-weight: normal">
                  {{ item.label }}
                </td>
                <td
                  style="padding: 4px 0; text-align: right; font-weight: normal; font-family: 'Inter', monospace"
                >
                  {{ useCurrencyFormat({ data: item.value, hidePrefix: true, addSuffix: true }) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Payment Breakdown -->
        <div style="margin-bottom: 10px">
          <h3 style="font-size: 14px; font-weight: 600; color: #333333">Payment Breakdown</h3>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse">
            <tbody>
              <tr v-for="(item, key) in summaryData.paymentBreakdown" :key="key">
                <td style="font-weight: normal">
                  {{ item.label }}
                </td>
                <td
                  style="padding: 4px 0; text-align: right; font-weight: normal; font-family: 'Inter', monospace"
                >
                  {{ useCurrencyFormat({ data: item.value, hidePrefix: true, addSuffix: true }) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Footer Section -->
    <!-- <div style="text-align: left; padding: 0px 32px; font-size: 16px; color: #333333; page-break-before: always">
      <div style="margin-bottom: 16px">You can download the full register report from the system</div>
      <div
        style="
          display: inline-block;
          padding: 0px 16px;
          background-color: #18618b;
          border-radius: 8px;
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
          line-height: 18px;
          height: 34px;
        "
      >
        Download Full Report
      </div>
      <div style="margin-top: 15px; font-style: italic">Thank you for using KUBIK</div>
    </div> -->
  </div>
</template>
