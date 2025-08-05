// Constant
import {
  LOYALTY_POINT_BENEFIT_LIST_COLUMNS,
  LOYALTY_POINT_BENEFIT_LIST_DATA,
} from '../constants/loyalty-point-benefit.constant';

// Type
import { ILoyaltyPointBenefitProvided } from '../interfaces/loyalty-point-benefit.interface';

export const useLoyaltyPointBenefitService = ():ILoyaltyPointBenefitProvided => {
  
  const loyaltyPointBenefit_onCreate = () => {
    console.log('create');
  }

  const dailySalesList_onChangePage = () => {
    console.log('onChangePage');
  };

  return {
    loyaltyPointBenefit_values: LOYALTY_POINT_BENEFIT_LIST_DATA,
    loyaltyPointBenefit_columns: LOYALTY_POINT_BENEFIT_LIST_COLUMNS,

    loyaltyPointBenefit_onCreate,
    dailySalesList_onChangePage
  };
};
