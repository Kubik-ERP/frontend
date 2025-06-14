<script setup lang="ts">
const customer = ref({
  id: '00105789127009833',
  name: 'Brooklyn Simmons',
  email: 'Brooklyn@gmail.com',
  phone: '+62 851239874621',
  address: 'Brooklyn, New York',
  gender: 'Male',
  dob: '2000-01-01',
  tags: ['tag1', 'tag2', 'tag3'],
});
</script>
<template>
  <div class="border border-solid border-primary-100 rounded-md p-4 mb-8">
    <section class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-semibold">{{ customer.name }}</h1>
        <PrimeVueButton label="Edit Customer" class="" icon="pi pi-pen-to-square" />
      </div>
      <p>{{ customer.id }}</p>
    </section>

    <section>
      <h2 class="font-semibold text-primary text-lg mt-4 mb-2">Customer Details</h2>
      <div class="grid grid-cols-3 gap-4 justify-evenly">
        <div class="flex flex-col">
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <p>{{ customer.email }}</p>
        </div>

        <div class="flex flex-col">
          <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
          <p>{{ customer.phone }}</p>
        </div>

        <div class="flex flex-col">
          <label for="address" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
          <p>{{ customer.address }}</p>
        </div>

        <div class="flex flex-col">
          <label for="gender" class="block text-sm font-medium leading-6 text-gray-900">Gender</label>
          <p>{{ customer.gender }}</p>
        </div>

        <div class="flex flex-col">
          <label for="dob" class="block text-sm font-medium leading-6 text-gray-900">Born Date</label>
          <p>{{ customer.dob }}</p>
        </div>

        <div class="flex flex-col">
          <label for="tags" class="block text-sm font-medium leading-6 text-gray-900">Tag</label>
          <p>{{ customer.tags.join(', ') }}</p>
        </div>

      </div>
    </section>
  </div>
</template>