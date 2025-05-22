export interface ICashierCategory {
  id: number;
  name: string;
  total: number;
  image: string;
}

export interface ICashierVariant {
  id: number;
  name: string;
  price: number;
}

export interface ICashierModalAddProductItem {
  qty: number;
  variant: ICashierVariant;
  notes: string;
}

export interface ICashierProduct {
  id: number;
  name: string;
  category: string;
  price: string;
  discountedPrice: string | null;
  image: string;
  qty: number;
  variant: ICashierVariant[];
}

export interface ICashierSelected {
  product: ICashierProduct;
  variant: ICashierVariant;
  qty: number;
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
