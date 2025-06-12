// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: 'products',
  name: 'catalog.products',
  component: () => AppBaseWrapper,
  children: [
    {
      path: '',
      name: 'catalog.products.index',
      component: () => import('../views/Products/ProductsUI.vue'),
      meta: {
        breadcrumb: 'Customer',
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: false,
        title: 'Customer',
      },
    },
    {
      path: 'add-product',
      name: 'catalog.products.add',
      component: () => import('../views/Products/AddProductUI.vue'),
      meta: {
        requiresAuthorization: false,
        layout: LAYOUT_OPTIONS.DEFAULT,
        breadcrumb: 'Add Product',
        title: 'Add Product',
      },
    },
    {
      path: 'edit-product/:id',
      name: 'catalog.products.edit',
      component: () => import('../views/Products/EditProductUI.vue'),
      meta: {
        requiresAuthorization: false,
        layout: LAYOUT_OPTIONS.DEFAULT,
        breadcrumb: 'Edit Product',
        title: 'Edit Product',
      },
    },
  ],
} as RouteRecordRaw;
