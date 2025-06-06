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
        path: 'invoice',
        name: 'setting.invoice',
        component: () => import('../views/SettingInvoiceUI.vue'),
        meta: {
          breadcrumb: 'Invoice',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Invoice',
        },
      },
      {
        path: 'tax-service',
        name: 'setting.tax',
        component: () => import('../views/SettingTaxServiceUI.vue'),
        meta: {
          breadcrumb: 'Tax & Service Charge',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Tax & Service Charge',
        },
      },
    ],
  },
];

export default routes;
