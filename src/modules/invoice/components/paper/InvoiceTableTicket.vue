<script setup lang="ts"></script>
<template>
  <section
    id="table-ticket"
    class="invoice-paper bg-white flex text-sm flex-col items-center gap-2 w-full max-w-xs lg:max-w-md p-4"
  >
    <div class="invoice-name">
      <span class="font-bold w-full flex justify-center">George</span>
      <span class="w-full flex justify-center text-[10px]">Table Checker</span>
    </div>

    <section id="cashier-information" class="flex items-center justify-between w-full">
      <p id="label-cashier" class="font-normal text-black text-sm">Order Date</p>
      <p id="cashier-name" class="font-normal text-black text-sm">01/08/2024 18:33</p>
    </section>

    <section id="cashier-information" class="flex items-center justify-between w-full">
      <p id="label-cashier" class="font-normal text-black text-sm">Invoice Number</p>
      <p id="cashier-name" class="font-normal text-black text-sm">202408010001</p>
    </section>

    <section id="cashier-information" class="flex items-center justify-between w-full">
      <p id="label-cashier" class="font-normal text-black text-sm">Staff</p>
      <p id="cashier-name" class="font-normal text-black text-sm">Samantha</p>
    </section>

    <section id="cashier-information" class="flex items-center justify-between w-full">
      <p id="label-cashier" class="font-normal text-black text-sm">Order Type</p>
      <p id="cashier-name" class="font-normal text-black text-sm">Dine In</p>
    </section>

    <table id="product-items" class="w-full">
      <thead>
        <tr class="border-y border-dashed border-black py-2">
          <th class="font-normal text-black text-sm text-start w-28 py-2">Qty</th>
          <th class="font-normal text-black text-sm text-start py-2">Order Item</th>
        </tr>
      </thead>

      <tbody class="border-b border-solid border-black">
        <tr>
          <td class="text-black text-sm py-2 align-top font-bold w-28">1x</td>
          <td class="text-black text-sm py-2">
            <div class="flex flex-col font-bold">
              <span> Blurberry Pancake </span>
              <span> 1x Additional +1 Cup Sugar </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.invoice-name {
  position: relative;
  width: 100%;
  font-family: 'Inter', monospace; /* Ensures uniform spacing */
  font-size: 12px;
}

.invoice-name::after {
  content: '===================================================='; /* Adjust length as needed */
  display: block;
  text-align: center;
  color: #000; /* Adjust color */
}

@media (max-width: 1024px) {
  .invoice-name::after {
    content: '====================================';
  }
}
</style>
