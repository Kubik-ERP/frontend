<script setup>
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

let { leavePage } = inject('confirmLeave');

const handleOnClose = response => {
  emit('close', response);
};

const handleCreateCustomer = async () => {
  customer_formValidations.value.$touch();

  if (customer_formValidations.value.$invalid) return;

  try {
    if (customer_FormData.dob) {
      customer_FormData.dob = useFormatDateLocal(customer_FormData.dob);
    }

    const data = await createCustomer(customer_FormData);

    if (props.isModal) {
      handleOnClose(data);
    } else {
      leavePage();
    }
  } catch (error) {
    console.error(error);
  }
};

const search = ref('');

// Create a new tag from the search input
const createTag = () => {
  if (search.value && !customer_FormData.tags.some(tag => tag.name.toLowerCase() === search.value.toLowerCase())) {
    const newTag = { name: search.value };
    customer_FormData.tags.push(newTag);
  }
  search.value = '';
};

const removeTag = tagToRemove => {
  customer_FormData.tags = customer_FormData.tags.filter(tag => tag.name !== tagToRemove.name);
  if (!tags.value.some(tag => tag.name === tagToRemove.name)) {
    tags.value.push(tagToRemove);
  }
};
</script>

<template>
  <section class="grid grid-cols-2 gap-8">
    <AppBaseFormGroup
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
    <div class="flex flex-col">
      <label for="gender" class="block text-sm font-medium leading-6 text-gray-900">Gender</label>
      <div class="flex flex-wrap gap-4">
        <div class="flex items-center gap-2">
          <PrimeVueRadioButton v-model="customer_FormData.gender" input-id="gender1" name="gender" value="male" />
          <label for="gender1">Male</label>
        </div>
        <div class="flex items-center gap-2">
          <PrimeVueRadioButton
            v-model="customer_FormData.gender"
            input-id="gender2"
            name="gender"
            value="female"
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
        date-format="dd/mm/yy"
        class="border shadow-xs border-grayscale-30 rounded-lg w-full"
      />
    </div>

    <section class="flex flex-col">
      <section id="phone-information" class="flex items-center gap-3">
        <section id="phone-code" class="w-fit">
          <AppBaseFormGroup
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="code"
            name="Code"
            :validators="customer_formValidations.code"
          >
            <PrimeVueSelect
              id="phoneCountryCode"
              v-model="customer_FormData.code"
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
        </section>

        <section id="phone-number" class="w-full">
          <AppBaseFormGroup
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="phone-number"
            name="Phone Number"
            :validators="customer_formValidations.number"
          >
            <PrimeVueInputText
              v-model="customer_FormData.number"
              placeholder="Input your phone number"
              class="text-sm w-full"
              type="tel"
            />
          </AppBaseFormGroup>
        </section>
      </section>
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
      <div>
        <form @submit.prevent="createTag">
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="search"
              name="name"
              type="text"
              class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full"
              fluid
            />
            <PrimeVueInputIcon>
              <template #default>
                <AppBaseSvg name="search" class="!w-4 !h-4" />
              </template>
            </PrimeVueInputIcon>
          </PrimeVueIconField>
        </form>

        <div class="flex gap-2 mt-2 flex-wrap">
          <span
            v-for="tag in customer_FormData.tags"
            :key="tag"
            class="px-2 py-1 font-semibold bg-blue-secondary-background/50 rounded-full flex items-center justify-center gap-2"
          >
            <p class="text-primary whitespace-nowrap">{{ tag.name }}</p>
            <button @click="removeTag(tag)">
              <i class="pi pi-times-circle text-sm cursor-pointer"></i>
            </button>
          </span>
        </div>
      </div>
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

      <PrimeVueButton
        type="button"
        class="w-48 bg-primary border-primary disabled:bg-grayscale-20 disabled:text-white disabled:border-grayscale-20"
        label="Add Customer"
        :disabled="customer_formValidations.$invalid"
        @click="handleCreateCustomer()"
      />
    </div>
  </section>
</template>
