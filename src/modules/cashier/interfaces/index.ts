export interface ICashierStateStore {
  cashier_category: ICashierCategory[];
  cashier_featured_product: ICashierProduct[];
  cashier_food: ICashierProduct[];
  cashier_drink: ICashierProduct[];
}

export interface ICashierCategory {
  name: string;
  total: number;
}

export interface ICashierProduct {
  id: number;
  name: string;
  category: string;
  price: string;
  discounted_price: string;
  image: string;
}
