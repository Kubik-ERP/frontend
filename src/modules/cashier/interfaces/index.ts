export interface ICashierCategory {
  name: string;
  total: number;
}

export interface ICashierProduct {
  id: number;
  name: string;
  category: string;
  price: string;
  discountedPrice: string;
  image: string;
}

export interface ICashierStateStore {
  cashier_listCategory: ICashierCategory[];
  cashier_listFeaturedProduct: ICashierProduct[];
  cashier_listFood: ICashierProduct[];
  cashier_listDrink: ICashierProduct[];
}
