import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Routes
import cashDrawerRouter from '@/modules/cash-drawer/routes/cash-drawer.router';

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
      cashDrawerRouter,
    ],
    meta: {
      breadcrumb: 'Sales Order',
      requiresAuthorization: true,
    },
  },
];

export default routes;
