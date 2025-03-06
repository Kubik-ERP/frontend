import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/authentication',
    component: AppBaseWrapper,
    children: [
      {
        path: 'create-new-password',
        name: 'create-new-password',
        component: () => import('../views/AuthenticationCreateNewPasswordUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.EMPTY,
        },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('../views/AuthenticationResetPasswordUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.EMPTY,
        },
      },
      {
        path: 'sign-in',
        name: 'sign-in',
        component: () => import('../views/AuthenticationSignInUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.EMPTY,
        },
      },
      {
        path: 'sign-up',
        name: 'sign-up',
        component: () => import('../views/AuthenticationSignUpUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.EMPTY,
        },
      },
    ],
  },
];

export default routes;
