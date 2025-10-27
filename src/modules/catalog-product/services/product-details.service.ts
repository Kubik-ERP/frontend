// constants
import { PRODUCT_DETAILS_PRODUCT_VARIANTS_COLUMNS, PRODUCT_DETAILS_PORTION_STOCK_COLUMNS } from '../constants';
// type
import { IProductDetailsProvided } from '../interfaces';
// store
import { useProductDetailsStore } from '../store/productDetails.store';
export const useProductDetailsService = (): IProductDetailsProvided => {
  const store = useProductDetailsStore();
  const { productDetails, productDetails_isLoading } = storeToRefs(store);

  // const productDetails_formData = reactive<IProductDetails>({
  //   photoUrl: '',
  //   name: '',
  //   category: [],
  //   price: 0,
  //   discountPrice: 0,
  //   productVariant: [],
  //   portionStock: [],
  // });

  return {
    // columns
    productDetails_productVariants_columns: PRODUCT_DETAILS_PRODUCT_VARIANTS_COLUMNS,
    productDetails_portionStock_columns: PRODUCT_DETAILS_PORTION_STOCK_COLUMNS,
    // data
    productDetails,
    productDetails_isLoading
  };
};
