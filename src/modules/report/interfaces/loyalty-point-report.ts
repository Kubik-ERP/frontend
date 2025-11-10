export interface ILoyaltyPointReport_spendBased {
  dashboard: {
    sumOfAllPoints: number;
    sumOfAllPointsExpired: number;
    totalCustomers: number;
    totalInvoices: number;
  };
  table: {
    invoiceId: string;
    purchaseDate: string;
    customer: string;
    grandTotal: number;
    orderType: string;
    totalPointsEarned: number;
    pointExpiryDate: string;
  }[];
}

export interface ILoyaltyPointReport_productBased {
  dashboard: {
    sumOfAllPoints: number;
    sumOfAllPointsExpired: number;
    totalCustomers: number;
    totalProductsForEarningBenefit: number;
  };
  table: {
    productName: string;
    productPrice: number;
    pointsToIDR: number;
    sumOfPointsGivenToCust: string;
    totalCust: string;
  }[];
}

export interface ILoyaltyPointReport_benefitUtilization {
  dashboard: {
    sumOfAllPoints: number;
    countCustomers: number;
    sumPointsUsedByType: {
      [key: string]: number;
    };
    sumOfDiscountAmount: number;
    sumOfCountTotalFreeItems: number;
  };
  table: {
    benefitName: string;
    type: string;
    countUsed: number;
    totalPointUsed: number;
    amount: number;
  }[];
}

export interface ILoyaltyPointReport_expiryWarning {
  dashboard: {
    sumOfAllPoints: number;
    countCustomers: number;
    sumByEachTypes: {
      [key: string]: number;
    };
  };
  table: {
    custName: string;
    invoice: string;
    type: string;
    points: number;
    expiryDate: string;
  }[];
}

export interface ILoyaltyPointReport_typeAccumulation {
  dashboard: {
    sumOfAllPoints: number;
    sumOfAllPointsExpired: number;
    totalCustomers: number;
  };
  table: {
    type: string;
    sumTotalPoints: number;
    totalCustomers: number;
  }[];
}
