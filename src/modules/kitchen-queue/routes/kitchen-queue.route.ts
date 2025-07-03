import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/queue/kitchen-display',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'queue-kitchen-display',
        component: () => import('../views/KitchenQueueUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.EMPTY,
          title: 'Kitchen Display',
        },
      },
    ],
  },
];

export default routes;
