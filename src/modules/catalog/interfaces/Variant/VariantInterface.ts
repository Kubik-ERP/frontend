export interface IVariant {
  id: string;
  name: string;
  price?: number;
}

export interface CreateCategoryPayload {
  name: string;
  price?: number;
}
