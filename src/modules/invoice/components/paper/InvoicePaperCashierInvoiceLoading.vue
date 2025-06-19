<template>
  <section
    id="invoice-cashier-invoice-loading"
    class="invoice-paper bg-white flex flex-col items-center gap-2 w-full max-w-xs lg:max-w-md p-4"
  >
    <PrimeVueSkeleton
      class="w-20 h-20 bg-grayscale-10"
      width="80px"
      height="80px"
      shape="circle"
    ></PrimeVueSkeleton>
    <PrimeVueSkeleton class="w-32 h-6 bg-grayscale-10" width="128px" height="24px"></PrimeVueSkeleton>
    <PrimeVueSkeleton class="w-64 h-4 bg-grayscale-10" width="256px" height="16px"></PrimeVueSkeleton>
    <PrimeVueSkeleton class="w-64 h-4 bg-grayscale-10" width="256px" height="16px"></PrimeVueSkeleton>
    <div class="invoice-datetime-or-status">
      <div class="invoice-datetime-or-status-content">
        <span class="date">
          <PrimeVueSkeleton width="80px" height="16px"></PrimeVueSkeleton>
        </span>
        <span class="cashier">
          <PrimeVueSkeleton width="120px" height="16px"></PrimeVueSkeleton>
        </span>
      </div>
    </div>
    <section
      v-for="index in 10"
      id="cashier-information"
      :key="index"
      class="flex items-center justify-between w-full"
    >
      <PrimeVueSkeleton width="80px" height="16px"></PrimeVueSkeleton>
      <PrimeVueSkeleton width="120px" height="16px"></PrimeVueSkeleton>
    </section>
  </section>
</template>

<style scoped>
.invoice-datetime-or-status {
  position: relative;
  width: 100%;
  font-family: 'Inter', monospace; /* Ensures uniform spacing */
  font-size: 12px;
}

.invoice-datetime-or-status::before {
  content: '====================================================';
  display: block;
  text-align: center;
  color: #000;
}

.invoice-datetime-or-status::after {
  content: '====================================================';
  display: block;
  text-align: center;
  color: #000;
}

@media (max-width: 1024px) {
  .invoice-datetime-or-status::before {
    content: '====================================';
  }

  .invoice-datetime-or-status::after {
    content: '====================================';
  }
}

/* Content styling with flexbox for alignment */
.invoice-datetime-or-status-content {
  display: flex;
  justify-content: space-between; /* Pushes date and cashier to opposite ends */
}
</style>
