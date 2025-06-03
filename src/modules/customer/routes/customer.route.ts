import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/customer',
    component: AppBaseWrapper,
    meta:{
      requiresAuthorization: false,
      breadcrumb: 'Customer',
    },
    children: [
      {
        path: '',
        name: 'customerlist',
        component: () => import('../views/CustomerListUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.DEFAULT,
        },
      },
      {
        path: 'add-customer',
        name: 'addcustomer',
        component: () => import('../views/AddCustomerUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.DEFAULT,
          breadcrumb: 'Add Customer',
        },
      },
      {
        path: 'edit-customer/:id',
        name: 'edit-customer',
        props: route => ({ id: route.params.id }),
        component: () => import('../views/EditCustomerUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.DEFAULT,
          breadcrumb: 'Edit Customer',
        },
      },
    ],
  },
];

export default routes;
