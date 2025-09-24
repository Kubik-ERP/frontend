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
    name: 'purchase-order',
    children: [
      {
        path: '',
        name: 'purchase-order.index',
        component: () => import('../views/PurchaseOrderListUI.vue'),
        meta: {
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
        path: ':id/detail',
        name: 'purchase-order.detail',
        component: () => import('../views/PurchaseOrderDetailUI.vue'),
        meta: {
          breadcrumb: 'Purchase Order Detail',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Purchase Order Detail',
        },
      },
      {
        path: ':id/delivery-order-document',
        name: 'purchase-order.delivery-order-document',
        component: () => import('../views/PurchaseOrderDeliveryOrderDocumentUI.vue'),
        meta: {
          breadcrumb: 'Delivery Order Document',
          layout: LAYOUT_OPTIONS.EMPTY,
          requiresAuthorization: true,
          title: 'Delivery Order Document',
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
      {
        path: ':id/received',
        name: 'purchase-order.received',
        component: () => import('../views/PurchaseOrderReceivedUI.vue'),
        meta: {
          breadcrumb: 'Received Purchase Order',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Received Purchase Order',
        },
      }
    ],
    meta: {
      breadcrumb: 'Purchase Order',
      requiresAuthorization: true,
    },
  },
];

export default routes;
