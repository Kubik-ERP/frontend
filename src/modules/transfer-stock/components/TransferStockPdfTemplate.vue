<script setup lang="ts">
// Constants
import { APP_LOGO_BASE64 } from '@/app/constants';

// Interfaces
interface IsuratJalanData {
  id: string;
  transferDate: string;
  receivedDate: string;
  senderInfo: {
    name: string;
    address: string;
    phoneNumber: string;
  };
  receiverInfo: {
    name: string;
    address: string;
    phoneNumber: string;
  };
  transferStockItems: Array<{
    itemInfo: {
      sku: string;
      name: string;
      brandName: string;
      unit: string;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

interface IProps {
  suratJalanData: IsuratJalanData;
}

withDefaults(defineProps<IProps>(), {
  suratJalanData: () => ({
    id: '',
    transferDate: '',
    receivedDate: '',
    senderInfo: {
      name: '',
      address: '',
      phoneNumber: '',
    },
    receiverInfo: {
      name: '',
      address: '',
      phoneNumber: '',
    },
    transferStockItems: [],
  }),
});
</script>

<template>
  <div
    id="surat-jalan-pdf-template"
    class="relative aspect-[210/297] w-full"
    style="
      font-family: 'Inter', Helvetica, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #333333;

      width: 100%;
      margin: 0 auto;
      padding: 0;
      box-sizing: border-box;
    "
  >
    <div id="navbar" style="background-color: #ffefe8; padding: 24px 32px; border-bottom: 1px solid #f3631d">
      <img :src="APP_LOGO_BASE64" alt="KUBIXPOS Logo" style="width: 200px" />
    </div>

    <div
      id="content"
      style="
        color: #333333;

        width: 100%;
        margin: 0 auto;
        padding: 32px;
        box-sizing: border-box;
      "
    >
      <!-- Header Section -->
      <div style="text-align: center; margin-bottom: 32px">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 8px 0; color: #333333">Transfer Stock</h1>
        <h2 style="font-size: 16px; font-weight: 600; margin: 0; color: #333333">
          {{ suratJalanData.id }}
        </h2>
      </div>

      <!-- Order Information -->
      <div class="w-full">
        <div class="flex items-center justify-between gap-4 w-full">
          <div
            class="w-full"
            style="border: 1px solid #f3631d; border-radius: 4px; padding: 24px; margin-bottom: 32px"
          >
            <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0; color: #333333">
              Sender Information
            </h3>

            <table style="width: 100%; font-size: 14px; border-collapse: collapse">
              <tbody>
                <tr>
                  <td style="width: 50%; font-weight: normal; padding: 4px 0">Name</td>
                  <td style="width: 5%; text-align: center; padding: 4px 0">:</td>
                  <td style="font-weight: normal; padding: 4px 0">
                    {{ suratJalanData.senderInfo.name }}
                  </td>
                </tr>
                <tr>
                  <td style="font-weight: normal; padding: 4px 0">Departure Date</td>
                  <td style="text-align: center; padding: 4px 0">:</td>
                  <td style="padding: 4px 0">
                    {{
                      suratJalanData.transferDate ? useFormatDate(suratJalanData.transferDate, 'dd/mm/yyyy') : '-'
                    }}
                  </td>
                </tr>
                <tr>
                  <td style="font-weight: normal; padding: 4px 0">Sender Address</td>
                  <td style="text-align: center; padding: 4px 0">:</td>
                  <td style="padding: 4px 0">{{ suratJalanData.senderInfo.address || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            class="w-full"
            style="border: 1px solid #f3631d; border-radius: 4px; padding: 24px; margin-bottom: 32px"
          >
            <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0; color: #333333">
              Receiver Information
            </h3>

            <table style="width: 100%; font-size: 14px; border-collapse: collapse">
              <tbody>
                <tr>
                  <td style="width: 50%; font-weight: normal; padding: 4px 0">Name</td>
                  <td style="width: 5%; text-align: center; padding: 4px 0">:</td>
                  <td style="font-weight: normal; padding: 4px 0">
                    {{ suratJalanData.senderInfo.name }}
                  </td>
                </tr>
                <tr>
                  <td style="font-weight: normal; padding: 4px 0">Arrived Date</td>
                  <td style="text-align: center; padding: 4px 0">:</td>
                  <td style="padding: 4px 0">
                    {{
                      suratJalanData.receivedDate ? useFormatDate(suratJalanData.receivedDate, 'dd/mm/yyyy') : '-'
                    }}
                  </td>
                </tr>
                <tr>
                  <td style="font-weight: normal; padding: 4px 0">Receiver Address</td>
                  <td style="text-align: center; padding: 4px 0">:</td>
                  <td style="padding: 4px 0">{{ suratJalanData.senderInfo.address || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Items Table -->
      <div style="border: 1px solid #f3631d; border-radius: 4px; padding: 24px; margin-bottom: 32px">
        <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0; color: #333333">Items</h3>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px">
          <thead>
            <tr style="border-bottom: 2px solid #e5e7eb">
              <th style="text-align: left; padding: 8px 4px; font-weight: 600; color: #374151">SKU</th>
              <th style="text-align: left; padding: 8px 4px; font-weight: 600; color: #374151">Item Name</th>
              <th style="text-align: left; padding: 8px 4px; font-weight: 600; color: #374151">Brand</th>
              <th style="text-align: left; padding: 8px 4px; font-weight: 600; color: #374151">Unit</th>
              <th style="text-align: right; padding: 8px 4px; font-weight: 600; color: #374151">Qty</th>
              <th style="text-align: right; padding: 8px 4px; font-weight: 600; color: #374151">Unit Price</th>
              <th style="text-align: right; padding: 8px 4px; font-weight: 600; color: #374151">Total Price</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in suratJalanData.transferStockItems"
              :key="index"
              style="border-bottom: 1px solid #f3f4f6"
            >
              <td style="padding: 8px 4px; color: #374151">{{ item.itemInfo.sku || '-' }}</td>
              <td style="padding: 8px 4px; color: #374151">{{ item.itemInfo.name || '-' }}</td>
              <td style="padding: 8px 4px; color: #374151">{{ item.itemInfo.brandName || '-' }}</td>
              <td style="padding: 8px 4px; color: #374151">{{ item.itemInfo.unit || '-' }}</td>
              <td style="padding: 8px 4px; text-align: right; color: #374151">{{ item.quantity || 0 }}</td>
              <td style="padding: 8px 4px; text-align: right; color: #374151; font-family: 'Inter', monospace">
                {{ useCurrencyFormat({ data: item.unitPrice || 0, hidePrefix: true, addSuffix: true }) }}
              </td>
              <td style="padding: 8px 4px; text-align: right; color: #374151; font-family: 'Inter', monospace">
                {{ useCurrencyFormat({ data: item.totalPrice || 0, hidePrefix: true, addSuffix: true }) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="border-top: 2px solid #e5e7eb">
              <td colspan="6" style="padding: 12px 4px; text-align: right; font-weight: 600; color: #374151">
                Total Price:
              </td>
              <td
                style="
                  padding: 12px 4px;
                  text-align: right;
                  font-weight: 600;
                  color: #374151;
                  font-family: 'Inter', monospace;
                "
              >
                {{
                  useCurrencyFormat({
                    data: suratJalanData.transferStockItems.reduce((a, b) => a + b.totalPrice, 0) || 0,
                    hidePrefix: true,
                    addSuffix: true,
                  })
                }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Signatures Section -->
      <section style="margin-top: 48px">
        <table style="width: 100%; border-collapse: collapse">
          <tbody>
            <tr>
              <td style="width: 33%; text-align: center; vertical-align: top">
                <div style="margin-bottom: 80px">
                  <div style="font-weight: 600; margin-bottom: 4px">Send by:</div>
                  <!-- <div style="font-size: 12px; color: #6b7280">Staff</div> -->
                </div>
                <div style="border-top: 1px solid #333; width: 150px; margin: 0 auto; padding-top: 8px">
                  <div style="font-size: 12px">Name & Signature</div>
                </div>
              </td>
              <td style="width: 33%; text-align: center; vertical-align: top">
                <div style="margin-bottom: 80px">
                  <div style="font-weight: 600; margin-bottom: 4px">Delivered by:</div>
                  <!-- <div style="font-size: 12px; color: #6b7280">supplier</div> -->
                </div>
                <div style="border-top: 1px solid #333; width: 150px; margin: 0 auto; padding-top: 8px">
                  <div style="font-size: 12px">Name & Signature</div>
                </div>
              </td>
              <td style="width: 33%; text-align: center; vertical-align: top">
                <div style="margin-bottom: 80px">
                  <div style="font-weight: 600; margin-bottom: 4px">Received by:</div>
                  <!-- <div style="font-size: 12px; color: #6b7280">Receiver</div> -->
                </div>
                <div style="border-top: 1px solid #333; width: 150px; margin: 0 auto; padding-top: 8px">
                  <div style="font-size: 12px">Name & Signature</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- Footer -->
    <footer
      style="
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        text-align: center;
        padding: 16px 32px;
        font-size: 12px;
        color: #6b7280;
        border-top: 1px solid #e5e7eb;
      "
    >
      <div>Thank you for using KUBIK</div>
      <div style="margin-top: 4px">Generated on {{ useFormatDate(new Date(), 'dd/mm/yyyy HH:mm') }}</div>
    </footer>
  </div>
</template>
