<script setup lang="ts">
// Components
import MenuRecipeAddIngredientsDialog from '../components/create-edit/MenuRecipeAddIngredientsDialog.vue';
import MenuRecipeContent from '../components/create-edit/MenuRecipeContent.vue';

// Services
import { useMenuRecipeCreateEditService } from '../services/menu-recipe-create-edit.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  menuRecipeCreateEdit_formData,
  menuRecipeCreateEdit_formDataOfIngredientItem,
  menuRecipeCreateEdit_formValidations,
  menuRecipeCreateEdit_formValidationsOfIngredientItem,
  menuRecipeCreateEdit_isEditMode,
  menuRecipeCreateEdit_listColumns,
  menuRecipeCreateEdit_listIngredientItemsOnDialog,
  menuRecipeCreateEdit_listOutputUnitOptions,
  menuRecipeCreateEdit_onAddIngredientItem,
  menuRecipeCreateEdit_onCancel,
  menuRecipeCreateEdit_onDeleteIngredientItem,
  menuRecipeCreateEdit_onEditIngredientItem,
  menuRecipeCreateEdit_onSave,
  menuRecipeCreateEdit_onSaveIngredientItems,
  menuRecipeCreateEdit_onShowDialogAddIngredient,
  menuRecipeCreateEdit_onShowDialogCancelAddIngredient,
  menuRecipeCreateEdit_onShowDialogSaveIngredients,
  // Product search functionality
  menuRecipeCreateEdit_listProducts,
  menuRecipeCreateEdit_onSearchProduct,
  menuRecipeCreateEdit_productSearchValue,
  menuRecipeCreateEdit_selectedProduct,
  menuRecipeCreateEdit_onSelectProduct,
  menuRecipeCreateEdit_onResetProductSearch,
  menuRecipeCreateEdit_isLoadingProducts,
  // Inventory items functionality
  menuRecipeCreateEdit_listInventoryItems,
  menuRecipeCreateEdit_fetchInventoryItems,
  menuRecipeCreateEdit_isLoadingInventoryItems,
  menuRecipeCreateEdit_calculatedMarginRp,
  menuRecipeCreateEdit_calculatedMarginPercent,
  menuRecipeCreateEdit_totalCostPortion,
} = useMenuRecipeCreateEditService();

/**
 * @description Provide all the data and methods what we need
 */
provide('menuRecipeCreateEdit', {
  menuRecipeCreateEdit_formData,
  menuRecipeCreateEdit_formDataOfIngredientItem,
  menuRecipeCreateEdit_formValidations,
  menuRecipeCreateEdit_formValidationsOfIngredientItem,
  menuRecipeCreateEdit_isEditMode,
  menuRecipeCreateEdit_listColumns,
  menuRecipeCreateEdit_listIngredientItemsOnDialog,
  menuRecipeCreateEdit_listOutputUnitOptions,
  menuRecipeCreateEdit_onAddIngredientItem,
  menuRecipeCreateEdit_onCancel,
  menuRecipeCreateEdit_onDeleteIngredientItem,
  menuRecipeCreateEdit_onEditIngredientItem,
  menuRecipeCreateEdit_onSave,
  menuRecipeCreateEdit_onSaveIngredientItems,
  menuRecipeCreateEdit_onShowDialogAddIngredient,
  menuRecipeCreateEdit_onShowDialogCancelAddIngredient,
  menuRecipeCreateEdit_onShowDialogSaveIngredients,
  // Product search
  menuRecipeCreateEdit_listProducts,
  menuRecipeCreateEdit_onSearchProduct,
  menuRecipeCreateEdit_productSearchValue,
  menuRecipeCreateEdit_selectedProduct,
  menuRecipeCreateEdit_onSelectProduct,
  menuRecipeCreateEdit_onResetProductSearch,
  menuRecipeCreateEdit_isLoadingProducts,
  // Inventory items
  menuRecipeCreateEdit_listInventoryItems,
  menuRecipeCreateEdit_fetchInventoryItems,
  menuRecipeCreateEdit_isLoadingInventoryItems,
  menuRecipeCreateEdit_calculatedMarginRp,
  menuRecipeCreateEdit_calculatedMarginPercent,
  menuRecipeCreateEdit_totalCostPortion,
});
</script>

<template>
  <section id="menu-recipe-create-edit-ui" class="default-wrapper gap-10">
    <MenuRecipeContent />

    <AppBaseDialogConfirmation id="menu-recipe-create-edit-dialog-confirmation" />
    <AppBaseDialogConfirmation id="menu-recipe-save-ingredients-dialog-confirmation" />
    <MenuRecipeAddIngredientsDialog />
  </section>
</template>
