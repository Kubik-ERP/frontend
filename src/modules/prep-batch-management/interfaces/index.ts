import type { Validation } from '@vuelidate/core';
import type { IMenuRecipeListQueryParams } from '@/modules/menu-recipe/interfaces';

export interface IMenuRecipe {
  id: string;
  isBaseRecipe: boolean;
  recipeName: string;
  output: string;
  yieldTarget: number;
  costPerPortion: number;
  marginRp: number;
  marginPercent: number;
  updatedAt: string;
}

export interface IInventoryItem {
  id: string;
}

export interface IIngredient {
  ingredient_id: string;
  item_id: string;
  qty: number;
  uom: string;
  notes: string;
  cost: number;
  inventory_item: IInventoryItem;
}
export interface IBatchFormData {
  recipeId : string | null;
  recipeName : string;
  recipe: IMenuRecipe;
  batchDate: Date;
  targetYield: number;
  waste: number;
  notes?: string | null;
  ingredients?: IIngredient[] | [];
}

export interface IBatchDetailsFormData {
  actualBatchYield: number;
  setWastePerItemIngridients: boolean;
  notes?: string | null;
}

export interface IBatchDetailsRecipe {
  batchName: string;
  recipeName: string;
  batchDate: Date;
  batchStatus: string;
  productLinked: string;
  productPrice: number;
  targetYield: number;
  batchWaste: number;
}

export interface IBatchDetailsProductionCost {
  costBatch: number;
  costPortion: number;
  marginPerSellingPrice: number;
  marginPerSellingPercentage: number;
}

export interface IBatchDetailsIngredient {
  item: string;
  qty: number;
  UOM: string;
  notes?: string | null;
  cost: number;
}

export interface IBatchDetails {
  recipe: IBatchDetailsRecipe;
  productionCost: IBatchDetailsProductionCost;
  ingridients: IBatchDetailsIngredient[];
}

export type IBatchList = {
  batch: string;
  batchDate: Date;
  targetYield: string;
  notes?: string | null;
  batchStatus: string;
  updatedAt: Date;
};

export interface IBatchStateStore {
  menuRecipe_lists: {
    meta: IPageMeta;
    items: IMenuRecipe[] | [];
  };
  menuRecipeList_isLoading: boolean;
  menuRecipe_ingredients: IIngredient[];
}

export type IBatchListProvided = {
  // columns
  batchList_columns: IColumnDataTable[];
  batchDetailsIngridient_columns: IColumnDataTable[];
  // values
  batchList_values: IBatchList[];
  batchDetails_values: IBatchDetails;
  // method
  batchList_getClassOfBatchStatus: (batchStatus: string) => string;
  menuRecipeList_onShowDialogDelete: (id: string) => void;
  menuRecipeList_fetchList: () => Promise<unknown>;
  menuRecipeList_onSelectedRecipe: (recipe: IMenuRecipe) => void;
  menuRecipe_fetchIngridients: (id: string) => Promise<unknown>;
  // formdata
  batch_formData: IBatchFormData;
  batch_formValidation: globalThis.Ref<Validation>;
  menuRecipeList_queryParams: IMenuRecipeListQueryParams;
  // store values
  menuRecipe_lists: globalThis.Ref<IBatchStateStore['menuRecipe_lists']>;
  menuRecipeList_isLoading: globalThis.Ref<IBatchStateStore['menuRecipeList_isLoading']>;
  menuRecipe_ingredients: globalThis.Ref<IBatchStateStore['menuRecipe_ingredients']>;
  // dialog confirmation
  batchCreateEdit_onShowDialogStart: (id: string) => void;
  batchCreateEdit_onShowDialogSave: () => void;
  batchCreateEdit_onShowDialogUpdate: (id: string) => void;
  batchCreateEdit_onShowDialogCancel: (id: string) => void;

  // batch details
  // formdata
  batchDetails_formData: IBatchDetailsFormData;
  batchDetails_formValidation: globalThis.Ref<Validation>;
  // batch detail dialog
  batchDetails_onShowDialogCompleteBatch: () => void;
  batchDetails_onCloseDialogCompleteBatch: () => void;
  // create edit batch methods
  batchCreateEdit_onSaveDraft: () => void;
};
