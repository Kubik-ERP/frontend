<script setup lang="ts">
// Services


import { useSupplierPreviewService } from '../services/supplier-preview.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  supplierPreview_supplier: supplier,
  supplierPreview_onEditSupplier,
  supplierPreview_fetchSupplierById,
} = useSupplierPreviewService();


// Initialize data fetch
onMounted(async () => {
  try {
    await supplierPreview_fetchSupplierById();
    console.log('Supplier data loaded successfully:', supplier.value);
  } catch (error) {
    console.error('Failed to load supplier data:', error);
  }
});

</script>
<template>
  <div class="w-full border border-primary rounded-lg p-6 text-base text-gray-800">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
      <div>
        <p class="text-lg font-semibold text-black">{{ supplier?.data.supplierName }}</p>
        <p class="text-base text-gray-600">{{ supplier?.data.id }}</p>
      </div>
      <PrimeVueButton
        class="text-base flex items-center gap-1 bg-white text-primary border border-primary rounded-lg px-4 py-2 w-full sm:w-auto justify-center"
        @click="supplierPreview_onEditSupplier">
        <AppBaseSvg name="edit" class="!w-4 !h-4 text-primary" />
        Edit Supplier Details
      </PrimeVueButton>
    </div>

    <!-- Supplier Details -->
    <div class="mb-6">
      <p class="text-base font-semibold text-primary mb-3">Supplier Details</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p class="text-sm text-gray-500">Contact Person</p>
          <p class="text-base font-medium text-black">{{ supplier?.data.contactPerson }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Phone Number</p>
          <p class="text-base text-black">{{ supplier?.data.phoneNumber }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Email</p>
          <p class="text-base text-black">{{ supplier?.data.email }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Address</p>
          <p class="text-base text-black">{{ supplier?.data.address }}</p>
        </div>
      </div>
    </div>

    <!-- Payment & Banking Information -->
    <div>
      <p class="text-base font-semibold text-primary mb-3">Payment & Banking Information</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p class="text-sm text-gray-500">Bank Name</p>
          <p class="text-base text-black">{{ supplier?.data.bankName }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Bank Account Number</p>
          <p class="text-base text-black">{{ supplier?.data.bankAccountNumber }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Bank Account Name</p>
          <p class="text-base text-black">{{ supplier?.data.bankAccountName }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Tax Identification Number (NPWP)</p>
          <p class="text-base text-black">{{ supplier?.data.taxIdentificationNumber }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
