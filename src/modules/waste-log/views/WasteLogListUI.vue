<script setup lang="ts">
// Vue
import { onMounted } from 'vue';

// Components
import WasteLogCreateEditDialog from '../components/WasteLogCreateEditDialog.vue';
import WasteLogListTable from '../components/WasteLogListTable.vue';

// Services
import { useWasteLogListService } from '../services/waste-log-list.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  wasteLogList_categoryOptions,
  wasteLogList_columns,
  wasteLogList_fetchDetail,
  wasteLogList_fetchInventoryItems,
  wasteLogList_fetchList,
  wasteLogList_formData,
  wasteLogList_formValidations,
  wasteLogList_handleOnSortChange,
  wasteLogList_inventoryItems,
  wasteLogList_isLoading,
  wasteLogList_isLoadingInventoryItems,
  wasteLogList_mapApiResponseToFormData,
  wasteLogList_mapFormDataToApiPayload,
  wasteLogList_onAddWasteLogItem,
  wasteLogList_onChangePage,
  wasteLogList_onDeleteWasteLogItem,
  wasteLogList_onInitializeForm,
  wasteLogList_onRemovePhoto,
  wasteLogList_onSaveWasteLog,
  wasteLogList_onSelectPhoto,
  wasteLogList_onShowDialogAddOrEditWasteLog,
  wasteLogList_onShowDialogCancelAddOrEditWasteLog,
  wasteLogList_onShowDialogDelete,
  wasteLogList_queryParams,
  wasteLogList_setScrollCallback,
  wasteLogList_uomOptions,
  wasteLogList_updateWasteLog,
  wasteLogList_values,
} = useWasteLogListService();

/**
 * @description Provide all the data and methods what we need
 */
provide('wasteLogList', {
  wasteLogList_categoryOptions,
  wasteLogList_columns,
  wasteLogList_fetchDetail,
  wasteLogList_fetchInventoryItems,
  wasteLogList_fetchList,
  wasteLogList_formData,
  wasteLogList_formValidations,
  wasteLogList_handleOnSortChange,
  wasteLogList_inventoryItems,
  wasteLogList_isLoading,
  wasteLogList_isLoadingInventoryItems,
  wasteLogList_mapApiResponseToFormData,
  wasteLogList_mapFormDataToApiPayload,
  wasteLogList_onAddWasteLogItem,
  wasteLogList_onChangePage,
  wasteLogList_onDeleteWasteLogItem,
  wasteLogList_onInitializeForm,
  wasteLogList_onRemovePhoto,
  wasteLogList_onSaveWasteLog,
  wasteLogList_onSelectPhoto,
  wasteLogList_onShowDialogAddOrEditWasteLog,
  wasteLogList_onShowDialogCancelAddOrEditWasteLog,
  wasteLogList_onShowDialogDelete,
  wasteLogList_queryParams,
  wasteLogList_setScrollCallback,
  wasteLogList_uomOptions,
  wasteLogList_updateWasteLog,
  wasteLogList_values,
});

/**
 * @description Lifecycle hooks
 */
onMounted(() => {
  wasteLogList_fetchInventoryItems();
  wasteLogList_fetchList();
});
</script>

<template>
  <section id="waste-log-list-ui" class="default-wrapper">
    <WasteLogListTable />
    <WasteLogCreateEditDialog />

    <AppBaseDialogConfirmation id="waste-log-list-dialog-confirmation" />
  </section>
</template>
