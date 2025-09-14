import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/cashier',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'cashier',
        component: () => import('../views/CashierUI.vue'),
        meta: {
          requiresAuthorization: true,
          backArrow: true,
          backArrowPath: '/dashboard',
          layout: LAYOUT_OPTIONS.EMPTY,
          title: 'Cashier',
        },
        children: [
          {
            path: 'order-edit/:invoiceId',
            name: 'cashier-order-edit',
            component: () => import('../views/CashierUI.vue'),
            meta: {
              requiresAuthorization: true,
              backArrow: true,
              backArrowPath: '/dashboard',
              layout: LAYOUT_OPTIONS.NAVBAR,
              title: 'Edit Order',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/self-order',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'self-order',
        component: () => import('../views/CashierUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.NAVBAR,
          title: 'Self Order',
        },
      },
      {
        path: 'not-valid',
        name: 'self-order.not-valid',
        component: () => import('../views/self-order/SelfOrderNotValid.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.EMPTY,
          title: 'Self Order Not Valid',
        },
      },
      {
        path: 'login',
        name: 'login-self-order',
        component: () => import('../views/self-order/SelfOrderLogin.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.EMPTY,
          title: 'Self Order Login',
        },
      },
      {
        path: 'create',
        name: 'create-self-order',
        component: () => import('../views/self-order/SelfOrderCreateAccount.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.EMPTY,
          title: 'Self Order Create',
        },
      },
    ],
  },
];

export default routes;
