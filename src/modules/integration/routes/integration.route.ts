// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/integrations',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'integrations.index',
        component: () => import('../views/IntegrationUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Integrations',
        },
      },
    ],
    meta: {
      breadcrumb: 'Integrations',
      requiresAuthorization: true,
    },
  },
];

export default routes;
