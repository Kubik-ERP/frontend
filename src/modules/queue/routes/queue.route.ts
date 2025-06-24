import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';


const routes: RouteRecordRaw[] = [
  {
    path: '/queue',
    component: AppBaseWrapper,
    meta: {
      requiresAuthorization: false,
    },
    children: [
      {
        path: '',
        name: 'queue',
        component: () => import('../views/QueueUI.vue'),
        meta: {
          title: 'Queue',
          breadcrumb: 'Queue',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: false,
        },
      },
    ],
  },
];

export default routes;
