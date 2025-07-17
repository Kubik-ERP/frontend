<script setup lang="ts"></script>
<template>
  <section id="kitchen-queue-loading">
    <div class="flex gap-6 max-w-screen max-h-screen">
      <div v-for="item in 5" :key="item" class="flex flex-col gap-5 p-5">
        <div v-for="child in 2" :key="child" class="p-5">
          <div class="rounded p-6">
            <div class="flex mb-4">
              <PrimeVueSkeleton shape="circle" size="4rem" class="mr-2"></PrimeVueSkeleton>
              <div>
                <PrimeVueSkeleton width="10rem" class="mb-2"></PrimeVueSkeleton>
                <PrimeVueSkeleton width="5rem" class="mb-2"></PrimeVueSkeleton>
                <PrimeVueSkeleton height=".5rem"></PrimeVueSkeleton>
              </div>
            </div>
            <PrimeVueSkeleton width="100%" height="150px"></PrimeVueSkeleton>
            <div class="flex justify-between mt-4">
              <PrimeVueSkeleton width="4rem" height="2rem"></PrimeVueSkeleton>
              <PrimeVueSkeleton width="4rem" height="2rem"></PrimeVueSkeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
