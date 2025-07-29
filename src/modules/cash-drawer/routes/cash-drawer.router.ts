// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: 'cash-drawer',
  name: 'cash-drawer',
  component: () => AppBaseWrapper,
  children: [
    {
      path: ':id/cash-register',
      name: 'cash-drawer.cash-register',
      component: () => import('../views/CashDrawerCashRegisterUI.vue'),
      meta: {
        breadcrumb: 'Cash Register',
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: true,
        title: 'Cash Register',
      },
    },
  ],
} as RouteRecordRaw;
