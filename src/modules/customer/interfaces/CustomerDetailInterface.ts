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
  payment_methods_id: string; // Changed from literal string to string
  customer_id: string; // Changed from literal string to string
  discount_amount: number; // Changed from literal 0 to number
  table_code: string; // Changed from literal string to string
  payment_status: string; // Changed from literal 'unpaid' to string (consider a union type like 'unpaid' | 'paid' if statuses are fixed)
  created_at: string; // Changed from literal date string to string (ISO 8601 format)
  update_at: string; // Changed from literal date string to string (ISO 8601 format)
  delete_at: string | null; // Changed from literal null to string | null (assuming it could be a date string if deleted)
  subtotal: number; // Changed from literal 77000 to number
  order_type: string; // Changed from literal 'dine_in' to string (consider a union type like 'dine_in' | 'take_away' if types are fixed)
  paid_at: string | null; // Changed from literal null to string | null (assuming it's a date string when paid)
  tax_id: string | null; // Changed from literal null to string | null
  service_charge_id: string | null; // Changed from literal null to string | null
  tax_amount: number; // Changed from literal 0 to number
  service_charge_amount: number; // Changed from literal 0 to number
  grand_total: number; // Changed from literal 77000 to number
  cashier_id: number; // Changed from literal 1 to number
  invoice_number: string; // Changed from literal string to string
  order_status: string; // Changed from literal 'ready' to string (consider a union type like 'ready' | 'pending' | 'completed')
  store_id: string; // Changed from literal string to string
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

export interface IPointDetails {
  id: string;
  value: number;
  customerId: string;
  invoiceId: string;
  type: string;
  expiryDate?: Date | null;
  notes?: string | null;
  invoice: Iinvoice;
}

export interface points {
  total: number;
  details: IPointDetails[];
}
