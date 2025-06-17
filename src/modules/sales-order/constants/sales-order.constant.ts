// Components
import CashDrawerListUI from '@/modules/cash-drawer/views/CashDrawerListUI.vue';
import CashInOutListUI from '@/modules/cash-in-out/views/CashInOutListUI.vue';
import DailySalesListUI from '@/modules/daily-sales/views/DailySalesListUI.vue';
import VoucherListUI from '@/modules/voucher/views/VoucherListUI.vue';

export const LIST_TABS_SALES_ORDER: ITabs[] = [
  {
    component: DailySalesListUI,
    label: 'Daily Sales',
    value: 'daily-sales',
  },
  {
    component: VoucherListUI,
    label: 'Voucher',
    value: 'voucher',
  },
  {
    component: CashDrawerListUI,
    label: 'Cash Drawer',
    value: 'cash-drawer',
  },
  {
    component: CashInOutListUI,
    label: 'Cash In/Out',
    value: 'cash-in-out',
  },
];

