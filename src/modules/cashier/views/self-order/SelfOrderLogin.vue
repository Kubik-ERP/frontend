<script setup lang="ts">
import { useCashierSelfOrderService } from '../../services/useCashierSelfOrder.service';
import { COUNTRY_INFORMATIONS } from '@/app/constants/country.constant';

// Define the interface for country information
interface CountryInformation {
  name: string;
  code: string;
  emoji: string;
  image: string;
  dialCodes: string;
  slug: string;
}

const { cashierSelfOrder_handleSignIn, cashierSelfOrder_signInForm, cashierSelfOrder_formValidationsSignIn } =
  useCashierSelfOrderService();

// Helper function for country option labels
const getCountryOptionLabel = (value: CountryInformation): string => {
  return `${value.name} (${value.dialCodes})`;
};
</script>
<template>
  <section id="self-order-login" class="flex flex-col items-center justify-between min-h-screen w-full p-4">
    <div class="flex flex-col flex-auto justify-center items-center gap-5 h-full w-full px-6">
      <div class="flex flex-col items-center justify-center gap-2">
        <div class="w-16 h-16 bg-[#d9d9d9] rounded-full"></div>

        <span class="text-xl font-bold">Hi! Welcome Back 👋</span>
      </div>

      <div class="flex flex-col w-full">
        <div class="flex flex-col gap-2">
          <PrimeVuelabel for="username" class="text-xs">Username</PrimeVuelabel>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="flex flex-col w-full text-sm font-medium leading-6 text-gray-900 w-full"
            label-for="username"
            name="username"
            :validators="cashierSelfOrder_formValidationsSignIn.name"
          >
            <PrimeVueInputText
              v-model="cashierSelfOrder_signInForm.name"
              size="small"
              aria-describedby="username-help"
              class="w-full"
              :class="classes"
              v-on="useListenerForm(cashierSelfOrder_formValidationsSignIn, 'name')"
            />
          </AppBaseFormGroup>
        </div>

        <div class="flex flex-col gap-2">
          <PrimeVuelabel for="username" class="text-xs">Email</PrimeVuelabel>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="flex flex-col w-full text-sm font-medium leading-6 text-gray-900 w-full"
            label-for="username"
            name="username"
            :validators="cashierSelfOrder_formValidationsSignIn.email"
          >
            <PrimeVueInputText
              v-model="cashierSelfOrder_signInForm.email"
              size="small"
              aria-describedby="username-help"
              class="w-full"
              :class="classes"
              v-on="useListenerForm(cashierSelfOrder_formValidationsSignIn, 'email')"
            />
          </AppBaseFormGroup>
        </div>

        <span class="text-xs text-[#323232]">Phone Number</span>
        <div class="grid grid-cols-7 gap-2 items-end w-full">
          <div class="col-span-2 flex flex-col gap-1 h-16">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              label-for="email"
              :name="useLocalization('authentication.sign-in.form.email')"
              :validators="cashierSelfOrder_formValidationsSignIn.code"
            >
              <PrimeVueSelect
                id="phoneCountryCode"
                v-model="cashierSelfOrder_signInForm.code"
                size="small"
                filter
                :class="classes"
                :options="COUNTRY_INFORMATIONS"
                :option-label="getCountryOptionLabel"
                option-value="dialCodes"
                placeholder="+62"
                class="text-sm h-full min-h-9 w-full"
                v-on="useListenerForm(cashierSelfOrder_formValidationsSignIn, 'code')"
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
          <div class="col-span-5 h-16">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              label-for="number"
              :name="useLocalization('authentication.sign-in.form.email')"
              :validators="cashierSelfOrder_formValidationsSignIn.number"
            >
              <PrimeVueInputText
                v-model="cashierSelfOrder_signInForm.number"
                class="w-full"
                :class="classes"
                size="small"
                v-on="useListenerForm(cashierSelfOrder_formValidationsSignIn, 'number')"
              />
            </AppBaseFormGroup>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center gap-4 w-full">
        <PrimeVueButton
          class="w-full"
          :disabled="cashierSelfOrder_formValidationsSignIn.$invalid"
          @click="cashierSelfOrder_handleSignIn()"
          >Sign In</PrimeVueButton
        >
      </div>
    </div>

    <span class="text-text-disabled text-xs mb-6">Powered By KUBIK POS</span>
  </section>
</template>
