import {
  SALES_INVOICE_COLUMNS,
  SALES_INVOICE_ITEMS_OF_SPLIT_BUTTON,
  SALES_INVOICE_VALUES,
} from '../constants/customer.constant';

export const useCustomerDetailService = () => {
  return {
    salesInvoice_Column: SALES_INVOICE_COLUMNS,
    SALES_INVOICE_ITEMS_OF_SPLIT_BUTTON: SALES_INVOICE_ITEMS_OF_SPLIT_BUTTON,
    SALES_INVOICE_VALUES : SALES_INVOICE_VALUES,
  };
};