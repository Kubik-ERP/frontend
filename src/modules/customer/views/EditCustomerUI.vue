<script setup>
import CustomerTags from '@/modules/customer/components/addCustomer/tags.vue';
import { useCustomerService } from '../services/CustomersService';
const { customer_FormData, customer_formValidations, createCustomer } = useCustomerService();

const customerID = ref();

const route = useRoute();
const router = useRouter();

const nextRoute = ref(null);
const isLeavingModal = ref(false);
let hasConfirmedLeave = false;

function clearForm() {
  customer_formValidations.value.$reset();
  customer_FormData.value = {};
}

const handleEditCustomer = () => {
  customer_formValidations.value.$touch();
  if (customer_formValidations.value.$invalid) return;
  console.log(customer_FormData);

  try {
    createCustomer(customer_FormData);
    clearForm();

    router.push({
      name: 'customer-list',
    });
  } catch (error) {
    console.error(error);
  }
};

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

onMounted(async () => {
  try {
    customerID.value = route.params.id;
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="">
    id : {{ customerID }}
    <br />
    {{ customer_FormData }}
    <form class="grid grid-cols-2 gap-8" @submit.prevent="handleEditCustomer">
      <div class="flex flex-col">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          name="Name"
          :validators="customer_formValidations.name"
        >
          <PrimeVueInputText
            v-model="customer_FormData.name"
            name="name"
            type="text"
            class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full"
            :class="{ ...classes }"
            v-on="useListenerForm(customer_formValidations, 'name')"
          />
        </AppBaseFormGroup>
      </div>
      <div class="flex flex-col">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="gender"
          name="Gender"
          :validators="customer_formValidations.gender"
        >
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2">
              <PrimeVueRadioButton
                v-model="customer_FormData.gender"
                input-id="gender1"
                name="gender"
                value="Male"
                :class="{ ...classes }"
                v-on="useListenerForm(customer_formValidations, 'gender')"
              />
              <label for="gender1">Male</label>
            </div>
            <div class="flex items-center gap-2">
              <PrimeVueRadioButton
                v-model="customer_FormData.gender"
                input-id="gender2"
                name="gender"
                value="Female"
                :class="{ ...classes }"
                v-on="useListenerForm(customer_formValidations, 'gender')"
              />
              <label for="gender2">Female</label>
            </div>
          </div>
        </AppBaseFormGroup>
      </div>
      <div class="flex flex-col">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="dob"
          name="Date of Birth"
          :validators="customer_formValidations.dob"
        >
          <div class="flex-auto">
            <PrimeVueDatePicker
              v-model="customer_FormData.dob"
              name="dob"
              show-icon
              fluid
              icon-display="input"
              input-id="icondisplay"
              class="border shadow-xs border-grayscale-30 rounded-lg w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(customer_formValidations, 'dob')"
            />
          </div>
        </AppBaseFormGroup>
      </div>

      <section id="phone-information" class="flex items-center gap-2">
        <section id="phone-code" class="w-fit">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="code"
            name="Code"
            spacing-bottom="mb-0"
            :validators="customer_formValidations.code"
          >
            <PrimeVueSelect
              id="code"
              v-model="customer_FormData.code"
              filter
              :options="COUNTRY_INFORMATIONS"
              option-value="dialCodes"
              placeholder="+62"
              class="text-sm h-full min-h-9 w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(customer_formValidations, 'code')"
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
          </AppBaseFormGroup>
        </section>

        <section id="phone-number" class="w-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="number"
            name="Phone Number"
            spacing-bottom="mb-0"
            :validators="customer_formValidations.number"
          >
            <PrimeVueInputText
              v-model="customer_FormData.number"
              placeholder="Input your phone number"
              class="text-sm w-full"
              :class="{ ...classes }"
              type="tel"
              v-on="useListenerForm(customer_formValidations, 'number')"
            />
          </AppBaseFormGroup>
        </section>
      </section>

      <div class="flex flex-col">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="email"
          name="Email"
          :validators="customer_formValidations.email"
        >
          <PrimeVueInputText
            v-model="customer_FormData.email"
            type="text"
            name="email"
            class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full"
            :class="{ ...classes }"
            v-on="useListenerForm(customer_formValidations, 'email')"
          />
        </AppBaseFormGroup>
      </div>
      <!-- <div class="flex flex-col">
        <AppBaseFormGroup v-slot="{ classes }" class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label label-for="id" name="Id" :validators="customer_formValidations.id">
          <PrimeVueInputText v-model="customer_FormData.id" type="text" name="id"
            class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full" :class="{ ...classes }"
            v-on="useListenerForm(customer_formValidations, 'id')" />
          <label for="id" class="text-xs text-grayscale-30 text-end w-full">
            {{ customer_FormData.id.length }}/16
          </label>
        </AppBaseFormGroup>
      </div> -->

      <div class="flex flex-col">
        <div class="w-full">
          <AppBaseFormGroup
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="tags"
            name="Tags"
            :validators="customer_formValidations.tags"
          >
            <CustomerTags
              v-model="customer_FormData.tags"
              name="tags"
              v-on="useListenerForm(customer_formValidations, 'tags')"
            />
          </AppBaseFormGroup>
        </div>
      </div>

      <div class="flex flex-col">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="address"
          name="Address"
          :validators="customer_formValidations.address"
        >
          <PrimeVueTextarea
            v-model="customer_FormData.address"
            name="address"
            rows="5"
            cols="30"
            class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full"
            :class="{ ...classes }"
            v-on="useListenerForm(customer_formValidations, 'address')"
          />
        </AppBaseFormGroup>
      </div>

      <div></div>

      <!-- canccel and add button -->
      <div class="flex gap-4 grid-cols-2">
        <router-link to="/customer">
          <PrimeVueButton
            type="button"
            label="Cancel"
            severity="info"
            variant="outlined"
            class="w-48 text-primary border-primary"
          ></PrimeVueButton>
        </router-link>
        <PrimeVueButton type="submit" label="Edit Customer" class="w-48 bg-primary border-primary"></PrimeVueButton>
      </div>
    </form>

    <PrimeVueDialog :visible="isLeavingModal" modal header="">
      <template #container>
        <div class="w-[35rem] p-8">
          <div class="flex flex-col items-center gap-4 text-center">
            <span><i class="pi pi-trash" style="font-size: 2.5rem"></i></span>
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
  </div>
</template>

<style lang="scss" scoped></style>