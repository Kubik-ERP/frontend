<script setup lang="ts">
// Components
import AccountStoreTableConfigurationNotFound from '../components/table-configuration/AccountStoreTableConfigurationNotFound.vue';
import TableConfigurationAddFloorDialog from '../components/table-configuration/TableConfigurationAddFloorDialog.vue';
import TableConfigurationAddTableDialog from '../components/table-configuration/TableConfigurationAddTableDialog.vue';
import TableConfigurationButtonActions from '../components/table-configuration/TableConfigurationButtonActions.vue';
import TableConfigurationLayout from '../components/table-configuration/TableConfigurationLayout.vue';

// Interfaces
import type { NavigationGuardNext } from 'vue-router';

// Services
import { useAccountStoreTableConfigurationService } from '../services/account-store-table-configuration.service';

/**
 * Destructure all the data and methods we need
 */
const {
  accountStoreTableConfiguration_checkIfAlreadyHaveTable,
  accountStoreTableConfiguration_editableData,
  accountStoreTableConfiguration_fetchOutletStoreTable,
  accountStoreTableConfiguration_formData,
  accountStoreTableConfiguration_formDataOfAddFloor,
  accountStoreTableConfiguration_formDataOfAddTable,
  accountStoreTableConfiguration_formValidations,
  accountStoreTableConfiguration_formValidationsOfAddFloor,
  accountStoreTableConfiguration_formValidationsOfAddTable,
  accountStoreTableConfiguration_isAlreadyHaveTable,
  accountStoreTableConfiguration_isEditableMode,
  accountStoreTableConfiguration_isShowDialogExitConfirmation,
  accountStoreTableConfiguration_lists,
  accountStoreTableConfiguration_listShapes,
  accountStoreTableConfiguration_onCloseDialogAddFloor,
  accountStoreTableConfiguration_onCloseDialogAddTable,
  accountStoreTableConfiguration_onShowDialogAddFloor,
  accountStoreTableConfiguration_onShowDialogAddTable,
  accountStoreTableConfiguration_onShowDialogDeleteTable,
  accountStoreTableConfiguration_onShowDialogEditFloor,
  accountStoreTableConfiguration_onShowDialogEditTable,
  accountStoreTableConfiguration_onShowDialogEnableQrCode,
  accountStoreTableConfiguration_onSubmit,
  accountStoreTableConfiguration_onSubmitFormAddFloor,
  accountStoreTableConfiguration_onSubmitFormAddTable,
} = useAccountStoreTableConfigurationService();

/**
 * Provide all the data and methods we need
 */
provide('accountStoreTableConfiguration', {
  accountStoreTableConfiguration_editableData,
  accountStoreTableConfiguration_formData,
  accountStoreTableConfiguration_formDataOfAddFloor,
  accountStoreTableConfiguration_formDataOfAddTable,
  accountStoreTableConfiguration_formValidations,
  accountStoreTableConfiguration_formValidationsOfAddFloor,
  accountStoreTableConfiguration_formValidationsOfAddTable,
  accountStoreTableConfiguration_isAlreadyHaveTable,
  accountStoreTableConfiguration_isEditableMode,
  accountStoreTableConfiguration_lists,
  accountStoreTableConfiguration_listShapes,
  accountStoreTableConfiguration_onCloseDialogAddFloor,
  accountStoreTableConfiguration_onCloseDialogAddTable,
  accountStoreTableConfiguration_onShowDialogAddFloor,
  accountStoreTableConfiguration_onShowDialogAddTable,
  accountStoreTableConfiguration_onShowDialogEditFloor,
  accountStoreTableConfiguration_onShowDialogDeleteTable,
  accountStoreTableConfiguration_onShowDialogEditTable,
  accountStoreTableConfiguration_onShowDialogEnableQrCode,
  accountStoreTableConfiguration_onSubmit,
  accountStoreTableConfiguration_onSubmitFormAddFloor,
  accountStoreTableConfiguration_onSubmitFormAddTable,
});

// Variabel untuk menyimpan fungsi 'next' dari router guard
let pendingNavigation: NavigationGuardNext | null = null;

// 👉 PERBAIKAN 1: Handler untuk 'beforeunload' (refresh/close tab)
// Fungsi ini HANYA untuk memicu dialog NATIVE browser.
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  const hasUnsavedChanges = accountStoreTableConfiguration_checkIfAlreadyHaveTable();

  if (hasUnsavedChanges) {
    // Baris ini mencegah tindakan default (langsung keluar)
    event.preventDefault();
    // Diperlukan oleh beberapa browser lama untuk menampilkan prompt
    event.returnValue = '';
  }
};

// 👉 PERBAIKAN 2: Handler untuk navigasi internal (menggunakan dialog kustom)
onBeforeRouteLeave((_to, _from, next) => {
  const hasUnsavedChanges = accountStoreTableConfiguration_checkIfAlreadyHaveTable();

  if (hasUnsavedChanges) {
    // Simpan fungsi `next` untuk dieksekusi nanti
    pendingNavigation = next;
    // Tampilkan dialog kustom Anda
    accountStoreTableConfiguration_isShowDialogExitConfirmation.value = true;
  } else {
    // Jika tidak ada perubahan, langsung lanjutkan navigasi
    next();
  }
});

/**
 * Handler ketika user menekan tombol "Confirm" pada DIALOG KUSTOM.
 */
const handleConfirmLeave = () => {
  accountStoreTableConfiguration_isShowDialogExitConfirmation.value = false;
  // Jika ada navigasi yang tertunda, lanjutkan
  if (pendingNavigation) {
    pendingNavigation(); // Ini sama dengan next()
    pendingNavigation = null;
  }
};

/**
 * Handler ketika user menekan tombol "Cancel" pada DIALOG KUSTOM.
 */
const handleCancelLeave = () => {
  accountStoreTableConfiguration_isShowDialogExitConfirmation.value = false;
  // Jika ada navigasi yang tertunda, batalkan
  if (pendingNavigation) {
    pendingNavigation(false); // Ini sama dengan next(false)
    pendingNavigation = null;
  }
};

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  accountStoreTableConfiguration_fetchOutletStoreTable();

  // Tambahkan listener untuk event refresh/close tab
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
  // PENTING: Hapus listener saat komponen dihancurkan untuk mencegah memory leak
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<template>
  <section id="account-store-table-configuration" class="container flex flex-col items-center gap-4 w-full mt-10">
    <template v-if="accountStoreTableConfiguration_formData.configurations.length > 0">
      <section
        v-for="(configuration, configurationIndex) in accountStoreTableConfiguration_formData.configurations"
        id="account-store-table-list-configurations"
        :key="`configuration-${configurationIndex}`"
        class="flex flex-col gap-6 w-full"
      >
        <TableConfigurationLayout :configuration="configuration" />
      </section>

      <TableConfigurationButtonActions />
    </template>

    <template v-else>
      <AccountStoreTableConfigurationNotFound />
    </template>

    <TableConfigurationAddFloorDialog />
    <TableConfigurationAddTableDialog />
    <AppBaseDialogConfirmation id="account-store-table-dialog-confirmation" />

    <AppBaseDialogExitConfirmation
      v-model:visible="accountStoreTableConfiguration_isShowDialogExitConfirmation"
      title="Unsaved Changes"
      description="You have unsaved changes. Are you sure you want to leave?"
      confirm-button-text="Leave"
      cancel-button-text="Stay"
      icon="exclude"
      @confirm="handleConfirmLeave"
      @cancel="handleCancelLeave"
    />
  </section>
</template>
