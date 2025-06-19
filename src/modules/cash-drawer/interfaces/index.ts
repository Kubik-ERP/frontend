export * from './cash-drawer-list.interface';

export interface ICashDrawerResponse {
  statusCode: number;
  message: string;
  data: ICashDrawerData;
}

export interface ICashDrawerData {
  items: ICashDrawerItem[];
  meta: ICashDrawerPageMeta;
}

export interface ICashDrawerItem {
  id: string;
  expectedBalance: number;
  actualBalance: null;
  status: string;
  date: null;
  notes: string;
  createdBy: number;
  createdAt: Date;
  updatedBy: null;
  updatedAt: null;
  storeId: string;
  closedAt: null;
  closedBy: null;
  staffId: string;
  employees: ICashDrawerEmploye;
}

export interface ICashDrawerEmploye {
  id: string;
  name: string;
}

export interface ICashDrawerPageMeta {
  total: number;
  totalPages: number;
  currentPage: string;
  perPage: string;
}

export interface ICashDrawerStore {
  cashDrawer_isLoading: boolean;
  cashDrawer_lists: ICashDrawerData | null;
}
