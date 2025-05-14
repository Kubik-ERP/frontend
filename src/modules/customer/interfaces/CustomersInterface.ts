export interface ICustomer {
  id: string;
  name: string;
  email: string;
  code: string;
  number?: string;
  points?: number; //number
  latestVisit?: string; //date
}
