<script setup lang="ts">
// Interfaces
import type { IAuthenticationSignInProvided } from '../interfaces/authentication-sign-in.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  authenticationSignIn_formData,
  authenticationSignIn_formValidations,
  authenticationSignIn_isLoading,
  authenticationSignIn_isNotAuthenticated,
  authenticationSignIn_onSubmit,
} = inject<IAuthenticationSignInProvided>('authenticationSignIn')!;
</script>

<template>
  <form class="flex flex-col gap-10 w-full max-w-md" @submit.prevent="authenticationSignIn_onSubmit">
    <section id="greeting-text" class="flex flex-col gap-2">
      <PrimeVueAvatar label="P" class="mr-2" size="xlarge" shape="circle" />

      <h1 class="font-bold text-2xl leading-8">Hi! Welcome Back 👋</h1>
    </section>

    <section id="form-inputs" class="flex flex-col">
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="email"
        name="Email"
        :validators="authenticationSignIn_formValidations.email"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="mail" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVueInputText
            v-model="authenticationSignIn_formData.email"
            :loading="authenticationSignIn_isLoading"
            placeholder="Input your registered email"
            class="text-sm w-full"
            :class="[classes, authenticationSignIn_isNotAuthenticated ? 'border-red-600' : '']"
            v-on="useListenerForm(authenticationSignIn_formValidations, 'email')"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>

      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="password"
        name="Password"
        :validators="authenticationSignIn_formValidations.password"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="key" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVuePassword
            v-model="authenticationSignIn_formData.password"
            placeholder="Input your new password"
            class="text-sm w-full"
            toggle-mask
            :class="[classes, authenticationSignIn_isNotAuthenticated ? '[&>input]:border-red-600' : '']"
            :feedback="false"
            :loading="authenticationSignIn_isLoading"
            :pt="{
              root: '[&>input]:text-sm [&>input]:w-full',
            }"
            v-on="useListenerForm(authenticationSignIn_formValidations, 'password')"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>

      <RouterLink :to="{ name: 'reset-password' }" class="font-semibold text-blue-primary text-sm text-end">
        Reset Password
      </RouterLink>

      <span v-if="authenticationSignIn_isNotAuthenticated" class="font-normal text-error-main text-sm mt-4">
        We couldn’t find an account with that email. Please check or sign up for a new account.
      </span>
    </section>

    <section id="button-actions" class="flex flex-col items-center gap-2">
      <section id="main-buttons" class="flex flex-col w-full gap-2">
        <PrimeVueButton
          class="bg-blue-primary border-none text-sm py-[10px]"
          label="Submit"
          type="submit"
          :disabled="authenticationSignIn_formValidations.$invalid"
          :loading="authenticationSignIn_isLoading"
        />

        <PrimeVueButton class="w-full" severity="secondary" variant="outlined">
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="google" />
              <span class="font-normal text-sm">Sign in with Google</span>
            </section>
          </template>
        </PrimeVueButton>
      </section>

      <PrimeVueDivider class="bg-grayscale-20" />

      <span class="font-normal text-sm">
        Doesn’t have an account?

        <RouterLink :to="{ name: 'sign-up' }" class="font-semibold text-blue-primary"> Create Account </RouterLink>
      </span>
    </section>
  </form>
</template>
