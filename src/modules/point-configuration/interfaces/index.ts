export * from './loyalty-point-benefit.interface';
export * from './point-configuration.interface';

import { IPointConfigurationListResponse, IProduct } from './loyalty-point-benefit.interface';
import { ILoyaltyPointSettings, ILoyaltyPointSettingsProductList } from './point-configuration.interface';

export type IPointConfigurationStore = {
  loyaltyPointBenefit_isLoading: boolean;
  productList_isLoading: boolean;
  loyaltyPointBenefit_list: IPointConfigurationListResponse;
  loyaltyPointBenefit_productList: IProduct[];

  loyaltyPointSettings_isLoading: boolean;
  loyaltyPointSettings_value:   ILoyaltyPointSettings ;

  loyaltyPointSettingsProduct_isLoading: boolean;
  loyaltyPointSettingsProduct_value: ILoyaltyPointSettingsProductList;
};
