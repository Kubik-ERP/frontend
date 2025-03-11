import { defineStore } from 'pinia';

import { ICashierStateStore } from '../interfaces';

export const useCashierStore = defineStore('cashier', {
  state: (): ICashierStateStore => ({
    cashierProduct_listCategory: [
      {
        id: 1,
        name: 'Food',
        total: 120,
        image: 'https://foodish-api.com/images/pasta/pasta10.jpg',
      },
      {
        id: 2,
        name: 'Beverage',
        total: 120,
        image: 'https://foodish-api.com/images/pizza/pizza10.jpg',
      },
      {
        id: 3,
        name: 'Pastry',
        total: 120,
        image: 'https://foodish-api.com/images/samosa/samosa10.jpg',
      },
      {
        id: 4,
        name: 'Drinks',
        total: 120,
        image: 'https://foodish-api.com/images/burger/burger10.jpg',
      },
      {
        id: 5,
        name: 'Pasta',
        total: 120,
        image: 'https://foodish-api.com/images/butter-chicken/butter-chicken10.jpg',
      },
      {
        id: 6,
        name: 'Pizza',
        total: 120,
        image: 'https://foodish-api.com/images/pizza/pizza10.jpg',
      },
      {
        id: 7,
        name: 'Burger',
        total: 120,
        image: 'https://foodish-api.com/images/burger/burger10.jpg',
      },
      {
        id: 8,
        name: 'Butter Chicken',
        total: 120,
        image: 'https://foodish-api.com/images/butter-chicken/butter-chicken10.jpg',
      },
      {
        id: 1,
        name: 'Food',
        total: 120,
        image: 'https://foodish-api.com/images/pasta/pasta10.jpg',
      },
      {
        id: 2,
        name: 'Beverage',
        total: 120,
        image: 'https://foodish-api.com/images/pizza/pizza10.jpg',
      },
      {
        id: 3,
        name: 'Pastry',
        total: 120,
        image: 'https://foodish-api.com/images/samosa/samosa10.jpg',
      },
      {
        id: 4,
        name: 'Drinks',
        total: 120,
        image: 'https://foodish-api.com/images/burger/burger10.jpg',
      },
      {
        id: 5,
        name: 'Pasta',
        total: 120,
        image: 'https://foodish-api.com/images/butter-chicken/butter-chicken10.jpg',
      },
      {
        id: 6,
        name: 'Pizza',
        total: 120,
        image: 'https://foodish-api.com/images/pizza/pizza10.jpg',
      },
      {
        id: 7,
        name: 'Burger',
        total: 120,
        image: 'https://foodish-api.com/images/burger/burger10.jpg',
      },
      {
        id: 8,
        name: 'Butter Chicken',
        total: 120,
        image: 'https://foodish-api.com/images/butter-chicken/butter-chicken10.jpg',
      },
    ],

    // TEMP: Hardcoded data, will be replaced with actual data from API
    cashierProduct_listFeaturedProduct: [
      {
        id: 1,
        name: 'Creamy Pasta',
        category: 'Food',
        price: '10990',
        discountedPrice: null,
        image: 'https://foodish-api.com/images/pasta/pasta6.jpg',
      },
      {
        id: 2,
        name: 'Cheese Pasta',
        category: 'Food',
        price: '15990',
        discountedPrice: null,
        image: 'https://foodish-api.com/images/pasta/pasta2.jpg',
      },
      {
        id: 3,
        name: 'Pepperoni Pizza',
        category: 'Food',
        price: '15990',
        discountedPrice: '14990',
        image: 'https://foodish-api.com/images/pizza/pizza2.jpg',
      },
      {
        id: 4,
        name: 'Margarita Pizza',
        category: 'Food',
        price: '20990',
        discountedPrice: '19990',
        image: 'https://foodish-api.com/images/pizza/pizza5.jpg',
      },
      {
        id: 5,
        name: 'Classic Cheeseburger',
        category: 'Food',
        price: '20990',
        discountedPrice: '19990',
        image: 'https://foodish-api.com/images/burger/burger5.jpg',
      },
      {
        id: 6,
        name: 'Butter Chicken',
        category: 'Food',
        price: '20990',
        discountedPrice: '19990',
        image: 'https://foodish-api.com/images/butter-chicken/butter-chicken5.jpg',
      },
    ],

    // TEMP: Hardcoded data, will be replaced with actual data from API
    cashierProduct_listFood: [
      {
        id: 1,
        name: 'Classic Pasta',
        category: 'Food',
        price: '10990',
        discountedPrice: '9990',
        image: 'https://foodish-api.com/images/pasta/pasta1.jpg',
      },
      {
        id: 2,
        name: 'Cheese Pasta',
        category: 'Food',
        price: '15990',
        discountedPrice: '14990',
        image: 'https://foodish-api.com/images/pasta/pasta2.jpg',
      },
      {
        id: 3,
        name: 'Garlic Butter Pasta',
        category: 'Food',
        price: '15990',
        discountedPrice: '14990',
        image: 'https://foodish-api.com/images/pasta/pasta3.jpg',
      },
      {
        id: 4,
        name: 'Spicy Tomato Pasta',
        category: 'Food',
        price: '20990',
        discountedPrice: '19990',
        image: 'https://foodish-api.com/images/pasta/pasta4.jpg',
      },
      {
        id: 5,
        name: 'Pesto Pasta',
        category: 'Food',
        price: '25990',
        discountedPrice: '24990',
        image: 'https://foodish-api.com/images/pasta/pasta5.jpg',
      },
      {
        id: 6,
        name: 'Creamy Alfredo Pasta',
        category: 'Food',
        price: '30990',
        discountedPrice: '29990',
        image: 'https://foodish-api.com/images/pasta/pasta6.jpg',
      },
    ],

    // TEMP: Hardcoded data, will be replaced with actual data from API
    cashierProduct_listDrink: [
      {
        id: 1,
        name: 'Samosa Snack',
        category: 'Beverage',
        price: '5990',
        discountedPrice: '4990',
        image: 'https://foodish-api.com/images/samosa/samosa1.jpg',
      },
      {
        id: 2,
        name: 'Spicy Samosa',
        category: 'Beverage',
        price: '7990',
        discountedPrice: '6990',
        image: 'https://foodish-api.com/images/samosa/samosa2.jpg',
      },
      {
        id: 3,
        name: 'Crispy Samosa',
        category: 'Beverage',
        price: '8990',
        discountedPrice: '7990',
        image: 'https://foodish-api.com/images/samosa/samosa3.jpg',
      },
      {
        id: 4,
        name: 'Vegetable Samosa',
        category: 'Beverage',
        price: '10990',
        discountedPrice: '9990',
        image: 'https://foodish-api.com/images/samosa/samosa4.jpg',
      },
      {
        id: 5,
        name: 'Chicken Samosa',
        category: 'Beverage',
        price: '12990',
        discountedPrice: '11990',
        image: 'https://foodish-api.com/images/samosa/samosa5.jpg',
      },
      {
        id: 6,
        name: 'Cheese Samosa',
        category: 'Beverage',
        price: '15990',
        discountedPrice: '14990',
        image: 'https://foodish-api.com/images/samosa/samosa6.jpg',
      },
    ],
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api cashier search.
     * @url /cashier/search
     * @method GET
     * @access public
     */
    async cashierProduct_fetchSearch(searchData: string): Promise<void> {
      // TODO: Fetch API when the endpoint is ready
      console.log(searchData);
    },
  },
});
