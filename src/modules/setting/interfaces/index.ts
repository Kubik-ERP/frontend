import { ISettingInvoiceDetail } from './setting-invoice.interface';

export * from './setting-invoice.interface';

export interface ISettingStateStore {
  setting_invoice: ISettingInvoiceDetail | null;
  setting_isLoading: boolean;
}