export type IFreeItems = {
  id: string;
  name: string;
  quantity: number
}

export type IDiscount = {
  discount: number
  isPercent: boolean
}

export type ILoyaltyPointBenefit = {
  type: string;
  benefitName: string;
  pointNeeds: number;
  discountFreeItems: IDiscount | IFreeItems[];
}


export interface ILoyaltyPointBenefitProvided {
  loyaltyPointBenefit_values: ILoyaltyPointBenefit[];
  loyaltyPointBenefit_columns: IColumnDataTable[];

  loyaltyPointBenefit_onCreate: () => void;
  dailySalesList_onChangePage: () => void;
}