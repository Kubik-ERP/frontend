<script setup>
import { ref } from 'vue'; // Make sure ref is imported
import excludeSVG from '@/app/assets/icons/exclude.svg';

import AddCustomerForm from '@/modules/customer/components/addCustomer/form.vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router'; // Ensure these are imported

function leavePage() {
  hasConfirmedLeave = true;
  router.push({ name: 'customer-list' });
}

const router = useRouter(); // Get the router instance for navigation

const nextRoute = ref(null);
const isLeavingModal = ref(false);
let hasConfirmedLeave = false; // Using `let` for reassignable flag

/**
 * @description Function to confirm leaving the page, typically after discarding changes.
 * This sets hasConfirmedLeave to true and then attempts to navigate.
 */
const confirmLeave = () => {
  isLeavingModal.value = false; // Hide the confirmation modal
  hasConfirmedLeave = true; // Signal that the next navigation is intentional

  if (nextRoute.value) {
    const targetRoute = nextRoute.value;
    nextRoute.value = null; // Clear the stored route
    router.push(targetRoute); // Proceed with the navigation that was originally blocked
  }
};

/**
 * @description Function to cancel leaving the page, typically when the user decides to stay.
 * Resets the state and keeps the user on the current page.
 */
const cancelLeave = () => {
  isLeavingModal.value = false; // Hide the confirmation modal
  nextRoute.value = null; // Clear any stored route
  hasConfirmedLeave = false; // Ensure the flag is false
};

/**
 * @description Navigation guard to prevent accidental page leaves.
 * It shows a confirmation modal if the user tries to leave without confirming changes.
 */
onBeforeRouteLeave((to, from, next) => {
  // If hasConfirmedLeave is true, it means navigation was intentionally triggered (e.g., by form submit)
  if (hasConfirmedLeave) {
    hasConfirmedLeave = false; // Reset the flag immediately after allowing navigation
    return next(); // Allow navigation to proceed
  }

  // If not confirmed to leave, then we need to handle showing the modal or blocking.
  // Refactored to avoid 'no-negated-condition' warning.
  if (isLeavingModal.value) {
    // If the modal is ALREADY visible, just block the navigation
    next(false);
  } else {
    // If the modal is NOT visible yet, show it and block navigation
    isLeavingModal.value = true; // Show the confirmation modal
    nextRoute.value = to.fullPath; // Store the target route to navigate to later
    next(false); // Prevent the current navigation attempt
  }
});

provide('confirmLeave', {
  leavePage,
});
</script>

<template>
  <div class="">
    <!-- AddCustomerForm listens for the isModal prop and emits a close event -->
    <AddCustomerForm />

    <!-- PrimeVue Dialog for "Are you sure you want to leave?" confirmation -->
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
  </div>
</template>

<style lang="scss" scoped></style>
