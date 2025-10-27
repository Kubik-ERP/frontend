// type
import type { IProductDetailsStateStore, IProductDetails } from '../interfaces';
export const useProductDetailsStore = defineStore('product-details', {
  state: (): IProductDetailsStateStore => ({
    productDetails_isLoading: false,
    productDetails: {
      id: '64adf394-d6d7-4f44-bb44-0e8f13b17d03',
      photoUrl: '1757395160529-227739470.webp',
      name: 'Super Giant',
      categories: ['Super', 'Giant'],
      recipe:{
        id: '64adf394-d6d7-4f44-bb44-0e8f13b17d03',
        name: 'Recipe Super Giant'
      },
      price: 92000,
      discountPrice: 90000,
      productVariant: [
        {
          name: 'Original',
          additionalPrice: 0,
        },
        {
          name: 'Pedas',
          additionalPrice: 10000,
        },
      ],
      portionStock: [
        {
          batchName: 'BATCH-0001',
          batchDate: new Date('2023-01-01'),
          batchActualPortion: 100,
          batchPortionLeft: 100,
          difference: 0,
        },
      ],
    } as IProductDetails,
  }),
  actions: {
    // async fetchProductDetails(id: string) {
    //   this.productDetails_isLoading = true;
    //   const { data } = await httpClient.get<IProductDetails>(`${PRODUCT_API_BASE_ENDPOINT}/${id}`);
    //   this.productDetails = data;
    //   this.productDetails_isLoading = false;
    // },
  },
});
