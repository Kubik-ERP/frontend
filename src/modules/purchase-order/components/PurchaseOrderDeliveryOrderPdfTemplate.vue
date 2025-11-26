<script setup lang="ts">
import { useOutletStore } from '@/modules/outlet/store';
import { storeToRefs } from 'pinia';

// Constants
import { APP_BASE_BUCKET_URL } from '@/app/constants';
const { outlet_currentOutlet } = storeToRefs(useOutletStore());

// Interfaces
interface IDeliveryOrderData {
  orderNumber: string;
  supplierInfo: {
    supplierName: string;
  };
  orderDate: string;
  deliveryDate: string;
  purchaseOrderItems: Array<{
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
  totalPrice: number;
  receiver: {
    id: string;
    fullname: string;
  };
}

interface IProps {
  deliveryOrderData: IDeliveryOrderData;
}

withDefaults(defineProps<IProps>(), {
  deliveryOrderData: () => ({
    orderNumber: '',
    supplierInfo: {
      supplierName: '',
    },
    orderDate: '',
    deliveryDate: '',
    purchaseOrderItems: [],
    totalPrice: 0,
    receiver: {
      id: '',
      fullname: '',
    },
  }),
});
</script>

<template>
  <div
    id="delivery-order-pdf-template"
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
    <div id="navbar" style="background-color: #f3631d; padding: 24px 32px; display: flex; align-items: center">
      <img
        :src="outlet_currentOutlet && outlet_currentOutlet.photo ? APP_BASE_BUCKET_URL + outlet_currentOutlet.photo : ''"
        :alt="outlet_currentOutlet?.name"
        style="width: 48px; height: 48px; object-fit: cover; margin-right: 16px; border-radius: 0px;"
      />
      <h1 style="font-size: 20px; font-weight: bold; margin: 0; color: #ffffff">{{ outlet_currentOutlet?.name }}</h1>
    </div>
    <p style="font-size: large; padding: 10px; margin-top: 10px; margin-bottom: 10px; text-align: center; font-weight: bold; color: #333333">
    </p>
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
        <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 8px 0; color: #333333">Delivery Order</h1>
        <h2 style="font-size: 16px; font-weight: 600; margin: 0; color: #333333">
          {{ deliveryOrderData.orderNumber }}
        </h2>
      </div>

      <!-- Order Information -->
      <div
        style="
          border: 1px solid #8cc8eb;
          border-radius: 4px;
          padding: 24px;
          margin-bottom: 32px;
          background-color: #ffffff;
        "
      >
        <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0; color: #333333">Order Information</h3>

        <table style="width: 100%; font-size: 14px; border-collapse: collapse">
          <tbody>
            <tr>
              <td style="width: 25%; font-weight: normal; padding: 4px 0">Supplier</td>
              <td style="width: 5%; text-align: center; padding: 4px 0">:</td>
              <td style="font-weight: normal; padding: 4px 0">
                {{ deliveryOrderData.supplierInfo.supplierName }}
              </td>
            </tr>
            <tr>
              <td style="font-weight: normal; padding: 4px 0">Order Date</td>
              <td style="text-align: center; padding: 4px 0">:</td>
              <td style="padding: 4px 0">
                {{ deliveryOrderData.orderDate ? useFormatDate(deliveryOrderData.orderDate, 'dd/mm/yyyy') : '-' }}
              </td>
            </tr>
            <tr>
              <td style="font-weight: normal; padding: 4px 0">Delivery Date</td>
              <td style="text-align: center; padding: 4px 0">:</td>
              <td style="padding: 4px 0">
                {{
                  deliveryOrderData.deliveryDate
                    ? useFormatDate(deliveryOrderData.deliveryDate, 'dd/mm/yyyy')
                    : '-'
                }}
              </td>
            </tr>
            <tr>
              <td style="font-weight: normal; padding: 4px 0">Receiver</td>
              <td style="text-align: center; padding: 4px 0">:</td>
              <td style="padding: 4px 0">{{ deliveryOrderData.receiver.fullname || '-' }}</td>
            </tr>
            <tr>
              <td style="font-weight: normal; padding: 4px 0">Delivery Address</td>
              <td style="text-align: center; padding: 4px 0">:</td>
              <td style="padding: 4px 0">{{ deliveryOrderData.supplierInfo.supplierName || '-' }}</td>
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
              v-for="(item, index) in deliveryOrderData.purchaseOrderItems"
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
                  useCurrencyFormat({ data: deliveryOrderData.totalPrice || 0, hidePrefix: true, addSuffix: true })
                }}
              </td>
            </tr>
          </tfoot>
        </table>
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
                  <div style="font-size: 12px; color: #6b7280">Supplier</div>
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
      <div style="margin-top: 4px">Generated on {{ useFormatDate(new Date(), 'dd/mm/yyyy HH:mm') }}</div>
    </div>
  </div>
</template>
