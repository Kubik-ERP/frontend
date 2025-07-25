<script setup lang="ts">
// Components
import AccountStoreTableConfigurationNotFound from '../components/table-configuration/AccountStoreTableConfigurationNotFound.vue';
import TableConfigurationAddFloorDialog from '../components/table-configuration/TableConfigurationAddFloorDialog.vue';
import TableConfigurationAddTableDialog from '../components/table-configuration/TableConfigurationAddTableDialog.vue';
import TableConfigurationButtonActions from '../components/table-configuration/TableConfigurationButtonActions.vue';
import TableConfigurationLayout from '../components/table-configuration/TableConfigurationLayout.vue';

// Services
import { useAccountStoreTableConfigurationService } from '../services/account-store-table-configuration.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  accountStoreTableConfiguration_editableData,
  accountStoreTableConfiguration_formData,
  accountStoreTableConfiguration_formDataOfAddFloor,
  accountStoreTableConfiguration_formDataOfAddTable,
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
  accountStoreTableConfiguration_onShowDialogDeleteTable,
  accountStoreTableConfiguration_onShowDialogEditFloor,
  accountStoreTableConfiguration_onShowDialogEditTable,
  accountStoreTableConfiguration_onShowDialogEnableQrCode,
  accountStoreTableConfiguration_onSubmit,
  accountStoreTableConfiguration_onSubmitFormAddFloor,
  accountStoreTableConfiguration_onSubmitFormAddTable,
} = useAccountStoreTableConfigurationService();

/**
 * @description Provide all the data and methods what we need
 */
provide('accountStoreTableConfiguration', {
  accountStoreTableConfiguration_editableData,
  accountStoreTableConfiguration_formData,
  accountStoreTableConfiguration_formDataOfAddFloor,
  accountStoreTableConfiguration_formDataOfAddTable,
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
</script>

<template>
  <section id="account-store-table-configuration" class="flex flex-col items-center gap-4 w-full">
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
  </section>
</template>
