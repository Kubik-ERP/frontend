import { defineStore } from 'pinia';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import { ICashierStateStore } from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';
import { CASHIER_ENDPOINT_PAYMENT_METHOD } from '../constants/cashierApi.constant';
import { ICashierOrderSummaryPaymentMethodResponse } from '../interfaces/cashier-order-summary';

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
        qty: 44,
        price: '10990',
        discountedPrice: null,
        image: 'https://foodish-api.com/images/pasta/pasta6.jpg',
        variant: [
          { id: 1, name: 'No adds on', price: 0 },
          { id: 2, name: 'With parmesan sauce', price: 5000 },
          { id: 3, name: 'Extra cheese', price: 3000 },
          { id: 4, name: 'Add grilled chicken', price: 7000 },
        ],
      },
      {
        id: 2,
        name: 'Cheese Pasta',
        category: 'Food',
        qty: 44,
        price: '15990',
        discountedPrice: null,
        image: 'https://foodish-api.com/images/pasta/pasta2.jpg',
        variant: [
          { id: 1, name: 'Regular', price: 0 },
          { id: 2, name: 'Extra cheese', price: 4000 },
          { id: 3, name: 'With truffle oil', price: 8000 },
        ],
      },
      {
        id: 3,
        name: 'Pepperoni Pizza',
        category: 'Food',
        qty: 44,
        price: '15990',
        discountedPrice: '14990',
        image: 'https://foodish-api.com/images/pizza/pizza2.jpg',
        variant: [
          { id: 1, name: 'Regular size', price: 0 },
          { id: 2, name: 'Large size', price: 10000 },
          { id: 3, name: 'Extra pepperoni', price: 5000 },
        ],
      },
      {
        id: 4,
        name: 'Margarita Pizza',
        category: 'Food',
        qty: 44,
        price: '20990',
        discountedPrice: '19990',
        image: 'https://foodish-api.com/images/pizza/pizza5.jpg',
        variant: [
          { id: 1, name: 'Regular size', price: 0 },
          { id: 2, name: 'Large size', price: 10000 },
          { id: 3, name: 'Extra mozzarella', price: 6000 },
        ],
      },
      {
        id: 5,
        name: 'Classic Cheeseburger',
        category: 'Food',
        qty: 44,
        price: '20990',
        discountedPrice: '19990',
        image: 'https://foodish-api.com/images/burger/burger5.jpg',
        variant: [
          { id: 1, name: 'Single patty', price: 0 },
          { id: 2, name: 'Double patty', price: 8000 },
          { id: 3, name: 'Add bacon', price: 5000 },
        ],
      },
      {
        id: 6,
        name: 'Butter Chicken',
        category: 'Food',
        qty: 44,
        price: '20990',
        discountedPrice: '19990',
        image: 'https://foodish-api.com/images/butter-chicken/butter-chicken5.jpg',
        variant: [
          { id: 1, name: 'Mild spice', price: 0 },
          { id: 2, name: 'Medium spice', price: 2000 },
          { id: 3, name: 'Extra spicy', price: 4000 },
          { id: 4, name: 'With garlic naan', price: 5000 },
        ],
      },
    ],

    // TEMP: Hardcoded data, will be replaced with actual data from API
    cashierProduct_listFood: [
      {
        id: 7,
        name: 'Classic Pasta',
        category: 'Food',
        qty: 44,
        price: '10990',
        discountedPrice: '9990',
        image: 'https://foodish-api.com/images/pasta/pasta1.jpg',
        variant: [
          { id: 1, name: 'Regular', price: 0 },
          { id: 2, name: 'Extra cheese', price: 3000 },
          { id: 3, name: 'Add grilled chicken', price: 5000 },
        ],
      },
      {
        id: 8,
        name: 'Cheese Pasta',
        category: 'Food',
        qty: 44,
        price: '15990',
        discountedPrice: '14990',
        image: 'https://foodish-api.com/images/pasta/pasta2.jpg',
        variant: [
          { id: 1, name: 'Regular', price: 0 },
          { id: 2, name: 'Double cheese', price: 4000 },
          { id: 3, name: 'With truffle oil', price: 7000 },
        ],
      },
      {
        id: 9,
        name: 'Garlic Butter Pasta',
        category: 'Food',
        qty: 44,
        price: '15990',
        discountedPrice: '14990',
        image: 'https://foodish-api.com/images/pasta/pasta3.jpg',
        variant: [
          { id: 1, name: 'Regular', price: 0 },
          { id: 2, name: 'Extra garlic', price: 2000 },
          { id: 3, name: 'Add shrimp', price: 6000 },
        ],
      },
      {
        id: 10,
        name: 'Spicy Tomato Pasta',
        category: 'Food',
        qty: 44,
        price: '20990',
        discountedPrice: '19990',
        image: 'https://foodish-api.com/images/pasta/pasta4.jpg',
        variant: [
          { id: 1, name: 'Mild spice', price: 0 },
          { id: 2, name: 'Extra spicy', price: 3000 },
          { id: 3, name: 'Add grilled sausage', price: 5000 },
        ],
      },
      {
        id: 11,
        name: 'Pesto Pasta',
        category: 'Food',
        qty: 44,
        price: '25990',
        discountedPrice: '24990',
        image: 'https://foodish-api.com/images/pasta/pasta5.jpg',
        variant: [
          { id: 1, name: 'Regular', price: 0 },
          { id: 2, name: 'Add grilled chicken', price: 6000 },
          { id: 3, name: 'With pine nuts', price: 5000 },
        ],
      },
      {
        id: 12,
        name: 'Creamy Alfredo Pasta',
        category: 'Food',
        qty: 44,
        price: '30990',
        discountedPrice: '29990',
        image: 'https://foodish-api.com/images/pasta/pasta6.jpg',
        variant: [
          { id: 1, name: 'Regular', price: 0 },
          { id: 2, name: 'Extra creamy sauce', price: 5000 },
          { id: 3, name: 'Add mushrooms', price: 4000 },
        ],
      },
    ],

    // TEMP: Hardcoded data, will be replaced with actual data from API
    cashierProduct_listDrink: [
      {
        id: 13,
        name: 'Samosa Snack',
        category: 'Beverage',
        qty: 44,
        price: '5990',
        discountedPrice: '4990',
        image: 'https://foodish-api.com/images/samosa/samosa1.jpg',
        variant: [
          { id: 1, name: 'Regular', price: 0 },
          { id: 2, name: 'Extra filling', price: 2000 },
        ],
      },
      {
        id: 14,
        name: 'Spicy Samosa',
        category: 'Beverage',
        qty: 44,
        price: '7990',
        discountedPrice: '6990',
        image: 'https://foodish-api.com/images/samosa/samosa2.jpg',
        variant: [
          { id: 1, name: 'Mild spice', price: 0 },
          { id: 2, name: 'Extra spicy', price: 3000 },
        ],
      },
      {
        id: 15,
        name: 'Crispy Samosa',
        category: 'Beverage',
        qty: 44,
        price: '8990',
        discountedPrice: '7990',
        image: 'https://foodish-api.com/images/samosa/samosa3.jpg',
        variant: [
          { id: 1, name: 'Regular', price: 0 },
          { id: 2, name: 'With cheese filling', price: 4000 },
        ],
      },
      {
        id: 16,
        name: 'Vegetable Samosa',
        category: 'Beverage',
        qty: 44,
        price: '10990',
        discountedPrice: '9990',
        image: 'https://foodish-api.com/images/samosa/samosa4.jpg',
        variant: [
          { id: 1, name: 'Regular', price: 0 },
          { id: 2, name: 'Extra vegetables', price: 2000 },
        ],
      },
      {
        id: 17,
        name: 'Chicken Samosa',
        category: 'Beverage',
        qty: 44,
        price: '12990',
        discountedPrice: '11990',
        image: 'https://foodish-api.com/images/samosa/samosa5.jpg',
        variant: [
          { id: 1, name: 'Regular', price: 0 },
          { id: 2, name: 'With extra chicken', price: 5000 },
        ],
      },
      {
        id: 18,
        name: 'Cheese Samosa',
        category: 'Beverage',
        qty: 44,
        price: '15990',
        discountedPrice: '14990',
        image: 'https://foodish-api.com/images/samosa/samosa6.jpg',
        variant: [
          { id: 1, name: 'Regular', price: 0 },
          { id: 2, name: 'With extra cheese', price: 6000 },
        ],
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

    /**
     * @description Handle fetch get payment method.
     * @url /cashier/product
     * @method GET
     * @access public
     */
    async cashierProduct_fetchPaymentMethod(
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ICashierOrderSummaryPaymentMethodResponse> {
      try {
        const response = await httpClient.get<ICashierOrderSummaryPaymentMethodResponse>(
          CASHIER_ENDPOINT_PAYMENT_METHOD,
          {
            ...requestConfigurations,
          },
        );

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },
  },
});
