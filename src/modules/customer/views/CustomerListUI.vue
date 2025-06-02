<script setup>
import { ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

import { useCustomerService } from '../services/CustomersService';

const { getAllCustomers } = useCustomerService();

const selectedCustomer = ref(null);

const isLoading = ref(false);

const isDeleteOpen = ref(false);

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
    customers.value = await getAllCustomers();
    customers.value.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      code: item.code,
      phone: `(${item.code}) ` + item.phone,
      points: item.points,
      latestVisit: item.latestVisit,
    }));
  } catch (error) {
    console.error('Failed to fetch customers:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadCustomers();
  console.log('customers', customers.value);
});
</script>

<template>
  <div class="m-4 p-1 border border-gray rounded-lg shadow-2xl">
    <!-- {{ customers }} -->
    <div>
      <PrimeVueDataTable
        :selection="selectedCustomer"
        :value="customers"
        :rows="10"
        :filters="filters"
        data-key="ID"
        paginator
        :loading="isLoading"
      >
        <template #header>
          <div class="flex justify-between">
            <div class="flex items-center justify-center gap-2">
              <h1 class="text-2xl font-bold">Customers</h1>
              <p class="text-green-primary bg-green-primary/50 py-1 px-2 text-xs rounded-full">
                {{ customers.length }} Members
              </p>
            </div>
            <div class="flex gap-4 justify-end">
              <PrimeVueIconField>
                <PrimeVueInputIcon>
                  <i class="pi pi-search" />
                </PrimeVueInputIcon>
                <PrimeVueInputText v-model="filters['global'].value" placeholder="Keyword Search" />
              </PrimeVueIconField>

              <router-link to="add-customer">
                <PrimeVueButton
                  type="button"
                  severity="info"
                  label="Add Customer"
                  icon="pi pi-plus"
                  class="bg-primary border-primary"
                />
              </router-link>
            </div>
          </div>
        </template>
        <template #empty> No customers found. </template>
        <template #loading> Loading customers data. Please wait. </template>

        <PrimeVueColumn selection-mode="multiple" header-style="width: 3rem"></PrimeVueColumn>
        <PrimeVueColumn sortable field="id" header="Member ID" style="width: 15%"></PrimeVueColumn>
        <PrimeVueColumn sortable field="name" header="Customer Name" style="width: 15%"></PrimeVueColumn>
        <PrimeVueColumn sortable field="email" header="Email" style="width: 15%"></PrimeVueColumn>
        <PrimeVueColumn sortable field="phone" header="Phone Number" style="width: 15%"></PrimeVueColumn>
        <PrimeVueColumn sortable field="points" header="Loyalty Point" style="width: 15%">
          <template #body="{ data }">
            <div class="flex gap-2">
              {{ data.points }}
              <p class="text-gray-400">Points</p>
            </div>
          </template>
        </PrimeVueColumn>
        <PrimeVueColumn sortable field="latestVisit" header="Lastest Visit" style="width: 15%" />

        <PrimeVueColumn>
          <template #body="slotProps">
            <PrimeVueButton
              type="text"
              icon="pi pi-ellipsis-v"
              class="bg-transparent text-gray-500 border-none float-end"
              @click="displayPopover($event, slotProps.data)"
            ></PrimeVueButton>
          </template>
        </PrimeVueColumn>

        <template #paginatorcontainer="{ page, pageCount, prevPageCallback, nextPageCallback }">
          <div class="flex items-center gap-2 justify-between w-full py-2">
            <!-- Previous Page Button -->
            <PrimeVueButton
              icon="pi pi-angle-left"
              variant="text"
              label="Previous"
              class="border border-primary text-primary hover:bg-transparent"
              @click="prevPageCallback"
            />

            <div>
              <template v-for="p in pageCount" :key="p">
                <PrimeVueButton
                  :label="p.toString()"
                  class="border-none aspect-square p-4"
                  :class="
                    page === p - 1
                      ? 'bg-blue-secondary-background text-primary'
                      : 'bg-transparent text-grayscale-20'
                  "
                />
              </template>
            </div>
            <!-- Page Numbers -->

            <!-- Next Page Button -->
            <PrimeVueButton
              icon="pi pi-angle-right"
              variant="text"
              label="Next"
              class="border border-primary text-primary hover:bg-transparent flex-row-reverse"
              @click="nextPageCallback"
            />
          </div>
        </template>
      </PrimeVueDataTable>

      <PrimeVuePopover ref="op">
        <div class="flex flex-col items-start">
          <PrimeVueButton variant="text" label="Edit" icon="pi pi-pen-to-square" class="text-black" />
          <PrimeVueButton
            variant="text"
            label="Delete"
            icon="pi pi-trash"
            class="text-red-500"
            @click="isDeleteOpen = true"
          />
        </div>
      </PrimeVuePopover>

      <!-- <PrimeVueDialog v-model:visible="isAddOpen" modal header="Add Customer" class="w-[45rem]">
    
        <form @submit.prevent>
          <div class="flex flex-col gap-1 mb-4">
            <div>
              <label for="name">Customer Name <sup class="text-red-500">*</sup></label>
            </div>
            <PrimeVueInputText v-model="name" class="flex-auto" autocomplete="off" />
          </div>
          <div class="flex flex-col gap-1 mb-8">
            <div class="flex gap-1">
              <label for="notes">Notes</label>
              <label for="optional" class="text-gray-400">(Optional)</label>
            </div>
            <PrimeVueTextarea v-model="notes" auto-resize rows="5" cols="30" />
          </div>
          <div class="flex justify-end gap-2">
            <PrimeVueButton
              type="button"
              label="Cancel"
              severity="info"
              variant="outlined"
              class="w-48 text-primary border-primary"
              @click="isAddOpen = false"
            ></PrimeVueButton>
            <PrimeVueButton
              type="submit"
              label="Add"
              class="w-48 bg-primary border-primary"
              @click="isAddOpen = false"
            ></PrimeVueButton>
          </div>
        </form>
      </PrimeVueDialog> -->

      <PrimeVueDialog :visible="isDeleteOpen" modal header="">
        <template #container>
          <div class="w-[35rem] p-8">
            <div class="flex flex-col items-center gap-4 text-center">
              <span><i class="pi pi-trash" style="font-size: 2.5rem"></i></span>
              <h1 class="text-2xl font-semibold">Are you sure you want to delete this customer?</h1>
              <p>This action cannot be undone, and the customer will be removed from catalog</p>
              <div class="flex items-center justify-between gap-4">
                <PrimeVueButton
                  class="text-lg w-56"
                  variant="outlined"
                  icon="pi pi-trash"
                  label="Delete Category"
                  severity="danger"
                  @click="isDeleteOpen = false"
                />
                <PrimeVueButton class="w-56 text-lg bg-primary border-primary" @click="isDeleteOpen = false"
                  >Cancel</PrimeVueButton
                >
              </div>
            </div>
          </div>
        </template>
      </PrimeVueDialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>