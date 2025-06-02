<script setup lang="ts">
// Components
import OutletCreatEditForm from '../components/OutletCreatEditForm.vue';
import OutletCreateEditDialogPIN from '../components/OutletCreateEditDialogPIN.vue';

// Services
import { useOutletCreateEditService } from '../services/outlet-create-edit.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  outletCreateEdit_fetchDetailOutlet,
  outletCreateEdit_formData,
  outletCreateEdit_formValidations,
  outletCreateEdit_isLoading,
  outletCreateEdit_onCancel,
  outletCreateEdit_onCloseDialogVerifyPIN,
  outletCreateEdit_onDeleteOutlet,
  outletCreateEdit_onRemovePhoto,
  outletCreateEdit_onSubmit,
  outletCreateEdit_onSubmitDialogVerifyPIN,
  outletCreateEdit_onUploadPhoto,
} = useOutletCreateEditService();

/**
 * @description Provide all the data and methods what we need
 */
provide('outletCreateEdit', {
  outletCreateEdit_formData,
  outletCreateEdit_formValidations,
  outletCreateEdit_isLoading,
  outletCreateEdit_onCancel,
  outletCreateEdit_onCloseDialogVerifyPIN,
  outletCreateEdit_onDeleteOutlet,
  outletCreateEdit_onRemovePhoto,
  outletCreateEdit_onSubmit,
  outletCreateEdit_onSubmitDialogVerifyPIN,
  outletCreateEdit_onUploadPhoto,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  /**
   * @description Injected variables
   */
  const route = useRoute();

  if (route.params.id) {
    await outletCreateEdit_fetchDetailOutlet(route.params.id as string);
  }
});
</script>

<template>
  <section id="outlet-create-edit" class="w-full pb-5">
    <OutletCreatEditForm />
    <OutletCreateEditDialogPIN />
    <AppBaseDialogConfirmation id="outlet-create-edit-dialog-confirmation" />
  </section>
</template>
