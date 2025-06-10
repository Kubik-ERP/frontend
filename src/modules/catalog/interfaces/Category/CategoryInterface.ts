export interface ICategory {
  id: string;
  category: string;
  description?: string;
  pictureUrl?: string;
}

export interface CategoryPayload {
  imagePreview?: string;
  imageFile?: File;
  category: string;
  description?: string;
}

export interface ICategoryFormData {
  imagePreview?: string;
  imageFile?: File;
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
