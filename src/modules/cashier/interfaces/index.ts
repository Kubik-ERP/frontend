export interface ICashierCategory {
  id: number;
  name: string;
  total: number;
  image: string;
}

export interface ICashierProduct {
  id: number;
  name: string;
  category: string;
  price: string;
  discountedPrice: string | null;
  image: string;
}

export interface ICashierStateStore {
  cashierProduct_listCategory: ICashierCategory[];
  cashierProduct_listFeaturedProduct: ICashierProduct[];
  cashierProduct_listFood: ICashierProduct[];
  cashierProduct_listDrink: ICashierProduct[];
}
