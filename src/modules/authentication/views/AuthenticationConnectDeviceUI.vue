<script setup lang="ts">
// Components
import AuthenticationConnectDeviceContent from '../components/AuthenticationConnectDeviceContent.vue';

// Services
import { useAuthenticationConnectDeviceService } from '../services/authentication-connect-device.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  authenticationConnectDevice_detectLocationAndBrowser,
  authenticationConnectDevice_formData,
  authenticationConnectDevice_formValidations,
  authenticationConnectDevice_isLoading,
  authenticationConnectDevice_isNotAuthenticated,
  authenticationConnectDevice_onSubmit,
} = useAuthenticationConnectDeviceService();

/**
 * @description Provide all the data and methods what we need
 */
provide('authenticationConnectDevice', {
  authenticationConnectDevice_detectLocationAndBrowser,
  authenticationConnectDevice_formData,
  authenticationConnectDevice_formValidations,
  authenticationConnectDevice_isLoading,
  authenticationConnectDevice_isNotAuthenticated,
  authenticationConnectDevice_onSubmit,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await authenticationConnectDevice_detectLocationAndBrowser();
});
</script>

<template>
  <section id="authentication-connect-device-ui" class="container flex items-center justify-center">
    <AuthenticationConnectDeviceContent />
  </section>
</template>
