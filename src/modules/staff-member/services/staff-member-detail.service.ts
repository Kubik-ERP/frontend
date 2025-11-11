import { useStaffMemberStore } from '../store';
import {
  COMMISSION_COLUMNS,
  COMMISSION_TYPES,
} from '../constants/staff-member-detail.constant';
import { STAFF_MEMBER_DETAIL_REQUEST } from '../constants';
import { IStaffCommissionsRequestQuery } from '../interfaces';

export const useStaffMemberDetailService = () => {
  const route = useRoute();
  const staffMemberId = route.params.id as string;

  const store = useStaffMemberStore();
  const { staffMember_isLoading, staffMember_details, staffMember_commissions } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const commission_queryParams = reactive<IStaffCommissionsRequestQuery>({
    startDate: null,
    endDate: null,
    sourceType: null,
    pageSize: 10,
    page: 1,
  });

  const staffMemberDetails_fetchInformation = async () => {
    try {
      await store.staffMember_fetchDetailStaffMember(staffMemberId, {
        ...httpAbort_registerAbort(STAFF_MEMBER_DETAIL_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const fetchCommissions = async () => {
    try {
      const res = await store.staffMember_fetchCommissions(staffMemberId, commission_queryParams, {
        ...httpAbort_registerAbort('STAFF_MEMBER_COMMISSIONS_REQUEST'),
      });

      staffMember_commissions.value = res;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  }

  const commission_onChangePage = (page: number): void => {
    commission_queryParams.page = page;
  };

  const commissionTypeClass = (type: string) => {
    if (type === 'product') return 'bg-primary-background text-primary';
    if (type === 'voucher') return 'bg-success-background text-success-main';
  };

  watch(
    () => commission_queryParams,
    debounce(async () => {
      await fetchCommissions();
    }, 500),
    {
      deep: true,
    },
  );

  onMounted(async () => {
    await fetchCommissions();
  });

  return {
    staffMemberDetails_isLoading: staffMember_isLoading,
    staffMemberDetails: staffMember_details,
    staffMemberDetails_fetchInformation,

    commission_columns: COMMISSION_COLUMNS,
    commission_types: COMMISSION_TYPES,
    commission_queryParams,
    commission_onChangePage,
    commissionTypeClass,
    staffMember_commissions,
  };
};
