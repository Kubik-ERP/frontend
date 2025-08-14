<script setup lang="ts">
import { useCashierSelfOrderService } from '../../services/useCashierSelfOrder.service';

import { useRoute } from 'vue-router';

const route = useRoute();

const { cashierSelfOrder_handleSignUp, cashierSelfOrder_signUpForm, cashierSelfOrder_formValidationsSignUp } =
  useCashierSelfOrderService();
</script>
<template>
  <section id="self-order-create-account" class="flex flex-col items-center justify-between min-h-screen w-full">
    <div class="flex py-3 px-4 border-y border-[#ededed] gap-2 w-full items-center">
      <router-link
        :to="{
          name: 'login-self-order',
          query: { redirect: route.query.redirect || '' },
        }"
      >
        <app-base-svg name="chevron-left-grey" />
      </router-link>
      <span>Create Account</span>
    </div>
    <div class="flex flex-auto flex-col gap-10 p-4 w-full">
      <div class="flex flex-col gap-2">
        <div class="w-16 h-16 bg-[#d9d9d9] rounded-full"></div>

        <span class="text-sm">Create your account to continue order</span>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col">
          <PrimeVuelabel for="username" class="text-xs">Username</PrimeVuelabel>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="flex flex-col w-full text-sm font-medium leading-6 text-gray-900 w-full"
            label-for="username"
            name="username"
            :validators="cashierSelfOrder_formValidationsSignUp.name"
          >
            <PrimeVueInputText
              v-model="cashierSelfOrder_signUpForm.name"
              size="small"
              aria-describedby="username-help"
              class="w-full"
              :class="classes"
              v-on="useListenerForm(cashierSelfOrder_formValidationsSignUp, 'name')"
            />
          </AppBaseFormGroup>
        </div>

        <div class="grid grid-cols-7 gap-2 items-end w-full">
          <div class="col-span-2 flex flex-col gap-1">
            <span class="text-xs text-[#323232]">Phone Number</span>

            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              label-for="email"
              :name="useLocalization('authentication.sign-in.form.email')"
              :validators="cashierSelfOrder_formValidationsSignUp.code"
            >
              <PrimeVueSelect
                id="phoneCountryCode"
                v-model="cashierSelfOrder_signUpForm.code"
                size="small"
                filter
                :options="COUNTRY_INFORMATIONS"
                :option-label="
                  value => {
                    return `${value.name} (${value.dialCodes})`;
                  }
                "
                option-value="dialCodes"
                placeholder="+62"
                class="text-sm h-full min-h-9 w-full"
                :class="classes"
                v-on="useListenerForm(cashierSelfOrder_formValidationsSignUp, 'code')"
              >
                <template #option="{ option }">
                  <section id="phone-option" class="flex items-center gap-1">
                    <img :src="option.image" alt="country-flag" class="w-6 h-6" />
                    <span class="text-sm">{{ option.name }} ({{ option.dialCodes }})</span>
                  </section>
                </template>

                <template #value="{ value }">
                  <section id="phone-value" class="flex items-center gap-1">
                    <span class="text-sm">{{ value }}</span>
                  </section>
                </template>
              </PrimeVueSelect>
            </AppBaseFormGroup>
          </div>
          <div class="col-span-5">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              label-for="email"
              :name="useLocalization('authentication.sign-in.form.email')"
              :validators="cashierSelfOrder_formValidationsSignUp.number"
            >
              <prime-vue-input-text
                v-model="cashierSelfOrder_signUpForm.number"
                class="w-full"
                :class="classes"
                size="small"
                v-on="useListenerForm(cashierSelfOrder_formValidationsSignUp, 'number')"
              />
            </AppBaseFormGroup>
          </div>
        </div>
      </div>

      <prime-vue-button
        :disabled="cashierSelfOrder_formValidationsSignUp.$invalid"
        class="w-full"
        @click="cashierSelfOrder_handleSignUp()"
        >Create Account</prime-vue-button
      >
    </div>
    <span class="text-text-disabled text-xs mb-6">Powered By KUBIK POS</span>
  </section>
</template>
