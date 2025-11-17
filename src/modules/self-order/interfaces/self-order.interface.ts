/**
 * @description Interface for Self Order Category State
 */
export interface ISelfOrderCategoryState {
  data: unknown[];
  isLoading: boolean;
}

/**
 * @description Interface for Self Order Product State
 */
export interface ISelfOrderProductState {
  data: unknown[];
  isLoading: boolean;
}

/**
 * @description Interface for Self Order Modal Add Edit Item
 */
export interface ISelfOrderModalAddEditItem {
  isAddNotesActive: boolean;
  item: {
    notes: string;
    quantity: number;
    variant: unknown;
  };
  product: unknown;
  show: boolean;
}

/**
 * @description Interface for Self Order Modal Category
 */
export interface ISelfOrderModalCategory {
  show: boolean;
}
