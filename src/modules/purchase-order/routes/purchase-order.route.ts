// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/purchase-order',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'purchase-order.index',
        component: () => import('../views/PurchaseOrderListUI.vue'),
        meta: {
          breadcrumb: 'Purchase Order',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Purchase Order',
        },
      },
      {
        path: 'create',
        name: 'purchase-order.create',
        component: () => import('../views/PurchaseOrderCreateEditUI.vue'),
        meta: {
          breadcrumb: 'Create New Purchase Order',
          layout: LAYOUT_OPTIONS.SIMPLE_NAVBAR,
          requiresAuthorization: true,
          title: 'Create New Purchase Order',
        },
      },
      {
        path: ':id/edit',
        name: 'purchase-order.edit',
        component: () => import('../views/PurchaseOrderCreateEditUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.SIMPLE_NAVBAR,
          requiresAuthorization: true,
        },
      },
    ],
    meta: {
      breadcrumb: 'Purchase Order',
      requiresAuthorization: true,
    },
  },
];

export default routes;
