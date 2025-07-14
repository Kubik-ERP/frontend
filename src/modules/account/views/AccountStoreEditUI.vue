<script setup lang="ts">
// Components
import AccountStoreEditButtonActions from '../components/store-edit/AccountStoreEditButtonActions.vue';
import AccountStoreEditFormDetail from '../components/store-edit/AccountStoreEditFormDetail.vue';
import AccountStoreEditFormLocation from '../components/store-edit/AccountStoreEditFormLocation.vue';
import AccountStoreEditFormOperational from '../components/store-edit/AccountStoreEditFormOperational.vue';

// Plugins
import eventBus from '@/plugins/mitt';

// Services
import { useAccountStoreEditService } from '../services/account-store-edit.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  accountStoreEdit_fetchDetailOutlet,
  accountStoreEdit_formData,
  accountStoreEdit_formDataOfVerifyPin,
  accountStoreEdit_formValidations,
  accountStoreEdit_isEditable,
  accountStoreEdit_isLoading,
  accountStoreEdit_onCancel,
  accountStoreEdit_onCloseDialogVerifyPIN,
  accountStoreEdit_onDeleteOutlet,
  accountStoreEdit_onRemovePhoto,
  accountStoreEdit_onShowDialogDeleteOutlet,
  accountStoreEdit_onSubmit,
  accountStoreEdit_onSubmitDialogVerifyPIN,
  accountStoreEdit_onUploadPhoto,
  accountStoreEdit_routeParamsId,
} = useAccountStoreEditService();

/**
 * @description Provide all the data and methods what we need
 */
provide('accountStoreEdit', {
  accountStoreEdit_formData,
  accountStoreEdit_formValidations,
  accountStoreEdit_isEditable,
  accountStoreEdit_isLoading,
  accountStoreEdit_onCancel,
  accountStoreEdit_onCloseDialogVerifyPIN,
  accountStoreEdit_onDeleteOutlet,
  accountStoreEdit_onRemovePhoto,
  accountStoreEdit_onShowDialogDeleteOutlet,
  accountStoreEdit_onSubmit,
  accountStoreEdit_onSubmitDialogVerifyPIN,
  accountStoreEdit_onUploadPhoto,
  accountStoreEdit_routeParamsId,
});

const argsEventEmitter: IPropsDialogPinVerification = {
  isOpen: true,
  pinConfirmation: accountStoreEdit_formDataOfVerifyPin.pinConfirmation,
  onClickSecondaryButton: accountStoreEdit_onCloseDialogVerifyPIN,
};

eventBus.emit('AppBaseDialogPinVerification', argsEventEmitter);

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  if (accountStoreEdit_isEditable) {
    if (accountStoreEdit_routeParamsId.value !== undefined && accountStoreEdit_routeParamsId.value !== null) {
      await accountStoreEdit_fetchDetailOutlet(accountStoreEdit_routeParamsId.value);
    } else {
      console.error('Error: accountStoreEdit_routeParamsId.value is undefined or null.');
    }
  }
});
</script>

<template>
  <section id="account-store-edit" class="flex flex-col w-full pb-5 gap-6">
    <AccountStoreEditFormDetail />
    <AccountStoreEditFormLocation />
    <AccountStoreEditFormOperational />
    <AccountStoreEditButtonActions />

    <AppBaseDialogPinVerification
      v-model:pin-confirmation="accountStoreEdit_formDataOfVerifyPin.pinConfirmation"
    />
    <AppBaseDialogConfirmation id="account-store-edit-dialog-confirmation" />
  </section>
</template>
