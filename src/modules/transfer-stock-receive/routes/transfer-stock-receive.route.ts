// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/transfer-stock-receive',
    component: AppBaseWrapper,
    name: 'transfer-stock-receive',
    children: [
      {
        path: '',
        name: 'transfer-stock-receive.index',
        component: () => import('../views/Transfer-stock-receiveUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Transfer Stock',
        },
      },
    ],
    meta: {
      breadcrumb: 'Transfer Stock',
      requiresAuthorization: true,
    },
  },
];

export default routes;
