// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/transfer-stock',
    component: AppBaseWrapper,
    name: 'transfer-stock',
    children: [
      {
        path: '',
        name: 'transfer-stock.index',
        component: () => import('../views/TransferStockListUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Transfer Stock',
        },
      },
      {
        path: 'create',
        name: 'transfer-stock.create',
        component: () => import('../views/TransferStockCreateEditUI.vue'),
        meta: {
          breadcrumb: 'Create New Transfer Stock',
          layout: LAYOUT_OPTIONS.SIMPLE_NAVBAR,
          requiresAuthorization: true,
          title: 'Create New Transfer Stock',
        },
      },
      {
        path: ':id/detail',
        name: 'transfer-stock.detail',
        component: () => import('../views/TransferStockDetailUI.vue'),
        meta: {
          breadcrumb: 'Transfer Stock Detail',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Transfer Stock Detail',
        },
      },
      {
        path: ':id/edit',
        name: 'transfer-stock.edit',
        component: () => import('../views/TransferStockCreateEditUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.SIMPLE_NAVBAR,
          requiresAuthorization: true,
        },
      },
      {
        path: ':id/shipping-document',
        name: 'transfer-stock.shipping-document',
        component: () => import('../views/TransferStockShippingDocumentUI.vue'),
        meta: {
          breadcrumb: 'Shipping Document',
          layout: LAYOUT_OPTIONS.EMPTY,
          requiresAuthorization: true,
          title: 'Shipping Document',
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
