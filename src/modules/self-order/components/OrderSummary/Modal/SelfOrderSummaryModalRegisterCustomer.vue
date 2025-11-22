<script setup lang="ts">
// Constants
import { COUNTRY_INFORMATIONS } from '@/app/constants/country.constant';

// Interfaces
import type { ISelfOrderProvided } from '@/modules/self-order/interfaces';

interface CountryInformation {
  code: string;
  dialCodes: string;
  emoji: string;
  image: string;
  name: string;
  slug: string;
}

// Services
import { useSelfOrderRegisterService } from '../../../services/self-order-register.service';

/**
 * @description Inject from self-order service
 */
const {
  selfOrder_modalRegisterCustomer,
  selfOrder_onCloseRegisterCustomerModal,
} = inject<ISelfOrderProvided>('selfOrder')!;

/**
 * @description Destructure register service
 */
const {
  selfOrderRegister_formData,
  selfOrderRegister_formValidations,
  selfOrderRegister_handleSignUp
} = useSelfOrderRegisterService();

/**
 * @description Helper function for country option labels
 */
const getCountryOptionLabel = (value: CountryInformation): string => {
  return `${value.name} (${value.dialCodes})`;
};

/**
 * @description Handle form submission
 */
const handleSubmit = async () => {
  await selfOrderRegister_handleSignUp();
  selfOrder_onCloseRegisterCustomerModal();
};
</script>

<template>
  <section id="self-order-summary-modal-register-customer">
    <PrimeVueDialog
      v-model:visible="selfOrder_modalRegisterCustomer.show"
      modal
      :style="{ width: '31rem' }"
      class="m-2"
      :closable="true"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-lg">Create Account</span>
        </div>
      </template>

      <template #default>
        <section id="register-customer-form" class="flex flex-col  p-2">
          <!-- Username Field -->
          <div class="flex flex-col gap-2">
            <label for="username" class="text-sm font-medium">Username</label>
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="flex flex-col w-full"
              label-for="username"
              name="username"
              :validators="selfOrderRegister_formValidations.name"
            >
              <PrimeVueInputText
                v-model="selfOrderRegister_formData.name"
                size="small"
                placeholder="Enter your name"
                class="w-full"
                :class="classes"
                v-on="useListenerForm(selfOrderRegister_formValidations, 'name')"
              />
            </AppBaseFormGroup>
          </div>

          <!-- Email Field -->
          <div class="flex flex-col gap-2">
            <label for="email" class="text-sm font-medium">Email</label>
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="flex flex-col w-full"
              label-for="email"
              name="email"
              :validators="selfOrderRegister_formValidations.email"
            >
              <PrimeVueInputText
                v-model="selfOrderRegister_formData.email"
                size="small"
                placeholder="Enter your email"
                type="email"
                class="w-full"
                :class="classes"
                v-on="useListenerForm(selfOrderRegister_formValidations, 'email')"
              />
            </AppBaseFormGroup>
          </div>

          <!-- Phone Number Field -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium">Phone Number</label>
            <div class="grid grid-cols-7 gap-2">
              <div class="col-span-2">
                <AppBaseFormGroup
                  v-slot="{ classes }"
                  class-label="block w-full"
                  label-for="phoneCountryCode"
                  name="Country Code"
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
                    class="text-sm w-full"
                    :class="classes"
                    v-on="useListenerForm(selfOrderRegister_formValidations, 'code')"
                  >
                    <template #option="{ option }">
                      <section id="phone-option" class="flex items-center gap-2">
                        <img :src="option.image" alt="country-flag" class="w-6 h-6" />
                        <span class="text-sm">{{ option.name }} ({{ option.dialCodes }})</span>
                      </section>
                    </template>

                    <template #value="{ value }">
                      <section id="phone-value" class="flex items-center">
                        <span class="text-sm">{{ value }}</span>
                      </section>
                    </template>
                  </PrimeVueSelect>
                </AppBaseFormGroup>
              </div>

              <div class="col-span-5">
                <AppBaseFormGroup
                  v-slot="{ classes }"
                  class-label="block w-full"
                  label-for="phoneNumber"
                  name="Phone Number"
                  :validators="selfOrderRegister_formValidations.number"
                >
                  <PrimeVueInputText
                    v-model="selfOrderRegister_formData.number"
                    size="small"
                    placeholder="Enter phone number"
                    class="w-full"
                    :class="classes"
                    v-on="useListenerForm(selfOrderRegister_formValidations, 'number')"
                  />
                </AppBaseFormGroup>
              </div>
            </div>
          </div>
        </section>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3 p-2">
          <PrimeVueButton
            class="text-primary border-primary"
            type="button"
            label="Cancel"
            outlined
            @click="selfOrder_onCloseRegisterCustomerModal"
          />
          <PrimeVueButton
            class="bg-primary border-none"
            type="button"
            label="Create Account"
            :disabled="selfOrderRegister_formValidations.$invalid"
            @click="handleSubmit"
          />
        </div>
      </template>
    </PrimeVueDialog>
  </section>
</template>

<style scoped></style>
