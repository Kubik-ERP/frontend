<script setup lang="ts">
// Constants
import { APP_LOGO_BASE64 } from '@/app/constants';

// Interfaces
interface TransferStockShippingDocumentPdfData {
  transactionCode: string;
  storeFrom: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
  storeTo: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
  shippedAt: string | Date | null;
  trackingNumber: string | null;
  logisticProvider: string | null;
  deliveryNote: string | null;
  transferStockItems: Array<{
    id: string;
    masterInventoryItems: {
      sku: string;
      name: string;
      unit: string;
    };
    qtyReserved: number;
    unitPrice: unknown;
    subtotal: unknown;
  }>;
  note?: string;
}

/**
 * @description Props
 */
defineProps<{
  shippingDocumentData: TransferStockShippingDocumentPdfData;
}>();

/**
 * @description Helper functions for currency formatting
 */
const formatCurrency = (value: unknown): string => {
  if (!value) return useCurrencyFormat({ data: 0, hidePrefix: true, addSuffix: true });
  
  // Handle Decimal.js format
  if (typeof value === 'object' && value !== null && 's' in value && 'e' in value && 'd' in value) {
    const decimalValue = value as { s: number; e: number; d: number[] };
    const sign = decimalValue.s || 1;
    const digits = decimalValue.d || [0];
    const exponent = decimalValue.e || 0;
    
    let numValue = 0;
    for (let i = 0; i < digits.length; i++) {
      numValue = numValue * 10 + digits[i];
    }
    numValue = numValue * sign * Math.pow(10, exponent - digits.length + 1);
    
    return useCurrencyFormat({ data: numValue, hidePrefix: true, addSuffix: true });
  }
  
  return useCurrencyFormat({ data: typeof value === 'number' ? value : 0, hidePrefix: true, addSuffix: true });
};
</script>

