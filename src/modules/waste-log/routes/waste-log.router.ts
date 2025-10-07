// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: 'waste-log',
  name: 'waste-log',
  component: AppBaseWrapper,
  children: [
    {
      path: '',
      name: 'waste-log.index',
      component: () => import('../views/WasteLogListUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: true,
        title: 'Waste Log',
      },
    },
  ],
  meta: {
    breadcrumb: 'Waste Log',
    requiresAuthorization: true,
  },
} as RouteRecordRaw;
