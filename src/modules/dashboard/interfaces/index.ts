import type { IAuthenticationProfile } from '@/modules/authentication/interfaces';

export interface IDashboardQueryParams {
  startDate: Date;
  endDate: Date;
}

export interface IDashboardProvided {
  authentication_userData: globalThis.Ref<IAuthenticationProfile | null>;
  dashboard_queryParams: IDashboardQueryParams;
  dashboard_getSummary: () => Promise<void>;
  dashboard_isLoading: globalThis.Ref<boolean>;
  dashboard_values: globalThis.Ref<IDashBoardValues>;
}
export interface IDashBoardValues {
  summary: {
    totalSales: {
      value: number;
      percentageChange: number;
    };
    totalCostOfGoodSold: {
      value: number;
      percentageChange: number;
    };
    totalGrossProfit: {
      value: number;
      percentageChange: number;
    };
    totalNettProfit: {
      value: number;
      percentageChange: number;
    };
  };
  monthlySalesData: { month: string; sales: number }[];
  latestSales: {
    value: number;
    percentageChange: number;
  };
  productSales: {
    name: string;
    quantity: number;
  }[];
  stockStatus: {
    stockStatus: {
      available: number;
      outOfStock: number;
      lowStock: number;
    };
    detailedLowStock: {
      items: {
        name: string;
        stock: number;
        unit: string;
        minimumStock: number;
      }[];
      count: 0;
    };
    detailedOutOfStock: {
      items: {
        name: string;
        stock: number;
        unit: string;
        minimumStock: number;
      }[];
      count: 0;
    };
  };
}
export interface IDashboardStore {
  dashboard_isLoading: boolean;
  dashboard_values: IDashBoardValues;
}
