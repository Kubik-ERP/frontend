import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/pos-setting',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        redirect: { name: 'outlet.list' },
      },
      {
        path: 'tax',
        name: 'setting.tax',
        component: () => import('../views/SettingTaxUI.vue'),
        meta: {
          breadcrumb: 'Tax & Service Charge',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: false,
          title: 'Tax & Service Charge',
        },
      },
    ],
  },
];

export default routes;
