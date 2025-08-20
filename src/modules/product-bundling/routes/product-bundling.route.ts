// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/catalog/product-bundling',
    name: 'product-bundling',
    component: AppBaseWrapper,
    children: [
      {
        path: '',
        name: 'product-bundling.index',
        component: () => import('../views/Product-bundlingUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Product Bundling',
        },
      },
    ],
    meta: {
      breadcrumb: 'Product Bundling',
      requiresAuthorization: true,
    },
  },
];

export default routes;
