import { defineStore } from 'pinia';

import { ICashierStateStore } from '../interfaces';

export const useCashierStore = defineStore('cashier', {
  state: (): ICashierStateStore => ({
    cashier_listCategory: [],

    // TEMP: Hardcoded data, will be replaced with actual data from API
    cashier_listFeaturedProduct: [
      {
        id: 1,
        name: 'Featured Product 1',
        category: 'Featured',
        price: '10.99',
        discountedPrice: '9.99',
        image: 'https://foodish-api.com/images/pasta/pasta6.jpg',
      },
      {
        id: 2,
        name: 'Featured Product 2',
        category: 'Featured',
        price: '15.99',
        discountedPrice: '14.99',
        image: 'https://foodish-api.com/images/pasta/pasta2.jpg',
      },
      {
        id: 3,
        name: 'Featured Product 3',
        category: 'Featured',
        price: '15.99',
        discountedPrice: '14.99',
        image: 'https://foodish-api.com/images/pizza/pizza2.jpg',
      },
      {
        id: 4,
        name: 'Featured Product 4',
        category: 'Featured',
        price: '20.99',
        discountedPrice: '19.99',
        image: 'https://foodish-api.com/images/pizza/pizza5.jpg',
      },
      {
        id: 5,
        name: 'Featured Product 5',
        category: 'Featured',
        price: '20.99',
        discountedPrice: '19.99',
        image: 'https://foodish-api.com/images/burger/burger5.jpg',
      },
      {
        id: 6,
        name: 'Featured Product 5',
        category: 'Featured',
        price: '20.99',
        discountedPrice: '19.99',
        image: 'https://foodish-api.com/images/butter-chicken/butter-chicken5.jpg',
      },
    ],

    // TEMP: Hardcoded data, will be replaced with actual data from API
    cashier_listFood: [
      {
        id: 1,
        name: 'Featured Product 1',
        category: 'Featured',
        price: '10.99',
        discountedPrice: '9.99',
        image: 'https://foodish-api.com/images/pasta/pasta1.jpg',
      },
      {
        id: 2,
        name: 'Featured Product 2',
        category: 'Featured',
        price: '15.99',
        discountedPrice: '14.99',
        image: 'https://foodish-api.com/images/pasta/pasta2.jpg',
      },
      {
        id: 3,
        name: 'Featured Product 3',
        category: 'Featured',
        price: '15.99',
        discountedPrice: '14.99',
        image: 'https://foodish-api.com/images/pasta/pasta3.jpg',
      },
      {
        id: 4,
        name: 'Featured Product 4',
        category: 'Featured',
        price: '20.99',
        discountedPrice: '19.99',
        image: 'https://foodish-api.com/images/pasta/pasta4.jpg',
      },
      {
        id: 5,
        name: 'Featured Product 5',
        category: 'Featured',
        price: '25.99',
        discountedPrice: '24.99',
        image: 'https://foodish-api.com/images/pasta/pasta5.jpg',
      },
      {
        id: 6,
        name: 'Featured Product 6',
        category: 'Featured',
        price: '30.99',
        discountedPrice: '29.99',
        image: 'https://foodish-api.com/images/pasta/pasta6.jpg',
      },
    ],

    // TEMP: Hardcoded data, will be replaced with actual data from API
    cashier_listDrink: [
      {
        id: 1,
        name: 'Featured Product 1',
        category: 'Featured',
        price: '5.99',
        discountedPrice: '4.99',
        image: 'https://foodish-api.com/images/samosa/samosa1.jpg',
      },
      {
        id: 2,
        name: 'Featured Product 2',
        category: 'Featured',
        price: '7.99',
        discountedPrice: '6.99',
        image: 'https://foodish-api.com/images/samosa/samosa2.jpg',
      },
      {
        id: 3,
        name: 'Featured Product 3',
        category: 'Featured',
        price: '8.99',
        discountedPrice: '7.99',
        image: 'https://foodish-api.com/images/samosa/samosa3.jpg',
      },
      {
        id: 4,
        name: 'Featured Product 4',
        category: 'Featured',
        price: '10.99',
        discountedPrice: '9.99',
        image: 'https://foodish-api.com/images/samosa/samosa4.jpg',
      },
      {
        id: 5,
        name: 'Featured Product 5',
        category: 'Featured',
        price: '12.99',
        discountedPrice: '11.99',
        image: 'https://foodish-api.com/images/samosa/samosa5.jpg',
      },
      {
        id: 6,
        name: 'Featured Product 6',
        category: 'Featured',
        price: '15.99',
        discountedPrice: '14.99',
        image: 'https://foodish-api.com/images/samosa/samosa6.jpg',
      },
    ],
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {},
});
