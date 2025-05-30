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
