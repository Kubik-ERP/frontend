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
};
