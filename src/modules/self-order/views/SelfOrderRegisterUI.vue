<script setup lang="ts">
// Constants
import { COUNTRY_INFORMATIONS } from '@/app/constants/country.constant';

// Interfaces
interface CountryInformation {
  code: string;
  dialCodes: string;
  emoji: string;
  image: string;
  name: string;
  slug: string;
}

// Services
import { useSelfOrderRegisterService } from '../services/self-order-register.service';

// Vue Router
import { useRoute } from 'vue-router';

const route = useRoute();

/**
 * @description Destructure all the data and methods
 */
const { selfOrderRegister_formData, selfOrderRegister_formValidations, selfOrderRegister_handleSignUp } =
  useSelfOrderRegisterService();

/**
 * @description Helper function for country option labels
 */
const getCountryOptionLabel = (value: CountryInformation): string => {
  return `${value.name} (${value.dialCodes})`;
};
</script>

<template>
  <section id="self-order-register" class="flex flex-col items-center justify-between min-h-screen w-full">
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
          <label for="username" class="text-xs">Username</label>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="flex flex-col w-full text-sm font-medium leading-6 text-gray-900 w-full"
            label-for="username"
            name="username"
            :validators="selfOrderRegister_formValidations.name"
          >
            <PrimeVueInputText
              v-model="selfOrderRegister_formData.name"
              size="small"
              aria-describedby="username-help"
              class="w-full"
              :class="classes"
              v-on="useListenerForm(selfOrderRegister_formValidations, 'name')"
            />
          </AppBaseFormGroup>
        </div>

        <div class="grid grid-cols-7 gap-2 items-end w-full">
          <div class="col-span-2 flex flex-col gap-1">
            <span class="text-xs text-[#323232]">Phone Number</span>

            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              label-for="phoneCountryCode"
              name="Phone Country Code"
              :validators="selfOrderRegister_formValidations.code"
            >
              <PrimeVueSelect
                id="phoneCountryCode"
                v-model="selfOrderRegister_formData.code"
                size="small"
                filter
                :options="COUNTRY_INFORMATIONS"
                :option-label="getCountryOptionLabel"
                option-value="dialCodes"
                placeholder="+62"
                class="text-sm h-full min-h-9 w-full"
                :class="classes"
                v-on="useListenerForm(selfOrderRegister_formValidations, 'code')"
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
              label-for="number"
              name="Phone Number"
              :validators="selfOrderRegister_formValidations.number"
            >
              <PrimeVueInputText
                v-model="selfOrderRegister_formData.number"
                class="w-full"
                :class="classes"
                size="small"
                v-on="useListenerForm(selfOrderRegister_formValidations, 'number')"
              />
            </AppBaseFormGroup>
          </div>
        </div>
      </div>

      <PrimeVueButton
        :disabled="selfOrderRegister_formValidations.$invalid"
        class="w-full"
        @click="selfOrderRegister_handleSignUp()"
        >Create Account</PrimeVueButton
      >
    </div>
    <span class="text-text-disabled text-xs mb-6">Powered By KUBIK POS</span>
  </section>
</template>

<style scoped></style>
