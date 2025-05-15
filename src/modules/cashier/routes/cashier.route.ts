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
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.NAVBAR,
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
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.NAVBAR,
        },
      },
    ],
  },
];

export default routes;
