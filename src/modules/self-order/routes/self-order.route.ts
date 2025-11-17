import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/self-order',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'self-order',
        component: () => import('../views/SelfOrderUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.EMPTY,
          title: 'Self Order',
        },
      },
      {
        path: 'create',
        name: 'self-order-register',
        component: () => import('../views/SelfOrderRegisterUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.EMPTY,
          title: 'Self Order Register',
        },
      },
      {
        path: 'invalid',
        name: 'self-order-invalid',
        component: () => import('../views/SelfOrderInvalidUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.EMPTY,
          title: 'Self Order Invalid',
        },
      },
      {
        path: 'login',
        name: 'self-order-login',
        component: () => import('../views/SelfOrderLoginUi.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.EMPTY,
          title: 'Self Order Login',
        },
      },
    ],
  },
];

export default routes;
