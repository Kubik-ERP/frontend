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
          breadcrumb: 'Sales Order',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: false,
          title: 'Sales Order',
        },
      },
    ],
  },
];

export default routes;
