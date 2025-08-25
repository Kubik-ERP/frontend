import type { IAuthenticationProfile } from '@/modules/authentication/interfaces';

export interface dashboard_queryParams {
  startDate: Date;
  endDate: Date;
}

export interface IDashboardProvided {
  authentication_userData: globalThis.Ref<IAuthenticationProfile | null>;
  dashboard_queryParams: dashboard_queryParams;
}
