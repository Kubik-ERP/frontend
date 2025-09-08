import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/queue/customer-waiting-list',
    component: AppBaseWrapper,
    meta: {
      requiresAuthorization: true,
    },
    children: [
      {
        path: '',
        name: 'customer-waiting-list',
        component: () => import('../views/Customer-waiting-listUI.vue'),
        meta: {
          title: 'Customer Waiting List',
          breadcrumb: 'Customer Waiting List',
          requiresAuthorization: true,
          // backArrow: true,
          // backArrowPath: '/dashboard',
          layout: LAYOUT_OPTIONS.SIMPLE_NAVBAR,
        },
      },
    ],
  },
];

export default routes;
