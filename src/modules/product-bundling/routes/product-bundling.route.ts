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
        component: () => import('../views/ProductBundlingListUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Product Bundling',
        },
      },
      {
        path: 'add-product-bundling',
        name: 'product-bundling.add',
        component: () => import('../views/ProductBundlingCreateEditUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Add Product Bundling',
          breadcrumb: 'Add Product Bundling',
        },
      },
      {
        path: 'edit-product-bundling/:id',
        name: 'product-bundling.edit',
        component: () => import('../views/ProductBundlingCreateEditUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Edit Product Bundling',
          breadcrumb: 'Edit Product Bundling',
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
