// store
import { useDiscountStore } from '../store';

// interface
import type { IItemDiscountProvided } from '../interfaces';

export const useDiscountService = (): IItemDiscountProvided => {
  const store = useDiscountStore();
  const { productList_isLoading, productList_values } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const fetchProductList = async () => {
    await store.fetchProductList({ ...httpAbort_registerAbort('PRODUCT_LIST_REQUEST') });
  };

  return {
    productList_isLoading,
    productList_values,

    fetchProductList,
  };
};
