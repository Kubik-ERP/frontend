// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/pos-setting/point-configuration',
    name: 'point-configuration',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'point-configuration.index',
        component: () => import('../views/pointConfigurationUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'point configuration',
        },
      },
      {
        path: 'edit-configuration',
        name: 'loyalty-point-setting.edit',
        component: () => import('../views/LoyaltyPointSettingEditUI.vue'),
        meta: {
          requiresAuthorization: true,
          breadcrumb: 'loyalty Point Settings',
          title: 'Loyalty Point Settings',
          backArrow: true,
          backArrowPath: '/pos-setting/point-configuration',
          layout: LAYOUT_OPTIONS.NAVBAR,
        },
      },
    ],
    meta: {
      breadcrumb: 'Loyalty Point',
      requiresAuthorization: true,
    },
  },
];

export default routes;
