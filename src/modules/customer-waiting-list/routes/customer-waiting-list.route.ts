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
          title: 'customer waiting list',
          breadcrumb: 'customer waiting list',
          layout: LAYOUT_OPTIONS.OUTLET,
          requiresAuthorization: true,
        },
      },
    ],
  },
];

export default routes;
