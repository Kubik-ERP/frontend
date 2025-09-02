<script setup lang="ts"></script>

<template>
  <section id="self-order-not-valid" class="flex items-center justify-center h-screen bg-gray-100 text-gray-800">
    <div class="flex flex-col items-center justify-center h-full gap-4">
      <AppBaseSvg name="cashier" class="!w-14 !h-14 text-gray-400" />
      <div class="text-center flex flex-col gap-2">
        <p class="text-lg text-gray-500">The URL you accessed is not valid</p>
        <p class="text-base text-gray-400">
          Please scan the QR code again. If you still see this page, kindly inform the restaurant staff.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
