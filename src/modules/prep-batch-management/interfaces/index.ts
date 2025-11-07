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
  recipeId: string | null;
  recipeName: string;
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
  batch_isLoading: boolean;
  batch_lists: {
    data: {
      id: string;
      batchName: string;
      date: Date;
      batch_target_yield: number;
      notes: string;
      status: string;
      updated_at: Date;
    }[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  batchDetail_values: IBatchDetailsResponse;
  menuRecipe_lists: {
    meta: IPageMeta;
    items: IMenuRecipe[] | [];
  };
  menuRecipeList_isLoading: boolean;
  menuRecipe_ingredients: IIngredient[];
}

export type IBatchQueryParams = {
  page: number;
  limit: number;
};

export interface IBatchDetailsResponse {
  id: string;
  recipe_id: string;
  date: Date;
  batch_target_yield: number;
  batch_waste: number;
  notes: string | null;
  created_at: Date;
  created_by: number;
  updated_at: Date | null;
  updated_by: number | null;
  status: string;
  cost_batch: number | null;
  cost_portion: number | null;
  margin_selling_price: number | null;
  cooking_at: Date | null;
  store_id: string;
  menu_recipes: {
    recipe_id: string;
    recipe_name: string;
    target_yield: number;
    output_unit: string;
  };
  batch_cooking_recipe_ingredient: Array<{
    id: string;
    batch_id: string;
    ingredient_id: string;
    qty: number;
    base_price: number;
    cost: number;
    created_at: Date;
    updated_at: Date | null;
    recipe_id: string;
    ingredients: {
      master_inventory_items: {
        id: string;
        name: string;
        unit: string;
      };
    };
  }>;
}

export interface batch_saveDraftResponse {
  data: {
    id: string
  }
}

export interface IWasteLogItem_formData {
  batchWaste: number;
  notes?: string | null;
  setWastePerItemIngridients: boolean;
  wasteLog: {
    items: {
      inventoryItemId: string;
      quantity: number;
      uom: string;
      category: string;
      notes?: string | null;
      photoUrl?: string | null;
    }[];
  };
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
  menuRecipeList_onShowDialogCancel: (id: string) => void;
  menuRecipeList_fetchList: () => Promise<unknown>;
  menuRecipeList_onSelectedRecipe: (recipe: IMenuRecipe) => void;
  menuRecipe_fetchIngridients: (id: string) => Promise<unknown>;
  batch_fetchList: () => Promise<unknown>;
  batch_onChangePage: (page: number) => void;
  batch_queryParams: IBatchQueryParams;
  batch_fetchDetails: (id: string) => Promise<unknown>;
  // formdata
  batch_formData: IBatchFormData;
  batch_formValidation: globalThis.Ref<Validation>;
  menuRecipeList_queryParams: IMenuRecipeListQueryParams;
  // store values
  menuRecipe_lists: globalThis.Ref<IBatchStateStore['menuRecipe_lists']>;
  menuRecipeList_isLoading: globalThis.Ref<IBatchStateStore['menuRecipeList_isLoading']>;
  menuRecipe_ingredients: globalThis.Ref<IBatchStateStore['menuRecipe_ingredients']>;
  batch_isLoading: globalThis.Ref<IBatchStateStore['batch_isLoading']>;
  batch_lists: globalThis.Ref<IBatchStateStore['batch_lists']>;
  batchDetail_values: globalThis.Ref<IBatchDetailsResponse>;
  // dialog confirmation
  batchCreateEdit_onShowDialogStart: (id: string) => void;
  batchCreateEdit_onShowDialogSave: () => void;
  batchCreateEdit_onShowDialogUpdate: (id: string) => void;
  batchCreateEdit_onShowDialogCancel: (id: string) => void;
  batchDetails_onShowDialogStart: (id: string) => void;
  // batch details
  // methods
  batchDetails_onCompleteBatch: () => void;
  // formdata
  batchDetails_formData: IBatchDetailsFormData;
  batchDetails_formValidation: globalThis.Ref<Validation>;
  // batch detail dialog
  batchDetails_onShowDialogCompleteBatch: () => void;
  batchDetails_onCloseDialogCompleteBatch: () => void;
  // create edit batch methods
  batchCreateEdit_onSaveDraft: () => void;
  // waste log
  batch_wasteLog_formData: IWasteLogItem_formData;
};
