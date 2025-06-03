import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/customer',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'customerlist',
        component: () => import('../views/CustomerListUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.DEFAULT,
          breadcrumb: 'Customers',
        },
      },
      {
        path: 'add-customer',
        name: 'addcustomer',
        component: () => import('../views/AddCustomerUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.DEFAULT,
        },
      },
    ],
  },
];

export default routes;
