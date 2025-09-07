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
        path: 'payment-method',
        name: 'setting.payment-method',
        component: () => import('../views/SettingPaymentMethodUI.vue'),
        meta: {
          breadcrumb: 'Payment Method',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Payment Method',
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
      {
        path: 'rounding',
        name: 'setting.rounding',
        component: () => import('../views/SettingRoundingUI.vue'),
        meta: {
          breadcrumb: 'Rounding',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Rounding',
        },
      },
      {
        path: 'connected-device',
        name: 'setting.device',
        component: () => import('@/modules/device/views/DeviceListUI.vue'),
        meta: {
          breadcrumb: 'Device',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Device',
        },
      },
    ],
  },
];

export default routes;
