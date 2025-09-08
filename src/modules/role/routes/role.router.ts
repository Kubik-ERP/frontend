// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: '/role',
  name: 'role',
  component: () => AppBaseWrapper,
  children: [
    {
      path: '/',
      name: 'role.index',
      component: () => import('../views/RoleListUI.vue'),
      meta: {
        breadcrumb: 'Role List',
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: true,
        title: 'Role List',
      },
    },
  ],
} as RouteRecordRaw;
