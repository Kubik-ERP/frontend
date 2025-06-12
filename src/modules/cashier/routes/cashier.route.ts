import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/cashier',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'cashier',
        component: () => import('../views/CashierUI.vue'),
        meta: {
          requiresAuthorization: true,
          backArrow: true,
          backArrowPath: '/dashboard',
          layout: LAYOUT_OPTIONS.NAVBAR,
          title: 'Cashier',
        },
      },
    ],
  },
  {
    path: '/self-order',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'self-order',
        component: () => import('../views/CashierUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.NAVBAR,
          title: 'Self Order',
        },
      },
    ],
  },
];

export default routes;
