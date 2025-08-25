import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';
import accessControlRoute from '@/modules/access-control/routes/access-control.router';
import roleRoute from '@/modules/role/routes/role.router';


const routes: RouteRecordRaw[] = [
  {
    path: '/user-permission',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'user-permission',
        component: () => import('../views/UserPermissionUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'User Permission',
        },
      },
      accessControlRoute,
      roleRoute,
    ],
    meta: {
      breadcrumb: 'User Permission',
      requiresAuthorization: true,
    },
  },
];

export default routes;
