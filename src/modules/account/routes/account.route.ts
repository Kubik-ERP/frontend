import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/account',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'account.index',
        component: () => import('../views/AccountUI.vue'),
        meta: {
          requiresAuthorization: false,
          title: 'Account',
        },
      },
      {
        path: 'edit-profile',
        name: 'account.edit',
        component: () => import('../views/AccountEditProfileUI.vue'),
        meta: {
          breadcrumb: 'Edit Profile',
          requiresAuthorization: false,
          title: 'Edit Profile',
        },
      },
      {
        path: 'store',
        name: 'account.store',
        component: AppBaseWrapper,
        children: [
          {
            path: ':id/detail',
            name: 'account.store.detail',
            component: () => import('../views/AccountStoreDetailUI.vue'),
            meta: {
              breadcrumb: 'Store Details',
              requiresAuthorization: false,
              title: 'Store Details',
            },
          },
          {
            path: ':id/edit',
            name: 'account.store.edit',
            component: () => import('../views/AccountStoreEditUI.vue'),
            meta: {
              breadcrumb: 'Edit Store Details',
              layout: LAYOUT_OPTIONS.OUTLET,
              requiresAuthorization: false,
              title: 'Edit Store Details',
            },
          },
          {
            path: ':id/table-configuration',
            name: 'account.store.table-configuration',
            component: () => import('../views/AccountStoreTableConfigurationUI.vue'),
            meta: {
              breadcrumb: 'Edit Table Configuration',
              layout: LAYOUT_OPTIONS.NAVBAR,
              requiresAuthorization: false,
              title: 'Edit Table Configuration',
            },
          },
        ],
        meta: {
          breadcrumb: 'Store Details',
          requiresAuthorization: false,
        },
      },
    ],
    meta: {
      breadcrumb: 'Account',
      layout: LAYOUT_OPTIONS.DEFAULT,
      requiresAuthorization: false,
    },
  },
];

export default routes;
