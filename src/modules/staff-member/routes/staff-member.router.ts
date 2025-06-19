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
        breadcrumb: 'Staff Members',
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: false,
        title: 'Staff Members',
      },
    },
  ],
} as RouteRecordRaw;
