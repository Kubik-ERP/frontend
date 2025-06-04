<script setup>
import CustomerTags from '@/modules/customer/components/addCustomer/tags.vue';
import { useCustomerService } from '../services/CustomersService';
const { customer_FormData, customer_formValidations } = useCustomerService();

const handleCreateCustomer = () => {
  console.log(customer_FormData);
};
</script>

<template>
  <div class="">
    {{ customer_FormData }}
    <form class="grid grid-cols-2 gap-8" @submit.prevent="handleCreateCustomer">
      <div class="flex flex-col">
        <AppBaseFormGroup v-slot="{ classes }" class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label label-for="name" name="Name" :validators="customer_formValidations.name">
          <PrimeVueInputText v-model="customer_FormData.name" name="name" type="text"
            class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full" :class="{ ...classes }"
            v-on="useListenerForm(customer_formValidations, 'name')" />
        </AppBaseFormGroup>
      </div>
      <div class="flex flex-col">
        <AppBaseFormGroup v-slot="{ classes }" class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label label-for="gender" name="Gender" :validators="customer_formValidations.gender">
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2">
              <PrimeVueRadioButton v-model="customer_FormData.gender" input-id="gender1" name="gender" value="Male"
                :class="{ ...classes }" v-on="useListenerForm(customer_formValidations, 'gender')" />
              <label for="gender1">Male</label>
            </div>
            <div class="flex items-center gap-2">
              <PrimeVueRadioButton v-model="customer_FormData.gender" input-id="gender2" name="gender" value="Female"
                :class="{ ...classes }" v-on="useListenerForm(customer_formValidations, 'gender')" />
              <label for="gender2">Female</label>
            </div>
          </div>
        </AppBaseFormGroup>
      </div>
      <div class="flex flex-col">
        <AppBaseFormGroup v-slot="{ classes }" class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label label-for="dob" name="Date of Birth" :validators="customer_formValidations.dob">
          <div class="flex-auto">
            <PrimeVueDatePicker v-model="customer_FormData.dob" name="dob" show-icon fluid icon-display="input"
              input-id="icondisplay" class="border shadow-xs border-grayscale-30 rounded-lg w-full"
              :class="{ ...classes }" v-on="useListenerForm(customer_formValidations, 'dob')" />
          </div>
        </AppBaseFormGroup>
      </div>

      <section id="phone-information" class="flex items-center gap-2">
        <section id="phone-code" class="w-fit">
          <AppBaseFormGroup v-slot="{ classes }" class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label label-for="code" name="Code" spacing-bottom="mb-0"
            :validators="customer_formValidations.code">
            <PrimeVueSelect id="code" v-model="customer_FormData.code" filter :options="COUNTRY_INFORMATIONS"
              option-value="dialCodes" placeholder="+62" class="text-sm h-full min-h-9 w-full" :class="{ ...classes }"
              v-on="useListenerForm(customer_formValidations, 'code')">
              <template #option="{ option }">
                <section id="phone-option" class="flex items-center gap-1">
                  <img :src="option.image" alt="country-flag" class="w-6 h-6" />
                  <span class="text-sm">{{ option.dialCodes }}</span>
                </section>
              </template>

              <template #value="{ value }">
                <section id="phone-value" class="flex items-center gap-1">
                  <span class="text-sm">{{ value }}</span>
                </section>
              </template>
            </PrimeVueSelect>
          </AppBaseFormGroup>
        </section>

        <section id="phone-number" class="w-full">
          <AppBaseFormGroup v-slot="{ classes }" class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label label-for="number" name="Phone Number" spacing-bottom="mb-0"
            :validators="customer_formValidations.number">
            <PrimeVueInputText v-model="customer_FormData.number" placeholder="Input your phone number"
              class="text-sm w-full" :class="{ ...classes }" type="tel"
              v-on="useListenerForm(customer_formValidations, 'number')" />
          </AppBaseFormGroup>
        </section>
      </section>

      <div class="flex flex-col">
        <AppBaseFormGroup v-slot="{ classes }" class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label label-for="email" name="Email" :validators="customer_formValidations.email">
          <PrimeVueInputText v-model="customer_FormData.email" type="text" name="email"
            class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full" :class="{ ...classes }"
            v-on="useListenerForm(customer_formValidations, 'email')" />
        </AppBaseFormGroup>
      </div>
      <div class="flex flex-col">
        <AppBaseFormGroup v-slot="{ classes }" class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label label-for="id" name="Id" :validators="customer_formValidations.id">
          <PrimeVueInputText v-model="customer_FormData.id" type="text" name="id"
            class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full" :class="{ ...classes }"
            v-on="useListenerForm(customer_formValidations, 'id')" />
          <label for="id" class="text-xs text-grayscale-30 text-end w-full">
            {{ customer_FormData.id.length }}/16
          </label>
        </AppBaseFormGroup>
      </div>

      <div class="flex flex-col">
        <div class="w-full">
          <AppBaseFormGroup class-label="block text-sm font-medium leading-6 text-gray-900 w-full" is-name-as-label
            label-for="tags" name="Tags" :validators="customer_formValidations.tags">
            <CustomerTags v-model="customer_FormData.tags" name="tags"
              v-on="useListenerForm(customer_formValidations, 'tags')" />
          </AppBaseFormGroup>
        </div>
      </div>

      <div class="flex flex-col">
        <AppBaseFormGroup v-slot="{ classes }" class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label label-for="address" name="Address" :validators="customer_formValidations.address">
          <PrimeVueTextarea v-model="customer_FormData.address" name="address" rows="5" cols="30"
            class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full" :class="{ ...classes }"
            v-on="useListenerForm(customer_formValidations, 'address')" />
        </AppBaseFormGroup>
      </div>

      <!-- canccel and add button -->
      <div class="flex gap-4 grid-cols-2">
        <PrimeVueButton type="button" label="Cancel" severity="info" variant="outlined"
          class="w-48 text-primary border-primary"></PrimeVueButton>
        <PrimeVueButton type="submit" label="Add Customer" class="w-48 bg-primary border-primary"></PrimeVueButton>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
