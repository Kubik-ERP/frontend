<script setup lang="ts">
// Script setup tetap sama, tidak ada perubahan
interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  summaryData: Record<string, any>;
}

withDefaults(defineProps<IProps>(), {
  summaryData: () => ({}),
});
</script>

<template>
  <div id="pdf-template" style="font-family: sans-serif; padding: 2rem; color: #1f2937; background-color: #ffffff">
    <h1 style="font-size: 1.875rem; font-weight: 700; text-align: center; color: #1e40af; margin-bottom: 2rem">
      KUBIK
    </h1>
    <p style="text-align: center; margin-bottom: 0.5rem">
      Here's the register summary for the shift closed on
      {{ summaryData.closeRegisterDate }} at {{ summaryData.storeName }}
    </p>

    <div style="border: 1px solid #d1d5db; padding: 1.5rem">
      <h2 style="text-align: center; font-weight: 700; font-size: 1.25rem; margin-bottom: 0.25rem">
        {{ summaryData.storeName }}
      </h2>
      <p style="text-align: center; font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem">
        Register Summary
        <br />
        Printed on {{ summaryData.printDate }}, {{ summaryData.printTime }}
      </p>

      <table style="width: 100%; font-size: 0.875rem; margin-bottom: 1.5rem">
        <tbody>
          <tr>
            <td style="padding-right: 1rem">Staff</td>
            <td style="padding-right: 0.5rem">:</td>
            <td style="font-weight: 600">{{ summaryData.staffName }}</td>
          </tr>
          <tr>
            <td style="padding-right: 1rem">Open On</td>
            <td style="padding-right: 0.5rem">:</td>
            <td>{{ summaryData.openRegisterDate }}, {{ summaryData.openRegisterTime }}</td>
          </tr>
          <tr>
            <td style="padding-right: 1rem">Closed On</td>
            <td style="padding-right: 0.5rem">:</td>
            <td>{{ summaryData.closeRegisterDate }}, {{ summaryData.closeRegisterTime }}</td>
          </tr>
        </tbody>
      </table>

      <table style="width: 100%; font-size: 0.875rem; margin-bottom: 1.5rem">
        <tbody>
          <tr v-for="(item, key) in summaryData.financials" :key="key">
            <td style="padding-top: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb">
              {{ item.label }}
            </td>
            <td
              style="
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid #e5e7eb;
                text-align: right;
              "
            >
              {{ useCurrencyFormat({ data: item.value, hidePrefix: true, addSuffix: true }) }}
            </td>
          </tr>
        </tbody>
      </table>

      <h3 style="font-weight: 700; margin-bottom: 0.5rem">Payment Breakdown</h3>
      <table style="width: 100%; font-size: 0.875rem">
        <tbody>
          <tr v-for="(item, key) in summaryData.paymentBreakdown" :key="key">
            <td style="padding-top: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb">
              {{ item.label }}
            </td>
            <td
              style="
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid #e5e7eb;
                text-align: right;
              "
            >
              {{ useCurrencyFormat({ data: item.value, hidePrefix: true, addSuffix: true }) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="text-align: center; margin-top: 2rem">
      <p style="margin-bottom: 1rem">You can download the full register report here:</p>
      <a
        href="#"
        style="
          background-color: #1d4ed8;
          color: #ffffff;
          font-weight: 700;
          padding: 0.5rem 1.5rem;
          border-radius: 0.25rem;
          text-decoration: none;
        "
        >Download Report</a
      >
      <p style="margin-top: 1rem">Thank you</p>
    </div>
  </div>
</template>
