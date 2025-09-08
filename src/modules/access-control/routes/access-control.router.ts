// import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';
import { LAYOUT_OPTIONS } from '@/app/constants';
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: '/user-permission',
  name: 'acceess-control',
  children: [
    {
      path: '',
      name: 'user-permission.index',
      component: import('../views/AccessControlListUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.DEFAULT,
        breadcrumb: "Access Control Permissions",
        requiresAuthorization: false,
        title: 'Access Control',
      },
    },
    {
      path: 'edit',
      name: 'user-permission.edit',
      component: import('../views/EditAccessControlUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.NAVBAR,
        breadcrumb: "Access Control Permissions Edit",
        requiresAuthorization: false,
        title: 'Access Control Edit',
      },
    },
  ],
  meta: {
    breadcrumb: 'Access Control Permissions',
    requiresAuthorization: false,
  },
} as RouteRecordRaw;
