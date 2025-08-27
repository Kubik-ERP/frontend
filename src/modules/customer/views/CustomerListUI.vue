<script setup>
import deletePolygonSVG from '@/app/assets/icons/delete-polygon.svg';
import deleteSVG from '@/app/assets/icons/delete.svg';
import editSVG from '@/app/assets/icons/edit.svg';
import plusLineWhiteSVG from '@/app/assets/icons/plus-line-white.svg';
import threeDotsSVG from '@/app/assets/icons/three-dots.svg';
import searchSVG from '@/app/assets/icons/search.svg';
import chevronLeftSVG from '@/app/assets/icons/chevron-left.svg';
import chevronRightSVG from '@/app/assets/icons/chevron-right.svg';
import eyeVisibleSVG from '@/app/assets/icons/eye-visible.svg';

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
const total = ref(0);

function handleEdit() {
  // console.log(selectedCustomer.value.id);
  router.push({ name: 'edit-customer', params: { id: selectedCustomer.value.id } });
}

const visiblePages = computed(() => {
  const range = 5;
  const start = Math.max(1, Math.min(page.value - 2, lastPage.value - range + 1));
  const end = Math.min(lastPage.value, start + range - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const op = ref();
const displayPopover = (event, product) => {
  selectedCustomer.value = product;
  op.value.show(event);
  // console.log('product', product);
};

const customers = ref([]);
const meta = ref({});

const loadCustomers = async () => {
  isLoading.value = true;
  try {
    const response = await getAllCustomers(page.value, limit.value, search.value);
    customers.value = response.customers;
    meta.value = response.meta;
    lastPage.value = meta.value.totalPages;
    total.value = meta.value.totalData;
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

const handlePreview = () => {
  router.push({ name: 'preview-customer', params: { id: selectedCustomer.value.id } });
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
  <div >
    <div>
      <PrimeVueDataTable
        :value="customers"
        :rows="limit"
        data-key="ID"
        paginator
        :pt="{
          root: 'rounded-sm border border-solid border-grayscale-20',
        }"
      >
        <template #header>
          <div class="flex justify-between">
            <div class="flex items-center justify-center gap-2">
              <h1 class="text-2xl font-bold">Customers</h1>
              <p class="text-green-primary bg-green-primary/10 py-1 px-2 text-xs rounded-full">
                {{ total }} Members
              </p>
            </div>
            <div class="flex gap-4 justify-end">
              <form @submit.prevent="handleSearch">
                <PrimeVueIconField>
                  <PrimeVueInputIcon><img :src="searchSVG" alt="" /></PrimeVueInputIcon>
                  <PrimeVueInputText v-model="search" placeholder="Keyword Search" />
                </PrimeVueIconField>
              </form>

              <router-link to="customer/add-customer">
                <PrimeVueButton
                  type="button"
                  severity="info"
                  label="Add Customer"
                  class="bg-primary border-primary"
                >
                  <template #icon>
                    <img :src="plusLineWhiteSVG" alt="" />
                  </template>
                </PrimeVueButton>
              </router-link>
            </div>
          </div>
        </template>

        <template #empty> No customers found. </template>

        <PrimeVueColumn header="Customer Name" class="w-1/5">
          <template #body="{ data }">
            <template v-if="isLoading">
              <PrimeVueSkeleton height="1.5rem" />
            </template>
            <template v-else>
              {{ data.name }}
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn header="Email" class="w-1/5">
          <template #body="{ data }">
            <template v-if="isLoading">
              <PrimeVueSkeleton height="1.5rem" />
            </template>
            <template v-else>
              {{ data.email }}
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn header="Phone Number" class="w-1/5">
          <template #body="{ data }">
            <template v-if="isLoading">
              <PrimeVueSkeleton height="1.5rem" />
            </template>
            <template v-else>
              <span>({{ data.code }}) {{ data.number }}</span>
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn header="Tags" class="w-1/5">
          <template #body="{ data }">
            <template v-if="isLoading">
              <PrimeVueSkeleton height="1.5rem" />
            </template>
            <template v-else>
              <div v-if="data.customersHasTag.length === 0">
                <p class="text-gray-400">-</p>
              </div>
              <div v-else class="flex flex-wrap gap-1">
                <span
                  v-for="tag in data.customersHasTag.map(tag => tag.tag)"
                  :key="tag"
                  class="px-1.5 py-0.5 text-xs font-semibold bg-blue-secondary-background/50 rounded-full"
                >
                  <p class="text-primary whitespace-nowrap">{{ tag.name }}</p>
                </span>
              </div>
            </template>
          </template>
        </PrimeVueColumn>
        <PrimeVueColumn header="Loyalty Point" class="w-1/5">
          <template #body="{ data }">
            <template v-if="isLoading">
              <PrimeVueSkeleton height="1.5rem" />
            </template>
            <template v-else>
              <div class="flex gap-2">
                {{ data.points }}
                <p class="text-gray-400">Points</p>
              </div>
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn header="Latest Visit" class="w-1/5">
          <template #body="{ data }">
            <template v-if="isLoading">
              <PrimeVueSkeleton height="1.5rem" />
            </template>
            <template v-else>
              {{ data.latestVisit }}
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn>
          <template #body="slotProps">
            <PrimeVueButton
              type="text"
              class="bg-transparent text-gray-500 border-none float-end"
              @click="displayPopover($event, slotProps.data)"
            >
              <template #icon>
                <img :src="threeDotsSVG" alt="" />
              </template>
            </PrimeVueButton>
          </template>
        </PrimeVueColumn>

        <template #paginatorcontainer="{}">
          <div class="flex items-center gap-2 justify-between w-full py-2">
            <!-- Previous Page Button -->
            <PrimeVueButton
              variant="text"
              label="Previous"
              class="border border-primary text-primary hover:bg-transparent"
              @click="prevPage()"
            >
              <template #icon>
                <img :src="chevronLeftSVG" alt="" />
              </template>
            </PrimeVueButton>

            <div class="flex gap-1">
              <PrimeVueButton
                v-for="p in visiblePages"
                :key="p"
                :label="p.toString()"
                class="border-none aspect-square p-4"
                :class="
                  page === p ? 'bg-blue-secondary-background text-primary' : 'bg-transparent text-grayscale-20'
                "
                @click="goToPage(p)"
              />
            </div>
            <!-- Page Numbers -->

            <!-- Next Page Button -->
            <PrimeVueButton
              variant="text"
              label="Next"
              class="border border-primary text-primary hover:bg-transparent flex-row-reverse"
              @click="nextPage()"
            >
              <template #icon>
                <img :src="chevronRightSVG" alt="" />
              </template>
            </PrimeVueButton>
          </div>
        </template>
      </PrimeVueDataTable>

      <PrimeVuePopover ref="op">
        <div class="flex flex-col items-start">
          <PrimeVueButton variant="text" label="Preview" class="text-black" @click="handlePreview()">
            <template #icon>
              <img :src="eyeVisibleSVG" alt="" />
            </template>
          </PrimeVueButton>
          <PrimeVueButton variant="text" label="Edit" class="text-black" @click="handleEdit()">
            <template #icon>
              <img :src="editSVG" alt="" />
            </template>
          </PrimeVueButton>
          <PrimeVueButton variant="text" label="Delete" class="text-red-500" @click="isDeleteOpen = true">
            <template #icon>
              <img :src="deleteSVG" alt="" />
            </template>
          </PrimeVueButton>
        </div>
      </PrimeVuePopover>

      <PrimeVueDialog :visible="isDeleteOpen" modal header="">
        <template #container>
          <div class="w-[35rem] p-8">
            <div class="flex flex-col items-center gap-4 text-center">
              <span><img :src="deletePolygonSVG" alt="" /></span>
              <h1 class="text-2xl font-semibold">Are you sure you want to delete this customer?</h1>
              <p>This action cannot be undone, and the customer will be removed from customers list</p>
              <div class="flex items-center justify-between gap-4">
                <PrimeVueButton
                  class="text-lg w-56"
                  variant="outlined"
                  label="Delete Customer"
                  severity="danger"
                  @click="handleDelete()"
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
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
