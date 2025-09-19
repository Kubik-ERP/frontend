// import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';
import { LAYOUT_OPTIONS } from '@/app/constants';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/marketing/discount',
    name: '/discount',
    children: [
      {
        path: '',
        name: 'discount.index',
        component: () => import('../views/Item-discountUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          breadcrumb: 'Discount List',
          requiresAuthorization: false,
          title: 'Discounts',
        },
      },
    ],
    meta: {
      breadcrumb: 'Item Discount',
      requiresAuthorization: false,
    },
  },
];

export default routes;
