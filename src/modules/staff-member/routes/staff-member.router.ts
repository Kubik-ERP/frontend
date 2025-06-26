// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: 'staff-member',
  name: 'staff-member',
  component: () => AppBaseWrapper,
  children: [
    {
      path: '',
      name: 'staff-member.index',
      component: () => import('../views/StaffMemberListUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: false,
        title: 'Staff Members',
      },
    },
    {
      path: 'create',
      name: 'staff-member.create',
      component: () => import('../views/StaffMemberCreateEditUI.vue'),
      meta: {
        breadcrumb: 'Add Staff Member',
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: false,
        title: 'Add New Staff Member',
      },
    },
  ],
  meta: {
    breadcrumb: 'Staff Members',
    requiresAuthorization: false,
  },
} as RouteRecordRaw;
