export interface ICashierCategory {
  id: number;
  name: string;
  total: number;
  image: string;
}

export interface ICashierVariant {
  variantId: string;
  name: string;
  price: number;
}

export interface ICashierModalAddProductItem {
  quantity: number;
  variant: ICashierVariant;
  notes: string;
}

export interface ICashierProduct {
  productId: string;
  name: string;
  category: string;
  price: string;
  discountedPrice: string | null;
  image: string;
  quantity: number;
  variant: ICashierVariant[];
}

export interface ICashierSelected {
  product: ICashierProduct;
  variant: ICashierVariant;
  productId: string;
  variantId: string;
  quantity: number;
  notes: string;
}

export interface ICashierModalAddProduct {
  show: boolean;
  isAddNotesActive: boolean;
  product: ICashierProduct | null;
  item: ICashierModalAddProductItem;
}

export interface ICashierStateStore {
  cashierProduct_selectedProduct: ICashierSelected[];
  cashierProduct_listCategory: ICashierCategory[];
  cashierProduct_listFeaturedProduct: ICashierProduct[];
  cashierProduct_listFood: ICashierProduct[];
  cashierProduct_listDrink: ICashierProduct[];
}
