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
    dateRange: null,
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

  const salesInvoice_columns = [
    { label: 'Invoice ID', value: 'invoiceID', sortable: true },
    { label: 'Purchase Date', value: 'purchaseDate', sortable: true },
    { label: 'Table Number', value: 'tableNumber', sortable: false },
    { label: 'Total Price', value: 'totalPrice', sortable: true },
    { label: 'Status', value: 'status', sortable: false },
    { label: 'Order Type', value: 'orderType', sortable: false },
    { label: 'Action', value: 'action', sortable: false },
  ];

  const salesInvoice_paymentStatus = [
    { label: 'Paid', value: 'paid' },
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Partial', value: 'partial' },
  ];

  const salesInvoice_orderType = [
    { label: 'Dine In', value: 'dine_in' },
    { label: 'Take Away', value: 'take_away' },
    { label: 'Delivery', value: 'delivery' },
  ];

  const staffMemberDetails_queryParams = reactive({
    page: 1,
    search: '',
    start_date: null as Date | null,
    end_date: null as Date | null,
    order_type: [] as string[],
    payment_status: [] as string[],
  });

  const staffMemberDetails_onChangePage = (page: number): void => {
    staffMemberDetails_queryParams.page = page;
  };

  const orderStatusClass = (status: string) => {
    if (status === 'Paid') return 'bg-success-background text-success-main';
    if (status === 'Unpaid') return 'bg-error-background text-error-main';
    if (status === 'Partial') return 'bg-warning-background text-warning-main';
    return '';
  };

  const orderTypeClass = (type: string) => {
    if (type === 'Dine In') return 'bg-primary-background text-primary';
    if (type === 'Take Away') return 'bg-secondary-background text-secondary';
    if (type === 'Delivery') return 'bg-info-background text-info-main';
    return '';
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

    salesInvoice_columns,
    salesInvoice_paymentStatus,
    salesInvoice_orderType,
    staffMemberDetails_queryParams,
    staffMemberDetails_onChangePage,
    orderStatusClass,
    orderTypeClass,
  };
};
