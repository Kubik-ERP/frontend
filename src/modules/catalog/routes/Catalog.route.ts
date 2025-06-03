import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/catalog',
    component: AppBaseWrapper,
    meta: {
      requiresAuthorization: false,
      breadcrumb: 'Catalog',
    },
    children: [
      {
        path: 'categories',
        name: 'categories',
        component: () => import('../views/Category/CategoriesUI.vue'),
        meta: {
          title: 'Categories',
          breadcrumb: 'Categories',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: false,
        },
      },
      {
        path: 'products',
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.DEFAULT,
          breadcrumb: 'Products',
          title: 'Products',
        },
        children: [
          {
            path: '',
            name: 'products',
            component: () => import('../views/Products/ProductsUI.vue'),
            meta: {
              requiresAuthorization: false,
              layout: LAYOUT_OPTIONS.DEFAULT,
              title: 'Products',
            },
          },
          {
            path: 'add-product',
            name: 'add-product',
            component: () => import('../views/Products/AddProductUI.vue'),
            meta: {
              requiresAuthorization: false,
              layout: LAYOUT_OPTIONS.DEFAULT,
              breadcrumb: 'Add Product',
              title: 'Add Product',
            },
          },
          {
            path: 'edit-product',
            meta: {
              requiresAuthorization: false,
              layout: LAYOUT_OPTIONS.DEFAULT,
              breadcrumb: 'Edit Product',
              title: 'Edit Product',
            },
            children: [
              {
                path: ':id',
                name: 'edit-product',
                props: route => ({ id: route.params.id }),
                component: () => import('../views/Products/EditProductUI.vue'),
                meta: {
                  requiresAuthorization: false,
                  layout: LAYOUT_OPTIONS.DEFAULT,
                  title: 'Edit Product',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
