<script setup lang="ts">
// Interfaces
import type { IAuthenticationConnectDeviceProvided } from '../interfaces';

/**
 * @description Injected variables
 */
const authenticationConnectDevice = inject<IAuthenticationConnectDeviceProvided>('authenticationConnectDevice');

/**
 * @description Destructure all the data and methods what we need
 */
const {
  authenticationConnectDevice_formData,
  authenticationConnectDevice_formValidations,
  authenticationConnectDevice_isLoading,
  authenticationConnectDevice_isNotAuthenticated,
  authenticationConnectDevice_onSubmit,
} = authenticationConnectDevice!;
</script>

<template>
  <form @submit.prevent="authenticationConnectDevice_onSubmit">
    <section
      id="authentication-connect-device-content"
      class="default-wrapper items-center justify-center max-w-md lg:max-w-2xl px-6 md:px-0 gap-6"
    >
      <section id="box-icon" class="bg-primary-background w-20 h-20 p-2 rounded-full">
        <section
          id="inner-box"
          class="bg-blue-secondary-background flex items-center justify-center w-full h-full p-1 rounded-full"
        >
          <AppBaseSvg name="device" class="w-10 h-10" />
        </section>
      </section>

      <!-- Title -->
      <h4 class="font-bold text-2xl text-black">Enter Device Code to Connect for POS Connection</h4>

      <!-- Device Code Input -->
      <div class="w-full">
        <PrimeVueInputText
          v-model="authenticationConnectDevice_formData.deviceCode"
          placeholder="Enter Device Code"
          :class="[
            'border border-solid font-bold text-2xl text-text-primary uppercase text-center w-full placeholder:font-normal placeholder:text-2xl placeholder:text-text-disabled placeholder:text-center placeholder:capitalize px-3 py-4 rounded-lg',
            authenticationConnectDevice_formValidations.deviceCode.$error
              ? 'border-red-500'
              : 'border-grayscale-30',
          ]"
        />
        <div
          v-if="authenticationConnectDevice_formValidations.deviceCode.$error"
          class="text-red-500 text-sm mt-1"
        >
          Device code is required
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="authenticationConnectDevice_isNotAuthenticated"
        class="w-full p-3 bg-red-50 border border-red-200 rounded-lg"
      >
        <p class="text-red-600 text-sm">
          Invalid email or device code. Please check your credentials and try again.
        </p>
      </div>

      <PrimeVueMessage class="w-full">
        <section id="content" class="flex gap-1">
          <section
            id="inner-box"
            class="bg-blue-secondary-background flex items-center justify-center w-6 h-6 p-1 rounded-full"
          >
            <AppBaseSvg name="device" class="w-4 h-4" />
          </section>

          <section id="message" class="flex flex-col">
            <h6 class="font-semibold text-base text-black">How I can get the device code?</h6>

            <p class="font-normal text-base text-primary">
              You can find it in the POS Backoffice under Device Settings.
            </p>
          </section>
        </section>
      </PrimeVueMessage>

      <PrimeVueButton
        type="submit"
        :loading="authenticationConnectDevice_isLoading"
        :disabled="authenticationConnectDevice_isLoading"
        class="bg-blue-primary border-none font-semibold text-base py-3 w-full mt-6"
        label="Connect Device"
      />
    </section>
  </form>
</template>
