<script setup lang="ts">
// Interfaces
import { useStaffStore } from '../store/index';
import { storeToRefs } from 'pinia';
import type { IStaff } from '../interfaces'; // Import the correct interface for staff fields

/**
 * @description Inject all the data and methods what we need
 */
const employeeStore = useStaffStore();
const { paginatedEmployees, currentPage, totalPages, sortField, sortOrder } = storeToRefs(employeeStore);
const { setSortField, goToPage } = employeeStore;

// Define the type for the field parameter
type EmployeeField = keyof IStaff; // Use IStaff instead of IStaffProvided

// Sorting logic
const sortBy = (field: EmployeeField) => {
  setSortField(field);
};
</script>

<template>
  <section id="staff-table-employee">
      <table class="min-w-full bg-white">
        <!-- Table Header -->
        <thead>
          <tr class="bg-gray-100 border-grayscale-20 border-b-2">
            <td class="py-2 px-4 cursor-pointer text-sm font-normal" @click="sortBy('employeeId')">
              Employee ID
              <span v-if="sortField === 'employeeId'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </td>
            <td class="py-2 px-4 cursor-pointer text-sm font-normal" @click="sortBy('name')">
              Name
              <span v-if="sortField === 'name'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </td>
            <td class="py-2 px-4 text-sm font-normal">Email</td>
            <td class="py-2 px-4 text-sm font-normal">Phone Number</td>
            <td class="py-2 px-4 text-sm font-normal">Title</td>
            <td class="py-2 px-4 text-sm font-normal">User Permission</td>
            <td></td>
          </tr>
        </thead>
        <!-- Table Body -->
        <tbody>
          <tr v-for="employee in paginatedEmployees" :key="employee.employeeId" class="hover:bg-gray-50 border-grayscale-20 border-b-2">
            <td class="py-2 px-4 text-sm font-normal">{{ employee.employeeId }}</td>
            <td class="py-2 px-4 text-sm font-normal">{{ employee.name }}</td>
            <td class="py-2 px-4 text-sm font-normal">{{ employee.email }}</td>
            <td class="py-2 px-4 text-sm font-normal">{{ employee.phoneNumber }}</td>
            <td class="py-2 px-4 text-sm font-normal">{{ employee.title }}</td>
            <td class="py-2 px-4 text-sm font-normal">{{ employee.userPermission }}</td>
            <td><i class="pi-ellipsis-v"></i></td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-between items-center p-4">
        <button
          class="px-4 py-2 rounded border border-blue-primary bg-transparent text-blue-primary rounded hover:bg-blue-primary hover:text-white transition-colors duration-100 rounded-lg"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </button>
        <div>
          <span v-for="page in totalPages" :key="page">
            <button
              class="px-3 py-1 mx-1 rounded"
              :class="{ 'bg-blue-secondary-background w-10 h-10 text-blue-primary': currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </span>
        </div>
        <button
          class="px-4 py-2 bg-gray-200 border border-blue-primary bg-transparent text-blue-primary rounded hover:bg-blue-primary hover:text-white transition-colors duration-100 rounded-lg"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
  </section>
</template>

<style scoped></style>
