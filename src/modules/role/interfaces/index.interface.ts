export interface IRole {
  id: string;
  name: string;
  storeId: string;
  isSystem: true;
  createdAt: string;
  updatedAt: string;
}

export interface IRoleFormData {
  id?: string | null;
  name: string | null;
}

