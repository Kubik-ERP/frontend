import { defineStore } from 'pinia';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import { ICashierProduct, ICashierStateStore } from '../interfaces';
import { ICashierOrderSummaryPaymentMethodResponse } from '../interfaces/cashier-order-summary';

// Plugins
import httpClient from '@/plugins/axios';

// Constants
import {
  CASHIER_ENDPOINT_CATEGORIES,
  CASHIER_ENDPOINT_PAYMENT_CALCULATE_ESTIMATION,
  CASHIER_ENDPOINT_PAYMENT_INSTANT,
  CASHIER_ENDPOINT_PAYMENT_METHOD,
  CASHIER_ENDPOINT_PAYMENT_PROCESS,
  CASHIER_ENDPOINT_PRODUCTS,
  CASHIER_ENDPOINT_SIMULATE_PAYMENT,
} from '../constants/cashierApi.constant';
import {
  ICashierResponseCalulateEstimation,
  ICashierResponseMidtransQrisPayment,
  ICashierResponseProcessCheckout,
} from '../interfaces/cashier-response';

export const useCashierStore = defineStore('cashier', {
  state: (): ICashierStateStore => ({
    cashierProduct_selectedProduct: [
      {
        product: {} as ICashierProduct,
        variant: {} as ICashierProduct['variant'][0],
        productId: '0196cf23-e3fb-7caa-b7be-f08248b20a33',
        variantId: '0196cf23-e3fb-70cf-a3ff-443bf28e7f0e',
        quantity: 1,
        notes: 'Ini adalah catatan',
      },
    ],
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
        productId: '1',
        name: 'Creamy Pasta',
        category: 'Food',
        quantity: 44,
        price: '10990',
        discountedPrice: null,
        image: 'https://foodish-api.com/images/pasta/pasta6.jpg',
        variant: [
          { variantId: '1', name: 'No adds on', price: 0 },
          { variantId: '2', name: 'With parmesan sauce', price: 5000 },
          { variantId: '3', name: 'Extra cheese', price: 3000 },
          { variantId: '4', name: 'Add grilled chicken', price: 7000 },
        ],
      },
      {
        productId: '2',
        name: 'Cheese Pasta',
        category: 'Food',
        quantity: 44,
        price: '15990',
        discountedPrice: null,
        image: 'https://foodish-api.com/images/pasta/pasta2.jpg',
        variant: [
          { variantId: '1', name: 'Regular', price: 0 },
          { variantId: '2', name: 'Extra cheese', price: 4000 },
          { variantId: '3', name: 'With truffle oil', price: 8000 },
        ],
      },
      {
        productId: '3',
        name: 'Pepperoni Pizza',
        category: 'Food',
        quantity: 44,
        price: '15990',
        discountedPrice: '14990',
        image: 'https://foodish-api.com/images/pizza/pizza2.jpg',
        variant: [
          { variantId: '1', name: 'Regular size', price: 0 },
          { variantId: '2', name: 'Large size', price: 10000 },
          { variantId: '3', name: 'Extra pepperoni', price: 5000 },
        ],
      },
      {
        productId: '4',
        name: 'Margarita Pizza',
        category: 'Food',
        quantity: 44,
        price: '20990',
        discountedPrice: '19990',
        image: 'https://foodish-api.com/images/pizza/pizza5.jpg',
        variant: [
          { variantId: '1', name: 'Regular size', price: 0 },
          { variantId: '2', name: 'Large size', price: 10000 },
          { variantId: '3', name: 'Extra mozzarella', price: 6000 },
        ],
      },
      {
        productId: '5',
        name: 'Classic Cheeseburger',
        category: 'Food',
        quantity: 44,
        price: '20990',
        discountedPrice: '19990',
        image: 'https://foodish-api.com/images/burger/burger5.jpg',
        variant: [
          { variantId: '1', name: 'Single patty', price: 0 },
          { variantId: '2', name: 'Double patty', price: 8000 },
          { variantId: '3', name: 'Add bacon', price: 5000 },
        ],
      },
      {
        productId: '6',
        name: 'Butter Chicken',
        category: 'Food',
        quantity: 44,
        price: '20990',
        discountedPrice: '19990',
        image: 'https://foodish-api.com/images/butter-chicken/butter-chicken5.jpg',
        variant: [
          { variantId: '1', name: 'Mild spice', price: 0 },
          { variantId: '2', name: 'Medium spice', price: 2000 },
          { variantId: '3', name: 'Extra spicy', price: 4000 },
          { variantId: '4', name: 'With garlic naan', price: 5000 },
        ],
      },
    ],

    // TEMP: Hardcoded data, will be replaced with actual data from API
    cashierProduct_listFood: [
      {
        productId: '7',
        name: 'Classic Pasta',
        category: 'Food',
        quantity: 44,
        price: '10990',
        discountedPrice: '9990',
        image: 'https://foodish-api.com/images/pasta/pasta1.jpg',
        variant: [
          { variantId: '1', name: 'Regular', price: 0 },
          { variantId: '2', name: 'Extra cheese', price: 3000 },
          { variantId: '3', name: 'Add grilled chicken', price: 5000 },
        ],
      },
      {
        productId: '8',
        name: 'Cheese Pasta',
        category: 'Food',
        quantity: 44,
        price: '15990',
        discountedPrice: '14990',
        image: 'https://foodish-api.com/images/pasta/pasta2.jpg',
        variant: [
          { variantId: '1', name: 'Regular', price: 0 },
          { variantId: '2', name: 'Double cheese', price: 4000 },
          { variantId: '3', name: 'With truffle oil', price: 7000 },
        ],
      },
    ],

    // TEMP: Hardcoded data, will be replaced with actual data from API
    cashierProduct_listDrink: [
      {
        productId: '13',
        name: 'Samosa Snack',
        category: 'Beverage',
        quantity: 44,
        price: '5990',
        discountedPrice: '4990',
        image: 'https://foodish-api.com/images/samosa/samosa1.jpg',
        variant: [{ variantId: '1', name: 'Regular', price: 0 }],
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
     * @url /api/products
     * @method GET
     * @access public
     */
    async cashierProduct_fetchSearch(searchData: string): Promise<ICashierProduct[]> {
      try {
        const response = await httpClient.get<ICashierProduct[]>(CASHIER_ENDPOINT_PRODUCTS + '/' + searchData);

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    /**
     * @description Handle fetch api cashier product category
     * @url /api/categories
     * @method GET
     * @access public
     */
    async cashierProduct_fetchCategory(
      categoryId: string,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierProduct[]> {
      try {
        const response = await httpClient.get<ICashierProduct[]>(CASHIER_ENDPOINT_CATEGORIES + '/' + categoryId, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    /**
     * @description Handle fetch api product per category
     * @url /api/categories/:categoryId
     * @method GET
     * @access public
     */
    async cashierProduct_fetchCategoryById(
      categoryId: string,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierProduct[]> {
      try {
        const response = await httpClient.get<ICashierProduct[]>(CASHIER_ENDPOINT_CATEGORIES + '/' + categoryId, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    /**
     * @description Handle calculate payment estimation.
     * @url /payment/calculate/estimation
     * @method POST
     * @access public
     */
    async cashierProduct_calculateEstimation(
      payload: unknown,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierResponseCalulateEstimation> {
      try {
        const response = await httpClient.post<ICashierResponseCalulateEstimation>(
          CASHIER_ENDPOINT_PAYMENT_CALCULATE_ESTIMATION,
          payload,
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

    /**
     * @description Handle payment process.
     * @url /payment/process
     * @method POST
     * @access public
     */
    async cashierProduct_paymentProcess(
      payload: unknown,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierResponseProcessCheckout> {
      try {
        const response = await httpClient.post<ICashierResponseProcessCheckout>(
          CASHIER_ENDPOINT_PAYMENT_PROCESS,
          payload,
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

    /**
     * @description Handle payment process.
     * @url /payment/process
     * @method POST
     * @access public
     */
    async cashierProduct_paymentInstant(
      payload: unknown,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierResponseMidtransQrisPayment> {
      try {
        const response = await httpClient.post<ICashierResponseMidtransQrisPayment>(
          CASHIER_ENDPOINT_PAYMENT_INSTANT,
          payload,
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

    /**
     * @description Handle fetch get payment method.
     * @url /cashier/product
     * @method GET
     * @access public
     */
    async cashierProduct_fetchPaymentMethod(
      requestConfigurations: AxiosRequestConfig = {},
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

    async cashierProduct_simulatePayment(
      payload: unknown,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<unknown> {
      try {
        const response = await httpClient.post<unknown>(CASHIER_ENDPOINT_SIMULATE_PAYMENT, payload, {
          ...requestConfigurations,
        });
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
