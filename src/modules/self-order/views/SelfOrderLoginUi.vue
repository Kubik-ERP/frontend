<script setup lang="ts">
// Constants
import { COUNTRY_INFORMATIONS } from '@/app/constants/country.constant';

// Stores
import { useOutletStore } from '@/modules/outlet/store';
import { storeToRefs } from 'pinia';

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
import { useSelfOrderLoginService } from '../services/self-order-login.service';

// Outlet Store
const outletStore = useOutletStore();
const { outlet_currentOutlet } = storeToRefs(outletStore);

/**
 * @description Destructure all the data and methods
 */
const {
  selfOrderLogin_formData,
  selfOrderLogin_formValidations,
  selfOrderLogin_handleGuestSignIn,
  selfOrderLogin_handleSignIn,
} = useSelfOrderLoginService();

/**
 * @description Helper function for country option labels
 */
const getCountryOptionLabel = (value: CountryInformation): string => {
  return `${value.name} (${value.dialCodes})`;
};
</script>

<template>
  <section id="self-order-login" class="flex flex-col items-center justify-between min-h-screen w-full p-4">
    <div class="flex flex-col flex-auto justify-center items-center gap-5 h-full w-full px-6">
      <div class="flex flex-col items-center justify-center gap-2">
        <!-- Store Image -->
        <div class="w-16 h-16 rounded-full overflow-hidden bg-[#d9d9d9] flex items-center justify-center">
          <img
            v-if="outlet_currentOutlet?.photo"
            :src="APP_BASE_BUCKET_URL + outlet_currentOutlet.photo"
            :alt="outlet_currentOutlet?.name"
            class="w-full h-full object-cover"
          />
          <AppBaseSvg v-else name="store" class="w-8 h-8 filter-primary-color" />
        </div>

        <!-- Store Name -->
        <span class="text-xl font-bold">{{ outlet_currentOutlet?.name || 'Welcome' }} 👋</span>
      </div>

      <div class="flex flex-col w-full">
        <div class="flex flex-col gap-2">
          <PrimeVuelabel for="username" class="text-xs">Username</PrimeVuelabel>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="flex flex-col w-full text-sm font-medium leading-6 text-gray-900 w-full"
            label-for="username"
            name="username"
            :validators="selfOrderLogin_formValidations.name"
          >
            <PrimeVueInputText
              v-model="selfOrderLogin_formData.name"
              size="small"
              aria-describedby="username-help"
              class="w-full"
              :class="classes"
              v-on="useListenerForm(selfOrderLogin_formValidations, 'name')"
            />
          </AppBaseFormGroup>
        </div>

        <div class="flex flex-col gap-2">
          <PrimeVuelabel for="email" class="text-xs">Email</PrimeVuelabel>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="flex flex-col w-full text-sm font-medium leading-6 text-gray-900 w-full"
            label-for="email"
            name="email"
            :validators="selfOrderLogin_formValidations.email"
          >
            <PrimeVueInputText
              v-model="selfOrderLogin_formData.email"
              size="small"
              aria-describedby="email-help"
              class="w-full"
              :class="classes"
              v-on="useListenerForm(selfOrderLogin_formValidations, 'email')"
            />
          </AppBaseFormGroup>
        </div>

        <span class="text-xs text-[#323232]"
          >Phone Number (please login with the number you used during registration to access your loyalty
          points)</span
        >
        <div class="grid grid-cols-7 gap-2 items-end w-full">
          <div class="col-span-2 flex flex-col gap-1 h-16">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              label-for="phoneCountryCode"
              name="Phone Country Code"
              :validators="selfOrderLogin_formValidations.code"
            >
              <PrimeVueSelect
                id="phoneCountryCode"
                v-model="selfOrderLogin_formData.code"
                size="small"
                filter
                :class="classes"
                :options="COUNTRY_INFORMATIONS"
                :option-label="getCountryOptionLabel"
                option-value="dialCodes"
                placeholder="+62"
                class="text-sm h-full min-h-9 w-full"
                v-on="useListenerForm(selfOrderLogin_formValidations, 'code')"
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
              name="Phone Number"
              :validators="selfOrderLogin_formValidations.number"
            >
              <PrimeVueInputText
                v-model="selfOrderLogin_formData.number"
                class="w-full"
                :class="classes"
                size="small"
                v-on="useListenerForm(selfOrderLogin_formValidations, 'number')"
              />
            </AppBaseFormGroup>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center gap-4 w-full">
        <PrimeVueButton
          class="w-full"
          :disabled="selfOrderLogin_formValidations.$invalid"
          @click="selfOrderLogin_handleSignIn()"
          >Sign In</PrimeVueButton
        >
        <PrimeVueButton class="w-full" outlined severity="secondary" @click="selfOrderLogin_handleGuestSignIn()">
          Sign In as Guest
        </PrimeVueButton>
      </div>
    </div>

    <span class="text-text-disabled text-xs mb-6">Powered By KUBIK POS</span>
  </section>
</template>

<style scoped></style>
