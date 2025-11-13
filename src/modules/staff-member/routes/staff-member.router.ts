// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: 'staff-member',
  name: 'staff-member',
  component: AppBaseWrapper,
  children: [
    {
      path: '',
      name: 'staff-member.index',
      component: () => import('../views/StaffMemberListUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: true,
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
        requiresAuthorization: true,
        title: 'Add New Staff Member',
      },
    },
    {
      path: 'edit/:id',
      props: route => ({ id: route.params.id }),
      name: 'staff-member.edit',
      component: () => import('../views/StaffMemberCreateEditUI.vue'),
      meta: {
        breadcrumb: 'Edit Staff Member',
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: true,
        title: 'Edit Staff Member',
      },
    },
    {
      path: 'detail/:id',
      props: route => ({ id: route.params.id }),
      name: 'staff-member.detail',
      component: () => import('../views/StaffMemberDetailUI.vue'),
      meta: {
        breadcrumb: 'Staff Member Details',
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: true,
        title: 'Staff Member Details',
      },
    }
  ],
  meta: {
    breadcrumb: 'Staff Members',
    requiresAuthorization: true,
  },
} as RouteRecordRaw;
