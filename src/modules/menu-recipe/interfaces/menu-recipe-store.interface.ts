export interface IMenuRecipe {
  recipe_id: string;
  recipe_name: string;
  output_unit: string;
  base_recipe: boolean;
  product_id: string;
  target_yield: number;
  cost_portion: number;
  margin_per_selling_price_rp: number;
  margin_per_selling_price_percent: number;
  store_id: string;
  created_at: Date;
  updated_at: Date;
  ingredients: IIngredient[];
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

export interface IInventoryItem {
  id: string;
}

export interface IMenuRecipeCreateEditFormPayload {
  recipeName: string;
  outputUnit: string;
  baseRecipe: boolean;
  productId: string;
  targetYield: number;
  costPortion: number;
  marginPerSellingPriceRp: number;
  marginPerSellingPricePercent: number;
  ingredients: Ingredient[];
}

export interface Ingredient {
  itemId: string;
  qty: number;
  uom: string;
  notes: string;
  cost: number;
}

export interface IMenuRecipeList {
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

export type IMenuRecipeDeleteResponse = Omit<IDefaultResponseFetch, 'data'>;

export interface IMenuRecipeDetailResponse extends IDefaultResponseFetch {
  data: IMenuRecipe;
}

export interface IMenuRecipeCreateEditResponse {
  recipe_id: string;
  recipe_name: string;
  output_unit: string;
  base_recipe: boolean;
  product_id: string;
  target_yield: number;
  cost_portion: number;
  margin_per_selling_price_rp: number;
  margin_per_selling_price_percent: number;
  store_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface IMenuRecipeListResponse extends IDefaultResponseFetch {
  data: {
    meta: IPageMeta;
    items: IMenuRecipeList[] | [];
  };
}

export interface IMenuRecipeStateStore {
  menuRecipe_selectedData: IMenuRecipe | null;
  menuRecipe_isLoading: boolean;
  menuRecipe_lists: {
    meta: IPageMeta;
    items: IMenuRecipeList[] | [];
  };
}
