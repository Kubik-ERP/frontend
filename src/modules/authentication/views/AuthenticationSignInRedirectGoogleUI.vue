<script setup>
// Services
import { useAuthenticationSignInService } from '../services/authentication-sign-in.service';

/**
 * @description Destructure all the data and methods what we need
 */
const { authenticationSignIn_fetchAuthenticationGoogleRedirect } = useAuthenticationSignInService();

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(() => {
  authenticationSignIn_fetchAuthenticationGoogleRedirect();
});
</script>

<template>
  <div class="auth-redirect-loading">
    <div class="spinner"></div>
    <p>Redirecting to Google for authentication...</p>
  </div>
</template>

<style scoped>
.auth-redirect-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  font-family: Arial, sans-serif;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 6px solid #e0e0e0;
  border-top: 6px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

p {
  color: #555;
  font-size: 1.1rem;
  margin: 0;
}
</style>
