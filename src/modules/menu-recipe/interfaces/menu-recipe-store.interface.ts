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
  products: IProducts;
  ingredients: IIngredient[];
}

export interface IMenuRecipeDetailVersion extends IMenuRecipe {
  version_id: string;
  version_number: string;
}

export interface IMenuRecipeListVersion {
  versions: IMenuRecipeVersion[];
}

export interface IMenuRecipeVersion {
  versionId: string;
  versionNumber: string;
  createdAt: string;
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
  name: string;
  brand_id: string;
  barcode: null | string;
  sku: string;
  category_id: string;
  unit: string;
  notes: string;
  stock_quantity: number;
  reorder_level: number;
  minimum_stock_quantity: number;
  expiry_date: null;
  storage_location_id: null;
  price_per_unit: number;
  supplier_id: string;
  created_at: Date;
  updated_at: Date;
  store_id: string;
  price_grosir: number;
  master_inventory_item_conversions?: IUnitConversion[];
  markup?: number;
  margin?: number;
}

export interface IUnitConversion {
  id: string;
  itemId: string;
  unitName: string;
  unitSymbol: string;
  conversionValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProducts {
  id: string;
  name: string;
  price: number;
  discount_price: null;
  picture_url: string;
  is_percent: boolean;
  stores_id: string;
  master_inventory_item_id: string;
  barcode: string;
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

export interface IMenuRecipeDetailVersionResponse extends IDefaultResponseFetch {
  data: IMenuRecipeDetailVersion;
}

export interface IMenuRecipeListResponse extends IDefaultResponseFetch {
  data: {
    meta: IPageMeta;
    items: IMenuRecipeList[] | [];
  };
}

export interface IMenuRecipeListVersionResponse extends IDefaultResponseFetch {
  data: IMenuRecipeListVersion;
}

export interface IMenuRecipeStateStore {
  menuRecipe_selectedData: IMenuRecipe | null;
  menuRecipe_isLoading: boolean;
  menuRecipe_lists: {
    meta: IPageMeta;
    items: IMenuRecipeList[] | [];
  };
  menuRecipe_versions: IMenuRecipeListVersion | null;
}
