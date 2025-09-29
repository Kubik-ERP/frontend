export interface ICustomerReport {
  nama: string;
  gender?: string | null;
  totalSales: number;
  dateAdded: string;
  outstanding: number;
  loyaltyPoints: number;
}
