import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/items',
    component: AppBaseWrapper,
    meta: {
      requiresAuthorization: true,
      breadcrumb: 'Master Items',
    },
    children: [
      {
        path: '',
        name: 'items.list',
        component: () => import('../views/ItemsListUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.DEFAULT,
          title: 'Master Items',
        },
      },
      {
        path: 'create',
        name: 'items.create',
        component: () => import('../views/ItemCreateEditUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.NAVBAR,
          breadcrumb: 'Add Items',
          title: 'Add New Items',
        },
      },
      {
        path: 'edit/:id',
        name: 'items.edit',
        component: () => import('../views/ItemCreateEditUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.NAVBAR,
          breadcrumb: 'Edit Items',
          title: 'Edit Items',
        },
      },
      {
        path: 'view/:id',
        name: 'items.stock.adjustment',
        component: () => import('../views/itemsStockAdjustmentUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.NAVBAR,
          breadcrumb: 'Stock Adjustment',
          title: 'Stock Adjustment',
        },
      },
    ],
  },
];

export default routes;
