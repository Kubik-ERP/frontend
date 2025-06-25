<script setup>
import CustomerTags from '@/modules/customer/components/addCustomer/tags.vue';
import { useCustomerService } from '../../services/CustomersService';

const { customer_FormData, customer_formValidations, createCustomer } = useCustomerService();

/**
 * @description Define props with default values and interfaces
 */

// If this component is always rendered within a parent that handles navigation,
// you might not strictly need useRouter or useRoute here for navigation.
// Keeping useRoute for potential access to current route info if needed.

const props = defineProps({
  isModal: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const handleOnClose = response => {
  // Always emit the close event after successful creation
  // The parent will decide whether to close a modal or navigate.
  emit('close', response);
};

function clearForm() {
  customer_formValidations.value.$reset();
  customer_FormData.name = '';
  customer_FormData.gender = '';
  customer_FormData.dob = '';
  customer_FormData.code = '';
  customer_FormData.number = '';
  customer_FormData.email = '';
  customer_FormData.tags = [];
  customer_FormData.address = '';
}

const handleCreateCustomer = async () => {
  customer_formValidations.value.$touch();

  if (customer_formValidations.value.$invalid) return;

  try {
    const response = await createCustomer(customer_FormData);
    clearForm();
    
    // On successful creation, emit the 'close' event.
    // The parent component will handle the subsequent navigation or modal closing.
    handleOnClose(response);

  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  {{customer_FormData}}
  <br>
  errors: 
  {{ customer_formValidations.$errors }}
  <br>
  invalid: 
  {{ customer_formValidations.$invalid }}
  <form class="grid grid-cols-2 gap-8" @submit.prevent="handleCreateCustomer">
    <AppBaseFormGroup 
      v-slot="{ classes }"
      class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
      is-name-as-label
      label-for="name"
      name="Customer Name"
      :validators="customer_formValidations.name"
    >
      <PrimeVueInputText
        v-model="customer_FormData.name"
        name="name"
        type="text"
        class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full"
        fluid
      />
    </AppBaseFormGroup>
    <!-- <div class="flex flex-col">
      <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Customer Name</label>
      <div
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="name"
        name="Customer Name"
      >
        <PrimeVueInputText
          v-model="customer_FormData.name"
          name="name"
          type="text"
          class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full"
          fluid
        />
      </div>
    </div> -->
    <div class="flex flex-col">
      <label for="gender" class="block text-sm font-medium leading-6 text-gray-900">Gender</label>
      <div class="flex flex-wrap gap-4">
        <div class="flex items-center gap-2">
          <PrimeVueRadioButton v-model="customer_FormData.gender" input-id="gender1" name="gender" value="Male" />
          <label for="gender1">Male</label>
        </div>
        <div class="flex items-center gap-2">
          <PrimeVueRadioButton
            v-model="customer_FormData.gender"
            input-id="gender2"
            name="gender"
            value="Female"
          />
          <label for="gender2">Female</label>
        </div>
      </div>
    </div>

    <div class="flex flex-col">
      <label for="dob" class="block text-sm font-medium leading-6 text-gray-900">Born Date</label>
      <PrimeVueDatePicker
        v-model="customer_FormData.dob"
        name="dob"
        type="date"
        show-icon
        fluid
        icon-display="input"
        input-id="icondisplay"
        class="border shadow-xs border-grayscale-30 rounded-lg w-full"
      />
    </div>

    <section id="phone-information">
      <div class="flex flex-col">
        <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
        <div class="flex items-center gap-2">
          <section id="phone-code" class="w-fit">
            <div
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="code"
              name="Code"
              spacing-bottom="mb-0"
            >
              <PrimeVueSelect
                id="code"
                v-model="customer_FormData.code"
                filter
                :options="COUNTRY_INFORMATIONS"
                option-value="dialCodes"
                placeholder="+62"
                class="text-sm h-full min-h-9 w-full"
              >
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
            </div>
          </section>

          <section id="phone-number" class="w-full">
            <div
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="number"
              name="Phone Number"
              spacing-bottom="mb-0"
            >
              <PrimeVueInputText
                v-model="customer_FormData.number"
                placeholder="Input your phone number"
                class="text-sm w-full"
                type="tel"
              />
            </div>
          </section>
        </div>
      </div>
    </section>

    <div class="flex flex-col">
      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
        <PrimeVueInputText
          v-model="customer_FormData.email"
          type="text"
          name="email"
          class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full"
        />
      </div>
    </div>

    <div class="flex flex-col">
      <label for="tags" class="block text-sm font-medium leading-6 text-gray-900">Tag</label>
      <CustomerTags v-model="customer_FormData.tags" />
    </div>

    <div class="flex flex-col">
      <div>
        <label for="address" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
        <PrimeVueTextarea
          v-model="customer_FormData.address"
          name="address"
          rows="5"
          cols="30"
          class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full"
        />
      </div>
    </div>

    <div></div>

    <!-- canccel and add button -->
    <div class="flex gap-4 grid-cols-2">
      <router-link v-if="!props.isModal" to="/customer">
        <PrimeVueButton
          type="button"
          label="Cancel"
          severity="info"
          variant="outlined"
          class="w-48 text-primary border-primary"
        ></PrimeVueButton>
      </router-link>
      <PrimeVueButton
        v-else
        type="button"
        label="Cancel"
        severity="info"
        variant="outlined"
        class="w-48 text-primary border-primary"
        @click="handleOnClose()"
      ></PrimeVueButton>

      <PrimeVueButton type="submit" label="Add Customer" class="w-48 bg-primary border-primary"></PrimeVueButton>
    </div>
  </form>
</template>
