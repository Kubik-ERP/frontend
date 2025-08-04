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
      requiresAuthorization: true,
      breadcrumb: 'Customer',
    },
    children: [
      {
        path: '',
        name: 'customer-list',
        component: () => import('../views/CustomerListUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.DEFAULT,
        },
      },
      {
        path: 'add-customer',
        name: 'addcustomer',
        component: () => import('../views/AddCustomerUI.vue'),
        meta: {
          requiresAuthorization: true,
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
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.DEFAULT,
          breadcrumb: 'Edit Customer',
        },
      },
      {
        path: 'preview-customer/:id',
        name: 'preview-customer',
        props: route => ({ id: route.params.id }),
        component: () => import('../views/PreviewCustomerUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.DEFAULT,
          breadcrumb: 'Preview Customer',
        },
      },
    ],
  },
];

export default routes;
