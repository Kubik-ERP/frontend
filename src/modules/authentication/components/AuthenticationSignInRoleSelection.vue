<script setup lang="ts">
// Interfaces
import type { IAuthenticationSignInProvided } from '../interfaces/authentication-sign-in.interface';

/**
 * @description Inject all the data and methods what we need
 */
const { authenticationSignIn_onSelectRole } = inject<IAuthenticationSignInProvided>('authenticationSignIn')!;
</script>

<template>
  <section
    id="authentication-sign-in-role-selection"
    class="default-wrapper max-w-md lg:max-w-lg px-6 md:px-0 gap-10"
  >
    <!-- Greeting Text -->
    <section id="greeting-text" class="flex flex-col gap-4 items-center sm:items-start">
      <img
        src="@/app/assets/images/app-logo.png"
        alt="app-logo"
        class="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
      />

      <h1 class="font-bold text-xl sm:text-2xl md:text-3xl leading-snug text-center sm:text-left">
        Hi! Welcome To KUBIK POS
      </h1>
    </section>

    <section id="list-options" class="grid grid-rows-2 grid-cols-12 gap-4">
      <section
        id="option-owner"
        class="bg-white border border-solid border-primary-border col-span-full lg:col-span-6 flex flex-col items-center gap-6 p-3 rounded-lg cursor-pointer basic-smooth-animation hover:bg-background"
        @click="authenticationSignIn_onSelectRole('OWNER')"
      >
        <section id="box-icon" class="bg-primary-background w-12 h-12 p-2 rounded-full">
          <section
            id="inner-box"
            class="bg-blue-secondary-background flex items-center justify-center w-full h-full p-1 rounded-full"
          >
            <AppBaseSvg name="account-company" class="w-4 h-4" />
          </section>
        </section>

        <section id="information" class="flex flex-col items-center gap-2">
          <h6 class="font-semibold text-primary text-sm lg:text-base">Login as Owner</h6>

          <p class="font-normal text-text-disabled text-xs lg:text-sm text-center">
            Full access to all POS backoffice features and reports.
          </p>
        </section>
      </section>

      <section
        id="option-employee"
        class="bg-white border border-solid border-primary-border col-span-full lg:col-span-6 flex flex-col items-center gap-6 p-3 rounded-lg cursor-pointer basic-smooth-animation hover:bg-background"
        @click="authenticationSignIn_onSelectRole('EMPLOYEE')"
      >
        <section id="box-icon" class="bg-primary-background w-12 h-12 p-2 rounded-full">
          <section
            id="inner-box"
            class="bg-blue-secondary-background flex items-center justify-center w-full h-full p-1 rounded-full"
          >
            <AppBaseSvg name="user" class="w-4 h-4" />
          </section>
        </section>

        <section id="information" class="flex flex-col items-center gap-2">
          <h6 class="font-semibold text-primary text-sm lg:text-base">Login as Employee</h6>

          <p class="font-normal text-text-disabled text-xs lg:text-sm text-center">
            Handle transactions and day today operations.
          </p>
        </section>
      </section>
    </section>
  </section>
</template>