<template>
  <div
    id="transfer-stock-shipping-document-pdf"
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
        padding: 32px;
        box-sizing: border-box;
      "
    >
      <!-- Header Section -->
      <div style="text-align: center; margin-bottom: 32px">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 8px 0; color: #333333">Transfer Shipping Document</h1>
        <h2 style="font-size: 16px; font-weight: 600; margin: 0; color: #333333">
          {{ shippingDocumentData.transactionCode }}
        </h2>
      </div>

      <!-- Store Information -->
      <div style="margin-bottom: 32px">
        <table style="width: 100%; border-collapse: collapse">
          <tbody>
            <tr>
              <td style="width: 50%; vertical-align: top; padding-right: 16px">
                <div
                  style="
                    border: 1px solid #8cc8eb;
                    border-radius: 4px;
                    padding: 16px;
                    background-color: #ffffff;
                  "
                >
                  <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0; color: #333333">From Store</h3>
                  <div style="font-size: 13px">
                    <div style="font-weight: 600; margin-bottom: 4px">{{ shippingDocumentData.storeFrom.name }}</div>
                    <div style="color: #6b7280; margin-bottom: 2px">{{ shippingDocumentData.storeFrom.address }}</div>
                    <div style="color: #6b7280">
                      {{ shippingDocumentData.storeFrom.city }} {{ shippingDocumentData.storeFrom.postalCode }}
                    </div>
                  </div>
                </div>
              </td>
              <td style="width: 50%; vertical-align: top; padding-left: 16px">
                <div
                  style="
                    border: 1px solid #8cc8eb;
                    border-radius: 4px;
                    padding: 16px;
                    background-color: #ffffff;
                  "
                >
                  <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0; color: #333333">To Store</h3>
                  <div style="font-size: 13px">
                    <div style="font-weight: 600; margin-bottom: 4px">{{ shippingDocumentData.storeTo.name }}</div>
                    <div style="color: #6b7280; margin-bottom: 2px">{{ shippingDocumentData.storeTo.address }}</div>
                    <div style="color: #6b7280">
                      {{ shippingDocumentData.storeTo.city }} {{ shippingDocumentData.storeTo.postalCode }}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Shipping Details -->
      <div
        style="
          border: 1px solid #8cc8eb;
          border-radius: 4px;
          padding: 24px;
          margin-bottom: 32px;
          background-color: #ffffff;
        "
      >
        <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0; color: #333333">Shipping Information</h3>

        <table style="width: 100%; font-size: 14px; border-collapse: collapse">
          <tbody>
            <tr>
              <td style="width: 25%; font-weight: normal; padding: 4px 0">Shipped Date</td>
              <td style="width: 5%; text-align: center; padding: 4px 0">:</td>
              <td style="font-weight: normal; padding: 4px 0">
                {{
                  shippingDocumentData.shippedAt
                    ? useFormatDate(String(shippingDocumentData.shippedAt), 'dd/mm/yyyy')
                    : '-'
                }}
              </td>
            </tr>
            <tr>
              <td style="font-weight: normal; padding: 4px 0">Tracking Number</td>
              <td style="text-align: center; padding: 4px 0">:</td>
              <td style="padding: 4px 0">{{ shippingDocumentData.trackingNumber || '-' }}</td>
            </tr>
            <tr>
              <td style="font-weight: normal; padding: 4px 0">Logistic Provider</td>
              <td style="text-align: center; padding: 4px 0">:</td>
              <td style="padding: 4px 0">{{ shippingDocumentData.logisticProvider || '-' }}</td>
            </tr>
            <tr>
              <td style="font-weight: normal; padding: 4px 0">Delivery Notes</td>
              <td style="text-align: center; padding: 4px 0">:</td>
              <td style="padding: 4px 0">{{ shippingDocumentData.deliveryNote || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Items Table -->
      <div
        style="
          border: 1px solid #8cc8eb;
          border-radius: 4px;
          padding: 24px;
          margin-bottom: 32px;
          background-color: #ffffff;
        "
      >
        <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0; color: #333333">Transfer Items</h3>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px">
          <thead>
            <tr style="border-bottom: 2px solid #e5e7eb">
              <th style="text-align: left; padding: 8px 4px; font-weight: 600; color: #374151">SKU</th>
              <th style="text-align: left; padding: 8px 4px; font-weight: 600; color: #374151">Item Name</th>
              <th style="text-align: left; padding: 8px 4px; font-weight: 600; color: #374151">Unit</th>
              <th style="text-align: right; padding: 8px 4px; font-weight: 600; color: #374151">Qty</th>
              <th style="text-align: right; padding: 8px 4px; font-weight: 600; color: #374151">Unit Price</th>
              <th style="text-align: right; padding: 8px 4px; font-weight: 600; color: #374151">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in shippingDocumentData.transferStockItems"
              :key="item.id"
              style="border-bottom: 1px solid #f3f4f6"
            >
              <td style="padding: 8px 4px; color: #374151">{{ item.masterInventoryItems.sku || '-' }}</td>
              <td style="padding: 8px 4px; color: #374151">{{ item.masterInventoryItems.name || '-' }}</td>
              <td style="padding: 8px 4px; color: #374151">{{ item.masterInventoryItems.unit || '-' }}</td>
              <td style="padding: 8px 4px; text-align: right; color: #374151">{{ item.qtyReserved || 0 }}</td>
              <td style="padding: 8px 4px; text-align: right; color: #374151; font-family: 'Inter', monospace">
                {{ formatCurrency(item.unitPrice) }}
              </td>
              <td style="padding: 8px 4px; text-align: right; color: #374151; font-family: 'Inter', monospace">
                {{ formatCurrency(item.subtotal) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Notes Section -->
      <div
        v-if="shippingDocumentData.note"
        style="
          border: 1px solid #8cc8eb;
          border-radius: 4px;
          padding: 24px;
          margin-bottom: 32px;
          background-color: #ffffff;
        "
      >
        <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 12px 0; color: #333333">Notes</h3>
        <p style="margin: 0; color: #6b7280; font-size: 13px">{{ shippingDocumentData.note }}</p>
      </div>

      <!-- Signatures Section -->
      <div style="margin-top: 48px">
        <table style="width: 100%; border-collapse: collapse">
          <tbody>
            <tr>
              <td style="width: 33%; text-align: center; vertical-align: top">
                <div style="margin-bottom: 80px">
                  <div style="font-weight: 600; margin-bottom: 4px">Prepared by:</div>
                  <div style="font-size: 12px; color: #6b7280">Staff</div>
                </div>
                <div style="border-top: 1px solid #333; width: 150px; margin: 0 auto; padding-top: 8px">
                  <div style="font-size: 12px">Name & Signature</div>
                </div>
              </td>
              <td style="width: 33%; text-align: center; vertical-align: top">
                <div style="margin-bottom: 80px">
                  <div style="font-weight: 600; margin-bottom: 4px">Delivered by:</div>
                  <div style="font-size: 12px; color: #6b7280">Courier</div>
                </div>
                <div style="border-top: 1px solid #333; width: 150px; margin: 0 auto; padding-top: 8px">
                  <div style="font-size: 12px">Name & Signature</div>
                </div>
              </td>
              <td style="width: 33%; text-align: center; vertical-align: top">
                <div style="margin-bottom: 80px">
                  <div style="font-weight: 600; margin-bottom: 4px">Received by:</div>
                  <div style="font-size: 12px; color: #6b7280">Receiver</div>
                </div>
                <div style="border-top: 1px solid #333; width: 150px; margin: 0 auto; padding-top: 8px">
                  <div style="font-size: 12px">Name & Signature</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div
      style="
        text-align: center;
        padding: 16px 32px;
        font-size: 12px;
        color: #6b7280;
        border-top: 1px solid #e5e7eb;
      "
    >
      <div>Thank you for using KUBIK</div>
      <div style="margin-top: 4px">Generated on {{ useFormatDate(new Date(), 'dd/mm/yyyy HH:mm') }}</div>
    </div>
  </div>
</template>
