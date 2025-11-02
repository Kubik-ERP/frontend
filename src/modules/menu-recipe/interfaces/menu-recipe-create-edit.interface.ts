// Interfaces
import type { Validation } from '@vuelidate/core';

// Import interfaces for proper typing
import type { IInventoryItems } from '@/modules/items/interfaces';
import type { IProductItem } from '@/modules/cashier/interfaces/cashier-response';

export interface IMenuRecipeCreateEditIngredientItem {
  itemId: IInventoryItems | null;
  quantity: number;
  uom: string | null;
  notes: string | null;
  cost: number;
}

export interface IMenuRecipeCreateEditForm {
  recipeName: string;
  outputUnit: string;
  productId: string | null;
  targetYield: number | null;
  baseRecipe: boolean;
  costPortion: number;
  marginPerSellingPriceRp: number;
  marginPerSellingPricePercent: number;
  ingredients: IMenuRecipeCreateEditIngredientItem[];
}

export interface IMenuRecipeCreateEditProvided {
  menuRecipeCreateEdit_fetchCreate: () => Promise<unknown>;
  menuRecipeCreateEdit_fetchDetails: (id: string) => Promise<unknown>;
  menuRecipeCreateEdit_fetchUpdate: (id: string) => Promise<unknown>;
  menuRecipeCreateEdit_formData: Ref<IMenuRecipeCreateEditForm>;
  menuRecipeCreateEdit_formDataOfIngredientItem: Ref<IMenuRecipeCreateEditIngredientItem>;
  menuRecipeCreateEdit_formValidations: Validation;
  menuRecipeCreateEdit_formValidationsOfIngredientItem: Validation;
  menuRecipeCreateEdit_isEditMode: ComputedRef<boolean>;
  menuRecipeCreateEdit_isLoading: Ref<boolean>;
  menuRecipeCreateEdit_listColumns: IColumnDataTable[];
  menuRecipeCreateEdit_listIngredientItemsOnDialog: Ref<IMenuRecipeCreateEditIngredientItem[]>;
  menuRecipeCreateEdit_listOutputUnitOptions: IDropdownItem[];
  menuRecipeCreateEdit_onAddIngredientItem: () => void;
  menuRecipeCreateEdit_onEditIngredientItem: (index: number) => void;
  menuRecipeCreateEdit_onDeleteIngredientItem: (index: number) => void;
  menuRecipeCreateEdit_onCancelEditIngredientItem: () => void;
  menuRecipeCreateEdit_onCancel: () => void;
  menuRecipeCreateEdit_onLoadInitialData: () => Promise<void>;
  menuRecipeCreateEdit_onResetForm: () => void;
  menuRecipeCreateEdit_onSave: () => Promise<void>;
  menuRecipeCreateEdit_onSaveIngredientItems: () => void;
  menuRecipeCreateEdit_onShowDialogAddIngredient: () => void;
  menuRecipeCreateEdit_onShowDialogCancelAddIngredient: () => void;
  menuRecipeCreateEdit_onShowDialogSaveIngredients: () => void;
  menuRecipeCreateEdit_onShowDialogDeleteIngredient: (index: number) => void;
  menuRecipeCreateEdit_onConfirmDeleteIngredient: () => void;
  menuRecipeCreateEdit_onCancelDeleteIngredient: () => void;
  menuRecipeCreateEdit_selectedIngredientIndex: Ref<number>;
  // Ingredient edit state
  menuRecipeCreateEdit_isEditingIngredientItem: Ref<boolean>;
  menuRecipeCreateEdit_editingIngredientItemIndex: Ref<number>;
  // Product search properties
  menuRecipeCreateEdit_listProducts: Ref<IProductItem[]>;
  menuRecipeCreateEdit_onSearchProduct: () => Promise<void>;
  menuRecipeCreateEdit_productSearchValue: Ref<string>;
  menuRecipeCreateEdit_selectedProduct: Ref<IProductItem | null>;
  menuRecipeCreateEdit_onSelectProduct: (product: IProductItem) => void;
  menuRecipeCreateEdit_onResetProductSearch: () => void;
  menuRecipeCreateEdit_isLoadingProducts: Ref<boolean>;
  // Inventory items properties
  menuRecipeCreateEdit_listInventoryItems: Ref<IInventoryItems[]>;
  menuRecipeCreateEdit_fetchInventoryItems: () => Promise<void>;
  menuRecipeCreateEdit_isLoadingInventoryItems: Ref<boolean>;
  // Computed calculations
  menuRecipeCreateEdit_totalCostPortion: ComputedRef<number>;
  menuRecipeCreateEdit_calculatedMarginRp: ComputedRef<number>;
  menuRecipeCreateEdit_calculatedMarginPercent: ComputedRef<number>;
}
