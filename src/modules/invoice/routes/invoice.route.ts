import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/invoice/:invoiceId',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'invoice',
        component: () => import('../views/InvoiceUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.EMPTY,
          title: 'Invoice',
        },
      },
    ],
  },
  {
    path: '/self-order/invoice/:invoiceId',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'self-order-invoice',
        component: () => import('../views/InvoiceUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.EMPTY,
          title: 'Invoice',
        },
      },
    ],
  },
  {
    path: '/static/invoice/:invoiceId',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'static-invoice',
        component: () => import('../views/StaticInvoice.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.EMPTY,
          title: 'Invoice',
        },
      },
    ],
  },
];

export default routes;
