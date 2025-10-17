<script setup lang="ts">
// Components
import MenuRecipeContent from '../components/detail/MenuRecipeContent.vue';

// Services
import { useMenuRecipeDetailService } from '../services/menu-recipe-detail.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  menuRecipeDetail_data,
  menuRecipeDetail_fetchDetails,
  menuRecipeDetail_fetchDelete,
  menuRecipeDetail_isLoading,
  menuRecipeDetail_listColumns,
  menuRecipeDetail_onBack,
  menuRecipeDetail_onCancelDialogDeleteConfirmation,
  menuRecipeDetail_onEdit,
  menuRecipeDetail_onLoadInitialData,
  menuRecipeDetail_onShowDialogDeleteConfirmation,
} = useMenuRecipeDetailService();

/**
 * @description Provide all the data and methods what we need
 */
provide('menuRecipeDetail', {
  menuRecipeDetail_data,
  menuRecipeDetail_fetchDetails,
  menuRecipeDetail_fetchDelete,
  menuRecipeDetail_isLoading,
  menuRecipeDetail_listColumns,
  menuRecipeDetail_onBack,
  menuRecipeDetail_onCancelDialogDeleteConfirmation,
  menuRecipeDetail_onEdit,
  menuRecipeDetail_onLoadInitialData,
  menuRecipeDetail_onShowDialogDeleteConfirmation,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(() => {
  menuRecipeDetail_onLoadInitialData();
});
</script>

<template>
  <section id="menu-recipe-detail-ui" class="default-wrapper">
    <MenuRecipeContent />

    <AppBaseDialogConfirmation id="menu-recipe-detail-dialog-delete" />
  </section>
</template>
