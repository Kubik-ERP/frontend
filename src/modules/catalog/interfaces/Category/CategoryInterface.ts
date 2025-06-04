export interface ICategory {
  id: string;
  category: string;
  description?: string;
}

export interface CategoryPayload {
  category: string;
  description?: string;
}

export interface ICategoryFormData {
  name: string;
  description: string;
}

export interface ICategoryResponse {
  categories: ICategory[];
  lastPage: number;
}

export interface ICategoryAddResponse {
  statusCode: number;
  message: string;
  data?: ICategory;
}
