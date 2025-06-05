import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/sales-order',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'sales-order',
        component: () => import('../views/SalesOrderUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: false,
          title: 'Sales Order',
        },
      },
      {
        path: 'cash-register',
        name: 'sales-order.cash-register',
        component: () => import('../views/SalesOrderCashRegisterUI.vue'),
        meta: {
          breadcrumb: 'Cash Register',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: false,
          title: 'Cash Register',
        },
      }
    ],
    meta: {
      breadcrumb: 'Sales Order',
      requiresAuthorization: false,
    }
  },
];

export default routes;
