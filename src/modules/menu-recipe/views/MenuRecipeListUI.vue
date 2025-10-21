<script setup lang="ts">
// Components
import MenuRecipeListTable from '../components/MenuRecipeListTable.vue';

// Services
import { useMenuRecipeListService } from '../services/menu-recipe-list.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  menuRecipeList_columns,
  menuRecipeList_fetchList,
  menuRecipeList_handleOnSortChange,
  menuRecipeList_isLoading,
  menuRecipeList_onChangePage,
  menuRecipeList_onShowDialogDelete,
  menuRecipeList_queryParams,
  menuRecipeList_values,
} = useMenuRecipeListService();

/**
 * @description Provide all the data and methods what we need
 */
provide('menuRecipeList', {
  menuRecipeList_columns,
  menuRecipeList_fetchList,
  menuRecipeList_handleOnSortChange,
  menuRecipeList_isLoading,
  menuRecipeList_onChangePage,
  menuRecipeList_onShowDialogDelete,
  menuRecipeList_queryParams,
  menuRecipeList_values,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(() => {
  // Fetch the list when component is mounted
  menuRecipeList_fetchList();
});
</script>

<template>
  <section id="menu-recipe-list-ui" class="default-wrapper">
    <MenuRecipeListTable />

    <AppBaseDialogConfirmation id="menu-recipe-list-dialog-delete" />
  </section>
</template>
