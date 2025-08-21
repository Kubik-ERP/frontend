// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: 'attendance',
  name: 'attendance',
  component: AppBaseWrapper,
  children: [
    {
      path: '',
      name: 'attendance.index',
      component: () => import('../views/AttendanceUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: true,
        title: 'Attendance',
      },
    },
  ],
  meta: {
    breadcrumb: 'Attendance',
    requiresAuthorization: true,
  },
} as RouteRecordRaw;
