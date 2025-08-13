// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: 'working-hours',
  name: 'working-hours',
  component: AppBaseWrapper,
  children: [
    {
      path: '',
      name: 'working-hours.index',
      component: () => import('../views/WorkingHoursListUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: true,
        title: 'Working Hours',
      },
    },
  ],
  meta: {
    breadcrumb: 'Working Hours',
    requiresAuthorization: true,
  },
} as RouteRecordRaw;
