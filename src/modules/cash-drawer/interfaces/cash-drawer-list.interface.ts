export interface ICashDrawerRequestQuery {
  endDate?: string | null;
  limit: number;
  page: number;
  startDate?: string | null;
  type?: number | null;
}

export interface ICashDrawerOpenFormData {
  balance: number | null;
  userId: number | null;
  notes?: string | null;
}

// export interface ICashDrawerListProvided {}
