export interface IInventoryCategory {
  id: string;
  name: string;
  code: string;
  notes: string;
  isHaveItems: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface IInventoryCategoryStateStore {
  inventoryCategoryList_isLoading: boolean;
  inventoryCategoryList: IInventoryCategoryListResponse;
}

export interface IInventoryCategoryActionResponse {
  statusCode: number;
  message: string;
  data?: IInventoryCategory | null;
}

export interface IInventoryCategoryListResponse  {
    statusCode: number;
    message: string;
    data: {
      items: IInventoryCategory[];
      meta: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
      };
    };
};

export interface IInventoryCategoryCreateUpdatePayload {
  name: string;
  code: string ;
  notes: string;
};


