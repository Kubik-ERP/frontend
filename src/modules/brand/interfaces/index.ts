export interface IBrand {
  id: string;
  brandName: string;
  brandCode: string;
  notes: string;
  isHaveItems?: boolean ;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBrandListResponse {
  statusCode: number;
  message: string;
  data: {
    items: IBrand[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface IBrandCreateUpdatePayload {
  brandName: string;
  brandCode: string | boolean | null;
  notes: string;
}

export interface IBrandActionResponse {
  statusCode: number;
  message: string;
  data: IBrand | null;
}




