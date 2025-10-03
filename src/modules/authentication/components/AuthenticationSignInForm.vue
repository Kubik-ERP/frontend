<script setup lang="ts">
// Interfaces
import type { IAuthenticationSignInProvided } from '../interfaces/authentication-sign-in.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  authenticationSignIn_activeStep,
  authenticationSignIn_formData,
  authenticationSignIn_formValidations,
  authenticationSignIn_isLoading,
  authenticationSignIn_isNotAuthenticated,
  authenticationSignIn_onSsoWithGoogle,
  authenticationSignIn_onSubmit,
  authenticationSignIn_selectedRole,
} = inject<IAuthenticationSignInProvided>('authenticationSignIn')!;
</script>

<template>
  <form
    class="flex flex-col gap-10 w-full max-w-md px-4 sm:px-6 md:px-0"
    @submit.prevent="authenticationSignIn_onSubmit"
  >
    <!-- Greeting Text -->
    <section id="greeting-text" class="flex flex-col gap-4 items-center sm:items-start">
      <img
        src="@/app/assets/images/app-logo.png"
        alt="app-logo"
        class="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
      />

      <div class="flex items-center gap-4 mt-2">
        <PrimeVueButton
          class="bg-transparent border border-solid border-blue-primary p-2 basic-smooth-animation hover:bg-grayscale-10"
          @click="
            () => {
              authenticationSignIn_activeStep = 0;
            }
          "
        >
          <template #default>
            <AppBaseSvg name="arrow-left" class="w-4 h-4" />
          </template>
        </PrimeVueButton>

        <h1 class="font-bold text-2xl text-primary leading-8">
          Login as {{ authenticationSignIn_selectedRole === 'OWNER' ? 'Owner' : 'Staff' }}
        </h1>
      </div>

      <h1 class="font-bold text-xl sm:text-2xl md:text-3xl leading-snug text-center sm:text-left">
        {{ useLocalization('app.hi') }} {{ useLocalization('app.welcome-back') }}
      </h1>
    </section>

    <!-- Form Inputs -->
    <section id="form-inputs" class="flex flex-col">
      <!-- Email -->
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="email"
        :name="useLocalization('authentication.sign-in.form.email')"
        :validators="authenticationSignIn_formValidations.email"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="mail" class="w-4 h-4" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVueInputText
            v-model="authenticationSignIn_formData.email"
            :loading="authenticationSignIn_isLoading"
            :placeholder="useLocalization('authentication.sign-in.form.placeholder.email')"
            class="text-sm w-full"
            :class="[classes, authenticationSignIn_isNotAuthenticated ? 'border-red-600' : '']"
            v-on="useListenerForm(authenticationSignIn_formValidations, 'email')"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>

      <!-- Password -->
      <AppBaseFormGroup
        v-if="authenticationSignIn_selectedRole === 'OWNER'"
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="password"
        :name="useLocalization('authentication.sign-in.form.password')"
        :validators="authenticationSignIn_formValidations.password"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="key" class="w-4 h-4" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVuePassword
            v-model="authenticationSignIn_formData.password"
            :placeholder="useLocalization('authentication.sign-in.form.placeholder.password')"
            class="text-sm w-full"
            toggle-mask
            :class="[classes, authenticationSignIn_isNotAuthenticated ? '[&>input]:border-red-600' : '']"
            :feedback="false"
            :loading="authenticationSignIn_isLoading"
            :pt="{ root: '[&>input]:text-sm [&>input]:w-full' }"
            v-on="useListenerForm(authenticationSignIn_formValidations, 'password')"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>

      <!-- Remember Me Checkbox -->
      <div v-if="authenticationSignIn_selectedRole === 'OWNER'" class="flex items-center gap-3">
        <PrimeVueCheckbox
          v-model="authenticationSignIn_formData.rememberMe"
          :binary="true"
          input-id="remember-me"
        />
        <label for="remember-me" class="text-sm font-medium text-gray-900 cursor-pointer">
          {{ useLocalization('authentication.sign-in.form.remember-me') }}
        </label>
      </div>

      <!-- Forgot Password -->
      <RouterLink :to="{ name: 'reset-password' }" class="font-semibold text-blue-primary text-sm text-end mt-2">
        {{ useLocalization('authentication.sign-in.reset-password') }}
      </RouterLink>

      <span v-if="authenticationSignIn_isNotAuthenticated" class="font-normal text-error-main text-sm mt-4">
        {{ useLocalization('authentication.sign-in.error-messages.not-authenticated') }}
      </span>
    </section>

    <!-- Buttons -->
    <section id="button-actions" class="flex flex-col items-center gap-2">
      <section id="main-buttons" class="flex flex-col w-full gap-2">
        <PrimeVueButton
          class="bg-blue-primary border-none text-sm py-[10px]"
          :label="useLocalization('app.submit')"
          type="submit"
          :disabled="authenticationSignIn_formValidations.$invalid"
          :loading="authenticationSignIn_isLoading"
        />

        <PrimeVueButton
          class="w-full"
          severity="secondary"
          variant="outlined"
          @click="authenticationSignIn_onSsoWithGoogle"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="google" class="w-4 h-4" />
              <span class="font-normal text-sm">
                {{ useLocalization('authentication.sign-in.continue-with-google') }}
              </span>
            </section>
          </template>
        </PrimeVueButton>
      </section>

      <!-- <PrimeVueDivider class="bg-grayscale-20" />

      <span class="font-normal text-sm text-center sm:text-left">
        {{ useLocalization('authentication.sign-in.doesnt-have-account') }}
        <RouterLink :to="{ name: 'sign-up' }" class="font-semibold text-blue-primary">
          {{ useLocalization('authentication.sign-in.create-account') }}
        </RouterLink>
      </span> -->
    </section>
  </form>
</template>
