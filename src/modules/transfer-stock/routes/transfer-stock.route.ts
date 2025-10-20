import { LAYOUT_OPTIONS } from '@/app/constants';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/transfer-stock',
    name: 'transfer-stock',
    component: () => import('../views/TransferStockListUI.vue'),
    meta: {
      requiresAuthorization: true,
      layout: LAYOUT_OPTIONS.DEFAULT,
      title: 'Transfer Stock',
      breadcrumb: 'Transfer Stock',
    },
  },
];

export default routes;

