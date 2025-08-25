export interface IStorageLocation {
  id: string;
  name: string;
  notes: string;
  code: string;
  isHaveItems: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorageLocationPayload {
  name: string;
  code: string | boolean | null;
  notes: string;
}

export interface IStorageLocationListResponse{
  statusCode: number;
  message: string;
  data: {
    items: IStorageLocation[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface IStorageLocationActionResponse{
  statusCode: number;
  message: string;
  data: IStorageLocation;
}
