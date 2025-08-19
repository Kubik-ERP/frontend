// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/inventory/stock-opname',
    name: 'stock-opname',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'stock-opname.index',
        component: () => import('../views/Stock-opnameUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Stock Opname',
        },
      },
      {
        path: '/inventory/stock-opname/issue/:id',
        name: 'stock-opname.create',
        component: () => import('../views/stock-opnameCreateEditUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.SIMPLE_NAVBAR,
          breadcrumb: 'Issue Stock Opname',
          requiresAuthorization: true,
          title: 'Issue Stock Opname',
        },
      },
      {
        path: '/inventory/stock-opname/detail/:id',
        name: 'stock-opname.detail',
        
        component: () => import('../views/stock-opnameDetailUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.SIMPLE_NAVBAR,
          breadcrumb: 'View Stock Opname',
          requiresAuthorization: true,
          title: 'View Stock Opname',
        },
      },
    ],
    meta: {
      breadcrumb: 'Stock Opname',
      requiresAuthorization: true,
    },
  },
];

export default routes;
