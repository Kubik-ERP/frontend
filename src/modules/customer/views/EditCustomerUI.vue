<script setup>
import excludeSVG from '@/app/assets/icons/exclude.svg';
import deleteSVG from '@/app/assets/icons/delete.svg';
import deletePolygonSVG from '@/app/assets/icons/delete-polygon.svg';

import { useCustomerService } from '../services/CustomersService';
const { customer_FormData, customer_formValidations, updateCustomer, getCustomerByID, deleteCustomer } =
  useCustomerService();

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

const handleEditCustomer = async () => {
  customer_formValidations.value.$touch();
  if (customer_formValidations.value.$invalid) return;

  try {
    if (customer_FormData.dob) {
      customer_FormData.dob = useFormatDateLocal(customer_FormData.dob);
    }
    await updateCustomer(route.params.id, customer_FormData);
    clearForm();
    hasConfirmedLeave = true;
    router.push({ name: 'customer-list' });
    // router.push({
    //   name: 'customer-list',
    // });
  } catch (error) {
    console.error(error);
  }
};

const isDeleteOpen = ref(false);
const handleDelete = async () => {
  isDeleteOpen.value = false;
  deleteCustomer(route.params.id);
  hasConfirmedLeave = true;
  router.push({ name: 'customer-list' });
};

const router = useRouter();
const route = useRoute();

const nextRoute = ref(null);
const isLeavingModal = ref(false);
let hasConfirmedLeave = false;
const confirmLeave = () => {
  isLeavingModal.value = false;
  hasConfirmedLeave = true;

  if (nextRoute.value) {
    const targetRoute = nextRoute.value;
    nextRoute.value = null;
    router.push(targetRoute);
  }
};

const cancelLeave = () => {
  isLeavingModal.value = false;
  nextRoute.value = null;
  hasConfirmedLeave = false;
};

onBeforeRouteLeave((to, from, next) => {
  // console.log('onBeforeRouteLeave triggered', isLeavingModal.value, hasConfirmedLeave);

  if (hasConfirmedLeave) {
    hasConfirmedLeave = false;
    return next();
  }

  if (!isLeavingModal.value) {
    isLeavingModal.value = true;
    nextRoute.value = to.fullPath;
    next(false);
  }
});

const loadCustomer = async () => {
  try {
    const response = await getCustomerByID(route.params.id);
    // console.log('🚀 ~ onMounted ~ response:', response);

    customer_FormData.name = response.name;
    customer_FormData.gender = response.gender;
    if (response.dob) {
      customer_FormData.dob = new Date(response.dob);
    }
    customer_FormData.code = response.code;
    customer_FormData.number = response.number;
    customer_FormData.email = response.email;
    customer_FormData.tags = response.customersHasTag.map(tag => ({ id: tag.tag.id, name: tag.tag.name }));
    customer_FormData.address = response.address;
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

onMounted(() => {
  loadCustomer();
});
</script>

<template>
  <form class="grid grid-cols-2 gap-8" @submit.prevent="handleEditCustomer">
    <div class="flex flex-col">
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
    </div>
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
        show-icon
        fluid
        icon-display="input"
        input-id="icondisplay"
        date-format="dd/mm/yy"
        class="border shadow-xs border-grayscale-30 rounded-lg w-full"
      />
    </div>

    <section class="flex flex-col">
      <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
      <section id="phone-information" class="flex items-center gap-3">
        <section id="phone-code" class="w-fit">
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
        </section>

        <section id="phone-number" class="w-full">
          <PrimeVueInputText
            v-model="customer_FormData.number"
            placeholder="Input your phone number"
            class="text-sm w-full"
            type="tel"
          />
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
          <PrimeVueInputText
            v-model="search"
            name="name"
            type="text"
            :class="{ ...classes }"
            class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full"
            fluid
          />
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
    <div class="flex items-center justify-between col-span-2">
      <div class="flex gap-2">
        <PrimeVueButton
          type="button"
          label="Cancel"
          severity="info"
          variant="outlined"
          class="w-48 text-primary border-primary"
          @click="isModal ? handleOnClose() : router.back()"
        ></PrimeVueButton>
        <PrimeVueButton
          type="submit"
          label="Edit Customer"
          :disabled="customer_formValidations.$invalid"
          class="w-48 bg-primary border-primary"
        ></PrimeVueButton>
      </div>

      <PrimeVueButton
        label="Delete Customer"
        class="text-xl w-56 py-2 border-2 border-none cursor-pointer rounded-lg text-red-500 bg-transparent font-semibold"
        @click="isDeleteOpen = true"
      >
        <template #icon>
          <img :src="deleteSVG" alt="" />
        </template>
      </PrimeVueButton>
    </div>
  </form>

  <PrimeVueDialog v-model:visible="isDeleteOpen" modal header="">
    <template #container>
      <div class="w-[35rem] p-8">
        <div class="flex flex-col items-center gap-4 text-center">
          <img :src="deletePolygonSVG" alt="Delete icon" class="mx-auto" />
          <h1 class="text-2xl font-semibold">Are you sure want to delete this customer data?</h1>
          <p>Deleting this customer data will permanently remove it from the system</p>
          <div class="flex items-center justify-between gap-4">
            <PrimeVueButton
              class="text-lg w-56 text-red-500 bg-transparent border-none"
              variant="outlined"
              label="Delete Customer"
              severity="danger"
              @click="
                handleDelete();
                isDeleteOpen = false;
              "
            >
              <template #icon>
                <img :src="deleteSVG" alt="" />
              </template>
            </PrimeVueButton>
            <PrimeVueButton class="w-56 text-lg bg-primary border-primary" @click="isDeleteOpen = false"
              >Cancel
            </PrimeVueButton>
          </div>
        </div>
      </div>
    </template>
  </PrimeVueDialog>

  <PrimeVueDialog :visible="isLeavingModal" modal header="">
    <template #container>
      <div class="w-[35rem] p-8">
        <div class="flex flex-col items-center gap-4 text-center">
          <span><img :src="excludeSVG" alt="" /></span>
          <h1 class="text-2xl font-semibold">Are you sure you want to leave this page?</h1>
          <p>Any changes you make to the data will be lost if you leave this page without saving</p>
          <div class="flex items-center justify-between gap-4">
            <PrimeVueButton
              class="text-lg w-56 text-primary font-semibold"
              variant="text"
              label="Discard Changes"
              @click="confirmLeave"
            />
            <PrimeVueButton
              variant="text"
              class="w-56 text-lg border-2 border-primary text-primary font-semibold"
              @click="cancelLeave"
              >Cancel</PrimeVueButton
            >
          </div>
        </div>
      </div>
    </template>
  </PrimeVueDialog>
</template>
