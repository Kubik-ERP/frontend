// constants
import { PRODUCT_DETAILS_PRODUCT_VARIANTS_COLUMNS, PRODUCT_DETAILS_PORTION_STOCK_COLUMNS } from '../constants';
// type
import { IProductDetailsProvided } from '../interfaces';
// store
import { useProductDetailsStore } from '../store/productDetails.store';
export const useProductDetailsService = (): IProductDetailsProvided => {
  const store = useProductDetailsStore();
  const { httpAbort_registerAbort } = useHttpAbort();

  const { productDetails, productDetails_isLoading } = storeToRefs(store);

  const productDetails_fetchProductDetails = async (id: string) => {
    try {
      await store.fetchProductDetails(id, {
        ...httpAbort_registerAbort('PRODUCT_DETAILS_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    // columns
    productDetails_productVariants_columns: PRODUCT_DETAILS_PRODUCT_VARIANTS_COLUMNS,
    productDetails_portionStock_columns: PRODUCT_DETAILS_PORTION_STOCK_COLUMNS,
    // data
    productDetails,
    productDetails_isLoading,
    // method
    productDetails_fetchProductDetails,
  };
};
