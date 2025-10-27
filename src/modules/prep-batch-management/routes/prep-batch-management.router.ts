// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: 'prep-batch-management',
  name: 'prep-batch-management',
  component: AppBaseWrapper,
  children: [
    {
      path: '',
      name: 'prep-batch-management.index',
      component: () => import('../views/PrepBatchManagementListUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: true,
        title: 'Prep & Batch Management',
      },
    },
  ],
  meta: {
    breadcrumb: 'Prep & Batch Management',
    requiresAuthorization: true,
  },
} as RouteRecordRaw;
