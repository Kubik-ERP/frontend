// store
import { useAuthenticationStore } from '@/modules/authentication/store';
import { useDashboardStore } from '../store';

// interface
import type { IDashboardProvided } from '../interfaces';
export const useDashboardService = (): IDashboardProvided => {
  const authenticationStore = useAuthenticationStore();
  const { authentication_userData } = storeToRefs(authenticationStore);

  const store = useDashboardStore();
  const { dashboard_isLoading, dashboard_values } = storeToRefs(store);

  const { httpAbort_registerAbort } = useHttpAbort();

  const dashboard_queryParams = reactive({
    startDate: new Date(),
    endDate: new Date(),
  });

  watch(
    () => dashboard_queryParams,
    debounce(async () => {
      dashboard_getSummary();
    }, 500),
    { deep: true },
  );

  const dashboard_getSummary = async () => {
    try {
      await store.getDashboardData(dashboard_queryParams, {
        ...httpAbort_registerAbort('DASHBOARD_SUMMARY_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  return {
    authentication_userData,
    dashboard_queryParams,
    dashboard_isLoading,
    dashboard_values,
    dashboard_getSummary,
  };
};
