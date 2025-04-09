export interface ICategory {
  id: string;
    category: string;
  description?: string;
}

export interface CreateCategoryPayload {
  category: string;
  description?: string;
}
