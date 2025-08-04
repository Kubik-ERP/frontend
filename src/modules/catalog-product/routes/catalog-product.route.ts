// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/catalog/products',
    name: 'catalog.products',
    component: AppBaseWrapper,
    meta: {
      requiresAuthorization: true,
      breadcrumb: 'Catalog Products',
    },
    children: [
      {
        path: '',
        name: 'catalog.products.index',
        component: () => import('../views/ProductsUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Catalog Products',
        },
      },
      {
        path: 'add-product',
        name: 'catalog.products.add',
        component: () => import('../views/AddProductUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.DEFAULT,
          breadcrumb: 'Add Product',
          title: 'Add Product',
        },
      },
      {
        path: 'edit-product/:id',
        name: 'catalog.products.edit',
        component: () => import('../views/EditProductUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.DEFAULT,
          breadcrumb: 'Edit Product',
          title: 'Edit Product',
        },
      },
    ],
  },
];

export default routes;

// export default {
//   path: 'products',
//   name: 'catalog.products',
//   component: () => AppBaseWrapper,
//   meta:{
//     requiresAuthorization: true,
//     breadcrumb: 'Catalog Products',
//   },
//   children: [
//     {
//       path: '',
//       name: 'catalog.products.index',
//       component: () => import('../views/ProductsUI.vue'),
//       meta: {
//         layout: LAYOUT_OPTIONS.DEFAULT,
//         requiresAuthorization: true,
//         title: 'Catalog Products',
//       },
//     },
//     {
//       path: 'add-product',
//       name: 'catalog.products.add',
//       component: () => import('../views/AddProductUI.vue'),
//       meta: {
//         requiresAuthorization: true,
//         layout: LAYOUT_OPTIONS.DEFAULT,
//         breadcrumb: 'Add Product',
//         title: 'Add Product',
//       },
//     },
//     {
//       path: 'edit-product/:id',
//       name: 'catalog.products.edit',
//       component: () => import('../views/EditProductUI.vue'),
//       meta: {
//         requiresAuthorization: true,
//         layout: LAYOUT_OPTIONS.DEFAULT,
//         breadcrumb: 'Edit Product',
//         title: 'Edit Product',
//       },
//     },
//   ],
// } as RouteRecordRaw;
