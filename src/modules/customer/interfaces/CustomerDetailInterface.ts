export interface IIncreasePoint {
  point: number;
  isHaveExpiryDate: string;
  ExpiryDate?: Date;
  notes?: string;
}

export interface IDecreasePoint {
  point: number;
  notes?: string;
}

export interface Iinvoice {
  id: string; // Changed from literal string to string
  paymentMethodsId: string; // Changed from literal string to string
  customerId: string; // Changed from literal string to string
  discountAmount: number; // Changed from literal 0 to number
  tableCode: string; // Changed from literal string to string
  paymentStatus: string; // Changed from literal 'unpaid' to string (consider a union type like 'unpaid' | 'paid' if statuses are fixed)
  createdAt: string; // Changed from literal date string to string (ISO 8601 format)
  updateAt: string; // Changed from literal date string to string (ISO 8601 format)
  deleteAt: string | null; // Changed from literal null to string | null (assuming it could be a date string if deleted)
  subtotal: number; // Changed from literal 77000 to number
  orderType: string; // Changed from literal 'dine_in' to string (consider a union type like 'dine_in' | 'take_away' if types are fixed)
  paidAt: string | null; // Changed from literal null to string | null (assuming it's a date string when paid)
  taxId: string | null; // Changed from literal null to string | null
  serviceChargeId: string | null; // Changed from literal null to string | null
  taxAmount: number; // Changed from literal 0 to number
  serviceChargeAmount: number; // Changed from literal 0 to number
  grandTotal: number; // Changed from literal 77000 to number
  cashierId: number; // Changed from literal 1 to number
  invoiceNumber: string; // Changed from literal string to string
  orderStatus: string; // Changed from literal 'ready' to string (consider a union type like 'ready' | 'pending' | 'completed')
  storeId: string; // Changed from literal string to string
}


export interface ICustomerDetails {
  id: string;
  name: string;
  code?: string;
  number?: string;
  gender?: string;
  email?: string;
  dob?: Date;
  address?: string;
  paid?: number;
  unpaid?: number;
  totalSales?: number;
  lastVisited?: Date;
}
