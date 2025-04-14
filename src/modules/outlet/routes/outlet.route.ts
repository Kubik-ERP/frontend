import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/outlet',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        redirect: { name: 'outlet.list' },
      },
      {
        path: 'create',
        name: 'outlet.create',
        component: () => import('../views/OutletCreateEditUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.OUTLET,
        },
      },
      {
        path: 'edit/:id',
        name: 'outlet.edit',
        component: () => import('../views/OutletCreateEditUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.OUTLET,
        },
      },
      {
        path: 'list',
        name: 'outlet.list',
        component: () => import('../views/OutletListUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.OUTLET,
        },
      },
    ],
  },
];

export default routes;
