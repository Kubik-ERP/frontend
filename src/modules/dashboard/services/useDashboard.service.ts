// store
import { useAuthenticationStore } from '@/modules/authentication/store';

// interface
import type { IDashboardProvided } from '../interfaces';
export const useDashboardService = (): IDashboardProvided => {
  const authenticationStore = useAuthenticationStore();
  const { authentication_userData } = storeToRefs(authenticationStore);

  const dashboard_queryParams = reactive({
    startDate: new Date(),
    endDate: new Date(),
  });

  return {
    authentication_userData,
    dashboard_queryParams,
  };
};
