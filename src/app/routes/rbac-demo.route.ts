// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/rbac-demo',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'rbac-demo',
        component: () => import('../views/RbacDemoUI.vue'),
        meta: {
          breadcrumb: 'RBAC Demo',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'RBAC Demo',
        },
      },
    ],
    meta: {
      breadcrumb: 'RBAC Demo',
      requiresAuthorization: true,
    },
  },
];

export default routes;
