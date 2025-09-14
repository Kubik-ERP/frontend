export * from './cash-drawer-list.interface';
export * from './cash-drawer-cash-register.interface';

export interface ICashDrawerStateStore {
  cashDrawer_detail: ICashDrawerItem | null;
  cashDrawer_isLoading: boolean;
  cashDrawer_lists: ICashDrawerData | null;
  cashDrawer_transactionOfOpenRegister: ICashDrawerTransactionData;
  cashDrawer_todayStatus: ICashDrawerTodayStatus | null;
}

export interface ICashDrawerTodayStatus {
  actualBalance: number | null;
  createdAt: Date;
  createdBy: number;
  expectedBalance: number;
  id: string;
  notes: string;
  status: string;
}

export interface ICashDrawerDetailResponse {
  statusCode: number;
  message: string;
  data: ICashDrawerItem | null;
}

export interface ICashDrawerResponse {
  statusCode: number;
  message: string;
  data: ICashDrawerData;
}

export interface ICashDrawerTodayResponse extends IDefaultResponseFetch {
  data: ICashDrawerTodayStatus | Record<string, never>;
}

export interface ICashDrawerData {
  items: ICashDrawerItem[];
  meta: ISecondPageMeta;
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

export interface ICashDrawerTransaction {
  amountIn: number;
  amountOut: number;
  cashDrawerId: string;
  createdAt: Date;
  createdBy: number;
  finalAmount: number;
  id: string;
  type: number;
}

export interface ICashDrawerTransactionData {
  items: ICashDrawerTransaction[];
  meta: ISecondPageMeta;
}

export interface ICashDrawerEmploye {
  id: string;
  name: string;
}

export interface ICashDrawerOpenRegisterResponse {
  statusCode: number;
  message: string;
  data: ICashDrawerItem;
}

export interface ICashDrawerTransactionResponse {
  statusCode: number;
  message: string;
  data: ICashDrawerTransactionData;
}
