import { defineStore } from 'pinia';

import { ICashierStateStore } from '../interfaces';

export const useCashierStore = defineStore('cashier', {
  state: (): ICashierStateStore => ({
    cashier_category: [],
    cashier_featured_product: [
      {
        id: 1,
        name: 'Featured Product 1',
        category: 'Featured',
        price: '10.99',
        discounted_price: '9.99',
        image: 'https://i0.wp.com/www.adelahasna.com/wp-content/uploads/2023/09/WoW-3.jpg?resize=819%2C1024&ssl=1',
      },
      {
        id: 2,
        name: 'Featured Product 2',
        category: 'Featured',
        price: '15.99',
        discounted_price: '14.99',
        image: 'https://i0.wp.com/www.adelahasna.com/wp-content/uploads/2023/09/WoW-3.jpg?resize=819%2C1024&ssl=1',
      },
      {
        id: 3,
        name: 'Featured Product 3',
        category: 'Featured',
        price: '20.99',
        discounted_price: '19.99',
        image: 'https://i0.wp.com/www.adelahasna.com/wp-content/uploads/2023/09/WoW-3.jpg?resize=819%2C1024&ssl=1',
      },
      {
        id: 4,
        name: 'Featured Product 4',
        category: 'Featured',
        price: '25.99',
        discounted_price: '24.99',
        image: 'https://i0.wp.com/www.adelahasna.com/wp-content/uploads/2023/09/WoW-3.jpg?resize=819%2C1024&ssl=1',
      },
      {
        id: 5,
        name: 'Featured Product 5',
        category: 'Featured',
        price: '30.99',
        discounted_price: '29.99',
        image: 'https://i0.wp.com/www.adelahasna.com/wp-content/uploads/2023/09/WoW-3.jpg?resize=819%2C1024&ssl=1',
      },
    ],
    cashier_food: [],
    cashier_drink: [],
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {},
});
