<script setup lang="ts"></script>
<template>
  <section
    id="kitchen-invoice"
    class="invoice-paper bg-white flex text-xs flex-col items-center gap-2 w-full max-w-xs lg:max-w-md p-4"
  >
    <div class="invoice-name">
      <span class="font-bold w-full flex justify-center text-sm">George</span>
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

    <div class="border-y py-2 border-dashed w-full">
      <span class="font-bold w-full flex justify-center">BEVERAGE</span>
    </div>

    <table id="product-items" class="w-full">
      <tbody>
        <tr>
          <td class="text-black text-sm py-2 font-bold align-top">1x</td>
          <td class="text-black text-sm text-left py-2 pl-10">
            <div class="flex flex-col font-bold">
              <span> Blurberry Pancake </span>
              <span> 1x Additional +1 Cup Sugar </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="border-y py-2 border-dashed w-full">
      <span class="font-bold w-full flex justify-center">FOOD</span>
    </div>

    <table id="product-items" class="w-full">
      <tbody>
        <tr>
          <td class="text-black text-sm py-2 font-bold align-top">1x</td>
          <td class="text-black text-sm text-left py-2 pl-10">
            <div class="flex flex-col font-bold">
              <span> Butter Oyster </span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="text-black text-sm py-2 font-bold align-top">1x</td>
          <td class="text-black text-sm text-left py-2 pl-10">
            <div class="flex flex-col font-bold">
              <span> Gyoza </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="border-y py-2 border-dashed w-full">
      <span class="font-bold w-full flex justify-center">DRINK</span>
    </div>

    <table id="product-items" class="w-full">
      <tbody>
        <tr>
          <td class="text-black text-sm py-2 font-bold align-top">1x</td>
          <td class="text-black text-sm text-left py-2 pl-10">
            <div class="flex flex-col font-bold">
              <span> Coffee Latte </span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="text-black text-sm py-2 font-bold align-top">1x</td>
          <td class="text-black text-sm text-left py-2 pl-10">
            <div class="flex flex-col font-bold">
              <span> Mocktail </span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="text-black text-sm py-2 font-bold align-top">1x</td>
          <td class="text-black text-sm text-left py-2 pl-10">
            <div class="flex flex-col font-bold">
              <span> Ice Lemonade </span>
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
