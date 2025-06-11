<script setup lang="ts">
// Components
import OutletCreatEditForm from '../components/OutletCreatEditForm.vue';

// Plugins
import eventBus from '@/plugins/mitt';

// Services
import { useOutletCreateEditService } from '../services/outlet-create-edit.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  outletCreateEdit_fetchDetailOutlet,
  outletCreateEdit_formData,
  outletCreateEdit_formDataOfVerifyPin,
  outletCreateEdit_formValidations,
  outletCreateEdit_isEditable,
  outletCreateEdit_isLoading,
  outletCreateEdit_onCancel,
  outletCreateEdit_onCloseDialogVerifyPIN,
  outletCreateEdit_onDeleteOutlet,
  outletCreateEdit_onRemovePhoto,
  outletCreateEdit_onShowDialogDeleteOutlet,
  outletCreateEdit_onSubmit,
  outletCreateEdit_onSubmitDialogVerifyPIN,
  outletCreateEdit_onUploadPhoto,
  outletCreateEdit_routeParamsId,
} = useOutletCreateEditService();

/**
 * @description Provide all the data and methods what we need
 */
provide('outletCreateEdit', {
  outletCreateEdit_formData,
  outletCreateEdit_formValidations,
  outletCreateEdit_isEditable,
  outletCreateEdit_isLoading,
  outletCreateEdit_onCancel,
  outletCreateEdit_onCloseDialogVerifyPIN,
  outletCreateEdit_onDeleteOutlet,
  outletCreateEdit_onRemovePhoto,
  outletCreateEdit_onShowDialogDeleteOutlet,
  outletCreateEdit_onSubmit,
  outletCreateEdit_onSubmitDialogVerifyPIN,
  outletCreateEdit_onUploadPhoto,
  outletCreateEdit_routeParamsId,
});

const argsEventEmitter: IPropsDialogPinVerification = {
  isOpen: true,
  pinConfirmation: outletCreateEdit_formDataOfVerifyPin.pinConfirmation,
  onClickSecondaryButton: outletCreateEdit_onCloseDialogVerifyPIN,
};

eventBus.emit('AppBaseDialogPinVerification', argsEventEmitter);

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  if (outletCreateEdit_isEditable) {
    if (outletCreateEdit_routeParamsId.value !== undefined && outletCreateEdit_routeParamsId.value !== null) {
      await outletCreateEdit_fetchDetailOutlet(outletCreateEdit_routeParamsId.value);
    } else {
      console.error('Error: outletCreateEdit_routeParamsId.value is undefined or null.');
    }
  }
});
</script>

<template>
  <section id="outlet-create-edit" class="w-full pb-5">
    <OutletCreatEditForm />
    <AppBaseDialogPinVerification
      v-model:pin-confirmation="outletCreateEdit_formDataOfVerifyPin.pinConfirmation"
    />
    <AppBaseDialogConfirmation id="outlet-create-edit-dialog-confirmation" />
  </section>
</template>
