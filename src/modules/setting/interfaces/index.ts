export * from './setting-invoice.interface';
export * from './setting-payment-method.interface';
export * from './setting-tax-service.interface';

import { ISettingInvoiceDetail } from './setting-invoice.interface';
import { ISettingPaymentMethod } from './setting-payment-method.interface';
import { ISettingTaxAndService } from './setting-tax-service.interface';

export interface ISettingStateStore {
  setting_invoice: ISettingInvoiceDetail | null;
  setting_isLoading: boolean;
  setting_paymentMethod: ISettingPaymentMethod[] | [];
  setting_service: ISettingTaxAndService | null;
  setting_tax: ISettingTaxAndService | null;
}
