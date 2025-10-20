<script setup lang="ts">
import { useRoundingService } from '../services/setting-rounding.service';

const {
  settingRounding_isEnabled,
  settingRounding_roundingType,
  settingRounding_roundingValue,
  settingRounding_handleIncrement,
  settingRounding_handleDecrement,
} = useRoundingService();
</script>
<template>
  <section id="setting-rounding" class="flex flex-col gap-4">
    <header class="flex items-center gap-4 w-full">
      <h5 class="font-semibold text-black text-lg">Pembulatan Pembayaran</h5>

      <PrimeVueToggleSwitch v-model:model-value="settingRounding_isEnabled" />
    </header>

    <PrimeVueCard class="w-full border border-solid border-grayscale-20 shadow-none">
      <template #content>
        <section id="form">
          <div class="mt-4">
            <div class="flex gap-4">
              <PrimeVueButton
                class="flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 border-none"
                :class="{
                  'bg-primary text-white': settingRounding_roundingType === 'up',
                  'bg-white hover:bg-primary hover:text-white text-black': settingRounding_roundingType !== 'up',
                }"
                @click="settingRounding_roundingType = 'up'"
              >
                <div class="flex gap-2 items-center">
                  <span>Pembulatan ke Atas</span>

                  <span class="pi pi-arrow-up"></span>
                </div>
              </PrimeVueButton>
              <PrimeVueButton
                class="flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 border-none"
                :class="{
                  'bg-primary text-white': settingRounding_roundingType === 'down',
                  'bg-white hover:bg-primary hover:text-white text-black': settingRounding_roundingType !== 'down',
                }"
                @click="settingRounding_roundingType = 'down'"
              >
                <div class="flex gap-2 items-center">
                  <span>Pembulatan ke Bawah</span>

                  <span class="pi pi-arrow-down"></span>
                </div>
              </PrimeVueButton>
            </div>

            <div class="mt-4">
              <label for="rounding-amount" class="block text-sm font-medium text-gray-700"
                >Jumlah Pembulatan</label
              >
              <div class="mt-1 w-full flex gap-2">
                <PrimeVueButton
                  icon="pi pi-minus"
                  class="border-none bg-primary px-6"
                  @click="settingRounding_handleDecrement"
                />
                <PrimeVueInputNumber
                  id="rounding-amount"
                  v-model="settingRounding_roundingValue"
                  class="mt-1 rounded-md w-full"
                  placeholder="Masukkan kelipatan (contoh: 10, 100, 1000)"
                  button-layout="horizontal"
                >
                </PrimeVueInputNumber>
                <PrimeVueButton
                  icon="pi pi-plus"
                  class="border-none bg-primary px-6"
                  @click="settingRounding_handleIncrement"
                />
              </div>
            </div>
          </div>
        </section>

        <div class="bg-secondary text-black px-4 py-3 rounded-md mt-4 flex gap-2">
          <AppBaseSvg name="info-secondary" class="filter-white-color mt-1 h-6 w-6" />
          <p>
            Sistem akan otomatis mengecek nominal Total Pembayaran untuk dibulatkan.
            <br />
            <b>Round up</b> akan membulatkan nominal yang kurang dari Rounding Target menjadi Rounding Target.
            Contoh, Jika Rounding Target bernilai 100 maka Total Pembayaran 9050,5 akan dibulatkan menjadi 9100.
            <br />
            <b>Round down</b> akan membulatkan nominal yang kurang dari Rounding Target menjadi 0. Contoh, jika
            Rounding Target bernilai 100 maka Total Pembayaran 9050,5 akan dibulatkan menjadi 9000.
          </p>
        </div>
      </template>
    </PrimeVueCard>
  </section>
</template>
