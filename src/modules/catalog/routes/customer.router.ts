// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: 'customer',
  name: 'catalog.customer',
  component: () => AppBaseWrapper,
  children: [
    {
      path: '',
      name: 'catalog.customer.index',
      component: () => import('../views/CustomerUI.vue'),
      meta: {
        breadcrumb: 'Customer',
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: false,
        title: 'Customer',
      },
    },
  ],
} as RouteRecordRaw;
