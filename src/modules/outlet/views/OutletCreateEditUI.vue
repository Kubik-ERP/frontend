<script setup lang="ts">
// Components
import OutletCreatEditForm from '../components/OutletCreatEditForm.vue';

// Services
import { useOutletCreateEditService } from '../services/outlet-create-edit.service';

/**
 * @description Destructure all the data and methods what we need
 */
const { outletCreateEdit_formData, outletCreateEdit_formValidations } = useOutletCreateEditService();

/**
 * @description Provide all the data and methods what we need
 */
provide('outletCreateEdit', {
  outletCreateEdit_formData,
  outletCreateEdit_formValidations,
});
</script>

<template>
  <section id="outlet-create-edit" class="w-full">
    <OutletCreatEditForm />
  </section>
</template>
