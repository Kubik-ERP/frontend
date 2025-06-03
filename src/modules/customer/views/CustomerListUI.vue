<script setup>
import { ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

import { useCustomerService } from '../services/CustomersService';

const { getAllCustomers, deleteCustomer } = useCustomerService();

const selectedCustomer = ref(null);

const isLoading = ref(false);

const isDeleteOpen = ref(false);

const route = useRoute();
const router = useRouter();

const page = ref(1);
const limit = ref(10);
const search = ref('');
const lastPage = ref(0);

const op = ref();
const displayPopover = (event, product) => {
  selectedCustomer.value = product;
  op.value.show(event);
  // console.log('product', product);
};

const customers = ref([]);

const loadCustomers = async () => {
  isLoading.value = true;
  try {
    const response = await getAllCustomers(page.value, limit.value, search.value);
    customers.value = response.customers;
    lastPage.value = response.lastPage;
  } catch (error) {
    console.error('Failed to fetch customers:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = async () => {
  isDeleteOpen.value = false;
  deleteCustomer(selectedCustomer.value.id);
  loadCustomers();
};

const handleSearch = () => {
  router.push({ query: { page: '1' } });
  page.value = 1;
  loadCustomers();
};

function goToPage(p) {
  router.push({ query: { page: p.toString() } });
  page.value = p;
  loadCustomers();
}

const nextPage = () => {
  if (page.value < lastPage.value) {
    page.value = page.value + 1;
    router.push({ query: { page: page.value.toString() } });
    loadCustomers();
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value = page.value - 1;
    router.push({ query: { page: page.value.toString() } });
    loadCustomers();
  }
};

onMounted(() => {
  loadCustomers();
  page.value = parseInt(route.query.page) || 1;
  if (!route.query.page) {
    router.push({ query: { page: '1' } });
  }
});
</script>

<template>
  <div class="m-4 p-1 border border-gray rounded-lg shadow-2xl">
    <div>
      <PrimeVueDataTable :selection="selectedCustomer" :value="customers" :rows="limit" :filters="filters" data-key="ID"
        paginator :loading="isLoading">
        <template #header>
          <div class="flex justify-between">
            <div class="flex items-center justify-center gap-2">
              <h1 class="text-2xl font-bold">Customers</h1>
              <p class="text-green-primary bg-green-primary/50 py-1 px-2 text-xs rounded-full">
                {{ customers.length }} Members
              </p>
            </div>
            <div class="flex gap-4 justify-end">
              <form @submit.prevent="handleSearch">
                <PrimeVueIconField>
                  <PrimeVueInputIcon><i class="pi pi-search" /></PrimeVueInputIcon>
                  <PrimeVueInputText v-model="search" placeholder="Keyword Search" />
                </PrimeVueIconField>
              </form>

              <router-link to="add-customer">
                <PrimeVueButton type="button" severity="info" label="Add Customer" icon="pi pi-plus"
                  class="bg-primary border-primary" />
              </router-link>
            </div>
          </div>
        </template>
        <template #empty> No customers found. </template>
        <template #loading> Loading customers data. Please wait. </template>

        <PrimeVueColumn selection-mode="multiple" header-style="width: 3rem"></PrimeVueColumn>
        <!-- <PrimeVueColumn sortable field="id" header="Member ID" style="width: 15%"></PrimeVueColumn> -->
        <PrimeVueColumn sortable field="name" header="Customer Name" style="width: 20%"></PrimeVueColumn>
        <PrimeVueColumn sortable field="email" header="Email" style="width: 20%"></PrimeVueColumn>
        <PrimeVueColumn sortable field="phone" header="Phone Number" style="width: 20%">
          <template #body="{ data }"> ({{ data.code }}) {{ data.number }} </template>
        </PrimeVueColumn>
        <PrimeVueColumn sortable field="points" header="Loyalty Point" style="width: 20%">
          <template #body="{ data }">
            <div class="flex gap-2">
              {{ data.points }}
              <p class="text-gray-400">Points</p>
            </div>
          </template>
        </PrimeVueColumn>
        <PrimeVueColumn sortable field="latestVisit" header="Lastest Visit" style="width: 20%" />

        <PrimeVueColumn>
          <template #body="slotProps">
            <PrimeVueButton type="text" icon="pi pi-ellipsis-v"
              class="bg-transparent text-gray-500 border-none float-end"
              @click="displayPopover($event, slotProps.data)"></PrimeVueButton>
          </template>
        </PrimeVueColumn>

        <template #paginatorcontainer="{ }">
          <div class="flex items-center gap-2 justify-between w-full py-2">
            <!-- Previous Page Button -->
            <PrimeVueButton icon="pi pi-angle-left" variant="text" label="Previous"
              class="border border-primary text-primary hover:bg-transparent" @click="prevPage()" />

            <div class="flex gap-1">
              <PrimeVueButton v-for="p in lastPage" :key="p" :label="p.toString()" class="border-none aspect-square p-4"
                :class="page === p ? 'bg-blue-secondary-background text-primary' : 'bg-transparent text-grayscale-20'
                  " @click="goToPage(p)" />
            </div>
            <!-- Page Numbers -->

            <!-- Next Page Button -->
            <PrimeVueButton icon="pi pi-angle-right" variant="text" label="Next"
              class="border border-primary text-primary hover:bg-transparent flex-row-reverse" @click="nextPage()" />
          </div>
        </template>
      </PrimeVueDataTable>

      <PrimeVuePopover ref="op">
        <div class="flex flex-col items-start">
          <PrimeVueButton variant="text" label="Edit" icon="pi pi-pen-to-square" class="text-black" />
          <PrimeVueButton variant="text" label="Delete" icon="pi pi-trash" class="text-red-500"
            @click="isDeleteOpen = true" />
        </div>
      </PrimeVuePopover>

      <PrimeVueDialog :visible="isDeleteOpen" modal header="">
        <template #container>
          <div class="w-[35rem] p-8">
            <div class="flex flex-col items-center gap-4 text-center">
              <span><i class="pi pi-trash" style="font-size: 2.5rem"></i></span>
              <h1 class="text-2xl font-semibold">Are you sure you want to delete this customer?</h1>
              <p>This action cannot be undone, and the customer will be removed from customers list</p>
              <div class="flex items-center justify-between gap-4">
                <PrimeVueButton class="text-lg w-56" variant="outlined" icon="pi pi-trash" label="Delete Customer"
                  severity="danger" @click="handleDelete()" />
                <PrimeVueButton class="w-56 text-lg bg-primary border-primary" @click="isDeleteOpen = false">Cancel
                </PrimeVueButton>
              </div>
            </div>
          </div>
        </template>
      </PrimeVueDialog>
    </div>
  </div>
</template>


<style lang="scss" scoped></style>